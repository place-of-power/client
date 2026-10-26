import { Component } from 'react'
import { ArrowUpRight, ExternalLink, Terminal } from 'lucide-react'
import { allEditors, editorGroups } from '@/shared/config'
import { Badge } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

class EditorMarquee extends Component {
    render() {
        const items = [...allEditors, ...allEditors]

        return (
            <div className="marquee-mask relative overflow-hidden border-y bg-muted/30">
                <div className="animate-marquee flex w-max items-center gap-3 py-3">
                    {items.map((editor, index) => (
                        <span
                            key={`${editor.name}-${index}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                            <span
                                className={cn(
                                    'grid size-5 place-items-center rounded-full bg-gradient-to-br text-[0.55rem] font-bold text-white',
                                    editor.gradient,
                                )}
                            >
                                {editor.monogram}
                            </span>
                            {editor.name}
                            <span className="text-[0.6rem] text-muted-foreground/70">
                                {editor.lang}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        )
    }
}

class EditorsSection extends Component {
    render() {
        return (
            <section id="editors" className="border-b bg-background">
                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-16 lg:py-24">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                                Инструменты
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Онлайн-редакторы языков программирования
                            </h2>
                            <p className="mt-3 text-muted-foreground">
                                Песочницы, в&nbsp;которых можно писать и&nbsp;запускать код прямо
                                в&nbsp;браузере — без установки. {allEditors.length} сервисов
                                в&nbsp;{editorGroups.length} группах по&nbsp;семействам&nbsp;ЯП.
                            </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                            <Terminal className="size-3.5 text-brand" />
                            все ссылки открываются в новой вкладке
                        </span>
                    </div>

                    <div className="mt-10">
                        <EditorMarquee />
                    </div>

                    <div className="mt-10 space-y-10">
                        {editorGroups.map((group) => (
                            <div key={group.slug} id={`editors-${group.slug}`} className="scroll-mt-24">
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <h3 className="text-xl font-semibold tracking-tight">
                                        {group.label}
                                    </h3>
                                    <span className="text-sm text-muted-foreground">
                                        {group.description}
                                    </span>
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {group.editors.length} редакторов
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {group.editors.map((editor) => (
                                        <a
                                            key={editor.name}
                                            href={editor.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                        >
                                            <div
                                                className={cn(
                                                    'pointer-events-none absolute -top-12 -right-12 size-28 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity group-hover:opacity-25',
                                                    editor.gradient,
                                                )}
                                            />
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={cn(
                                                        'grid size-11 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm',
                                                        editor.gradient,
                                                    )}
                                                >
                                                    {editor.monogram}
                                                </span>
                                                {editor.badge ? (
                                                    <Badge className="border-transparent bg-brand/15 text-brand">
                                                        {editor.badge}
                                                    </Badge>
                                                ) : (
                                                    <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                                )}
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <h4 className="font-semibold tracking-tight">
                                                    {editor.name}
                                                </h4>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {editor.description}
                                            </p>
                                            <div className="mt-4 flex items-center justify-between border-t pt-3">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[0.68rem] font-medium text-muted-foreground">
                                                    {editor.lang}
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                                                    Открыть <ArrowUpRight className="size-3.5" />
                                                </span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }
}

export default EditorsSection
