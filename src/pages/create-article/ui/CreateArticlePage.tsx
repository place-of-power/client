import { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleForm } from '@/features/article-form'
import { paths } from '@/shared/config'

interface CreateArticlePageProps {
    onCreated: (slug: string) => void
}

class CreateArticleView extends Component<CreateArticlePageProps> {
    render() {
        return (
            <main className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-12 pb-16">
                <header className="mb-8">
                    <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                        Авторам
                    </p>
                    <h1 className="mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                        Новая статья
                    </h1>
                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        Пишите в&nbsp;Markdown, смотрите предпросмотр справа и&nbsp;публикуйте —
                        статья сразу появится в&nbsp;ленте.
                    </p>
                </header>
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
