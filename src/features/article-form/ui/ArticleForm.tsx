import { Component, createRef } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { createArticle, fetchCategories } from '@/shared/api'
import type { ArticleInput } from '@/shared/api'
import { parseMarkdown } from '@/shared/lib/markdown'
import type { ArticleStatus, Category } from '@/shared/model'
import { MarkdownContent, Select, SubmitButton } from '@/shared/ui'
import './ArticleForm.css'

interface MarkdownTool {
    label: string
    title: string
    before: string
    after: string
    placeholder: string
}

const MARKDOWN_TOOLS: MarkdownTool[] = [
    { label: 'H2', title: 'Заголовок 2', before: '## ', after: '', placeholder: 'Заголовок' },
    { label: 'H3', title: 'Заголовок 3', before: '### ', after: '', placeholder: 'Заголовок' },
    { label: 'Жирный', title: 'Жирный текст', before: '**', after: '**', placeholder: 'текст' },
    { label: 'Курсив', title: 'Курсив', before: '*', after: '*', placeholder: 'текст' },
    { label: 'Код', title: 'Код в строке', before: '`', after: '`', placeholder: 'код' },
    {
        label: 'Блок',
        title: 'Блок кода',
        before: '```\n',
        after: '\n```',
        placeholder: 'код',
    },
    { label: 'Список', title: 'Список', before: '- ', after: '', placeholder: 'пункт' },
    { label: 'Цитата', title: 'Цитата', before: '> ', after: '', placeholder: 'цитата' },
    {
        label: 'Ссылка',
        title: 'Ссылка',
        before: '[',
        after: '](url)',
        placeholder: 'текст',
    },
]

interface ArticleFormProps {
    onCreated: (slug: string) => void
}

interface ArticleFormState {
    title: string
    categoryId: string
    description: string
    content: string
    status: ArticleStatus
    categories: Category[]
    error: string
    submitting: boolean
}

class ArticleForm extends Component<ArticleFormProps, ArticleFormState> {
    contentRef = createRef<HTMLTextAreaElement>()

    state: ArticleFormState = {
        title: '',
        categoryId: '',
        description: '',
        content: '',
        status: 'published',
        categories: [],
        error: '',
        submitting: false,
    }

    componentDidMount() {
        void this.loadCategories()
    }

    async loadCategories() {
        try {
            const categories = await fetchCategories()

            this.setState({ categories, categoryId: categories[0]?.id ?? '' })
        } catch {
            this.setState({ error: 'Не удалось загрузить категории.' })
        }
    }

    handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ title: event.target.value })
    }

    handleCategoryChange = (value: string) => {
        this.setState({ categoryId: value })
    }

    handleStatusChange = (value: string) => {
        this.setState({ status: value as ArticleStatus })
    }

    handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: event.target.value })
    }

    handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ content: event.target.value })
    }

    insertTool = (tool: MarkdownTool) => {
        const textarea = this.contentRef.current

        if (!textarea) {
            return
        }

        const { content } = this.state
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = content.slice(start, end)
        const inner = selected || tool.placeholder
        const next = content.slice(0, start) + tool.before + inner + tool.after + content.slice(end)

        this.setState({ content: next }, () => {
            textarea.focus()
            textarea.setSelectionRange(
                start + tool.before.length,
                start + tool.before.length + inner.length,
            )
        })
    }

    handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { title, description, content, categoryId, status, categories } = this.state
        const category = categories.find((item) => item.id === categoryId)

        if (!title.trim() || !description.trim() || !content.trim()) {
            this.setState({ error: 'Заполните заголовок, описание и содержимое статьи.' })
            return
        }

        if (!category) {
            this.setState({ error: 'Выберите категорию.' })
            return
        }

        const input: ArticleInput = {
            title: title.trim(),
            description: description.trim(),
            content,
            category,
            status,
        }

        this.setState({ error: '', submitting: true })

        const article = await createArticle(input)

        this.props.onCreated(article.slug)
    }

    render() {
        const { title, categoryId, description, content, status, categories, error, submitting } =
            this.state
        const previewHtml = parseMarkdown(content).html

        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="form-field">
                    <label className="form-label" htmlFor="article-form-title">
                        Заголовок
                    </label>
                    <input
                        className="form-input"
                        id="article-form-title"
                        type="text"
                        value={title}
                        placeholder="О чём статья"
                        onChange={this.handleTitleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label className="form-label" htmlFor="article-form-category">
                            Категория
                        </label>
                        <Select
                            id="article-form-category"
                            value={categoryId}
                            options={categories.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            onChange={this.handleCategoryChange}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="article-form-status">
                            Статус
                        </label>
                        <Select
                            id="article-form-status"
                            value={status}
                            options={[
                                { value: 'published', label: 'Опубликовано' },
                                { value: 'draft', label: 'Черновик' },
                            ]}
                            onChange={this.handleStatusChange}
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="article-form-description">
                        Краткое описание
                    </label>
                    <textarea
                        className="form-textarea"
                        id="article-form-description"
                        value={description}
                        rows={2}
                        placeholder="Одно-два предложения для карточки"
                        onChange={this.handleDescriptionChange}
                    />
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="article-form-content">
                        Содержимое (Markdown)
                    </label>
                    <div className="article-form-toolbar">
                        {MARKDOWN_TOOLS.map((tool) => (
                            <button
                                key={tool.label}
                                className="article-form-tool"
                                type="button"
                                title={tool.title}
                                onClick={() => this.insertTool(tool)}
                            >
                                {tool.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="form-textarea article-form-editor-input"
                        id="article-form-content"
                        ref={this.contentRef}
                        value={content}
                        placeholder={'## Заголовок раздела\n\nТекст статьи…'}
                        onChange={this.handleContentChange}
                    />
                </div>

                <div className="form-field">
                    <span className="form-label">Предпросмотр</span>
                    <div className="article-form-preview">
                        {content.trim() ? (
                            <MarkdownContent html={previewHtml} />
                        ) : (
                            <p className="article-form-preview-empty">
                                Здесь появится статья по мере ввода.
                            </p>
                        )}
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <SubmitButton disabled={submitting}>
                        {submitting ? 'Публикуем…' : 'Создать статью'}
                    </SubmitButton>
                </div>
            </form>
        )
    }
}

export default ArticleForm
