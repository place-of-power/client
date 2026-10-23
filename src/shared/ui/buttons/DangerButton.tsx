import { Component } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import './DangerButton.css'

interface DangerButtonProps {
    children: ReactNode
    disabled?: boolean
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

class DangerButton extends Component<DangerButtonProps> {
    render() {
        const { children, disabled, onClick } = this.props

        return (
            <button className="button button--danger" type="button" disabled={disabled} onClick={onClick}>
                {children}
            </button>
        )
    }
}

export default DangerButton