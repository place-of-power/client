import { generatePath } from 'react-router-dom'

export const ROUTES = {
    home: '/',
    categories: '/categories',
    article: '/articles/:slug',
} as const

export const paths = {
    home: ROUTES.home,
    categories: ROUTES.categories,
    article: (slug: string) => generatePath(ROUTES.article, { slug }),
}
