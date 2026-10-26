import { Component } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import { deleteCategoryById, reorderCategoriesById } from '@/shared/lib'
import type { Category } from '@/shared/model/category'
import { ConfirmDialog } from '@/shared/ui'
import { Button } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

interface RowAction {
    kind: 'moveUp' | 'moveDown' | 'delete'
    index: number
}

interface ManageCategoriesPageState {
    categories: Category[]
    loading: boolean
    deleting: Category | null
    deletingBusy: boolean
    error: string
    dragIndex: number | null
}

class ManageCategoriesPage extends Component<Record<string, never>, ManageCategoriesPageState> {
    state: ManageCategoriesPageState = {
        categories: [],
        loading: true,
        deleting: null,
        deletingBusy: false,
        error: '',
        dragIndex: null,
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        try {
            const categories = await fetchCategories()

            this.setState({ categories, loading: false })
        } catch {
            this.setState({ loading: false })
        }
    }

    handleAction = (index: number, kind: RowAction['kind']) => {
        const { categories } = this.state

        if (kind === 'delete') {
            this.setState({ deleting: categories[index] ?? null, error: '' })

            return
        }

        const next = [...categories]
        const swapWith = kind === 'moveUp' ? index - 1 : index + 1

        if (swapWith < 0 || swapWith >= next.length) {
            return
        }

        const tmp = next[index]
        next[index] = next[swapWith]
        next[swapWith] = tmp

        this.setState({ categories: next, error: '' })
        void this.persistOrder(next)
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

    async persistOrder(next: Category[]) {
        const items = next.map((category, index) => ({ id: category.id, sortOrder: index }))
        const result = await reorderCategoriesById(items)

        if (!result.ok) {
            this.setState({ error: result.error })
        }
    }

    render() {
        const { categories, loading, deleting, deletingBusy, error, dragIndex } = this.state

        const moveUpButton = (category: Category, index: number) => (
            <Button
                variant="ghost"
                size="icon"
                disabled={index === 0}
                onClick={() => this.handleAction(index, 'moveUp')}
                aria-label={`Переместить вверх: ${category.name}`}
                className="size-8 rounded-full"
            >
                <ChevronUp className="size-4" />
            </Button>
        )

        const moveDownButton = (category: Category, index: number) => (
            <Button
                variant="ghost"
                size="icon"
                disabled={index === categories.length - 1}
                onClick={() => this.handleAction(index, 'moveDown')}
                aria-label={`Переместить вниз: ${category.name}`}
                className="size-8 rounded-full"
            >
                <ChevronDown className="size-4" />
            </Button>
        )

        const deleteButton = (category: Category, index: number) => (
            <Button
                variant="ghost"
                size="icon"
                onClick={() => this.handleAction(index, 'delete')}
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
                        Переставляйте категории стрелками или перетаскиванием. Порядок сохраняется
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
                        {categories.map((category, index) => (
                            <li
                                key={category.id}
                                draggable
                                onDragStart={this.handleDragStart(index)}
                                onDragOver={this.handleDragOver}
                                onDrop={this.handleDrop(index)}
                                onDragEnd={this.handleDragEnd}
                                className={cn(
                                    'flex items-center gap-3 border-b p-4 last:border-b-0',
                                    dragIndex === index && 'opacity-50',
                                )}
                            >
                                <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                                    <GripVertical className="size-5" />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                    {category.name}
                                </span>
                                <span className="hidden text-xs text-muted-foreground sm:inline">
                                    /{category.slug}
                                </span>
                                <div className="flex items-center gap-1">
                                    {moveUpButton(category, index)}
                                    {moveDownButton(category, index)}
                                    <span className="mx-1 h-5 w-px bg-border" />
                                    {deleteButton(category, index)}
                                </div>
                            </li>
                        ))}
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