import { Marked, Renderer, type Token } from 'marked'
import { highlightCode } from '@/shared/lib/highlight'

export interface TocHeading {
    id: string
    text: string
    depth: number
}

const TRANSLIT: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'y',
    я: 'ya',
}

function slugify(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[«»"'“”‘’№,.:;!?()[\]{}&/=+*%$#@^~]/g, '')
        .replace(/[а-яё]/g, (char) => TRANSLIT[char] ?? char)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    return slug || 'section'
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function parseMarkdown(markdown: string): { html: string; headings: TocHeading[] } {
    const headings: TocHeading[] = []
    const usedSlugs = new Map<string, number>()

    const renderer = {
        heading(this: Renderer, token: { tokens: Token[]; depth: number }): string {
            const renderedText = this.parser.parseInline(token.tokens)
            const plainText = renderedText.replace(/<[^>]+>/g, '')
            const baseSlug = slugify(plainText)
            const usedCount = usedSlugs.get(baseSlug) ?? 0
            const id = usedCount === 0 ? baseSlug : `${baseSlug}-${usedCount + 1}`
            usedSlugs.set(baseSlug, usedCount + 1)
            headings.push({ id, text: plainText, depth: token.depth })

            return `<h${token.depth} id="${id}">${renderedText}</h${token.depth}>`
        },

        code(token: { text: string; lang?: string }): string {
            const rawLang = String(token.lang ?? '').toLowerCase()
            const label = rawLang ? `<span class="article-code-lang">${escapeHtml(rawLang)}</span>` : ''
            const body = highlightCode(String(token.text), rawLang)

            return `<pre class="article-code">${label}<code class="hljs">${body}</code></pre>`
        },
    }

    const marked = new Marked({ renderer, gfm: true })
    const html = marked.parse(markdown ?? '', { async: false }) as string

    return { html, headings }
}