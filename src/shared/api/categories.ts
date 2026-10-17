import type { Category } from '@/shared/model/category'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface CategoriesResponse {
    data: Category[]
}

const pending = new Map<string, Promise<Category[]>>()

async function requestCategories(url: string): Promise<Category[]> {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Не удалось загрузить категории: ${response.status}`)
    }

    const { data } = (await response.json()) as CategoriesResponse

    return data
}

export function fetchCategories(limit?: number): Promise<Category[]> {
    const query = limit === undefined ? '' : `?limit=${limit}`
    const url = `${API_URL}/api/v1/categories${query}`
    const existing = pending.get(url)

    if (existing) {
        return existing
    }

    const request = requestCategories(url).finally(() => pending.delete(url))

    pending.set(url, request)

    return request
}
