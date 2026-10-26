export type ContentBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'code'; language: string; code: string }
    | { type: 'quote'; text: string; author: string }
    | {
          type: 'callout'
          variant: 'tip' | 'warning' | 'info'
          title: string
          text: string
      }
    | { type: 'takeaways'; items: string[] }

const CALLOUT_TITLE: Record<'tip' | 'warning' | 'info', string> = {
    tip: 'Совет',
    warning: 'Внимание',
    info: 'Обратите внимание',
}

/** Пустой блок нужного типа для кнопки «добавить» */
export function emptyBlock(type: ContentBlock['type']): ContentBlock {
    switch (type) {
        case 'paragraph':
            return { type, text: '' }
        case 'heading':
            return { type, text: '' }
        case 'list':
        case 'takeaways':
            return { type, items: [''] }
        case 'code':
            return { type, language: 'ts', code: '' }
        case 'quote':
            return { type, text: '', author: '' }
        case 'callout':
            return { type, variant: 'tip', title: '', text: '' }
    }
}

/** Блок → markdown-фрагмент (без финального переноса) */
function blockToMarkdown(block: ContentBlock): string {
    switch (block.type) {
        case 'paragraph':
            return block.text.trim()
        case 'heading':
            return `## ${block.text.trim()}`
        case 'list':
            return block.items
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => `- ${item}`)
                .join('\n')
        case 'code':
            return `\`\`\`${block.language}\n${block.code}\n\`\`\``
        case 'quote':
            return `> ${block.text.trim()}${block.author.trim() ? `\n> — ${block.author.trim()}` : ''}`
        case 'callout': {
            const title = (block.title ?? '').trim() || CALLOUT_TITLE[block.variant]
            return `> **${title}**\n> ${block.text.trim()}`
        }
        case 'takeaways':
            return (
                `## Что запомнить\n` +
                block.items
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((item) => `- ${item}`)
                    .join('\n')
            )
    }
}

/** Все блоки редактора склеиваются в тело статьи (markdown) */
export function blocksToMarkdown(blocks: ContentBlock[]): string {
    return blocks
        .filter((block) => blockContent(block).trim() !== '')
        .map(blockToMarkdown)
        .join('\n\n')
}

/** Непустой ли блок (для валидации) */
export function blockContent(block: ContentBlock): string {
    switch (block.type) {
        case 'paragraph':
        case 'heading':
            return block.text
        case 'list':
        case 'takeaways':
            return block.items.filter((item) => item.trim()).join(' ')
        case 'code':
            return block.code
        case 'quote':
            return block.text
        case 'callout':
            return `${block.title ?? ''} ${block.text}`
    }
}

/** «Анна Соколова» → «АС»; одиночное имя → первые две буквы */
export function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean)

    if (parts.length === 0) return '??'

    const first = parts[0]?.[0] ?? ''
    const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : parts[0]?.[1] ?? ''

    return (first + second).toUpperCase()
}

/** Оценка времени чтения по блокам (~180 слов/мин) */
export function estimateReadTime(blocks: ContentBlock[]): number {
    let words = 0

    for (const block of blocks) {
        switch (block.type) {
            case 'paragraph':
            case 'heading':
            case 'quote':
                words += block.text.split(/\s+/).filter(Boolean).length
                break
            case 'list':
            case 'takeaways':
                words += block.items.join(' ').split(/\s+/).filter(Boolean).length
                break
            case 'code':
                words += Math.ceil(block.code.length / 40)
                break
            case 'callout':
                words += `${block.title ?? ''} ${block.text}`.split(/\s+/).filter(Boolean).length
                break
        }
    }

    return Math.max(1, Math.round(words / 180))
}

/** Суммарное количество слов в блоках (для счётчика в редакторе) */
export function countWords(blocks: ContentBlock[]): number {
    let words = 0

    for (const block of blocks) {
        switch (block.type) {
            case 'paragraph':
            case 'heading':
            case 'quote':
                words += block.text.split(/\s+/).filter(Boolean).length
                break
            case 'list':
            case 'takeaways':
                words += block.items.join(' ').split(/\s+/).filter(Boolean).length
                break
            case 'code':
                words += block.code.split(/\s+/).filter(Boolean).length
                break
            case 'callout':
                words += `${block.title ?? ''} ${block.text}`.split(/\s+/).filter(Boolean).length
                break
        }
    }

    return words
}

const BLOCK_ERRORS: Record<ContentBlock['type'], string> = {
    paragraph: 'Введите текст абзаца',
    heading: 'Введите заголовок',
    list: 'Добавьте пункты списка',
    code: 'Введите код',
    quote: 'Введите текст цитаты',
    callout: 'Введите текст врезки',
    takeaways: 'Добавьте пункты «Что запомнить»',
}

/** Ошибка валидации конкретного блока (пустая строка = блок валиден) */
export function blockError(block: ContentBlock): string {
    if (blockContent(block).trim() === '') {
        return BLOCK_ERRORS[block.type]
    }

    return ''
}