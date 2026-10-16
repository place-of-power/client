import { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleForm } from '@/features/article-form'
import { paths } from '@/shared/config'
import { HeroTitle } from '@/shared/ui'

interface CreateArticlePageProps {
    onCreated: (slug: string) => void
}

class CreateArticleView extends Component<CreateArticlePageProps> {
    render() {
        return (
            <main className="page">
                <HeroTitle>Новая статья</HeroTitle>
                <ArticleForm onCreated={this.props.onCreated} />
            </main>
        )
    }
}

function CreateArticlePage() {
    const navigate = useNavigate()

    return <CreateArticleView onCreated={(slug) => navigate(paths.article(slug))} />
}

export default CreateArticlePage
