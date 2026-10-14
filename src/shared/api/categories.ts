import type { Category } from '@/shared/model/category'
import { mockCategories } from './mock/data.ts'

export async function fetchCategories(): Promise<Category[]> {
    return mockCategories
}
