import { BrainCircuit, Cloud, Code2, Database, Globe, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface BlogSubcategory {
    name: string
    slug: string
    description: string
}

export interface BlogCategory {
    name: string
    slug: string
    description: string
    icon: LucideIcon
    gradient: string
    accent: string
    subcategories: BlogSubcategory[]
}

export const blogCategories: BlogCategory[] = [
    {
        name: 'ИИ и ML',
        slug: 'ai-ml',
        description: 'Машинное обучение, LLM и нейросети',
        icon: BrainCircuit,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        accent: 'text-emerald-500',
        subcategories: [
            { name: 'Машинное обучение', slug: 'ml', description: 'Алгоритмы, тренировка моделей, MLOps' },
            { name: 'LLM и GPT', slug: 'llm', description: 'Большие языковые модели, prompt engineering' },
            { name: 'Компьютерное зрение', slug: 'cv', description: 'CV, генерация изображений, видео' },
            { name: 'Этика ИИ', slug: 'ethics', description: 'Безопасность, доверие и регулирование' },
        ],
    },
    {
        name: 'Веб-разработка',
        slug: 'web',
        description: 'Frontend, Backend и Full-Stack',
        icon: Globe,
        gradient: 'from-cyan-500 via-sky-500 to-blue-500',
        accent: 'text-cyan-500',
        subcategories: [
            { name: 'Frontend', slug: 'frontend', description: 'React, Next.js, Vue, Svelte' },
            { name: 'Backend', slug: 'backend', description: 'Node, API, GraphQL, базы данных' },
            { name: 'Full-Stack', slug: 'fullstack', description: 'Архитектура и стек целиком' },
            { name: 'WebAssembly', slug: 'wasm', description: 'WASM, Rust в браузере, производительность' },
        ],
    },
    {
        name: 'Программирование',
        slug: 'programming',
        description: 'Языки, паттерны и экосистемы',
        icon: Code2,
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        accent: 'text-violet-500',
        subcategories: [
            { name: 'JavaScript', slug: 'javascript', description: 'ES2024, Node, фреймворки' },
            { name: 'TypeScript', slug: 'typescript', description: 'Типы, дженерики, утилиты' },
            { name: 'Python', slug: 'python', description: 'FastAPI, async, дата-стек' },
            { name: 'Rust', slug: 'rust', description: 'Безопасность памяти и системное' },
            { name: 'Go', slug: 'go', description: 'Конкарренси, микросервисы' },
        ],
    },
    {
        name: 'Cloud и DevOps',
        slug: 'cloud-devops',
        description: 'Инфраструктура и доставка кода',
        icon: Cloud,
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        accent: 'text-amber-500',
        subcategories: [
            { name: 'Docker', slug: 'docker', description: 'Контейнеризация и образы' },
            { name: 'Kubernetes', slug: 'kubernetes', description: 'Оркестрация и операторы' },
            { name: 'CI/CD', slug: 'cicd', description: 'GitHub Actions, GitLab, пайплайны' },
            { name: 'Cloud', slug: 'cloud', description: 'AWS, Azure, GCP, serverless' },
        ],
    },
    {
        name: 'Data Science',
        slug: 'data',
        description: 'Данные, аналитика и визуализация',
        icon: Database,
        gradient: 'from-teal-500 via-emerald-500 to-green-500',
        accent: 'text-teal-500',
        subcategories: [
            { name: 'Big Data', slug: 'big-data', description: 'Spark, Kafka, хранилища' },
            { name: 'Аналитика', slug: 'analytics', description: 'Pandas, SQL, метрики' },
            { name: 'Визуализация', slug: 'viz', description: 'D3, Recharts, дашборды' },
        ],
    },
    {
        name: 'Безопасность',
        slug: 'security',
        description: 'Защита приложений и данных',
        icon: ShieldCheck,
        gradient: 'from-rose-500 via-pink-500 to-red-500',
        accent: 'text-rose-500',
        subcategories: [
            { name: 'Web Security', slug: 'web-security', description: 'OWASP, XSS, CSRF' },
            { name: 'Криптография', slug: 'crypto', description: 'Шифрование и подписи' },
            { name: 'DevSecOps', slug: 'devsecops', description: 'Безопасность в пайплайнах' },
        ],
    },
]

export const blogSubcategoryCount = blogCategories.reduce(
    (total, category) => total + category.subcategories.length,
    0,
)
