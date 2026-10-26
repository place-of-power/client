import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'
import { Avatar, AvatarFallback } from '@/shared/ui/kit'
import { PostCover } from '@/shared/ui/post-cover'

function formatDate(iso: string): string {
    if (!iso) return ''

    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

class PostCard extends Component<{ article: ArticlePreview }> {
    render() {
        const { article } = this.props

        return (
            <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <Link to={paths.article(article.slug)} className="block" aria-label={article.title}>
                    <PostCover article={article} />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-muted-foreground">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="size-1 rounded-full bg-muted-foreground/50" />
                        <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" />
                            {article.readingTime}
                        </span>
                    </div>
                    <h3 className="mt-2 text-base leading-snug font-semibold tracking-tight">
                        <Link to={paths.article(article.slug)} className="after:absolute after:inset-0">
                            {article.title}
                        </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {article.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2.5 pt-4">
                        <Avatar className="size-8 border">
                            <AvatarFallback className="bg-muted text-[0.66rem] font-semibold">
                                {article.category.name.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-[0.78rem] leading-tight font-medium">
                                {article.category.name}
                            </p>
                            <p className="truncate text-[0.66rem] text-muted-foreground">
                                {article.status === 'published' ? 'Опубликовано' : article.status}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        )
    }
}

export default PostCard
