import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AtSign, GitBranch, Heart, Rss, Send, Terminal, Video } from 'lucide-react'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { editorGroups, paths } from '@/shared/config'

const socials = [
    { label: 'GitHub', icon: GitBranch },
    { label: 'Twitter / X', icon: AtSign },
    { label: 'YouTube', icon: Video },
    { label: 'Telegram', icon: Send },
    { label: 'RSS', icon: Rss },
]

const projectLinks = ['Редакция', 'Авторам', 'Реклама', 'Контакты', 'Политика']

class Footer extends Component {
    render() {
        return (
            <footer className="mt-auto border-t bg-background">
                <div className="border-b bg-muted/30">
                    <div className="mx-auto flex w-full max-w-[var(--container)] flex-col gap-4 px-[var(--gutter)] py-8 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
                                <Terminal className="size-5" />
                            </span>
                            <div>
                                <p className="text-base font-bold tracking-tight">Place of Power</p>
                                <p className="text-xs text-muted-foreground">
                                    IT · AI · Code — обучающие статьи о технологиях
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {socials.map((social) => (
                                <span
                                    key={social.label}
                                    title={social.label}
                                    className="grid size-9 place-items-center rounded-full border bg-background text-muted-foreground"
                                >
                                    <social.icon className="size-4" />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-12">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                        <div className="col-span-2 lg:col-span-1">
                            <p className="text-sm font-semibold">О нас</p>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                «Place of Power» — русскоязычный блог о программировании,
                                искусственном интеллекте и инфраструктуре. Объясняем сложное
                                простым языком и собираем справочник онлайн-редакторов ЯП.
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Категории</p>
                            <ul className="mt-3 space-y-2">
                                {blogCategories.map((category) => (
                                    <li key={category.slug}>
                                        <Link
                                            to={paths.category(category.slug)}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Редакторы ЯП</p>
                            <ul className="mt-3 space-y-2">
                                {editorGroups.map((group) => (
                                    <li key={group.slug}>
                                        <span className="text-sm text-muted-foreground">
                                            {group.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Разделы</p>
                            <ul className="mt-3 space-y-2">
                                <li>
                                    <Link
                                        to={paths.home}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Главная
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={paths.categories}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Все категории
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={paths.create}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Написать статью
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={paths.createCategory}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Создать категорию
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to={paths.manageCategories}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        Управление категориями
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Проект</p>
                            <ul className="mt-3 space-y-2">
                                {projectLinks.map((label) => (
                                    <li key={label}>
                                        <span className="text-sm text-muted-foreground">{label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t">
                    <div className="mx-auto flex w-full max-w-[var(--container)] flex-col items-center justify-between gap-3 px-[var(--gutter)] py-5 text-xs text-muted-foreground sm:flex-row">
                        <p>© {new Date().getFullYear()} Place of Power. Все права защищены.</p>
                        <p className="inline-flex items-center gap-1.5">
                            Сделано с <Heart className="size-3 text-rose-500" /> на React 19 ·
                            TypeScript · Tailwind
                        </p>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Footer
