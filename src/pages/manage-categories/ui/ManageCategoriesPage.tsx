import { Component } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import { deleteCategoryById, reorderCategoriesById } from '@/shared/lib'
import type { Category } from '@/shared/model/category'
import { ConfirmDialog } from '@/shared/ui'
import { Button } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

interface Subcategory {
    name: string
    slug: string
}

interface ManageCategoriesPageState {
    categories: Category[]
    subOrder: Record<string, Subcategory[]>
    loading: boolean
    deleting: Category | null
    deletingBusy: boolean
    error: string
    dragIndex: number | null
    dragSub: { categorySlug: string; index: number } | null
}

// shortcut: подкатегорий в API пока нет — показываем стабильное случайное число по slug
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
        loading: true,
        deleting: null,
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
            this.setState({ deleting: null })
        }
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

    handleSubDelete = (categorySlug: string, index: number) => () => {
        const { subOrder } = this.state
        const next = [...(subOrder[categorySlug] ?? [])]

        this.setState({
            subOrder: { ...subOrder, [categorySlug]: next.filter((_, itemIndex) => itemIndex !== index) },
        })
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
            loading,
            deleting,
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
                className="size-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                    <Button asChild className="h-10 rounded-full bg-brand px-5 text-brand-foreground hover:opacity-90">
                        <Link to={paths.createCategory}>
                            <Plus className="size-4" /> Добавить категорию
                        </Link>
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
                                        <div className="flex items-baseline gap-2">
                                            <span className="truncate text-sm font-medium">
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
                                                        'flex items-center gap-2 border-l-2 border-border pl-3 text-[0.7rem] text-muted-foreground',
                                                        dragSub?.categorySlug === category.slug &&
                                                            dragSub.index === subIndex &&
                                                            'opacity-50',
                                                    )}
                                                >
                                                    <span className="cursor-grab">
                                                        <GripVertical className="size-3" />
                                                    </span>
                                                    <span className="size-1 rounded-full bg-current" />
                                                    <span className="min-w-0 flex-1 truncate">
                                                        {subcategory.name}
                                                    </span>
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
                                    <div className="flex items-start">
                                        {deleteButton(category, categories.indexOf(category))}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}

                <ConfirmDialog
                    open={deleting !== null}
                    title="Удалить категорию?"
                    confirmLabel={deletingBusy ? 'Удаляем…' : 'Удалить'}
                    busy={deletingBusy}
                    onConfirm={this.handleConfirmDelete}
                    onCancel={this.handleCancelDelete}
                >
                    Категория «{deleting?.name}» и все её статьи будут удалены без возможности
                    восстановления.
                </ConfirmDialog>
            </main>
        )
    }
}

export default ManageCategoriesPage