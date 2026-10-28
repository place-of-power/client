import { Component } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import { deleteCategoryById, reorderCategoriesById } from '@/shared/lib'
import type { Category } from '@/shared/model/category'
import { CategoryForm } from '@/features/category-form'
import { FormCard, ConfirmDialog } from '@/shared/ui'
import { Button, Input, Label, Textarea } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'
import './ManageCategoriesPage.css'

interface Subcategory {
    name: string
    slug: string
    description?: string
}

interface ManageCategoriesPageState {
    categories: Category[]
    subOrder: Record<string, Subcategory[]>
    covers: Record<string, string>
    loading: boolean
    creating: boolean
    addingSub: { categorySlug: string } | null
    deleting: Category | null
    deletingSub: { categorySlug: string; name: string; index: number } | null
    deletingBusy: boolean
    error: string
    dragIndex: number | null
    dragSub: { categorySlug: string; index: number } | null
}

// shortcut: подкатегорий в API пока нет — показываем стабильное случайное число по slug
function coverStyle(cover: string): { background?: string } {
    if (cover.startsWith('custom:')) {
        const hex = cover.slice(7)

        return { background: `linear-gradient(135deg, ${hex}, ${hex}55 60%, ${hex}22)` }
    }

    return {}
}

function mockSubcategories(slug: string): Subcategory[] {
    const seed = [...slug].reduce((total, char) => total + char.charCodeAt(0), 0)
    const count = 2 + (seed % 4)
    const base = ['Основы', 'Практикум', 'Инструменты', 'Продвинутый', 'Кейсы']

    return Array.from({ length: count }, (_, index) => ({
        name: `${base[(seed + index) % base.length]} ${index + 1}`,
        slug: `${slug}-${index + 1}`,
    }))
}

class ManageCategoriesPage extends Component<Record<string, never>, ManageCategoriesPageState> {
    state: ManageCategoriesPageState = {
        categories: [],
        subOrder: {},
        covers: {},
        loading: true,
        creating: false,
        addingSub: null,
        deleting: null,
        deletingSub: null,
        deletingBusy: false,
        error: '',
        dragIndex: null,
        dragSub: null,
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        try {
            const categories = await fetchCategories()
            const subOrder: Record<string, Subcategory[]> = {}

            for (const category of categories) {
                subOrder[category.slug] = mockSubcategories(category.slug)
            }

            this.setState({ categories, subOrder, loading: false })
        } catch {
            this.setState({ loading: false })
        }
    }

    handleDelete = (index: number) => {
        const { categories } = this.state

        this.setState({ deleting: categories[index] ?? null, error: '' })
    }

    handleConfirmDelete = async () => {
        const { deleting } = this.state

        if (!deleting) {
            return
        }

        this.setState({ deletingBusy: true })

        const result = await deleteCategoryById(deleting.id)

        if (result.ok) {
            this.setState((state) => ({
                categories: state.categories.filter((item) => item.id !== deleting.id),
                deleting: null,
                deletingBusy: false,
            }))

            return
        }

        this.setState({ deleting: null, deletingBusy: false, error: result.error })
    }

    handleCancelDelete = () => {
        if (!this.state.deletingBusy) {
            this.setState({ deleting: null, deletingSub: null })
        }
    }

    handleOpenCreate = () => {
        this.setState({ creating: true })
    }

    handleCloseCreate = () => {
        this.setState({ creating: false })
    }

    handleCreated = (category: Category, cover?: string) => {
        this.setState((state) => ({
            creating: false,
            covers: cover && category.slug ? { ...state.covers, [category.slug]: cover } : state.covers,
        }))
        void this.load()
    }

    handleOpenAddSub = (categorySlug: string) => () => {
        this.setState({ addingSub: { categorySlug } })
    }

    handleCloseAddSub = () => {
        this.setState({ addingSub: null })
    }

    handleSubAdded = (categorySlug: string, name: string, description: string) => {
        const { subOrder } = this.state
        const slug = `${categorySlug}-${Date.now()}`
        const next = [...(subOrder[categorySlug] ?? []), { name, slug, description }]

        this.setState({ subOrder: { ...subOrder, [categorySlug]: next }, addingSub: null })
    }

    handleSubDelete = (categorySlug: string, index: number) => () => {
        const { subOrder } = this.state
        const sub = (subOrder[categorySlug] ?? [])[index]

        if (!sub) {
            return
        }

        this.setState({ deletingSub: { categorySlug, name: sub.name, index }, error: '' })
    }

    handleConfirmSubDelete = () => {
        const { deletingBusy, deletingSub, subOrder } = this.state

        if (deletingBusy || !deletingSub) {
            return
        }

        const next = (subOrder[deletingSub.categorySlug] ?? []).filter(
            (_, itemIndex) => itemIndex !== deletingSub.index,
        )

        this.setState({
            subOrder: { ...subOrder, [deletingSub.categorySlug]: next },
            deletingSub: null,
        })
    }

