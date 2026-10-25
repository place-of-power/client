import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticles, fetchCategories } from '@/shared/api'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { HeroTitle } from '@/shared/ui'
import { ArticleGrid } from '@/widgets/article-grid'

interface CategoryPageViewProps {
    slug: string
}

interface CategoryPageViewState {
    category: Category | null
    articles: ArticlePreview[]
    loading: boolean
}

class CategoryPageView extends Component<CategoryPageViewProps, CategoryPageViewState> {
    state: CategoryPageViewState = {
        category: null,
        articles: [],
        loading: true,
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
        try {
            const [categories, articles] = await Promise.all([fetchCategories(), fetchArticles()])
            const category = categories.find((item) => item.slug === this.props.slug) ?? null

            this.setState({
                category,
                articles: category
                    ? articles.filter((article) => article.category.id === category.id)
                    : [],
                loading: false,
            })
        } catch {
            this.setState({ loading: false })
        }
    }

    render() {
        const { category, articles, loading } = this.state

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
                <ArticleGrid articles={articles} />
            </main>
        )
    }
}

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>()

    return <CategoryPageView slug={slug ?? ''} />
}

export default CategoryPage