import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('php', php)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

const LANGUAGE_ALIASES: Record<string, string> = {
    shell: 'bash',
    sh: 'bash',
    docker: 'dockerfile',
    yml: 'yaml',
    xml: 'xml',
    html: 'xml',
    js: 'javascript',
    ts: 'typescript',
    mdx: 'markdown',
    md: 'markdown',
    gitignore: 'bash',
}

export function highlightCode(code: string, language?: string): string {
    const resolved = language ? (LANGUAGE_ALIASES[language.toLowerCase()] ?? language.toLowerCase()) : undefined

    if (resolved && hljs.getLanguage(resolved)) {
        return hljs.highlight(code, { language: resolved, ignoreIllegals: true }).value
    }

    return hljs.highlightAuto(code).value
}