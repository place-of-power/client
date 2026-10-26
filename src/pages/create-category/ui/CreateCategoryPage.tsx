import { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryForm } from '@/features/category-form'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model'

interface CreateCategoryPageProps {
    onCreated: (category: Category) => void
}

class CreateCategoryView extends Component<CreateCategoryPageProps> {
    render() {
        return (
            <main className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-12 pb-16">
                <header className="mb-8">
                    <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                        Каталог
                    </p>
                    <h1 className="mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                        Новая категория
                    </h1>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Slug можно оставить пустым — он сгенерируется из названия. Порядок задаёт
                        позицию в каталоге.
                    </p>
                </header>
                <CategoryForm onCreated={this.props.onCreated} />
            </main>
        )
    }
}

function CreateCategoryPage() {
    const navigate = useNavigate()

    return <CreateCategoryView onCreated={() => navigate(paths.categories)} />
}

export default CreateCategoryPage