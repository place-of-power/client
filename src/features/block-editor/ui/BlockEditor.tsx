import { Component } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { ArrowDown, ArrowUp, Code2, List, ListChecks, Quote, Text, Trash2, Type, AlertTriangle, Lightbulb, Info, Plus } from 'lucide-react'
import type { ContentBlock } from '@/shared/lib/markdown'
import { blocksToMarkdown, emptyBlock } from '@/shared/lib/markdown'
import { Button, Input, Textarea } from '@/shared/ui/kit'
import { cn } from '@/shared/lib/cn'

type BlockType = ContentBlock['type']

const BLOCK_TYPES: { type: BlockType; label: string; icon: typeof Text }[] = [
    { type: 'paragraph', label: 'Абзац', icon: Text },
    { type: 'heading', label: 'Подзаголовок', icon: Type },
    { type: 'list', label: 'Список', icon: List },
    { type: 'code', label: 'Код', icon: Code2 },
    { type: 'quote', label: 'Цитата', icon: Quote },
    { type: 'callout', label: 'Врезка', icon: Lightbulb },
    { type: 'takeaways', label: 'Что запомнить', icon: ListChecks },
]

const CALLOUT_ICONS: Record<'tip' | 'warning' | 'info', typeof Lightbulb> = {
    tip: Lightbulb,
    warning: AlertTriangle,
    info: Info,
}

const CALLOUT_LABELS: Record<'tip' | 'warning' | 'info', string> = {
    tip: 'Совет',
    warning: 'Внимание',
    info: 'Инфо',
}

interface BlockEditorProps {
    value: string
    onChange: (markdown: string) => void
}

interface PendingTitles {
    [index: number]: string
}

interface BlockEditorState {
    blocks: ContentBlock[]
    pendingTitles: PendingTitles
}

/** Классовый блочный редактор: редактирует blocks, наружу отдаёт склеенный markdown */
class BlockEditor extends Component<BlockEditorProps, BlockEditorState> {
    state: BlockEditorState = {
        blocks: this.parseInitial(this.props.value),
        pendingTitles: {},
    }

    /** Черновой markdown разбираем в блоки так, чтобы их можно было продолжать редактировать */
    private parseInitial(value: string): ContentBlock[] {
        const trimmed = value.trim()

        if (!trimmed) {
            return []
        }

        const chunks = trimmed.split(/\n{2,}/)

        return chunks
            .map((chunk) => {
                const lines = chunk.split('\n').map((line) => line.trimEnd())

                if (lines[0].startsWith('## ')) {
                    return { type: 'heading', text: lines[0].slice(3).trim() }
                }

                if (
                    lines[0].startsWith('```') &&
                    lines[lines.length - 1].startsWith('```') &&
                    lines.length >= 2
                ) {
                    return {
                        type: 'code',
                        language: lines[0].slice(3).trim() || 'text',
                        code: lines.slice(1, -1).join('\n'),
                    }
                }

                if (lines.every((line) => line.startsWith('- '))) {
                    return {
                        type: 'list',
                        items: lines.map((line) => line.slice(2).trim()),
                    }
                }

                if (lines.every((line) => /^>\s/.test(line))) {
                    const textLines = lines.map((line) => line.replace(/^>\s?/, ''))
                    const authorLine = textLines.findIndex((line) => line.startsWith('— '))

                    if (authorLine !== -1) {
                        return {
                            type: 'quote',
                            text: textLines.slice(0, authorLine).join(' '),
                            author: textLines[authorLine].slice(2).trim(),
                        }
                    }

                    return { type: 'quote', text: textLines.join(' '), author: '' }
                }

                return { type: 'paragraph', text: chunk.trim() }
            })
            .filter((block) => block) as ContentBlock[]
    }

    private emit(blocks: ContentBlock[]) {
        this.props.onChange(blocksToMarkdown(blocks))
    }

    private commit = (next: ContentBlock[]) => {
        this.setState({ blocks: next })
        this.emit(next)
    }

    handleBlockChange = (index: number, patch: Partial<ContentBlock>) => {
        const { blocks } = this.state
        const next = blocks.map((block, i) => (i === index ? ({ ...block, ...patch } as ContentBlock) : block))

        this.commit(next)
    }

