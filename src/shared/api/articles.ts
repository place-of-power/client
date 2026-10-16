import { slugify } from '@/shared/lib/slug'
import { mockArticles } from './mock/data.ts'
import type { Article, ArticleInput, ArticlePreview } from './types.ts'

const WORDS_PER_MINUTE = 180

function toPreview(article: Article): ArticlePreview {
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        status: article.status,
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        cover: article.cover,
    }
}

function estimateReadingTime(content: string): string {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))

    return `${minutes} мин чтения`
}

function uniqueSlug(title: string): string {
    const base = slugify(title)
    let slug = base
    let index = 2

    while (mockArticles.some((article) => article.slug === slug)) {
        slug = `${base}-${index}`
        index += 1
    }

    return slug
}

export async function fetchArticles(): Promise<ArticlePreview[]> {
    return mockArticles.map(toPreview)
}

export async function fetchArticle(slug: string): Promise<Article | null> {
    return mockArticles.find((article) => article.slug === slug) ?? null
}

export async function createArticle(input: ArticleInput): Promise<Article> {
    const article: Article = {
        slug: uniqueSlug(input.title),
        title: input.title,
        description: input.description,
        category: input.category,
        status: input.status,
        publishedAt: new Date().toISOString().slice(0, 10),
        readingTime: estimateReadingTime(input.content),
        content: input.content,
    }

    mockArticles.unshift(article)

    return article
}
