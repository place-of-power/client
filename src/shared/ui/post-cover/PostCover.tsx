import { Component } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { ArticlePreview } from '@/shared/api'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { cn } from '@/shared/lib/cn'

interface PostCoverProps {
    article: ArticlePreview
    className?: string
    showCategory?: boolean
}

class PostCover extends Component<PostCoverProps> {
    render() {
        const { article, className, showCategory = true } = this.props
        const category = blogCategories.find((item) => item.slug === article.category.slug)
        const Icon = category?.icon
        const gradient = category?.gradient ?? 'from-emerald-500 via-teal-500 to-cyan-500'

        return (
            <div
                className={cn(
                    'relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gradient-to-br',
                    gradient,
                    className,
                )}
            >
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
                <div className="absolute -top-8 -left-8 size-32 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute right-2 -bottom-10 size-28 rounded-full bg-black/20 blur-2xl" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <div className="flex items-start justify-between">
                        {showCategory ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[0.7rem] font-semibold backdrop-blur-sm">
                                {Icon ? <Icon className="size-3.5" /> : null}
                                {article.category.name}
                            </span>
                        ) : null}
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-medium backdrop-blur-sm">
                            {article.readingTime}
                        </span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/70 uppercase">
                            {article.category.slug}
                        </span>
                        <span className="grid size-8 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-transform group-hover:translate-x-0.5">
                            <ArrowUpRight className="size-4" />
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostCover
