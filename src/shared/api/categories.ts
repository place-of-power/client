import type { Category } from '@/shared/model/category'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

interface ApiEnvelope<T> {
    data: T
    errors: { field: string | null; message: string }[]
}

export interface CategoryInput {
    name: string
    slug: string
    sortOrder: number
}

const pending = new Map<string, Promise<Category[]>>()

async function requestCategories(url: string): Promise<Category[]> {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Не удалось загрузить категории: ${response.status}`)
    }

    const { data } = (await response.json()) as ApiEnvelope<Category[]>

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

export async function createCategory(input: CategoryInput): Promise<Category> {
    const response = await fetch(`${API_URL}/api/v1/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })

    const body = (await response.json()) as ApiEnvelope<Category>

    if (!response.ok) {
        throw new Error(body.errors[0]?.message ?? `Не удалось создать категорию: ${response.status}`)
    }

    return body.data
}

export async function deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const body = (await response.json()) as ApiEnvelope<Category>

        throw new Error(body.errors[0]?.message ?? `Не удалось удалить категорию: ${response.status}`)
    }
}