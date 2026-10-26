import { Marked, Renderer, type Token } from 'marked'
import { highlightCode } from '@/shared/lib/highlight'
import { slugify } from '@/shared/lib/slug'

export interface TocHeading {
    id: string
    text: string
    depth: number
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
export * from './blocks.ts'
