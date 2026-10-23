import { Component } from 'react'
import type { ReactNode } from 'react'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
    open: boolean
    title: string
    confirmLabel: string
    cancelLabel?: string
    busy?: boolean
    onConfirm: () => void
    onCancel: () => void
    children: ReactNode
}

class ConfirmDialog extends Component<ConfirmDialogProps> {
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeydown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeydown)
        document.body.style.overflow = ''
    }

    componentDidUpdate(prevProps: ConfirmDialogProps) {
        if (prevProps.open !== this.props.open) {
            document.body.style.overflow = this.props.open ? 'hidden' : ''
        }
    }

    handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.props.open && !this.props.busy) {
            this.props.onCancel()
        }
    }

    render() {
        const {
            open,
            title,
            confirmLabel,
            cancelLabel = 'Отмена',
            busy,
            onConfirm,
            onCancel,
            children,
        } = this.props

        if (!open) {
            return null
        }

        return (
            <div className="confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
                <div className="confirm-dialog-overlay" onClick={busy ? undefined : onCancel} />
                <div className="confirm-dialog-panel">
                    <h2 className="confirm-dialog-title">{title}</h2>
                    <div className="confirm-dialog-body">{children}</div>
                    <div className="confirm-dialog-actions">
                        <button
                            className="confirm-dialog-cancel"
                            type="button"
                            disabled={busy}
                            onClick={onCancel}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            className="confirm-dialog-confirm"
                            type="button"
                            disabled={busy}
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfirmDialog