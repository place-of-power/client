import type { Category } from '@/shared/model/category'

export interface ArticlePreview {
    slug: string
    title: string
    description: string
    category: Category
    publishedAt: string
    readingTime: string
    cover?: string
}

export interface Article extends ArticlePreview {
    content: string
}
