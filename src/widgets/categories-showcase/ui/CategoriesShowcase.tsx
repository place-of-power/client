import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { blogCategories, blogSubcategoryCount } from '@/shared/api/mock/blog-categories'
import { paths } from '@/shared/config'
import { Button } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

class CategoriesShowcase extends Component {
    render() {
        return (
            <section id="sections" className="border-b bg-background">
                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-16 lg:py-24">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                                Разделы
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Категории и подкатегории
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                {blogCategories.length} направлений, {blogSubcategoryCount}{' '}
                                подкатегории. Выберите, что интересно — от&nbsp;LLM и веб-разработки
                                до&nbsp;Cloud, Data Science и безопасности.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="self-start rounded-full sm:self-auto">
                            <Link to={paths.categories}>
                                Все категории <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {blogCategories.map((category) => {
                            const Icon = category.icon

                            return (
                                <article
                                    key={category.slug}
                                    className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div
                                        className={cn(
                                            'pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30',
                                            category.gradient,
                                        )}
                                    />
                                    <div className="flex items-start justify-between">
                                        <span
                                            className={cn(
                                                'grid size-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm',
                                                category.gradient,
                                            )}
                                        >
                                            <Icon className="size-5" />
                                        </span>
                                        <span className="rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-medium text-muted-foreground">
                                            {category.subcategories.length} подкатегорий
                                        </span>
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                                        {category.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {category.description}
                                    </p>
                                    <ul className="mt-4 space-y-1.5">
                                        {category.subcategories.map((subcategory) => (
                                            <li key={subcategory.slug}>
                                                <Link
                                                    to={paths.category(category.slug)}
                                                    className="group/sub -mx-2.5 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-accent"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span
                                                            className={cn(
                                                                'size-1.5 rounded-full bg-gradient-to-br',
                                                                category.gradient,
                                                            )}
                                                        />
                                                        <span className="text-xs font-medium text-foreground">
                                                            {subcategory.name}
                                                        </span>
                                                    </span>
                                                    <span className="truncate pl-2 text-[0.72rem] text-muted-foreground">
                                                        {subcategory.description}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to={paths.category(category.slug)}
                                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand"
                                    >
                                        Смотреть статьи
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>
        )
    }
}

export default CategoriesShowcase
