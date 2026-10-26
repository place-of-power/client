import { Component } from 'react'
import { ExternalLink } from 'lucide-react'
import { editorGroups } from '@/shared/config'
import type { EditorGroup } from '@/shared/config'
import { Badge, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

class MegaEditorGroup extends Component<{ group: EditorGroup }> {
    render() {
        const { group } = this.props

        return (
            <div className="mb-3 last:mb-0">
                <p className="px-1 pb-1 text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                    {group.label}
                </p>
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {group.editors.map((editor) => (
                        <li key={editor.name}>
                            <NavigationMenuLink asChild>
                                <a
                                    href={editor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-accent/60"
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
                                        <span className="flex items-center gap-1 text-sm leading-tight font-medium">
                                            <span className="truncate">{editor.name}</span>
                                            <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                        </span>
                                        <span className="block truncate text-[0.7rem] text-muted-foreground">
                                            {editor.description}
                                        </span>
                                    </span>
                                    {editor.badge ? (
                                        <Badge className="border-transparent bg-brand/15 text-[0.6rem] text-brand">
                                            {editor.badge}
                                        </Badge>
                                    ) : null}
                                </a>
                            </NavigationMenuLink>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

class EditorsMegaMenu extends Component {
    render() {
        return (
            <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 rounded-full px-4 text-sm font-medium text-foreground">
                    Редакторы ЯП
                </NavigationMenuTrigger>
                <NavigationMenuContent className="!w-[min(92vw,860px)] !p-0">
                    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr]">
                        <div className="border-b bg-muted/40 p-5 md:border-r md:border-b-0">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="grid size-7 place-items-center rounded-md bg-brand text-brand-foreground">
                                    <ExternalLink className="size-3.5" />
                                </span>
                                Онлайн-редакторы ЯП
                            </div>
                            <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
                                Запускайте код в браузере без установки. {editorGroups.length}{' '}
                                группы песочниц — от JavaScript и Python до Rust, Go и
                                алгоритмических контестов.
                            </p>
                            <div className="mt-4 grid grid-cols-2 gap-1.5 text-[0.7rem]">
                                {editorGroups.map((group) => (
                                    <span
                                        key={group.slug}
                                        className="rounded-md px-2 py-1.5 font-medium text-muted-foreground"
                                    >
                                        {group.label}
                                        <span className="ml-1 text-muted-foreground/70">
                                            ({group.editors.length})
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="scroll-thin max-h-[460px] overflow-y-auto p-3">
                            {editorGroups.map((group) => (
                                <MegaEditorGroup key={group.slug} group={group} />
                            ))}
                        </div>
                    </div>
                </NavigationMenuContent>
            </NavigationMenuItem>
        )
    }
}

export default EditorsMegaMenu
