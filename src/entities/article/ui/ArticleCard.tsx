import { Component } from 'react'
import { Link } from 'react-router-dom'
import type { ArticlePreview } from '@/shared/api'
import './ArticleCard.css'

interface ArticleCardProps {
    article: ArticlePreview
}

class ArticleCard extends Component<ArticleCardProps> {
    render() {
        const { article } = this.props

        return (
            <article className="article-card">
                <div className="article-card-cover">{article.category.name}</div>
                <div className="article-card-body">
                    <Link className="article-card-title" to={`/articles/${article.slug}`}>
                        {article.title}
                    </Link>
                    <p className="article-card-description">{article.description}</p>
                    <div className="article-card-meta">
                        {article.publishedAt} · {article.readingTime}
                    </div>
                </div>
            </article>
        )
    }
}

export default ArticleCard
