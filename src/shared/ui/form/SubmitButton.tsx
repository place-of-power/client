import { Component } from 'react'
import type { ReactNode } from 'react'

interface SubmitButtonProps {
    children: ReactNode
    disabled?: boolean
}

class SubmitButton extends Component<SubmitButtonProps> {
    render() {
        const { children, disabled } = this.props

        return (
            <button className="form-submit" type="submit" disabled={disabled}>
                {children}
            </button>
        )
    }
}

export default SubmitButton