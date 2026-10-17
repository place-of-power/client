import { Component } from 'react'
import { fetchArticles, fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import type { ArticlePreview } from '@/shared/api'
import type { Category } from '@/shared/model/category'
import { HeroSubtitle, HeroTitle, LinkButton } from '@/shared/ui'
import { SearchBar } from '@/features/article-search'
import { ArticleGrid } from '@/widgets/article-grid'
import { CategoryTiles } from '@/widgets/category-tiles'
import './HomePage.css'

const HOME_CATEGORIES_LIMIT = 6

type HomePageProps = Record<string, never>

interface HomePageState {
    articles: ArticlePreview[]
    categories: Category[]
    loading: boolean
    error: string
}

class HomePage extends Component<HomePageProps, HomePageState> {
    state: HomePageState = {
        articles: [],
        categories: [],
        loading: true,
        error: '',
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        try {
            const [articles, categories] = await Promise.all([
                fetchArticles(),
                fetchCategories(HOME_CATEGORIES_LIMIT),
            ])

            this.setState({ articles, categories, loading: false })
        } catch {
            this.setState({ error: 'Не удалось загрузить данные с сервера.', loading: false })
        }
    }

    render() {
        const { articles, categories, loading, error } = this.state

        return (
            <main className="page">
                <section className="home-hero">
                    <HeroTitle>Place of Power</HeroTitle>
                    <HeroSubtitle>
                        Обучающие статьи по языкам программирования и инструментам. Разбираемся в
                        устройстве того, что используем каждый день.
                    </HeroSubtitle>
                    <SearchBar />
                </section>

                {!loading && error && <p className="page-status">{error}</p>}

                {!loading && !error && (
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
