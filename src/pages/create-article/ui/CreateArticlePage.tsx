import { Component } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
    AlignLeft,
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Code2,
    Eye,
    Info,
    Lightbulb,
    List,
    ListChecks,
    Loader2,
    PenLine,
    Plus,
    Quote,
    Sparkles,
    Text,
    Trash2,
    Type,
    Wand2,
    X,
} from 'lucide-react'
import type { BlogCategory } from '@/shared/api/mock/blog-categories'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { paths } from '@/shared/config'
import type { ContentBlock } from '@/shared/lib/markdown'
import {
    blockError,
    countWords,
    emptyBlock,
    estimateReadTime,
    initialsOf,
} from '@/shared/lib/markdown'
import { Badge, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/shared/ui/kit'
import { PostCover } from '@/shared/ui/post-cover'
import { cn } from '@/shared/lib/cn'

const GRADIENT_PRESETS: { value: string; label: string }[] = [
    { value: 'from-emerald-500 via-teal-500 to-cyan-500', label: 'Изумруд' },
    { value: 'from-teal-500 via-emerald-500 to-green-500', label: 'Мята' },
    { value: 'from-cyan-500 via-sky-500 to-blue-500', label: 'Океан' },
    { value: 'from-violet-500 via-purple-500 to-fuchsia-500', label: 'Фиалка' },
    { value: 'from-amber-500 via-orange-500 to-red-500', label: 'Закат' },
    { value: 'from-rose-500 via-pink-500 to-red-500', label: 'Роза' },
]

const BLOCK_ORDER: ContentBlock['type'][] = [
    'paragraph',
    'heading',
    'list',
    'code',
    'quote',
    'callout',
    'takeaways',
]

const BLOCK_META = {
    paragraph: { label: 'Абзац', icon: Text },
    heading: { label: 'Подзаголовок', icon: Type },
    list: { label: 'Список', icon: List },
    code: { label: 'Код', icon: Code2 },
    quote: { label: 'Цитата', icon: Quote },
    callout: { label: 'Врезка', icon: Lightbulb },
    takeaways: { label: 'Что запомнить', icon: ListChecks },
} as const

interface ToastState {
    title: string
    description: string
    variant: 'default' | 'destructive'
}

interface ErrorsState {
    title?: string
    excerpt?: string
    categorySlug?: string
    subcategorySlug?: string
    authorName?: string
    blocks?: string
}

interface CreateState {
    title: string
    excerpt: string
    categorySlug: string
    subcategorySlug: string
    authorName: string
    readTime: number | ''
    tagsInput: string
    articleTags: string[]
    gradient: string
    blocks: ContentBlock[]
    errors: ErrorsState
    submitting: boolean
    toast: ToastState | null
    publishedTitle: string | null
}

function pluralBlocks(n: number): string {
    const m10 = n % 10
    const m100 = n % 100

    if (m10 === 1 && m100 !== 11) return 'блок'
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'блока'
    return 'блоков'
}

class CreateArticlePage extends Component<Record<string, never>, CreateState> {
    state: CreateState = {
        title: '',
        excerpt: '',
        categorySlug: '',
        subcategorySlug: '',
        authorName: '',
        readTime: '',
        tagsInput: '',
        articleTags: [],
        gradient: GRADIENT_PRESETS[0].value,
        blocks: [],
        errors: {},
        submitting: false,
        toast: null,
        publishedTitle: null,
    }

    toastTimer?: number

    componentWillUnmount() {
        window.clearTimeout(this.toastTimer)
    }

    private selectedCategory(): BlogCategory | undefined {
        return blogCategories.find((category) => category.slug === this.state.categorySlug)
    }

    private tagsList(): string[] {
        return this.state.articleTags
    }

    private finalReadTime(): number {
        return typeof this.state.readTime === 'number' && this.state.readTime >= 1
            ? this.state.readTime
            : estimateReadTime(this.state.blocks)
    }

    private notify(toast: ToastState) {
        this.setState({ toast })
        window.clearTimeout(this.toastTimer)
        this.toastTimer = window.setTimeout(() => this.setState({ toast: null }), 4000)
    }

    private update<K extends keyof CreateState>(key: K, value: CreateState[K]) {
        this.setState({ [key]: value } as Pick<CreateState, K>)
    }

    handleTitle = (event: ChangeEvent<HTMLInputElement>) => this.update('title', event.target.value)
    handleExcerpt = (event: ChangeEvent<HTMLTextAreaElement>) => this.update('excerpt', event.target.value)
    handleAuthorName = (event: ChangeEvent<HTMLInputElement>) => this.update('authorName', event.target.value)
    handleTags = (event: ChangeEvent<HTMLInputElement>) => this.update('tagsInput', event.target.value)

    handleReadTime = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        this.update('readTime', value === '' ? '' : Math.max(1, Math.min(120, Number(value))))
    }

    handleCategory = (value: string) => {
        this.setState({ categorySlug: value, subcategorySlug: '' })
    }

    handleSubcategory = (value: string) => this.update('subcategorySlug', value)

    addTag = () => {
        const value = this.state.tagsInput.trim()

        if (!value) return

        const incoming = value.split(',').map((t) => t.trim()).filter(Boolean)
        const merged = [...new Set([...this.state.articleTags, ...incoming])]

        this.update('articleTags', merged)
        this.update('tagsInput', '')
    }

    removeTag = (tag: string) => {
        this.update('articleTags', this.state.articleTags.filter((t) => t !== tag))
    }

    private updateBlock(index: number, patch: Partial<ContentBlock>) {
        const blocks = this.state.blocks.map((b, i) =>
            i === index ? ({ ...b, ...patch } as ContentBlock) : b,
        )

        this.update('blocks', blocks)
    }

    private moveBlock(index: number, dir: -1 | 1) {
        const blocks = [...this.state.blocks]
        const target = index + dir

        if (target < 0 || target >= blocks.length) return

        const tmp = blocks[index]
        blocks[index] = blocks[target]
        blocks[target] = tmp

        this.update('blocks', blocks)
    }

    private removeBlock(index: number) {
        if (this.state.blocks.length <= 1) return

        this.update(
            'blocks',
            this.state.blocks.filter((_, i) => i !== index),
        )
    }

    private addBlock(type: ContentBlock['type']) {
        this.update('blocks', [...this.state.blocks, emptyBlock(type)])
    }

    private resetForm() {
        this.setState({
            title: '',
            excerpt: '',
            categorySlug: '',
            subcategorySlug: '',
            authorName: '',
            readTime: '',
            tagsInput: '',
            articleTags: [],
            gradient: GRADIENT_PRESETS[0].value,
            blocks: [],
            errors: {},
        })
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const state = this.state
        const error: ErrorsState = {}

        if (state.title.trim().length < 8) error.title = 'Минимум 8 символов'
        else if (state.title.trim().length > 140) error.title = 'Максимум 140 символов'
        if (state.excerpt.trim().length < 20) error.excerpt = 'Минимум 20 символов'
        else if (state.excerpt.trim().length > 400) error.excerpt = 'Максимум 400 символов'
        if (!state.categorySlug) error.categorySlug = 'Выберите категорию'
        if (!state.subcategorySlug) error.subcategorySlug = 'Выберите подкатегорию'
        if (state.authorName.trim().length < 2) error.authorName = 'Укажите имя автора'

        state.blocks.forEach((block, i) => {
            const err = blockError(block)

            if (err && !error.blocks) {
                error.blocks = `Блок ${i + 1} «${BLOCK_META[block.type].label}»: ${err.toLowerCase()}`
            }
        })

        if (state.blocks.length === 0) error.blocks = 'Добавьте хотя бы один блок'

        this.setState({ errors: error })

        if (Object.values(error).some(Boolean)) {
            this.notify({
                title: 'Проверьте форму',
                description: Object.values(error)[0] as string,
                variant: 'destructive',
            })
            return
        }

        this.setState({ submitting: true })
        await new Promise((resolve) => setTimeout(resolve, 700))
        this.setState({ submitting: false })

        // Полный мок: API не принимает author/tags/gradient/subcategory, публикация не уходит на сервер
        this.notify({
            title: 'Статья опубликована 🎉',
            description: `«${this.state.title.trim()}» появилась в ленте блога.`,
            variant: 'default',
        })

        this.setState({ publishedTitle: this.state.title.trim() })
        this.resetForm()
    }

    renderFieldError(msg?: string) {
        return msg ? <p className="mt-1.5 text-xs text-destructive">{msg}</p> : null
    }

    renderCounter(len: number, max: number) {
        return (
            <span className={cn('text-[0.7rem] tabular-nums', len > max ? 'text-destructive' : 'text-muted-foreground')}>
                {len}/{max}
            </span>
        )
    }

    renderBlockFields(block: ContentBlock, index: number) {
        switch (block.type) {
            case 'paragraph':
                return (
                    <Textarea
                        value={block.text}
                        onChange={(e) => this.updateBlock(index, { type: 'paragraph', text: e.target.value })}
                        placeholder="Текст абзаца…"
                        rows={4}
                    />
                )
            case 'heading':
                return (
                    <Input
                        value={block.text}
                        onChange={(e) => this.updateBlock(index, { type: 'heading', text: e.target.value })}
                        placeholder="Подзаголовок раздела…"
                    />
                )
            case 'list':
                return (
                    <Textarea
                        value={block.items.join('\n')}
                        onChange={(e) => this.updateBlock(index, { type: 'list', items: e.target.value.split('\n') })}
                        placeholder={'Пункт списка\nЕщё один пункт'}
                        rows={4}
                    />
                )
            case 'code':
                return (
                    <>
                        <Input
                            value={block.language}
                            onChange={(e) => this.updateBlock(index, { type: 'code', language: e.target.value })}
                            placeholder="Язык: ts, python, go…"
                            className="font-mono text-xs"
                        />
                        <Textarea
                            value={block.code}
                            onChange={(e) => this.updateBlock(index, { type: 'code', code: e.target.value })}
                            placeholder="const hello = () => 'world';"
                            rows={6}
                            className="font-mono text-xs"
                        />
                    </>
                )
            case 'quote':
                return (
                    <>
                        <Textarea
                            value={block.text}
                            onChange={(e) => this.updateBlock(index, { type: 'quote', text: e.target.value })}
                            placeholder="Текст цитаты…"
                            rows={3}
                        />
                        <Input
                            value={block.author}
                            onChange={(e) => this.updateBlock(index, { type: 'quote', author: e.target.value })}
                            placeholder="Автор цитаты (необязательно)"
                        />
                    </>
                )
            case 'callout':
                return (
                    <>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[160px_minmax(0,1fr)]">
                            <Select value={block.variant} onValueChange={(v) => this.updateBlock(index, { type: 'callout', variant: v as 'tip' | 'warning' | 'info' })}>
                                <SelectTrigger aria-label="Тип врезки">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tip">Совет</SelectItem>
                                    <SelectItem value="warning">Важно</SelectItem>
                                    <SelectItem value="info">Заметка</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                value={block.title}
                                onChange={(e) => this.updateBlock(index, { type: 'callout', title: e.target.value })}
                                placeholder="Заголовок врезки…"
                            />
                        </div>
                        <Textarea
                            value={block.text}
                            onChange={(e) => this.updateBlock(index, { type: 'callout', text: e.target.value })}
                            placeholder="Текст врезки…"
                            rows={3}
                        />
                    </>
                )
            case 'takeaways':
                return (
                    <Textarea
                        value={block.items.join('\n')}
                        onChange={(e) => this.updateBlock(index, { type: 'takeaways', items: e.target.value.split('\n') })}
                        placeholder={'Главный вывод один\nГлавный вывод два'}
                        rows={3}
                    />
                )
        }
    }

    renderPreview(): React.ReactNode {
        const state = this.state
        const category = this.selectedCategory()
        const tags = this.tagsList()
        const name = state.authorName.trim() || 'Ваше имя'
        const title = state.title.trim() || 'Заголовок статьи'
        const excerpt = state.excerpt.trim() || 'Краткое описание появится здесь.'

        const previewArticle = {
            slug: 'preview',
            title,
            description: excerpt,
            category: {
                id: '',
                name: category?.name ?? 'Категория',
                slug: category?.slug ?? 'category',
            },
            status: 'published' as const,
            publishedAt: '',
            readingTime: `${this.finalReadTime()} мин`,
        }

        return (
            <aside className="hidden xl:block">
                <div className="sticky top-24 space-y-4">
                    <div className="rounded-2xl border bg-card p-5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                            <Eye className="size-3.5" /> Живой предпросмотр
                        </p>
                        <div className="mt-4">
                            <PostCover article={previewArticle} className="rounded-xl" />
                        </div>
                        <h3 className="mt-4 line-clamp-3 text-base leading-snug font-semibold">
                            {title}
                        </h3>
                        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{excerpt}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {(tags.length > 0 ? tags : ['#блог']).map((tag) => (
                                <Badge key={tag} variant="secondary" className="font-normal">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2.5 border-t pt-4">
                            <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-[0.62rem] font-bold text-white">
                                {initialsOf(name)}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-[0.78rem] leading-tight font-medium">{name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-card p-5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                            <Info className="size-3.5" /> Подсказки
                        </p>
                        <ul className="mt-3 space-y-2.5 text-[0.82rem] leading-5 text-muted-foreground">
                            <li className="flex gap-2">
                                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                Заголовок — до 140 символов, лид — до 400.
                            </li>
                            <li className="flex gap-2">
                                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                Блок «Код» получит тёмную панель и кнопку копирования.
                            </li>
                            <li className="flex gap-2">
                                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                Время чтения считается автоматически: ~180 слов/мин.
                            </li>
                            <li className="flex gap-2">
                                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                                Блоки можно менять местами стрелками вверх/вниз.
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        )
    }

    render() {
        const state = this.state
        const category = this.selectedCategory()
        const blocks = state.blocks
        const words = countWords(blocks)
        const errors = state.errors

        return (
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72">
                    <div className="animate-blob absolute top-[-8rem] left-1/4 size-[22rem] rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="animate-blob absolute top-[-6rem] right-1/4 size-[20rem] rounded-full bg-teal-500/15 blur-3xl [animation-delay:-5s]" />
                </div>

                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-8 pb-20">
                    <nav aria-label="Навигация" className="flex items-center justify-between gap-3">
                        <ol className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-muted-foreground">
                            <li>
                                <Link to={paths.home} className="hover:text-foreground">
                                    Главная
                                </Link>
                            </li>
                            <li aria-hidden>/</li>
                            <li aria-current="page" className="text-foreground">
                                Новая статья
                            </li>
                        </ol>
                        <Button asChild variant="outline" size="sm" className="h-8 rounded-full">
                            <Link to={paths.categories}>
                                <ArrowLeft className="size-3.5" /> Все статьи
                            </Link>
                        </Button>
                    </nav>

                    <header className="mx-auto mt-8 max-w-3xl text-center">
                        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand">
                            <PenLine className="size-3.5" /> Авторам
                        </Badge>
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
                            Написать{' '}
                            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                статью
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground sm:text-lg">
                            Заполните форму, соберите текст из блоков и опубликуйте материал
                            в&nbsp;блоге — он сразу появится в&nbsp;ленте.
                        </p>
                    </header>

                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                            <div className="min-w-0 space-y-6">
                                <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4">
                                    <Sparkles className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                                    <p className="text-sm leading-6 text-foreground/85">
                                        Статья публикуется сразу: она появится в блоке «Последние
                                        статьи», на странице категории и получит собственный адрес
                                        вида <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.78rem]">#article/…</code>
                                        {' '}(в&nbsp;режиме мока публикация не&nbsp;уходит на&nbsp;сервер).
                                    </p>
                                </div>

                                <section className="rounded-2xl border bg-card p-6">
                                    <h2 className="text-lg font-bold tracking-tight">Основное</h2>
                                    <div className="mt-5 space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="title">Заголовок</Label>
                                                {this.renderCounter(state.title.length, 140)}
                                            </div>
                                            <Input
                                                id="title"
                                                value={state.title}
                                                onChange={this.handleTitle}
                                                placeholder="Например: Что такое замыкания в JavaScript и зачем они нужны"
                                                aria-invalid={Boolean(errors.title)}
                                                className={cn(errors.title && 'border-destructive focus-visible:ring-destructive')}
                                            />
                                            {this.renderFieldError(errors.title)}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="excerpt">Краткое описание (лид)</Label>
                                                {this.renderCounter(state.excerpt.length, 400)}
                                            </div>
                                            <Textarea
                                                id="excerpt"
                                                value={state.excerpt}
                                                onChange={this.handleExcerpt}
                                                placeholder="2–3 предложения, которые объясняют, о чём статья и почему её стоит прочитать."
                                                rows={3}
                                                aria-invalid={Boolean(errors.excerpt)}
                                                className={cn(errors.excerpt && 'border-destructive focus-visible:ring-destructive')}
                                            />
                                            {this.renderFieldError(errors.excerpt)}
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-2xl border bg-card p-6">
                                    <h2 className="text-lg font-bold tracking-tight">Рубрика и автор</h2>
                                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Категория</Label>
                                            <Select value={state.categorySlug} onValueChange={this.handleCategory}>
                                                <SelectTrigger id="category" aria-invalid={Boolean(errors.categorySlug)} className={cn('w-full', errors.categorySlug && 'border-destructive')}>
                                                    <SelectValue placeholder="Выберите категорию" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {blogCategories.map((item) => (
                                                        <SelectItem key={item.slug} value={item.slug}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {this.renderFieldError(errors.categorySlug)}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subcategory">Подкатегория</Label>
                                            <Select value={state.subcategorySlug} onValueChange={this.handleSubcategory} disabled={!state.categorySlug}>
                                                <SelectTrigger id="subcategory" aria-invalid={Boolean(errors.subcategorySlug)} className={cn('w-full', errors.subcategorySlug && 'border-destructive')}>
                                                    <SelectValue placeholder={state.categorySlug ? 'Выберите подкатегорию' : 'Сначала категория'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(category?.subcategories ?? []).map((subcategory) => (
                                                        <SelectItem key={subcategory.slug} value={subcategory.slug}>
                                                            {subcategory.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {this.renderFieldError(errors.subcategorySlug)}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="author">Имя автора</Label>
                                            <Input
                                                id="author"
                                                value={state.authorName}
                                                onChange={this.handleAuthorName}
                                                placeholder="Иван Иванов"
                                                aria-invalid={Boolean(errors.authorName)}
                                                className={cn(errors.authorName && 'border-destructive focus-visible:ring-destructive')}
                                            />
                                            {this.renderFieldError(errors.authorName)}
                                        </div>

                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="readTime">Время чтения, минут</Label>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Input
                                                    id="readTime"
                                                    type="number"
                                                    min={1}
                                                    max={120}
                                                    value={state.readTime}
                                                    onChange={this.handleReadTime}
                                                    placeholder="Авто"
                                                    className="w-32"
                                                />
                                                <Button type="button" variant="outline" className="rounded-lg" onClick={() => this.update('readTime', estimateReadTime(blocks))}>
                                                    <Wand2 className="size-4" /> Рассчитать по тексту
                                                </Button>
                                                <span className="ml-1 inline-flex items-center gap-1.5 self-center text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" /> сейчас: {this.finalReadTime()} мин
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="rounded-2xl border bg-card p-6">
                                    <h2 className="text-lg font-bold tracking-tight">Обложка</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Выберите градиент — он станет фоном обложки статьи.
                                    </p>
                                    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                                        {GRADIENT_PRESETS.map((preset) => (
                                            <button
                                                key={preset.value}
                                                type="button"
                                                onClick={() => this.update('gradient', preset.value)}
                                                aria-pressed={state.gradient === preset.value}
                                                aria-label={`Градиент «${preset.label}»`}
                                                className={cn(
                                                    'relative h-14 overflow-hidden rounded-xl bg-gradient-to-br shadow-sm transition-all',
                                                    preset.value,
                                                    state.gradient === preset.value
                                                        ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                                                        : 'opacity-75 hover:opacity-100',
                                                )}
                                            >
                                                <span className="absolute inset-0 grid place-items-center text-[0.68rem] font-semibold text-white">
                                                    {preset.label}
                                                </span>
                                                {state.gradient === preset.value ? (
                                                    <Check className="absolute top-1.5 right-1.5 size-3.5 text-white drop-shadow" />
                                                ) : null}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="rounded-2xl border bg-card p-6">
                                    <h2 className="text-lg font-bold tracking-tight">Теги</h2>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-2 rounded-full border bg-background/70 p-1.5 pl-4 shadow-sm backdrop-blur">
                                            <Input
                                                value={state.tagsInput}
                                                onChange={this.handleTags}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        this.addTag()
                                                    }
                                                }}
                                                placeholder="JavaScript, Замыкания, Основы"
                                                aria-label="Введите тег"
                                                className="h-8 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={this.addTag}
                                                aria-label="Добавить тег"
                                                className="size-8 shrink-0 rounded-full bg-brand p-0 text-brand-foreground hover:opacity-90"
                                            >
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                        {this.tagsList().length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {this.tagsList().map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="gap-1 pr-1 font-normal">
                                                        #{tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => this.removeTag(tag)}
                                                            aria-label={`Удалить тег ${tag}`}
                                                            className="-mr-0.5 grid size-4 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/15 hover:text-foreground"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                Необязательно: без тегов подставим название категории.
                                            </p>
                                        )}
                                    </div>
                                </section>

                                <section className="rounded-2xl border bg-card p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-bold tracking-tight">Контент</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Соберите статью из блоков — их можно менять местами.
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="gap-1.5">
                                            <AlignLeft className="size-3" /> {blocks.length}{' '}
                                            {pluralBlocks(blocks.length)} · {words} слов
                                        </Badge>
                                    </div>

                                    {this.renderFieldError(errors.blocks)}

                                    <div className="mt-4 space-y-3">
                                        {blocks.map((block, index) => {
                                            const meta = BLOCK_META[block.type]
                                            const Icon = meta.icon

                                            return (
                                                <div key={index} className="rounded-xl border bg-background p-4 transition-colors hover:border-brand/40">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="flex items-center gap-2 text-sm font-semibold">
                                                            <span className="grid size-7 place-items-center rounded-md bg-brand/10 text-brand">
                                                                <Icon className="size-3.5" />
                                                            </span>
                                                            {meta.label}
                                                            <span className="text-xs font-normal text-muted-foreground">
                                                                #{index + 1}
                                                            </span>
                                                        </span>
                                                        <div className="flex items-center gap-0.5">
                                                            <Button type="button" variant="ghost" size="icon" className="size-7 rounded-md" onClick={() => this.moveBlock(index, -1)} disabled={index === 0} aria-label="Переместить блок выше">
                                                                <ChevronUp className="size-4" />
                                                            </Button>
                                                            <Button type="button" variant="ghost" size="icon" className="size-7 rounded-md" onClick={() => this.moveBlock(index, 1)} disabled={index === blocks.length - 1} aria-label="Переместить блок ниже">
                                                                <ChevronDown className="size-4" />
                                                            </Button>
                                                            <Button type="button" variant="ghost" size="icon" className="size-7 rounded-md text-muted-foreground hover:text-destructive" onClick={() => this.removeBlock(index)} disabled={blocks.length <= 1} aria-label="Удалить блок">
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 space-y-2.5">
                                                        {this.renderBlockFields(block, index)}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-4">
                                        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <Plus className="size-3.5" /> Добавить блок
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {BLOCK_ORDER.map((type) => {
                                                const meta = BLOCK_META[type]
                                                const Icon = meta.icon

                                                return (
                                                    <Button key={type} type="button" variant="outline" size="sm" className="h-8 rounded-full" onClick={() => this.addBlock(type)}>
                                                        <Icon className="size-3.5" /> {meta.label}
                                                    </Button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </section>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                    <Button type="button" variant="ghost" size="lg" className="h-12 rounded-full" onClick={() => this.resetForm()} disabled={state.submitting}>
                                        Очистить
                                    </Button>
                                    <Button type="submit" size="lg" disabled={state.submitting} className="h-12 flex-1 rounded-full bg-brand text-base text-brand-foreground hover:opacity-90 sm:flex-none sm:px-10">
                                        {state.submitting ? (
                                            <>
                                                <Loader2 className="size-5 animate-spin" /> Публикуем…
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="size-5" /> Опубликовать статью
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="min-w-0">{this.renderPreview()}</div>
                        </div>
                    </form>

                    {state.publishedTitle ? (
                        <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-sm text-emerald-700 dark:text-emerald-300">
                            Статья «{state.publishedTitle}» опубликована в режиме мока. Подключите
                            поля author/tags/gradient к&nbsp;API, чтобы она появилась в&nbsp;ленте.
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default CreateArticlePage