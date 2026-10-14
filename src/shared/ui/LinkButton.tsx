import { Component } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './LinkButton.css'

interface LinkButtonProps {
    to: string
    children: ReactNode
}

class LinkButton extends Component<LinkButtonProps> {
    render() {
        const { to, children } = this.props

        return (
            <Link className="link-button" to={to}>
                {children}
            </Link>
        )
    }
}

export default LinkButton
