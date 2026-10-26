import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ArticleCard } from '@/entities/article'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'

interface FeaturedPostsProps {
    articles: ArticlePreview[]
}

class FeaturedPosts extends Component<FeaturedPostsProps> {
    render() {
        const [lead, ...rest] = this.props.articles.slice(0, 3)

        if (!lead) return null

        return (
            <section id="featured" className="border-b bg-background">
                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-16 lg:py-24">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                                Подборка
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                В центре внимания
                            </h2>
                        </div>
                        <Link
                            to={paths.categories}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                        >
                            Все материалы <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <ArticleCard article={lead} />

                        {rest.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5">
                                {rest.map((article) => (
                                    <ArticleCard key={article.slug} article={article} />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </section>
        )
    }
}

export default FeaturedPosts
