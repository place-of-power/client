import { Component } from 'react'
import type { ArticlePreview } from '@/shared/api'
import { ArticleCard } from '@/entities/article'

class PostCard extends Component<{ article: ArticlePreview }> {
    render() {
        const { article } = this.props

        return <ArticleCard article={article} />
    }
}

export default PostCard