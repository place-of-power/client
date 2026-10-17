import { Component } from 'react'
import type { ChangeEvent, SubmitEvent } from 'react'
import { slugify } from '@/shared/lib'
import type { Category } from '@/shared/model'
import { SubmitButton } from '@/shared/ui'

interface CategoryFormProps {
    onCreated: (category: Category) => void
}

interface CategoryFormState {
    name: string
    slug: string
    sortOrder: string
    error: string
    slugEdited: boolean
}

class CategoryForm extends Component<CategoryFormProps, CategoryFormState> {
    state: CategoryFormState = {
        name: '',
        slug: '',
        sortOrder: '',
        error: '',
        slugEdited: false,
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

    handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { name, slug, sortOrder } = this.state
        const trimmedName = name.trim()

        if (!trimmedName) {
            this.setState({ error: 'Введите название категории.' })
            return
        }

        this.props.onCreated({
            id: crypto.randomUUID(),
            name: trimmedName,
            slug: slug.trim() || slugify(trimmedName),
            sortOrder: Number.parseInt(sortOrder, 10) || 0,
        })

        this.setState({ name: '', slug: '', sortOrder: '', error: '', slugEdited: false })
    }

    render() {
        const { name, slug, sortOrder, error } = this.state

        return (
            <form className="form" onSubmit={this.handleSubmit}>
                <div className="form-field">
                    <label className="form-label" htmlFor="category-form-name">
                        Название
                    </label>
                    <input
                        className="form-input"
                        id="category-form-name"
                        type="text"
                        value={name}
                        placeholder="Например, Go"
                        onChange={this.handleNameChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label className="form-label" htmlFor="category-form-slug">
                            Slug
                        </label>
                        <input
                            className="form-input"
                            id="category-form-slug"
                            type="text"
                            value={slug}
                            placeholder="go"
                            onChange={this.handleSlugChange}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label" htmlFor="category-form-sort-order">
                            Порядок
                        </label>
                        <input
                            className="form-input"
                            id="category-form-sort-order"
                            type="number"
                            min={0}
                            value={sortOrder}
                            placeholder="0"
                            onChange={this.handleSortOrderChange}
                        />
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <SubmitButton>Добавить категорию</SubmitButton>
                </div>
            </form>
        )
    }
}

export default CategoryForm