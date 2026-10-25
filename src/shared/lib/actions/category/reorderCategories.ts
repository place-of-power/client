import { reorderCategories } from '@/shared/api'
import type { CategoryOrderItem } from '@/shared/api'

export interface ReorderResult {
    ok: boolean
    error: string
}

export async function reorderCategoriesById(items: CategoryOrderItem[]): Promise<ReorderResult> {
    try {
        await reorderCategories(items)

        return { ok: true, error: '' }
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Не удалось изменить порядок категорий.',
        }
    }
}