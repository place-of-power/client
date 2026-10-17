import { Component } from 'react'
import { fetchCategories } from '@/shared/api'
import type { Category } from '@/shared/model/category'
import { HeroTitle } from '@/shared/ui'
import { CategoryTiles } from '@/widgets/category-tiles'

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
        try {
            const categories = await fetchCategories()

            this.setState({ categories, loading: false })
        } catch {
            this.setState({ loading: false })
        }
    }

    render() {
        const { categories, loading } = this.state

        return (
            <main className="page">
                <HeroTitle>Категории</HeroTitle>
                {!loading && <CategoryTiles categories={categories} heading={false} />}
            </main>
        )
    }
}

export default CategoriesPage
