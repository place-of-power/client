import { createCategory } from '@/shared/api'
import type { CategoryInput } from '@/shared/api'
import type { Category } from '@/shared/model/category'

export interface CreateResult {
    ok: boolean
    category: Category | null
    error: string
}

export async function createCategoryById(input: CategoryInput): Promise<CreateResult> {
    try {
        const category = await createCategory(input)

        return { ok: true, category, error: '' }
    } catch (error) {
        return {
            ok: false,
            category: null,
            error:
                error instanceof Error
                    ? error.message
                    : 'Не удалось создать категорию.',
        }
    }
}