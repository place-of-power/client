import { Component } from 'react'
import { ArticleCard } from '@/entities/article'
import type { ArticlePreview } from '@/entities/article'
import './ArticleGrid.css'

interface ArticleGridProps {
    articles: ArticlePreview[]
    title?: string
}

class ArticleGrid extends Component<ArticleGridProps> {
    render() {
        const { articles, title } = this.props

        return (
            <section className="article-grid">
                {title && <h2 className="article-grid-title">{title}</h2>}
                {articles.length === 0 ? (
                    <p className="article-grid-empty">Статей пока нет.</p>
                ) : (
                    <div className="article-grid-list">
                        {articles.map((article) => (
                            <ArticleCard key={article.slug} article={article} />
                        ))}
                    </div>
                )}
            </section>
        )
    }
}

export default ArticleGrid
