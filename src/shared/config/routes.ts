import { generatePath } from 'react-router-dom'

export const ROUTES = {
    home: '/',
    categories: '/categories',
    category: '/categories/:slug',
    manageCategories: '/categories/manage',
    article: '/articles/:slug',
    create: '/create',
} as const

export const paths = {
    home: ROUTES.home,
    categories: ROUTES.categories,
    category: (slug: string) => generatePath(ROUTES.category, { slug }),
    manageCategories: ROUTES.manageCategories,
    article: (slug: string) => generatePath(ROUTES.article, { slug }),
    create: ROUTES.create,
}