    handleDragStart = (index: number) => () => {
        this.setState({ dragIndex: index })
    }

    handleDragOver = (event: DragEvent<HTMLLIElement>) => {
        event.preventDefault()
    }

    handleDrop = (targetIndex: number) => () => {
        const { categories, dragIndex } = this.state

        if (dragIndex === null || dragIndex === targetIndex) {
            return
        }

        const next = [...categories]
        const [moved] = next.splice(dragIndex, 1)
        next.splice(targetIndex, 0, moved)

        this.setState({ categories: next, dragIndex: null })
        void this.persistOrder(next)
    }

    handleDragEnd = () => {
        this.setState({ dragIndex: null })
    }

    handleSubDragStart = (categorySlug: string, index: number) => () => {
        this.setState({ dragSub: { categorySlug, index } })
    }

    handleSubDrop = (categorySlug: string, targetIndex: number) => () => {
        const { subOrder, dragSub } = this.state

        if (!dragSub || dragSub.categorySlug !== categorySlug || dragSub.index === targetIndex) {
            this.setState({ dragSub: null })

            return
        }

        const next = [...(subOrder[categorySlug] ?? [])]
        const [moved] = next.splice(dragSub.index, 1)
        next.splice(targetIndex, 0, moved)

        this.setState({
            subOrder: { ...subOrder, [categorySlug]: next },
            dragSub: null,
        })
    }

    handleSubDragEnd = () => {
        this.setState({ dragSub: null })
    }

    async persistOrder(next: Category[]) {
        const items = next.map((category, index) => ({ id: category.id, sortOrder: index }))
        const result = await reorderCategoriesById(items)

        if (!result.ok) {
            this.setState({ error: result.error })
        }
    }

    render() {
        const {
            categories,
            subOrder,
            covers,
            loading,
            creating,
            addingSub,
            deleting,
            deletingSub,
            deletingBusy,
            error,
            dragIndex,
            dragSub,
        } = this.state

        const deleteButton = (category: Category, index: number) => (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => this.handleDelete(index)}
                aria-label={`Удалить: ${category.name}`}
                className="size-8 cursor-pointer rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
                <Trash2 className="size-4" />
            </Button>
        )

