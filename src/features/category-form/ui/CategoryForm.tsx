import { Component } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { createCategoryById, slugify } from '@/shared/lib'
import type { Category } from '@/shared/model'
import { Button, Input, Label } from '@/shared/ui/kit'

interface CategoryFormProps {
    onCreated: (category: Category) => void
}

interface CategoryFormState {
    name: string
    slug: string
    sortOrder: string
    error: string
    slugEdited: boolean
    submitting: boolean
}

class CategoryForm extends Component<CategoryFormProps, CategoryFormState> {
    state: CategoryFormState = {
        name: '',
        slug: '',
        sortOrder: '',
        error: '',
        slugEdited: false,
        submitting: false,
    }

    handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        this.setState((state) => ({
            name: value,
            slug: state.slugEdited ? state.slug : value.trim() ? slugify(value) : '',
        }))
    }

    handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ slug: event.target.value, slugEdited: true })
    }

    handleSortOrderChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ sortOrder: event.target.value })
    }

    handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { name, slug, sortOrder } = this.state
        const trimmedName = name.trim()

        if (!trimmedName) {
            this.setState({ error: 'Введите название категории.' })
            return
        }

        this.setState({ error: '', submitting: true })

        try {
            const result = await createCategoryById({
                name: trimmedName,
                slug: slug.trim() || slugify(trimmedName),
                sortOrder: Number.parseInt(sortOrder, 10) || 0,
            })

            if (!result.ok || !result.category) {
                this.setState({ error: result.error || 'Не удалось создать категорию.' })

                return
            }

            this.props.onCreated(result.category)
            this.setState({ name: '', slug: '', sortOrder: '', error: '', slugEdited: false })
        } catch (error) {
            this.setState({
                error:
                    error instanceof Error
                        ? error.message
                        : 'Не удалось создать категорию.',
            })
        } finally {
            this.setState({ submitting: false })
        }
    }

    render() {
        const { name, slug, sortOrder, error, submitting } = this.state

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="max-w-2xl rounded-2xl border bg-card p-6">
                    <div className="space-y-2">
                        <Label htmlFor="category-form-name">Название</Label>
                        <Input
                            id="category-form-name"
                            type="text"
                            value={name}
                            placeholder="Например, Go"
                            onChange={this.handleNameChange}
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category-form-slug">Slug</Label>
                            <Input
                                id="category-form-slug"
                                type="text"
                                value={slug}
                                placeholder="go"
                                onChange={this.handleSlugChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category-form-sort-order">Порядок</Label>
                            <Input
                                id="category-form-sort-order"
                                type="number"
                                min={0}
                                value={sortOrder}
                                placeholder="0"
                                onChange={this.handleSortOrderChange}
                            />
                        </div>
                    </div>

                    {error ? (
                        <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}

                    <div className="mt-5 flex justify-end">
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="h-10 rounded-full bg-brand px-5 text-brand-foreground hover:opacity-90"
                        >
                            {submitting ? 'Создаём…' : 'Добавить категорию'}
                        </Button>
                    </div>
                </div>
            </form>
        )
    }
}

export default CategoryForm