import { deleteCategory } from '@/shared/api'

export interface DeleteResult {
    ok: boolean
    error: string
}

export async function deleteCategoryById(id: string): Promise<DeleteResult> {
    try {
        await deleteCategory(id)

        return { ok: true, error: '' }
    } catch (error) {
        return {
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Не удалось удалить категорию.',
        }
    }
}