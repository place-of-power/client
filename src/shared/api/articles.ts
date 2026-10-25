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

interface CreatedArticleDto {
    id: string
    slug: string
    title: string
    description: string
    body: string
    status: ArticlePreview['status']
    categoryId: string
    categorySlug: string
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

export async function fetchArticles(): Promise<ArticlePreview[]> {
    const response = await fetch(`${API_URL}/api/v1/articles/recent?limit=6`)

    if (!response.ok) {
        throw new Error(`Не удалось загрузить статьи: ${response.status}`)
    }

    const { data } = (await response.json()) as ApiEnvelope<RecentArticleDto[]>

    return data.map(toPreviewFromRecent)
}

export interface CategoryArticlesPage {
    items: ArticlePreview[]
    nextCursor: string | null
}

export async function fetchArticlesByCategory(
    slug: string,
    cursor?: string,
    limit = 10,
): Promise<CategoryArticlesPage> {
    const query = new URLSearchParams({ limit: String(limit) })
    if (cursor) {
        query.set('cursor', cursor)
    }

    const response = await fetch(`${API_URL}/api/v1/categories/${slug}/articles?${query}`)

    if (!response.ok) {
        throw new Error(`Не удалось загрузить статьи категории: ${response.status}`)
    }

    const body = (await response.json()) as ApiEnvelope<{
        items: RecentArticleDto[]
        nextCursor: string | null
    }>

    return {
        items: body.data.items.map(toPreviewFromRecent),
        nextCursor: body.data.nextCursor,
    }
}

export async function fetchArticle(slug: string): Promise<Article | null> {
    return mockArticles.find((article) => article.slug === slug) ?? null
}

export async function createArticle(input: ArticleInput): Promise<Article> {
    const slug = slugify(input.title)
    const response = await fetch(`${API_URL}/api/v1/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            slug,
            title: input.title,
            description: input.description,
            body: input.content,
            status: input.status,
            categoryId: input.category.id,
        }),
    })

    if (!response.ok) {
        const body = (await response.json()) as ApiEnvelope<Article>
        throw new Error(body.errors[0]?.message ?? `Не удалось создать статью: ${response.status}`)
    }

    const body = (await response.json()) as ApiEnvelope<CreatedArticleDto>
    const dto = body.data

    return {
        slug: dto.slug,
        title: dto.title,
        description: dto.description,
        category: { id: dto.categoryId, name: '', slug: dto.categorySlug },
        status: dto.status,
        publishedAt: '',
        readingTime: '',
        content: dto.body,
    }
}
