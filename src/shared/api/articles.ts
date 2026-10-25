import { slugify } from '@/shared/lib/slug'
import { mockArticles } from './mock/data.ts'
import type { Article, ArticleInput, ArticlePreview } from './types.ts'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const WORDS_PER_MINUTE = 180

interface ApiEnvelope<T> {
    data: T
    errors: { field: string | null; message: string }[]
}

interface RecentArticleDto {
    slug: string
    title: string
    description: string
    status: ArticlePreview['status']
    categorySlug: string
    categoryName: string
    publishedAt: string | null
}

function toPreviewFromRecent(dto: RecentArticleDto): ArticlePreview {
    return {
        slug: dto.slug,
        title: dto.title,
        description: dto.description,
        category: { id: '', name: dto.categoryName, slug: dto.categorySlug },
        status: dto.status,
        publishedAt: dto.publishedAt ?? '',
        readingTime: `${Math.max(1, Math.round(dto.description.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE))} мин чтения`,
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
    const response = await fetch(`${API_URL}/api/v1/articles/recent?limit=6`)

    if (!response.ok) {
        throw new Error(`Не удалось загрузить статьи: ${response.status}`)
    }

    const { data } = (await response.json()) as ApiEnvelope<RecentArticleDto[]>

    return data.map(toPreviewFromRecent)
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
