import { Component } from 'react'
import { fetchArticles, fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import type { ArticlePreview } from '@/shared/api'
import type { Category } from '@/shared/model/category'
import { LinkButton } from '@/shared/ui'
import { SearchBar } from '@/features/article-search'
import { ArticleGrid } from '@/widgets/article-grid'
import { CategoryTiles } from '@/widgets/category-tiles'
import './HomePage.css'

type HomePageProps = Record<string, never>

interface HomePageState {
    articles: ArticlePreview[]
    categories: Category[]
    loading: boolean
}

class HomePage extends Component<HomePageProps, HomePageState> {
    state: HomePageState = {
        articles: [],
        categories: [],
        loading: true,
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        const [articles, categories] = await Promise.all([fetchArticles(), fetchCategories()])

        this.setState({ articles, categories, loading: false })
    }

    render() {
        const { articles, categories, loading } = this.state

        return (
            <main className="home">
                <section className="home-hero">
                    <h1 className="home-hero-title">Place of Power</h1>
                    <p className="home-hero-subtitle">
                        Обучающие статьи по языкам программирования и инструментам.
                        Разбираемся в устройстве того, что используем каждый день.
                    </p>
                    <SearchBar />
                </section>

                {!loading && (
                    <div className="home-sections">
                        <div className="home-categories">
                            <CategoryTiles categories={categories} />
                            <LinkButton to={paths.categories}>Все категории</LinkButton>
                        </div>
                        <ArticleGrid title="Последние статьи" articles={articles} />
                    </div>
                )}
            </main>
        )
    }
}

export default HomePage
