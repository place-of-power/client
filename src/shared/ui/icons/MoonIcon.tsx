import { Component } from 'react'
import type { IconProps } from './types.ts'

class MoonIcon extends Component<IconProps> {
    render() {
        return (
            <svg
                className={this.props.className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
            </svg>
        )
    }
}

export default MoonIcon