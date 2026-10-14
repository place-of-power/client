import { Component } from 'react'
import type { ReactNode } from 'react'
import './HeroSubtitle.css'

interface HeroSubtitleProps {
    children: ReactNode
}

class HeroSubtitle extends Component<HeroSubtitleProps> {
    render() {
        return <p className="hero-subtitle">{this.props.children}</p>
    }
}

export default HeroSubtitle