        return (
            <main className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-12 pb-16">
                <header>
                    <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                        Каталог
                    </p>
                    <h1 className="mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                        Управление категориями
                    </h1>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Переставляйте категории перетаскиванием. Порядок сохраняется
                        на&nbsp;сервере.
                    </p>
                </header>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to={paths.categories}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                    >
                        <ArrowLeft className="size-4" /> К категориям
                    </Link>
                    <Button
                        onClick={this.handleOpenCreate}
                        className="h-10 cursor-pointer rounded-full bg-brand px-5 text-brand-foreground hover:opacity-90"
                    >
                        <Plus className="size-4" /> Добавить категорию
                    </Button>
                </div>

                {error ? (
                    <p className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                ) : null}

                {!loading ? (
                    <ul className="mt-6 overflow-hidden rounded-2xl border bg-card">
                        {categories.map((category) => {
                            const subcategories = subOrder[category.slug] ?? []

                            return (
                                <li
                                    key={category.id}
                                    draggable
                                    onDragStart={this.handleDragStart(categories.indexOf(category))}
                                    onDragOver={this.handleDragOver}
                                    onDrop={this.handleDrop(categories.indexOf(category))}
                                    onDragEnd={this.handleDragEnd}
                                    className={cn(
                                        'flex items-start gap-3 border-b p-4 last:border-b-0',
                                        dragIndex === categories.indexOf(category) && 'opacity-50',
                                    )}
                                >
                                    <span className="mt-1 cursor-grab text-muted-foreground active:cursor-grabbing">
                                        <GripVertical className="size-5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        {covers[category.slug] ? (
                                            <span
                                                style={coverStyle(covers[category.slug])}
                                                className={cn(
                                                    'mb-2 block h-8 w-20 rounded-md bg-gradient-to-br',
                                                    covers[category.slug].startsWith('custom:')
                                                        ? ''
                                                        : covers[category.slug],
                                                )}
                                            />
                                        ) : null}
                                        <div className="flex items-baseline gap-2">
                                            <span className="truncate text-sm font-medium text-foreground">
                                                {category.name}
                                            </span>
                                            <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
                                                /{category.slug}
                                            </span>
                                        </div>
                                        <ul className="mt-2 space-y-1">
                                            {subcategories.map((subcategory, subIndex) => (
                                                <li
                                                    key={subcategory.slug}
                                                    draggable
                                                    onDragStart={this.handleSubDragStart(
                                                        category.slug,
                                                        subIndex,
                                                    )}
                                                    onDragOver={this.handleDragOver}
                                                    onDrop={this.handleSubDrop(category.slug, subIndex)}
                                                    onDragEnd={this.handleSubDragEnd}
                                                    className={cn(
                                                        'flex items-center gap-2 border-l-2 border-border pl-3 text-[0.7rem]',
                                                        dragSub?.categorySlug === category.slug &&
                                                            dragSub.index === subIndex &&
                                                            'opacity-50',
                                                    )}
                                                >
                                                    <span className="cursor-grab text-muted-foreground">
                                                        <GripVertical className="size-3" />
                                                    </span>
                                                    <span className="size-1 rounded-full bg-current text-muted-foreground" />
                                                    <div className="min-w-0 flex-1">
                                                        <span className="block truncate text-foreground">
                                                            {subcategory.name}
                                                        </span>
                                                        {subcategory.description ? (
                                                            <span className="block truncate text-muted-foreground">
                                                                {subcategory.description}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={this.handleSubDelete(
                                                            category.slug,
                                                            subIndex,
                                                        )}
                                                        aria-label={`Удалить подкатегорию: ${subcategory.name}`}
                                                        className="cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex flex-col items-center self-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={this.handleOpenAddSub(category.slug)}
                                            aria-label={`Добавить подкатегорию в: ${category.name}`}
                                            className="size-8 cursor-pointer rounded-full text-brand hover:bg-brand/10 hover:text-brand"
                                        >
                                            <Plus className="size-4" />
                                        </Button>
                                        {deleteButton(category, categories.indexOf(category))}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}

                <ConfirmDialog
                    open={deleting !== null || deletingSub !== null}
                    title={deletingSub ? 'Удалить подкатегорию?' : 'Удалить категорию?'}
                    confirmLabel="Удалить"
                    busy={deletingBusy}
                    onConfirm={deletingSub ? this.handleConfirmSubDelete : this.handleConfirmDelete}
                    onCancel={this.handleCancelDelete}
                >
                    {deletingSub ? (
                        <>Подкатегория «{deletingSub.name}» будет удалена без возможности
                            восстановления.</>
                    ) : (
                        <>Категория «{deleting?.name}» и все её статьи будут удалены без
                            возможности восстановления.</>
                    )}
                </ConfirmDialog>

                {creating ? (
                    <div className="create-dialog" role="dialog" aria-modal="true" aria-label="Новая категория">
                        <div className="create-dialog-overlay" onClick={this.handleCloseCreate} />
                        <div className="create-dialog-panel">
                            <div className="create-dialog-title">Новая категория</div>
                            <p className="create-dialog-description">
                                Slug можно оставить пустым — он сгенерируется из названия. Порядок
                                задаёт позицию в каталоге.
                            </p>
                            <CategoryForm onCreated={this.handleCreated} onCancel={this.handleCloseCreate} />
                        </div>
                    </div>
                ) : null}

                {addingSub ? (
                    <AddSubcategoryDialog
                        categoryName={
                            categories.find((c) => c.slug === addingSub.categorySlug)?.name ??
                            addingSub.categorySlug
                        }
                        categorySlug={addingSub.categorySlug}
                        onClose={this.handleCloseAddSub}
                        onAdd={this.handleSubAdded}
                    />
                ) : null}
            </main>
        )
    }
}

export default ManageCategoriesPage

interface AddSubcategoryDialogProps {
    categorySlug: string
    categoryName: string
    onClose: () => void
    onAdd: (categorySlug: string, name: string, description: string) => void
}

interface AddSubcategoryDialogState {
    name: string
    description: string
    error: string
}

class AddSubcategoryDialog extends Component<AddSubcategoryDialogProps, AddSubcategoryDialogState> {
    state: AddSubcategoryDialogState = { name: '', description: '', error: '' }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: event.target.value })
    }

    handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: event.target.value })
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const name = this.state.name.trim()

        if (!name) {
            this.setState({ error: 'Введите название подкатегории.' })

            return
        }

        this.props.onAdd(this.props.categorySlug, name, this.state.description.trim())
    }

    render() {
        const { categoryName, onClose } = this.props
        const { name, description, error } = this.state

        return (
            <div className="create-dialog" role="dialog" aria-modal="true" aria-label="Новая подкатегория">
                <div className="create-dialog-overlay" onClick={onClose} />
                <div className="create-dialog-panel">
                    <div className="create-dialog-title">Новая подкатегория</div>
                    <p className="create-dialog-description">
                        Подкатегория будет добавлена в категорию «{categoryName}».
                    </p>
                    <FormCard
                        onSubmit={this.handleSubmit}
                        error={error}
                        submitLabel="Добавить"
                        onCancel={onClose}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="subcategory-form-name">Название</Label>
                            <Input
                                id="subcategory-form-name"
                                type="text"
                                value={name}
                                placeholder="Например, TypeScript"
                                onChange={this.handleChange}
                                autoFocus
                            />
                        </div>
                        <div className="mt-5 space-y-2">
                            <Label htmlFor="subcategory-form-description">Описание</Label>
                            <Textarea
                                id="subcategory-form-description"
                                value={description}
                                placeholder="Краткое содержание подкатегории"
                                onChange={this.handleDescriptionChange}
                                rows={3}
                            />
                        </div>
                    </FormCard>
                </div>
            </div>
        )
    }
}