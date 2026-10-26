import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Menu } from 'lucide-react'
import { editorGroups, paths } from '@/shared/config'
import { blogCategories } from '@/shared/api/mock/blog-categories'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Separator, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'
import BrandMark from './BrandMark.tsx'

class HeaderMobileMenu extends Component<Record<string, never>, { open: boolean }> {
    state = { open: false }

    handleOpenChange = (open: boolean) => {
        this.setState({ open })
    }

    close = () => {
        this.setState({ open: false })
    }

    render() {
        const { open } = this.state

        return (
            <Sheet open={open} onOpenChange={this.handleOpenChange}>
                <SheetTrigger
                    className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent md:hidden"
                    aria-label="Открыть меню"
                >
                    <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="right" aria-describedby={undefined} className="w-[min(100vw,360px)] p-0">
                    <SheetHeader className="border-b px-5 py-4">
                        <SheetTitle className="sr-only">Меню</SheetTitle>
                        <BrandMark />
                    </SheetHeader>
                    <nav className="scroll-thin flex-1 overflow-y-auto px-2 py-3">
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="categories" className="border-b-0">
                                <AccordionTrigger className="px-3 text-sm font-semibold hover:no-underline">
                                    Категории
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <ul className="space-y-1">
                                        {blogCategories.map((category) => {
                                            const Icon = category.icon

                                            return (
                                                <li key={category.slug}>
                                                    <Link
                                                        to={paths.category(category.slug)}
                                                        onClick={this.close}
                                                        className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-accent"
                                                    >
                                                        <span
                                                            className={cn(
                                                                'grid size-7 shrink-0 place-items-center rounded-md bg-gradient-to-br text-white',
                                                                category.gradient,
                                                            )}
                                                        >
                                                            <Icon className="size-3.5" />
                                                        </span>
                                                        <span className="min-w-0">
                                                            <span className="block text-sm font-medium">
                                                                {category.name}
                                                            </span>
                                                            <span className="flex flex-wrap gap-1 pt-1">
                                                                {category.subcategories.map((subcategory) => (
                                                                    <span
                                                                        key={subcategory.slug}
                                                                        className="rounded-full bg-muted px-1.5 py-0.5 text-[0.6rem] text-muted-foreground"
                                                                    >
                                                                        {subcategory.name}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="editors" className="border-b-0">
                                <AccordionTrigger className="px-3 text-sm font-semibold hover:no-underline">
                                    Онлайн-редакторы ЯП
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    {editorGroups.map((group) => (
                                        <div key={group.slug} className="mb-3 last:mb-0">
                                            <p className="px-3 pb-1 text-[0.65rem] font-semibold tracking-wider text-muted-foreground uppercase">
                                                {group.label}
                                            </p>
                                            <ul className="space-y-0.5">
                                                {group.editors.map((editor) => (
                                                    <li key={editor.name}>
                                                        <a
                                                            href={editor.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-accent"
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'grid size-7 shrink-0 place-items-center rounded-md bg-gradient-to-br text-[0.6rem] font-bold text-white',
                                                                    editor.gradient,
                                                                )}
                                                            >
                                                                {editor.monogram}
                                                            </span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="block truncate text-sm font-medium">
                                                                    {editor.name}
                                                                </span>
                                                                <span className="block truncate text-[0.68rem] text-muted-foreground">
                                                                    {editor.description}
                                                                </span>
                                                            </span>
                                                            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Separator className="my-2" />

                        <div className="space-y-1 px-3">
                            <Link
                                to={paths.home}
                                onClick={this.close}
                                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Главная
                            </Link>
                            <Link
                                to={paths.categories}
                                onClick={this.close}
                                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Все категории
                            </Link>
                            <Link
                                to={paths.create}
                                onClick={this.close}
                                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Написать статью
                            </Link>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        )
    }
}

export default HeaderMobileMenu
