import { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryForm } from '@/features/category-form'
import { addCategory } from '@/shared/api'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model'
import { HeroTitle } from '@/shared/ui'

interface CreateCategoryPageProps {
    onCreated: (category: Category) => void
}

class CreateCategoryView extends Component<CreateCategoryPageProps> {
    render() {
        return (
            <main className="page">
                <HeroTitle>Новая категория</HeroTitle>
                <CategoryForm onCreated={this.props.onCreated} />
            </main>
        )
    }
}

function CreateCategoryPage() {
    const navigate = useNavigate()

    return (
        <CreateCategoryView
            onCreated={(category) => {
                addCategory(category)
                navigate(paths.categories)
            }}
        />
    )
}

export default CreateCategoryPage