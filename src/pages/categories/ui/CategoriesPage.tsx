import { Component } from 'react'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { HeroTitle, LinkButton } from '@/shared/ui'
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
            <main className="page categories-page">
                <HeroTitle>Категории</HeroTitle>
                <LinkButton to={paths.createCategory}>Добавить категорию</LinkButton>
                {!loading && <CategoryTiles categories={categories} heading={false} />}
            </main>
        )
    }
}

export default CategoriesPage