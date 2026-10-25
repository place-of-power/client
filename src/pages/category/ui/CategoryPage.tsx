import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticlesByCategory, fetchCategories } from '@/shared/api'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { HeroTitle } from '@/shared/ui'
import { ArticleGrid } from '@/widgets/article-grid'
import './CategoryPage.css'

interface CategoryPageViewProps {
    slug: string
}

interface CategoryPageViewState {
    category: Category | null
    articles: ArticlePreview[]
    nextCursor: string | null
    loading: boolean
    loadingMore: boolean
    error: string
}

const PAGE_LIMIT = 10

class CategoryPageView extends Component<CategoryPageViewProps, CategoryPageViewState> {
    state: CategoryPageViewState = {
        category: null,
        articles: [],
        nextCursor: null,
        loading: true,
        loadingMore: false,
        error: '',
    }

    componentDidMount() {
        void this.load()
    }

    componentDidUpdate(prevProps: CategoryPageViewProps) {
        if (prevProps.slug !== this.props.slug) {
            void this.load()
        }
    }

    async load() {
        this.setState({ loading: true, error: '' })

        try {
            const [categories, page] = await Promise.all([
                fetchCategories(),
                fetchArticlesByCategory(this.props.slug, undefined, PAGE_LIMIT),
            ])
            const category = categories.find((item) => item.slug === this.props.slug) ?? null

            this.setState({
                category,
                articles: category ? page.items : [],
                nextCursor: category ? page.nextCursor : null,
                loading: false,
            })
        } catch {
            this.setState({ loading: false, error: 'Не удалось загрузить статьи категории.' })
        }
    }

    loadMore = async () => {
        const { nextCursor } = this.state

        if (!nextCursor) {
            return
        }

        this.setState({ loadingMore: true })

        try {
            const page = await fetchArticlesByCategory(this.props.slug, nextCursor, PAGE_LIMIT)

            this.setState((state) => ({
                articles: [...state.articles, ...page.items],
                nextCursor: page.nextCursor,
                loadingMore: false,
            }))
        } catch {
            this.setState({ loadingMore: false, error: 'Не удалось загрузить ещё статьи.' })
        }
    }

    render() {
        const { category, articles, nextCursor, loading, loadingMore, error } = this.state

        if (loading) {
            return <p className="page-status">Загрузка…</p>
        }

        if (!category) {
            return (
                <div className="page-status">
                    <p>Категория не найдена.</p>
                    <Link to={paths.home}>← На главную</Link>
                </div>
            )
        }

        return (
            <main className="page">
                <HeroTitle>{category.name}</HeroTitle>
                {error && <p className="page-status">{error}</p>}
                <ArticleGrid articles={articles} />
                {nextCursor && (
                    <button
                        className="category-page-more"
                        type="button"
                        onClick={this.loadMore}
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Загружаем…' : 'Загрузить ещё'}
                    </button>
                )}
            </main>
        )
    }
}

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>()

    return <CategoryPageView slug={slug ?? ''} />
}

export default CategoryPage