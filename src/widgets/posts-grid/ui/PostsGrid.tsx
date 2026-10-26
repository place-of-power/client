import { Component } from 'react'
import type { ArticlePreview } from '@/shared/api'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/kit'
import PostCard from './PostCard.tsx'

const FILTERS = [
    { slug: 'all', name: 'Все' },
    ...blogCategories.map((category) => ({ slug: category.slug, name: category.name })),
]

interface PostsGridProps {
    articles: ArticlePreview[]
}

interface PostsGridState {
    active: string
}

class PostsGrid extends Component<PostsGridProps, PostsGridState> {
    state: PostsGridState = { active: 'all' }

    handleChange = (value: string) => {
        this.setState({ active: value })
    }

    render() {
        const { articles } = this.props
        const { active } = this.state
        const visible =
            active === 'all'
                ? articles
                : articles.filter((article) => article.category.slug === active)

        return (
            <section id="latest" className="scroll-mt-16 border-b bg-background">
                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-16 lg:py-24">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                                Свежее
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Последние статьи
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Фильтруйте по&nbsp;категориям. Обновляется вместе с&nbsp;сервером.
                            </p>
                        </div>
                    </div>

                    <Tabs value={active} onValueChange={this.handleChange} className="mt-8">
                        <div className="scroll-thin overflow-x-auto pb-1">
                            <TabsList className="flex h-auto w-max flex-wrap gap-1 rounded-full bg-muted/60 p-1">
                                {FILTERS.map((filter) => (
                                    <TabsTrigger
                                        key={filter.slug}
                                        value={filter.slug}
                                        className="rounded-full px-3.5 py-1.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >
                                        {filter.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <TabsContent value={active} className="mt-8">
                            {visible.length === 0 ? (
                                <div className="rounded-2xl border border-dashed py-16 text-center">
                                    <p className="text-muted-foreground">
                                        В этой категории пока нет статей.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {visible.map((article) => (
                                        <PostCard key={article.slug} article={article} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        )
    }
}

export default PostsGrid
