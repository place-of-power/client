import { Component } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticle } from '@/shared/api'
import type { Article as ArticleData } from '@/shared/api'
import { Article } from '@/widgets/article'

interface ArticlePageViewProps {
    slug: string
}

interface ArticlePageViewState {
    article: ArticleData | null
    loading: boolean
}

class ArticlePageView extends Component<ArticlePageViewProps, ArticlePageViewState> {
    state: ArticlePageViewState = {
        article: null,
        loading: true,
    }

    componentDidMount() {
        void this.load()
    }

    componentDidUpdate(prevProps: ArticlePageViewProps) {
        if (prevProps.slug !== this.props.slug) {
            void this.load()
        }
    }

    async load() {
        this.setState({ loading: true })

        const article = await fetchArticle(this.props.slug)

        this.setState({ article, loading: false })
    }

    render() {
        const { article, loading } = this.state

        if (loading) {
            return <p className="page-status">Загрузка…</p>
        }

        if (!article) {
            return (
                <div className="page-status">
                    <p>Статья не найдена.</p>
                    <Link to="/">← На главную</Link>
                </div>
            )
        }

        return <Article article={article} author="Place of Power" role="Редакция" />
    }
}

function ArticlePageRoute() {
    const { slug } = useParams<{ slug: string }>()

    return <ArticlePageView slug={slug ?? ''} />
}

export default ArticlePageRoute
