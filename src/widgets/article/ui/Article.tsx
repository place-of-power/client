import { Component, createRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { parseMarkdown, type TocHeading } from '@/shared/lib/markdown'
import { MarkdownContent } from '@/shared/ui'
import { Badge } from '@/shared/ui/kit'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { paths } from '@/shared/config'
import { cn } from '@/shared/lib/cn'
import type { Article as ArticleData } from '@/shared/api'

interface ArticleProps {
    article: ArticleData
    author: string
    role: string
}

interface ArticleState {
    activeId: string
    progress: number
}

class Article extends Component<ArticleProps, ArticleState> {
    private readonly markdown = parseMarkdown(this.props.article.content)
    private readonly bodyRef = createRef<HTMLDivElement>()
    private frame = 0

    state: ArticleState = { activeId: '', progress: 0 }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        window.addEventListener('resize', this.handleScroll)
        this.handleScroll()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        window.removeEventListener('resize', this.handleScroll)

        if (this.frame) {
            cancelAnimationFrame(this.frame)
        }
    }

    handleScroll = () => {
        if (this.frame) {
            return
        }

        this.frame = requestAnimationFrame(() => {
            this.frame = 0
            this.updateProgress()
            this.updateActiveHeading()
        })
    }

    updateProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight

        if (scrollable <= 0) {
            return
        }

        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))

        if (Math.abs(progress - this.state.progress) > 1) {
            this.setState({ progress })
        }
    }

    updateActiveHeading() {
        const body = this.bodyRef.current

        if (!body) {
            return
        }

        const headings = Array.from(body.querySelectorAll<HTMLElement>('h2, h3'))

        if (headings.length === 0) {
            return
        }

        const offset = 96
        const reachedBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

        let activeId = headings[0].id

        if (reachedBottom) {
            activeId = headings[headings.length - 1].id
        } else {
            for (const heading of headings) {
                if (heading.getBoundingClientRect().top > offset) {
                    break
                }

                activeId = heading.id
            }
        }

        if (activeId !== this.state.activeId) {
            this.setState({ activeId })
        }
    }

    handleTocClick = (id: string) => {
        this.setState({ activeId: id })
    }

    initials(name: string) {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word[0] ?? '')
            .join('')
            .toUpperCase()
    }

    renderCover() {
        const { article } = this.props
        const category = blogCategories.find((item) => item.slug === article.category.slug)
        const Icon = category?.icon
        const gradient = category?.gradient ?? 'from-emerald-500 via-teal-500 to-cyan-500'

        return (
            <div
                className={cn(
                    'relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br',
                    gradient,
                )}
            >
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
                <div className="absolute -top-12 -left-12 size-64 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute -right-8 -bottom-16 size-56 rounded-full bg-black/20 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                    {Icon ? <Icon className="size-16 text-white/90" /> : null}
                </div>
            </div>
        )
    }

    renderToc() {
        const headings: TocHeading[] = this.markdown.headings

        if (headings.length === 0) {
            return null
        }

        return (
            <aside className="hidden xl:block">
                <div className="sticky top-24 rounded-2xl border bg-card p-4">
                    <p className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                        Содержание
                    </p>
                    <ul className="mt-3 space-y-1">
                        {headings.map((heading) => (
                            <li key={heading.id}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={() => this.handleTocClick(heading.id)}
                                    className={cn(
                                        'block rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent',
                                        heading.depth === 3 && 'pl-5 text-[0.82rem]',
                                        heading.id === this.state.activeId
                                            ? 'bg-accent font-medium text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        )
    }

    render() {
        const { article, author, role } = this.props

        return (
            <article className="pb-16">
                <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-[width] duration-150"
                        style={{ width: `${this.state.progress}%` }}
                    />
                </div>

                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-8">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <nav className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                            <Link to={paths.home} className="transition-colors hover:text-foreground">
                                Главная
                            </Link>
                            <span>/</span>
                            <Link
                                to={paths.categories}
                                className="transition-colors hover:text-foreground"
                            >
                                Категории
                            </Link>
                            <span>/</span>
                            <Link
                                to={paths.category(article.category.slug)}
                                className="transition-colors hover:text-foreground"
                            >
                                {article.category.name}
                            </Link>
                        </nav>
                        <Link
                            to={paths.categories}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                        >
                            <ArrowLeft className="size-4" /> Все статьи
                        </Link>
                    </div>

                    <header className="mt-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="border-transparent bg-brand/15 text-brand">
                                {article.category.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {article.publishedAt}
                            </span>
                        </div>
                        <h1 className="mt-4 max-w-4xl text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {article.title}
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                            {article.description}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-xs font-bold text-white">
                                {this.initials(author)}
                            </span>
                            <div>
                                <p className="text-sm leading-tight font-medium">{author}</p>
                                <p className="text-xs text-muted-foreground">{role}</p>
                            </div>
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="size-3.5" /> {article.readingTime}
                            </span>
                        </div>
                    </header>

                    <div className="mt-8">{this.renderCover()}</div>

                    <div className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
                        <div>
                            <MarkdownContent html={this.markdown.html} innerRef={this.bodyRef} />

                            <footer className="mt-12 flex items-center gap-3 rounded-2xl border bg-card p-5">
                                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
                                    {this.initials(author)}
                                </span>
                                <div>
                                    <p className="text-[0.68rem] tracking-wider text-muted-foreground uppercase">
                                        Автор статьи
                                    </p>
                                    <p className="text-sm font-semibold">{author}</p>
                                    <p className="text-xs text-muted-foreground">{role}</p>
                                </div>
                            </footer>
                        </div>

                        {this.renderToc()}
                    </div>
                </div>
            </article>
        )
    }
}

export default Article
