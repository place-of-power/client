import { Component } from 'react'
import type { IconProps } from './types.ts'

class SunIcon extends Component<IconProps> {
    render() {
        return (
            <svg className={this.props.className} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" />
                <line x1="12" y1="2.5" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="21.5" />
                <line x1="2.5" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="21.5" y2="12" />
                <line x1="5.2" y1="5.2" x2="7" y2="7" />
                <line x1="17" y1="17" x2="18.8" y2="18.8" />
                <line x1="5.2" y1="18.8" x2="7" y2="17" />
                <line x1="17" y1="7" x2="18.8" y2="5.2" />
            </svg>
        )
    }
}

export default SunIcon
