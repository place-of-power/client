import { Component } from 'react'
import { fetchArticles } from '@/shared/api'
import type { ArticlePreview } from '@/shared/api'
import { CategoriesShowcase } from '@/widgets/categories-showcase'
import { FeaturedPosts } from '@/widgets/featured-posts'
import { Hero } from '@/widgets/hero'
import { PostsGrid } from '@/widgets/posts-grid'

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

                {!loading && error && (
                    <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-10">
                        <p className="page-status">{error}</p>
                    </div>
                )}

                {!loading && !error && <PostsGrid articles={articles} />}
            </>
        )
    }
}

export default HomePage
