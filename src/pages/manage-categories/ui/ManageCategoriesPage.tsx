import { Component } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import { deleteCategoryById, reorderCategoriesById } from '@/shared/lib'
import type { Category } from '@/shared/model/category'
import { ConfirmDialog, HeroTitle, LinkButton } from '@/shared/ui'
import './ManageCategoriesPage.css'

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
        const { categories, loading, deleting, deletingBusy, error } = this.state

        return (
            <main className="page manage-categories">
                <HeroTitle>Управление категориями</HeroTitle>
                <div className="manage-categories-toolbar">
                    <Link className="manage-categories-back" to={paths.categories}>
                        ← К категориям
                    </Link>
                    <LinkButton to={paths.createCategory}>Добавить категорию</LinkButton>
                </div>

                {error && <p className="manage-categories-error">{error}</p>}

                {!loading && (
                    <ul className="manage-categories-list">
                        {categories.map((category, index) => (
                            <li
                                className={
                                    this.state.dragIndex === index
                                        ? 'manage-categories-row manage-categories-row--dragging'
                                        : 'manage-categories-row'
                                }
                                key={category.id}
                                draggable
                                onDragStart={this.handleDragStart(index)}
                                onDragOver={this.handleDragOver}
                                onDrop={this.handleDrop(index)}
                                onDragEnd={this.handleDragEnd}
                            >
                                <span className="manage-categories-name">{category.name}</span>
                                <div className="manage-categories-actions">
                                    <button
                                        className="manage-categories-order"
                                        type="button"
                                        disabled={index === 0}
                                        onClick={() => this.handleAction(index, 'moveUp')}
                                        aria-label={`Переместить вверх: ${category.name}`}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="manage-categories-order"
                                        type="button"
                                        disabled={index === categories.length - 1}
                                        onClick={() => this.handleAction(index, 'moveDown')}
                                        aria-label={`Переместить вниз: ${category.name}`}
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="manage-categories-delete"
                                        type="button"
                                        onClick={() => this.handleAction(index, 'delete')}
                                        aria-label={`Удалить: ${category.name}`}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

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