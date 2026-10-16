import type { ArticleStatus } from '@/shared/model/article'
import type { Category } from '@/shared/model/category'

export interface ArticlePreview {
    slug: string
    title: string
    description: string
    category: Category
    status: ArticleStatus
    publishedAt: string
    readingTime: string
    cover?: string
}

export interface Article extends ArticlePreview {
    content: string
}

export interface ArticleInput {
    title: string
    description: string
    content: string
    category: Category
    status: ArticleStatus
}
