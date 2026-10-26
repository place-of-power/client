import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, Settings2 } from 'lucide-react'
import { blogCategories, blogSubcategoryCount } from '@/shared/api/mock/blog-categories'
import { editorGroups, paths } from '@/shared/config'
import { Badge, Button, Input } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

const editorsCount = editorGroups.reduce((total, group) => total + group.editors.length, 0)

const stats = [
    { label: 'Категорий', value: String(blogCategories.length) },
    { label: 'Подкатегорий', value: String(blogSubcategoryCount) },
    { label: 'Редакторов ЯП', value: String(editorsCount) },
]

interface CategoriesPageState {
    query: string
}

class CategoriesPage extends Component<Record<string, never>, CategoriesPageState> {
    state: CategoriesPageState = { query: '' }

    handleQueryChange = (event: { target: { value: string } }) => {
        this.setState({ query: event.target.value })
    }

    matches(name: string): boolean {
        const query = this.state.query.trim().toLowerCase()

        return query === '' || name.toLowerCase().includes(query)
    }

    visibleCategories() {
        const query = this.state.query.trim().toLowerCase()

        if (!query) {
            return blogCategories
        }

        return blogCategories.filter(
            (category) =>
                category.name.toLowerCase().includes(query) ||
                category.description.toLowerCase().includes(query) ||
                category.subcategories.some((subcategory) =>
                    subcategory.name.toLowerCase().includes(query),
                ),
        )
    }

    render() {
        const { query } = this.state
        const visible = this.visibleCategories()

        return (
            <main className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] pt-12 pb-16">
                <header className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                                Каталог
                            </p>
                            <h1 className="mt-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                                Все категории
                            </h1>
                            <p className="mt-3 max-w-2xl text-muted-foreground">
                                Шесть направлений и&nbsp;{blogSubcategoryCount} подкатегории. Найдите
                                тему по&nbsp;названию категории или подкатегории.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link to={paths.manageCategories}>
                                <Settings2 className="size-4" /> Управление категориями
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {stats.map((stat) => (
                            <Badge
                                key={stat.label}
                                variant="secondary"
                                className="rounded-full px-3 py-1 font-normal"
                            >
                                <span className="font-semibold text-foreground">{stat.value}</span>
                                {stat.label}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex w-full max-w-md items-center gap-2 rounded-full border bg-background px-4 shadow-sm">
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <Input
                            type="search"
                            value={query}
                            onChange={this.handleQueryChange}
                            placeholder="Например, Rust или безопасность"
                            aria-label="Поиск по категориям"
                            className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                        />
                    </div>
                </header>

                {visible.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-dashed py-16 text-center">
                        <p className="text-muted-foreground">
                            По запросу «{query}» ничего не нашлось.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {visible.map((category) => {
                            const Icon = category.icon

                            return (
                                <article
                                    key={category.slug}
                                    className="group relative overflow-hidden rounded-3xl border bg-card p-6 transition-all hover:shadow-lg"
                                >
                                    <div
                                        className={cn(
                                            'pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-25',
                                            category.gradient,
                                        )}
                                    />
                                    <div className="flex items-start gap-4">
                                        <span
                                            className={cn(
                                                'grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-sm',
                                                category.gradient,
                                            )}
                                        >
                                            <Icon className="size-6" />
                                        </span>
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold tracking-tight">
                                                {category.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {category.description}
                                            </p>
                                        </div>
                                        <span className="ml-auto shrink-0 rounded-full bg-muted px-2.5 py-1 text-[0.65rem] font-medium text-muted-foreground">
                                            {category.subcategories.length}
                                        </span>
                                    </div>

                                    <ul className="mt-5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                        {category.subcategories.map((subcategory) => (
                                            <li
                                                key={subcategory.slug}
                                                className={cn(
                                                    'rounded-lg px-2.5 py-1.5',
                                                    this.matches(subcategory.name) && 'bg-accent/60',
                                                )}
                                            >
                                                <p className="text-sm font-medium">
                                                    {subcategory.name}
                                                </p>
                                                <p className="truncate text-[0.72rem] text-muted-foreground">
                                                    {subcategory.description}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={paths.category(category.slug)}
                                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand"
                                    >
                                        Все статьи категории
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </article>
                            )
                        })}
                    </div>
                )}
            </main>
        )
    }
}

export default CategoriesPage
