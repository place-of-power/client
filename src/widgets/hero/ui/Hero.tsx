import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Search, Terminal, TrendingUp } from 'lucide-react'
import { ArticleCard } from '@/entities/article'
import type { ArticlePreview } from '@/shared/api'
import { blogCategories, blogSubcategoryCount } from '@/shared/api/mock/blog-categories'
import { editorGroups, paths } from '@/shared/config'
import { Button } from '@/shared/ui/kit'

const heroPills = [
    { icon: Cpu, label: 'LLM' },
    { icon: Terminal, label: 'React 19' },
    { icon: TrendingUp, label: 'Rust + WASM' },
]

const editorsCount = editorGroups.reduce((total, group) => total + group.editors.length, 0)

interface HeroProps {
    article?: ArticlePreview
    articlesCount: number
}

class Hero extends Component<HeroProps> {
    handleSubmit = (event: { preventDefault: () => void }) => {
        event.preventDefault()
        document.getElementById('latest')?.scrollIntoView({ behavior: 'smooth' })
    }

    render() {
        const { article, articlesCount } = this.props
        const stats = [
            { label: 'Категорий', value: String(blogCategories.length) },
            { label: 'Подкатегорий', value: String(blogSubcategoryCount) },
            { label: 'Редакторов ЯП', value: String(editorsCount) },
            { label: 'Статей', value: String(articlesCount) },
        ]

        return (
            <section id="home" className="relative overflow-hidden border-b bg-background">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="animate-blob absolute -top-32 -left-32 size-[28rem] rounded-full bg-emerald-500/30 blur-3xl" />
                    <div className="animate-blob absolute top-10 right-[-10rem] size-[26rem] rounded-full bg-cyan-500/20 blur-3xl [animation-delay:-4s]" />
                    <div className="animate-blob absolute bottom-[-12rem] left-1/3 size-[24rem] rounded-full bg-violet-500/20 blur-3xl [animation-delay:-8s]" />
                </div>
                <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-14 pb-16 lg:pt-20 lg:pb-24">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                        <div className="text-center lg:text-left">
                            <h1 className="mt-2 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                                Блог про{' '}
                                <span className="relative whitespace-nowrap">
                                    <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                        IT и&nbsp;ИИ
                                    </span>
                                    <svg
                                        className="absolute -bottom-1 left-0 w-full text-emerald-500/60"
                                        viewBox="0 0 200 8"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        aria-hidden
                                    >
                                        <path
                                            d="M2 6 C 50 2, 150 2, 198 6"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                                ,
                                <br className="hidden sm:block" /> который объясняет.
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg lg:mx-0">
                                Архитектура LLM, веб-разработка, программирование и DevOps — без
                                воды и хайпа.
                            </p>

                            <form
                                className="mx-auto mt-7 flex w-full max-w-md items-center gap-2 rounded-full border bg-background/70 p-1.5 pl-4 shadow-sm backdrop-blur lg:mx-0"
                                onSubmit={this.handleSubmit}
                            >
                                <Search className="size-4 shrink-0 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="RAG, Docker, TypeScript…"
                                    aria-label="Поиск по блогу"
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="h-8 rounded-full bg-brand text-brand-foreground hover:opacity-90"
                                >
                                    Найти
                                </Button>
                            </form>

                            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                                {heroPills.map((pill) => (
                                    <span
                                        key={pill.label}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                                    >
                                        <pill.icon className="size-3.5 text-brand" />
                                        {pill.label}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-11 rounded-full bg-brand px-6 text-brand-foreground hover:opacity-90"
                                >
                                    <Link to={paths.categories}>
                                        Читать статьи <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-11 rounded-full px-6"
                                >
                                    <a href="#editors">Онлайн-редакторы ЯП</a>
                                </Button>
                            </div>
                        </div>

                        {article ? (
                            <div className="relative mx-auto w-full max-w-md self-start lg:max-w-none">
                                <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20 blur-2xl" />
                                <ArticleCard article={article} />
                            </div>
                        ) : null}
                    </div>

                    <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-card p-4 text-center sm:p-5">
                                <dt className="text-[0.7rem] font-medium tracking-wider text-muted-foreground uppercase">
                                    {stat.label}
                                </dt>
                                <dd className="mt-1 text-2xl font-bold tracking-tight text-brand">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        )
    }
}

export default Hero