    handleBlockEdit = (index: number, field: string, value: string) => {
        const { blocks } = this.state
        const block = blocks[index]

        if (!block) return

        if (block.type === 'list' || block.type === 'takeaways') {
            const items = [...block.items]
            const row = Number(field)

            items[row] = value
            this.handleBlockChange(index, { items })
            return
        }

        if (block.type === 'code') {
            if (field === 'language') this.handleBlockChange(index, { language: value })
            else this.handleBlockChange(index, { code: value })
            return
        }

        if (block.type === 'callout') {
            if (field === 'title') this.handleBlockChange(index, { title: value })
            else if (field === 'variant')
                this.handleBlockChange(index, { variant: value } as Partial<ContentBlock>)
            else this.handleBlockChange(index, { text: value })
            return
        }

        if (block.type === 'quote') {
            if (field === 'author') this.handleBlockChange(index, { author: value })
            else this.handleBlockChange(index, { text: value })
            return
        }

        this.handleBlockChange(index, { text: value })
    }

    handleItemEdit = (index: number, row: number, value: string) => this.handleBlockEdit(index, String(row), value)

    handleAddItem = (index: number) => {
        const { blocks } = this.state
        const block = blocks[index]

        if (block && (block.type === 'list' || block.type === 'takeaways')) {
            this.handleBlockChange(index, { items: [...block.items, ''] })
        }
    }

    handleRemoveItem = (index: number, row: number) => {
        const { blocks } = this.state
        const block = blocks[index]

        if (block && (block.type === 'list' || block.type === 'takeaways') && block.items.length > 1) {
            this.handleBlockChange(index, { items: block.items.filter((_, i) => i !== row) })
        }
    }

    handleMove = (index: number, dir: -1 | 1) => {
        const { blocks } = this.state
        const target = index + dir

        if (target < 0 || target >= blocks.length) return

        const next = [...blocks]
        const tmp = next[index]
        next[index] = next[target]
        next[target] = tmp

        this.commit(next)
    }

    handleRemove = (index: number) => {
        this.commit(this.state.blocks.filter((_, i) => i !== index))
    }

    handlePendingTitleChange = (index: number, value: string) => {
        this.setState({ pendingTitles: { ...this.state.pendingTitles, [index]: value } })
    }

    applyPendingTitle = (index: number) => {
        const { pendingTitles, blocks } = this.state
        const title = (pendingTitles[index] ?? '').trim()
        const local = { ...pendingTitles }
        delete local[index]

        this.setState({ pendingTitles: local })

        if (title) {
            const block = blocks[index]

            if (block?.type === 'callout') {
                this.handleBlockChange(index, { title })
            }
        }
    }

    renderFields(block: ContentBlock, index: number): ReactNode {
        switch (block.type) {
            case 'paragraph':
                return (
                    <Textarea
                        value={block.text}
                        rows={3}
                        placeholder="Текст абзаца…"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.handleBlockEdit(index, 'text', e.target.value)}
                    />
                )

            case 'heading':
                return (
                    <Input
                        value={block.text}
                        placeholder="Заголовок раздела"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleBlockEdit(index, 'text', e.target.value)}
                    />
                )

