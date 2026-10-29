import { Component } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createCategoryById, slugify } from '@/shared/lib'
import type { Category } from '@/shared/model'
import { FormCard } from '@/shared/ui'
import { Input, Label, Textarea } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

const CATEGORY_GRADIENTS = [
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-cyan-500 via-sky-500 to-blue-500',
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-amber-500 via-orange-500 to-red-500',
    'from-teal-500 via-emerald-500 to-green-500',
    'from-rose-500 via-pink-500 to-red-500',
] as const

type CategoryGradient = (typeof CATEGORY_GRADIENTS)[number]

type Cover = CategoryGradient | `custom:${string}`

interface CategoryFormProps {
    onCreated: (category: Category, cover?: string) => void
    onCancel?: () => void
}

interface CategoryFormState {
    name: string
    slug: string
    description: string
    gradient: Cover
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
        gradient: CATEGORY_GRADIENTS[0],
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

    handleGradient = (gradient: Cover) => {
        this.setState({ gradient })
    }

    handleCustomColor = (event: ChangeEvent<HTMLInputElement>) => {
        const hex = event.target.value

        this.setState({ gradient: `custom:${hex}` })
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

            this.props.onCreated(result.category, this.state.gradient)
            this.setState({ name: '', slug: '', description: '', gradient: CATEGORY_GRADIENTS[0], sortOrder: '', error: '', slugEdited: false })
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
        const { name, slug, description, gradient, sortOrder, error, submitting } = this.state
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
                        maxLength={255}
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

                <div className="mt-5 space-y-2">
                    <Label>Кавер</Label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {CATEGORY_GRADIENTS.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => this.handleGradient(item)}
                                aria-pressed={gradient === item}
                                aria-label={`Кавер ${item}`}
                                className={cn(
                                    'relative h-10 overflow-hidden rounded-lg bg-gradient-to-br transition-all',
                                    item,
                                    gradient === item
                                        ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                                        : 'opacity-75 hover:opacity-100',
                                )}
                            />
                        ))}
                        <label
                            className={cn(
                                'relative flex h-10 items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all',
                                gradient.startsWith('custom:')
                                    ? 'border-brand ring-2 ring-brand ring-offset-2 ring-offset-background'
                                    : 'border-border hover:opacity-100',
                            )}
                        >
                            <span className="text-[0.62rem] font-medium text-muted-foreground">
                                Свой
                            </span>
                            <input
                                type="color"
                                value={gradient.startsWith('custom:') ? gradient.slice(7) : '#10b981'}
                                onChange={this.handleCustomColor}
                                className="absolute inset-0 cursor-pointer opacity-0"
                                aria-label="Свой цвет кавера"
                            />
                        </label>
                    </div>
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