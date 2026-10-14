import { Component } from 'react'
import type { IconProps } from './types.ts'

class BoltIcon extends Component<IconProps> {
    render() {
        return (
            <svg className={this.props.className} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.5 2 4 13h6.5L10 22l9.5-11H13l.5-9Z" />
            </svg>
        )
    }
}

export default BoltIcon
