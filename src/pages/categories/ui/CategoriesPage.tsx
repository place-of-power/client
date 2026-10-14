import { Component } from 'react'
import { fetchCategories } from '@/shared/api'
import type { Category } from '@/shared/model/category'
import { CategoryTiles } from '@/widgets/category-tiles'
import './CategoriesPage.css'

type CategoriesPageProps = Record<string, never>

interface CategoriesPageState {
    categories: Category[]
    loading: boolean
}

class CategoriesPage extends Component<CategoriesPageProps, CategoriesPageState> {
    state: CategoriesPageState = {
        categories: [],
        loading: true,
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        const categories = await fetchCategories()

        this.setState({ categories, loading: false })
    }

    render() {
        const { categories, loading } = this.state

        return (
            <main className="categories-page">
                <h1 className="categories-page-title">Категории</h1>
                {!loading && <CategoryTiles categories={categories} heading={false} />}
            </main>
        )
    }
}

export default CategoriesPage
