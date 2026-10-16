import { Component } from 'react'
import type { Ref } from 'react'
import 'highlight.js/styles/github-dark.css'
import './MarkdownContent.css'

interface MarkdownContentProps {
    html: string
    innerRef?: Ref<HTMLDivElement>
    className?: string
}

class MarkdownContent extends Component<MarkdownContentProps> {
    render() {
        const { html, innerRef, className } = this.props

        return (
            <div
                className={className ? `markdown-content ${className}` : 'markdown-content'}
                ref={innerRef}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        )
    }
}

export default MarkdownContent
