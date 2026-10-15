import { Component } from 'react'
import type { IconProps } from './types.ts'

class ChevronIcon extends Component<IconProps> {
    render() {
        return (
            <svg className={this.props.className} viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        )
    }
}

export default ChevronIcon
