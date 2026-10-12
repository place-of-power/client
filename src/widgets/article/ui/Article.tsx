import { Component, createRef } from 'react'
import 'highlight.js/styles/github-dark.css'
import { parseMarkdown, type TocHeading } from '@/shared/lib/markdown'
import type { ArticleMeta } from '@/entities/article'
import './Article.css'

interface ArticleProps {
    title: string
    excerpt: string
    meta: ArticleMeta
    content: string
}

interface ArticleState {
    activeId: string
}

class Article extends Component<ArticleProps, ArticleState> {
    private readonly markdown = parseMarkdown(this.props.content)
    private readonly bodyRef = createRef<HTMLDivElement>()
    private frame = 0

    state: ArticleState = { activeId: '' }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        window.addEventListener('resize', this.handleScroll)
        this.updateActiveHeading()
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
            this.updateActiveHeading()
        })
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

    renderTags() {
        return (
            <ul className="article-tags">
                {this.props.meta.tags.map((tag, index) => (
                    <li key={`${tag}-${index}`}>
                        <span className="article-tag">{tag}</span>
                    </li>
                ))}
            </ul>
        )
    }

    renderAuthorInitials(author: string) {
        const words = author.trim().split(/\s+/)

        return words
            .slice(0, 2)
            .map((word) => word[0] ?? '')
            .join('')
            .toUpperCase()
    }

    renderToc() {
        const headings: TocHeading[] = this.markdown.headings

        if (headings.length === 0) {
            return null
        }

        return (
            <aside className="article-toc">
                <span className="article-toc-title">Содержание</span>
                <ul>
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                className={
                                    heading.id === this.state.activeId
                                        ? 'article-toc-link active'
                                        : 'article-toc-link'
                                }
                                data-depth={heading.depth}
                                href={`#${heading.id}`}
                                onClick={() => this.handleTocClick(heading.id)}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        )
    }

    render() {
        const { title, excerpt, meta } = this.props

        return (
            <article className="article">
                <div className="article-cover" />

                <div className="article-wrap">
                    <header className="article-header">
                        {this.renderTags()}
                        <h1 className="article-title">{title}</h1>
                        <p className="article-excerpt">{excerpt}</p>
                        <div className="article-meta">
                            <span className="article-avatar">
                                {this.renderAuthorInitials(meta.author)}
                            </span>
                            <div className="article-meta-text">
                                <span className="article-author">{meta.author}</span>
                                <span className="article-meta-details">
                                    {meta.publishedAt} · {meta.readingTime}
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="article-layout">
                        <div className="article-main">
                            <div
                                className="article-body"
                                ref={this.bodyRef}
                                dangerouslySetInnerHTML={{ __html: this.markdown.html }}
                            />

                            <footer className="article-author-box">
                                <span className="article-author-box-avatar">
                                    {this.renderAuthorInitials(meta.author)}
                                </span>
                                <div className="article-author-box-text">
                                    <span className="article-author-box-label">
                                        Автор статьи
                                    </span>
                                    <span className="article-author-box-name">
                                        {meta.author}
                                    </span>
                                    <span className="article-author-box-role">
                                        {meta.role}
                                    </span>
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