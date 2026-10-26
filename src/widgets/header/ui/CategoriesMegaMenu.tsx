import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { paths } from '@/shared/config'
import type { BlogCategory } from '@/shared/api/mock/blog-categories'
import { blogCategories, blogSubcategoryCount } from '@/shared/api/mock/blog-categories'
import { Badge, Button, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

class MegaCategoryCard extends Component<{ category: BlogCategory }> {
    render() {
        const { category } = this.props
        const Icon = category.icon

        return (
            <NavigationMenuLink asChild>
                <Link
                    to={paths.category(category.slug)}
                    className="group block rounded-lg border border-transparent p-2.5 transition-colors hover:border-border hover:bg-accent/60"
                >
                    <div className="flex items-center gap-2.5">
                        <span
                            className={cn(
                                'grid size-8 place-items-center rounded-md bg-gradient-to-br text-white shadow-sm',
                                category.gradient,
                            )}
                        >
                            <Icon className="size-[1.05rem] text-white" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm leading-tight font-semibold">
                                {category.name}
                            </p>
                            <p className="truncate text-[0.7rem] text-muted-foreground">
                                {category.description}
                            </p>
                        </div>
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-1 pl-[2.6rem]">
                        {category.subcategories.map((subcategory) => (
                            <li key={subcategory.slug}>
                                <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                    {subcategory.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Link>
            </NavigationMenuLink>
        )
    }
}

class CategoriesMegaMenu extends Component {
    render() {
        return (
            <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 rounded-full px-4 text-[0.8rem] font-medium text-foreground">
                    Категории
                </NavigationMenuTrigger>
                <NavigationMenuContent className="!w-[min(92vw,860px)] !p-0">
                    <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1.35fr]">
                        <div className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white md:border-r md:border-b-0 md:border-white/10">
                            <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
                            <div className="relative">
                                <Badge className="border-white/20 bg-white/20 text-white">
                                    <Sparkles className="size-3" /> Каталог
                                </Badge>
                                <p className="mt-4 text-lg leading-snug font-semibold">
                                    Все направления блога
                                </p>
                                <p className="mt-1.5 text-sm text-white/85">
                                    Статьи собираются по категориям: от ИИ и ML до безопасности и
                                    DevOps.
                                </p>
                                <Button
                                    asChild
                                    size="sm"
                                    className="mt-5 h-8 bg-white text-emerald-700 hover:bg-white/90"
                                >
                                    <Link to={paths.categories}>
                                        Все категории <ArrowUpRight className="size-3.5" />
                                    </Link>
                                </Button>
                                <div className="mt-6 flex items-center gap-3 text-[0.7rem] text-white/75">
                                    <span>{blogCategories.length} категорий</span>
                                    <span className="size-1 rounded-full bg-white/40" />
                                    <span>{blogSubcategoryCount} подкатегории</span>
                                </div>
                            </div>
                        </div>

                        <div className="scroll-thin max-h-[460px] overflow-y-auto p-4">
                            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                {blogCategories.map((category) => (
                                    <li key={category.slug}>
                                        <MegaCategoryCard category={category} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        )
    }
}

export default CategoriesMegaMenu
