import { Component } from 'react'
import { fetchArticles } from '@/shared/api'
import type { ArticlePreview } from '@/shared/api'
import { ArticleGrid } from '@/widgets/article-grid'
import { CategoriesShowcase } from '@/widgets/categories-showcase'
import { EditorsSection } from '@/widgets/editors-section'
import { FeaturedPosts } from '@/widgets/featured-posts'
import { Hero } from '@/widgets/hero'

type HomePageProps = Record<string, never>

interface HomePageState {
    articles: ArticlePreview[]
    loading: boolean
    error: string
}

class HomePage extends Component<HomePageProps, HomePageState> {
    state: HomePageState = {
        articles: [],
        loading: true,
        error: '',
    }

    componentDidMount() {
        void this.load()
    }

    async load() {
        try {
            const articles = await fetchArticles()

            this.setState({ articles, loading: false })
        } catch {
            this.setState({ error: 'Не удалось загрузить данные с сервера.', loading: false })
        }
    }

    render() {
        const { articles, loading, error } = this.state

        return (
            <>
                <Hero article={articles[0]} articlesCount={articles.length} />

                <CategoriesShowcase />

                <FeaturedPosts articles={articles} />

                <EditorsSection />

                <main className="page">
                    {!loading && error && <p className="page-status">{error}</p>}

                    {!loading && !error && (
                        <div id="latest" className="scroll-mt-24">
                            <ArticleGrid title="Последние статьи" articles={articles} />
                        </div>
                    )}
                </main>
            </>
        )
    }
}

export default HomePage
