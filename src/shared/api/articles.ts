import { mockArticles } from './mock/data.ts'
import type { Article, ArticlePreview } from './types.ts'

function toPreview(article: Article): ArticlePreview {
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
        publishedAt: article.publishedAt,
        readingTime: article.readingTime,
        cover: article.cover,
    }
}

export async function fetchArticles(): Promise<ArticlePreview[]> {
    return mockArticles.map(toPreview)
}

export async function fetchArticle(slug: string): Promise<Article | null> {
    return mockArticles.find((article) => article.slug === slug) ?? null
}
