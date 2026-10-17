import { generatePath } from 'react-router-dom'

export const ROUTES = {
    home: '/',
    categories: '/categories',
    category: '/categories/:slug',
    article: '/articles/:slug',
    create: '/create',
} as const

export const paths = {
    home: ROUTES.home,
    categories: ROUTES.categories,
    category: (slug: string) => generatePath(ROUTES.category, { slug }),
    article: (slug: string) => generatePath(ROUTES.article, { slug }),
    create: ROUTES.create,
}