            case 'list':
            case 'takeaways':
                return (
                    <div className="space-y-1.5">
                        {block.items.map((item, row) => (
                            <div key={row} className="flex items-center gap-1.5">
                                <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                                <Input
                                    value={item}
                                    placeholder="Пункт"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleItemEdit(index, row, e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 shrink-0 rounded-full text-muted-foreground"
                                    onClick={() => this.handleRemoveItem(index, row)}
                                    disabled={block.items.length <= 1}
                                    aria-label="Удалить пункт"
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                                {row === block.items.length - 1 ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-7 shrink-0 rounded-full text-muted-foreground"
                                        onClick={() => this.handleAddItem(index)}
                                        aria-label="Добавить пункт"
                                    >
                                        <Plus className="size-3.5" />
                                    </Button>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )

            case 'code':
                return (
                    <div className="space-y-2">
                        <Input
                            className="h-8 w-32 font-mono text-xs"
                            value={block.language}
                            placeholder="язык, напр. ts"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleBlockEdit(index, 'language', e.target.value)}
                        />
                        <Textarea
                            className="font-mono text-xs leading-relaxed"
                            value={block.code}
                            rows={6}
                            placeholder="код…"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.handleBlockEdit(index, 'code', e.target.value)}
                        />
                    </div>
                )

            case 'quote': {
                const { blocks } = this.state
                const blockRef = blocks[index]

                return (
                    <div className="space-y-2">
                        <Textarea
                            value={block.text}
                            rows={2}
                            placeholder="Текст цитаты…"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.handleBlockEdit(index, 'text', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <Input
                                value={blockRef?.type === 'quote' ? blockRef.author : ''}
                                placeholder="Автор цитаты (необязательно)"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => this.handleBlockEdit(index, 'author', e.target.value)}
                            />
                        </div>
                    </div>
                )
            }

            case 'callout': {
                const { pendingTitles, blocks } = this.state
                const blockRef = blocks[index]

                return (
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {(['tip', 'warning', 'info'] as const).map((variant) => {
                                const Icon = CALLOUT_ICONS[variant]

                                return (
                                    <Button
                                        key={variant}
                                        type="button"
                                        size="sm"
                                        variant={blockRef?.type === 'callout' && blockRef.variant === variant ? 'default' : 'outline'}
                                        className={cn(
                                            'h-7 rounded-full px-3 text-xs',
                                            blockRef?.type === 'callout' && blockRef.variant === variant
                                                ? 'bg-brand text-brand-foreground'
                                                : '',
                                        )}
                                        onClick={() => this.handleBlockEdit(index, 'variant', variant)}
                                    >
                                        <Icon className="size-3.5" />
                                        {CALLOUT_LABELS[variant]}
                                    </Button>
                                )
                            })}
                        </div>
                        <Input
                            value={pendingTitles[index] ?? ''}
                            placeholder="Заголовок врезки (необязательно)"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => this.handlePendingTitleChange(index, e.target.value)}
                            onBlur={() => this.applyPendingTitle(index)}
                        />
                        <Textarea
                            value={block.text}
                            rows={2}
                            placeholder="Текст врезки…"
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => this.handleBlockEdit(index, 'text', e.target.value)}
                        />
                    </div>
                )
            }
        }
    }

    renderEditorMeta(block: ContentBlock): string {
        switch (block.type) {
            case 'list':
                return `Список · ${block.items.length}`
            case 'takeaways':
                return `Что запомнить · ${block.items.length}`
            case 'code':
                return `Код · ${block.language || 'text'}`
            case 'quote':
                return 'Цитата'
            case 'callout':
                return `Врезка · ${CALLOUT_LABELS[block.variant]}`
            default:
                return block.type
        }
    }

    render() {
        const { blocks } = this.state

        return (
            <div>
                {blocks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center">
                        <p className="text-sm text-muted-foreground">
                            Статья пуста. Добавьте первый блок.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {blocks.map((block, index) => (
                            <div key={index} className="group rounded-2xl border bg-background p-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                                        {this.renderEditorMeta(block)}
                                    </span>

                                    <div className="ml-auto flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-full text-muted-foreground"
                                            disabled={index === 0}
                                            onClick={() => this.handleMove(index, -1)}
                                            aria-label="Блок выше"
                                        >
                                            <ArrowUp className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-full text-muted-foreground"
                                            disabled={index === blocks.length - 1}
                                            onClick={() => this.handleMove(index, 1)}
                                            aria-label="Блок ниже"
                                        >
                                            <ArrowDown className="size-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => this.handleRemove(index)}
                                            aria-label="Удалить блок"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-3">{this.renderFields(block, index)}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                    {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                        <Button
                            key={type}
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-full px-3 text-xs"
                            onClick={() => this.commit([...this.state.blocks, emptyBlock(type)])}
                        >
                            <Icon className="size-3.5" /> {label}
                        </Button>
                    ))}
                </div>
            </div>
        )
    }
}

export default BlockEditor