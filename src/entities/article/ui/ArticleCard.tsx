import { Component } from 'react'
import { Link } from 'react-router-dom'
import type { ArticlePreview } from '@/shared/api'
import { paths } from '@/shared/config'
import './ArticleCard.css'

interface ArticleCardProps {
    article: ArticlePreview
}

class ArticleCard extends Component<ArticleCardProps> {
    render() {
        const { article } = this.props

        return (
            <Link className="article-card" to={paths.article(article.slug)}>
                <div className="article-card-cover">{article.category.name}</div>
                <div className="article-card-body">
                    <h3 className="article-card-title">{article.title}</h3>
                    <p className="article-card-description">{article.description}</p>
                    <div className="article-card-meta">
                        {article.publishedAt} · {article.readingTime}
                    </div>
                </div>
            </Link>
        )
    }
}

export default ArticleCard
