import { Component } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { createArticle, fetchCategories } from '@/shared/api'
import type { ArticleInput } from '@/shared/api'
import { parseMarkdown } from '@/shared/lib/markdown'
import type { ArticleStatus, Category } from '@/shared/model'
import { MarkdownContent } from '@/shared/ui'
import { BlockEditor } from '@/features/block-editor'
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@/shared/ui/kit'

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

    handleBlocksChange = (markdown: string) => {
        this.setState({ content: markdown })
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

        try {
            const article = await createArticle(input)

            this.props.onCreated(article.slug)
        } catch (error) {
            this.setState({
                submitting: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось создать статью.',
            })
        }
    }

    render() {
        const { title, categoryId, description, content, status, categories, error, submitting } =
            this.state
        const previewHtml = parseMarkdown(content).html

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
                    <div className="space-y-6">
                        <div className="rounded-2xl border bg-card p-6">
                            <div className="space-y-2">
                                <Label htmlFor="article-form-title">Заголовок</Label>
                                <Input
                                    id="article-form-title"
                                    type="text"
                                    value={title}
                                    placeholder="О чём статья"
                                    onChange={this.handleTitleChange}
                                />
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="article-form-category">Категория</Label>
                                    <Select
                                        value={categoryId || undefined}
                                        onValueChange={this.handleCategoryChange}
                                    >
                                        <SelectTrigger id="article-form-category" className="w-full">
                                            <SelectValue placeholder="Выберите категорию" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="article-form-status">Статус</Label>
                                    <Select value={status} onValueChange={this.handleStatusChange}>
                                        <SelectTrigger id="article-form-status" className="w-full">
                                            <SelectValue placeholder="Статус" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="published">Опубликовано</SelectItem>
                                            <SelectItem value="draft">Черновик</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-5 space-y-2">
                                <Label htmlFor="article-form-description">Краткое описание</Label>
                                <Textarea
                                    id="article-form-description"
                                    value={description}
                                    rows={2}
                                    placeholder="Одно-два предложения для карточки"
                                    onChange={this.handleDescriptionChange}
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-card p-6">
                            <Label>Содержимое</Label>
                            <p className="mt-1 mb-3 text-xs text-muted-foreground">
                                Блоки склеиваются в&nbsp;markdown-тело статьи.
                            </p>
                            <BlockEditor value={content} onChange={this.handleBlocksChange} />
                        </div>

                        {error ? (
                            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </p>
                        ) : null}

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={submitting}
                                className="h-11 rounded-full bg-brand px-6 text-brand-foreground hover:opacity-90"
                            >
                                {submitting ? 'Публикуем…' : 'Создать статью'}
                            </Button>
                        </div>
                    </div>

                    <aside className="hidden xl:block">
                        <div className="sticky top-24 rounded-2xl border bg-card p-4">
                            <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                                Предпросмотр
                            </p>
                            <div className="scroll-thin mt-3 max-h-[70vh] overflow-y-auto rounded-xl bg-background p-4">
                                {content.trim() ? (
                                    <MarkdownContent html={previewHtml} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Здесь появится статья по мере ввода.
                                    </p>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </form>
        )
    }
}

export default ArticleForm
