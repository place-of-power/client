import { Component } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Button } from '@/shared/ui/kit'

interface FormCardProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    error: string
    submitLabel: string
    busy?: boolean
    onCancel?: () => void
    children: ReactNode
}

class FormCard extends Component<FormCardProps> {
    render() {
        const { onSubmit, error, submitLabel, busy, onCancel, children } = this.props

        return (
            <form onSubmit={onSubmit} className="w-full">
                <div className="w-full bg-card py-6">
                    {children}

                    {error ? (
                        <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}

                    <div className="mt-5 flex justify-end gap-2">
                        {onCancel ? (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                className="h-10 cursor-pointer rounded-full px-5"
                            >
                                Отмена
                            </Button>
                        ) : null}
                        <Button
                            type="submit"
                            disabled={busy}
                            className="h-10 rounded-full bg-brand px-5 text-brand-foreground hover:opacity-90"
                        >
                            {submitLabel}
                        </Button>
                    </div>
                </div>
            </form>
        )
    }
}

export default FormCard