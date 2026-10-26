import { Component } from 'react'
import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import { fetchCategories } from '@/shared/api'
import { paths } from '@/shared/config'
import type { Category } from '@/shared/model/category'
import { MoonIcon, SunIcon } from '@/shared/ui/icons'
import { Button, NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'
import BrandMark from './BrandMark.tsx'
import CategoriesMegaMenu from './CategoriesMegaMenu.tsx'
import EditorsMegaMenu from './EditorsMegaMenu.tsx'
import HeaderMobileMenu from './HeaderMobileMenu.tsx'

type Theme = 'light' | 'dark'

interface HeaderState {
    theme: Theme
    scrolled: boolean
    categories: Category[]
}

class Header extends Component<Record<string, never>, HeaderState> {
    state: HeaderState = {
        theme: this.readTheme(),
        scrolled: false,
        categories: [],
    }

    mounted = false

    componentDidMount() {
        this.mounted = true
        this.applyTheme(this.state.theme)
        window.addEventListener('scroll', this.handleScroll, { passive: true })
        this.handleScroll()

        fetchCategories()
            .then((categories) => {
                if (this.mounted) this.setState({ categories })
            })
            .catch(() => {
                if (this.mounted) this.setState({ categories: [] })
            })
    }

    componentWillUnmount() {
        this.mounted = false
        window.removeEventListener('scroll', this.handleScroll)
    }

    readTheme(): Theme {
        const stored = window.localStorage.getItem('theme')

        if (stored === 'light' || stored === 'dark') {
            return stored
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    applyTheme(theme: Theme) {
        document.documentElement.dataset.theme = theme
    }

    handleScroll = () => {
        this.setState({ scrolled: window.scrollY > 8 })
    }

    toggleTheme = () => {
        const theme: Theme = this.state.theme === 'dark' ? 'light' : 'dark'
        window.localStorage.setItem('theme', theme)
        this.applyTheme(theme)
        this.setState({ theme })
    }

    render() {
        const { theme, scrolled, categories } = this.state

        return (
            <header
                className={cn(
                    'sticky top-0 z-50 w-full transition-all',
                    scrolled
                        ? 'border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
                        : 'border-b border-transparent',
                )}
            >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                <div className="mx-auto flex h-16 w-full max-w-[var(--container)] items-center gap-3 px-[var(--gutter)]">
                    <BrandMark />

                    <div className="hidden md:flex">
                        <NavigationMenu className="ml-2">
                            <NavigationMenuList className="gap-0.5">
                                <CategoriesMegaMenu categories={categories} />
                                <EditorsMegaMenu />
                                <NavigationMenuItem>
                                    <Link to={paths.home} className={navigationMenuTriggerStyle()}>
                                        Главная
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to={paths.categories} className={navigationMenuTriggerStyle()}>
                                        Каталог
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link to={paths.create} className={navigationMenuTriggerStyle()}>
                                        Создать
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center gap-1.5">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="rounded-full sm:hidden"
                            aria-label="Написать статью"
                        >
                            <Link to={paths.create}>
                                <PenLine className="size-[1.15rem]" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hidden h-9 rounded-full px-3.5 sm:inline-flex"
                        >
                            <Link to={paths.create}>
                                <PenLine className="size-4" /> Написать
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            aria-label="Переключить тему"
                            onClick={this.toggleTheme}
                        >
                            {theme === 'dark' ? (
                                <SunIcon className="size-[1.15rem]" />
                            ) : (
                                <MoonIcon className="size-[1.15rem]" />
                            )}
                        </Button>
                        <HeaderMobileMenu categories={categories} />
                    </div>
                </div>
            </header>
        )
    }
}

export default Header
