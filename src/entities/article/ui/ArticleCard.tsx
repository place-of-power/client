import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { ArticlePreview } from '@/shared/api'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { paths } from '@/shared/config'
import { Avatar, AvatarFallback, Button } from '@/shared/ui/kit'
import { PostCover } from '@/shared/ui/post-cover'
import { cn } from '@/shared/lib/cn'

interface ArticleCardProps {
    article: ArticlePreview
}

function formatDate(iso: string): string {
    if (!iso) return ''

    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

class ArticleCard extends Component<ArticleCardProps> {
    render() {
        const { article } = this.props
        const category = blogCategories.find((item) => item.slug === article.category.slug)
        const accent = category?.accent ?? 'text-foreground'
        // shortcut: автор замокан, пока в API нет поля автора
        const author = { name: 'Редакция Place of Power', initials: article.category.name.slice(0, 1) }

        return (
            <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <Link to={paths.article(article.slug)} className="block" aria-label={article.title}>
                    <PostCover article={article} />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold',
                                accent,
                            )}
                        >
                            {article.category.name}
                        </span>
                        <span className="text-[0.72rem] text-muted-foreground">
                            {formatDate(article.publishedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[0.72rem] text-muted-foreground">
                            <Clock className="size-3" />
                            {article.readingTime}
                        </span>
                    </div>

                    <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight text-foreground">
                        <Link to={paths.article(article.slug)} className="after:absolute after:inset-0">
                            {article.title}
                        </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {article.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar className="size-8 border">
                                <AvatarFallback className="bg-muted text-[0.66rem] font-semibold text-foreground">
                                    {author.initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate text-sm font-medium text-foreground">
                                {author.name}
                            </span>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-full px-3.5 text-[0.8rem]"
                        >
                            <Link to={paths.article(article.slug)}>
                                Читать <ArrowUpRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
        )
    }
}

export default ArticleCard