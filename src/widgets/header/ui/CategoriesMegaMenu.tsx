import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { Badge, Button, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/shared/ui/kit'

interface CategoriesMegaMenuProps {
    categories: Category[]
}

class CategoriesMegaMenu extends Component<CategoriesMegaMenuProps> {
    render() {
        const { categories } = this.props

        return (
            <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 rounded-full px-4 text-sm font-medium">
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
                                    <span>{categories.length} в каталоге</span>
                                    <span className="size-1 rounded-full bg-white/40" />
                                    <span>API в реальном времени</span>
                                </div>
                            </div>
                        </div>

                        <div className="scroll-thin max-h-[460px] overflow-y-auto p-4">
                            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to={paths.category(category.slug)}
                                                className="group flex items-center gap-2.5 rounded-lg border border-transparent p-2.5 transition-colors hover:border-border hover:bg-accent/60"
                                            >
                                                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-sm font-bold text-white shadow-sm">
                                                    {category.name.slice(0, 1).toUpperCase()}
                                                </span>
                                                <span className="truncate text-sm leading-tight font-semibold">
                                                    {category.name}
                                                </span>
                                            </Link>
                                        </NavigationMenuLink>
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
