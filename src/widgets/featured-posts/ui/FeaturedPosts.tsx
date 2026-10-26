import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'
import { Avatar, AvatarFallback, Badge } from '@/shared/ui/kit'
import { PostCover } from '@/shared/ui/post-cover'

function formatDate(iso: string): string {
    if (!iso) return ''

    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

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
                        <article className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-xl">
                            <Link to={paths.article(lead.slug)} className="block">
                                <PostCover
                                    article={lead}
                                    className="aspect-[16/10] rounded-none"
                                />
                            </Link>
                            <div className="flex flex-1 flex-col p-6 lg:p-8">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-medium text-brand">
                                        {lead.category.name}
                                    </span>
                                    <span>{formatDate(lead.publishedAt)}</span>
                                    <span className="size-1 rounded-full bg-muted-foreground/50" />
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="size-3" /> {lead.readingTime}
                                    </span>
                                </div>
                                <h3 className="mt-3 text-2xl leading-tight font-bold tracking-tight lg:text-3xl">
                                    <Link
                                        to={paths.article(lead.slug)}
                                        className="after:absolute after:inset-0"
                                    >
                                        {lead.title}
                                    </Link>
                                </h3>
                                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                                    {lead.description}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-6">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="size-9 border">
                                            <AvatarFallback className="bg-muted text-[0.68rem] font-semibold">
                                                {lead.category.name.slice(0, 1).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm leading-tight font-medium">
                                                {lead.category.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {lead.readingTime}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                                        Читать <ArrowUpRight className="size-4" />
                                    </span>
                                </div>
                            </div>
                        </article>

                        {rest.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5">
                                {rest.map((article) => (
                                    <article
                                        key={article.slug}
                                        className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card transition-all hover:shadow-lg sm:flex-row"
                                    >
                                        <Link
                                            to={paths.article(article.slug)}
                                            className="block sm:w-2/5"
                                            aria-label={article.title}
                                        >
                                            <PostCover
                                                article={article}
                                                showCategory={false}
                                                className="aspect-[16/9] rounded-none sm:aspect-auto sm:h-full"
                                            />
                                        </Link>
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full px-2.5 py-1 font-medium"
                                                >
                                                    {article.category.name}
                                                </Badge>
                                                <span>{formatDate(article.publishedAt)}</span>
                                                <span className="size-1 rounded-full bg-muted-foreground/50" />
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="size-3" /> {article.readingTime}
                                                </span>
                                            </div>
                                            <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight">
                                                <Link
                                                    to={paths.article(article.slug)}
                                                    className="after:absolute after:inset-0"
                                                >
                                                    {article.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                {article.description}
                                            </p>
                                            <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
                                                <Avatar className="size-7 border">
                                                    <AvatarFallback className="bg-muted text-[0.6rem] font-semibold">
                                                        {article.category.name
                                                            .slice(0, 1)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-foreground">
                                                    {article.category.name}
                                                </span>
                                                <span>·</span>
                                                <span>{article.readingTime}</span>
                                            </div>
                                        </div>
                                    </article>
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
