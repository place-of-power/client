import { Component } from 'react'
import type { ReactNode } from 'react'
import './HeroTitle.css'

interface HeroTitleProps {
    children: ReactNode
}

class HeroTitle extends Component<HeroTitleProps> {
    render() {
        return <h1 className="hero-title">{this.props.children}</h1>
    }
}

export default HeroTitle
