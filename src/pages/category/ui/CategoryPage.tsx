import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticlesByCategory, fetchCategories } from '@/shared/api'
import type { ArticlePreview } from '@/shared/api'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { Button } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'
import { PostCard } from '@/widgets/posts-grid'

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

        const profile = blogCategories.find((item) => item.slug === category.slug)
        const Icon = profile?.icon
        const gradient = profile?.gradient ?? 'from-emerald-500 via-teal-500 to-cyan-500'

        return (
            <main className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-8 pb-16">
                <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    <Link to={paths.home} className="transition-colors hover:text-foreground">
                        Главная
                    </Link>
                    <span>/</span>
                    <Link to={paths.categories} className="transition-colors hover:text-foreground">
                        Категории
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{category.name}</span>
                </nav>

                <header className="mt-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        {Icon ? (
                            <span
                                className={cn(
                                    'grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm',
                                    gradient,
                                )}
                            >
                                <Icon className="size-6" />
                            </span>
                        ) : null}
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                {category.name}
                            </h1>
                            {profile ? (
                                <p className="mt-2 max-w-2xl text-muted-foreground">
                                    {profile.description}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {profile && profile.subcategories.length > 0 ? (
                        <ul className="flex flex-wrap gap-1.5">
                            {profile.subcategories.map((subcategory) => (
                                <li
                                    key={subcategory.slug}
                                    className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground"
                                >
                                    {subcategory.name}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </header>

                {error ? <p className="page-status">{error}</p> : null}

                {articles.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-dashed py-16 text-center">
                        <p className="text-muted-foreground">В этой категории пока нет статей.</p>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <PostCard key={article.slug} article={article} />
                        ))}
                    </div>
                )}

                {nextCursor ? (
                    <div className="mt-10 flex justify-center">
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-11 rounded-full px-6"
                            onClick={this.loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? 'Загружаем…' : 'Загрузить ещё'}
                        </Button>
                    </div>
                ) : null}
            </main>
        )
    }
}

function CategoryPage() {
    const { slug } = useParams<{ slug: string }>()

    return <CategoryPageView slug={slug ?? ''} />
}

export default CategoryPage
