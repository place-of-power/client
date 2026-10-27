import { Component } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createCategoryById, slugify } from '@/shared/lib'
import type { Category } from '@/shared/model'
import { FormCard } from '@/shared/ui'
import { Input, Label, Textarea } from '@/shared/ui/kit'

interface CategoryFormProps {
    onCreated: (category: Category) => void
    onCancel?: () => void
}

interface CategoryFormState {
    name: string
    slug: string
    description: string
    sortOrder: string
    error: string
    slugEdited: boolean
    submitting: boolean
}

class CategoryForm extends Component<CategoryFormProps, CategoryFormState> {
    state: CategoryFormState = {
        name: '',
        slug: '',
        description: '',
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

    handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ description: event.target.value })
    }

    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
            this.setState({ name: '', slug: '', description: '', sortOrder: '', error: '', slugEdited: false })
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
        const { name, slug, description, sortOrder, error, submitting } = this.state
        const { onCancel } = this.props

        return (
            <FormCard
                onSubmit={this.handleSubmit}
                error={error}
                submitLabel={submitting ? 'Создаём…' : 'Добавить категорию'}
                busy={submitting}
                onCancel={onCancel}
            >
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

                <div className="mt-5 space-y-2">
                    <Label htmlFor="category-form-description">Описание</Label>
                    <Textarea
                        id="category-form-description"
                        value={description}
                        placeholder="Краткое содержание категории"
                        onChange={this.handleDescriptionChange}
                        rows={3}
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
            </FormCard>
        )
    }
}

export default CategoryForm