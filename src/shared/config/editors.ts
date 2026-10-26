export interface CodeEditor {
    name: string
    url: string
    description: string
    lang: string
    gradient: string
    monogram: string
    badge?: string
}

export interface EditorGroup {
    slug: string
    label: string
    description: string
    editors: CodeEditor[]
}

export const editorGroups: EditorGroup[] = [
    {
        label: 'JavaScript / TypeScript',
        slug: 'js-ts',
        description: 'Сетевые IDE для веб-стека',
        editors: [
            {
                name: 'CodeSandbox',
                url: 'https://codesandbox.io',
                description: 'Полноценные React/Vue/Next.js проекты в браузере',
                lang: 'JS/TS',
                gradient: 'from-slate-500 to-slate-700',
                monogram: 'CS',
                badge: 'Популярный',
            },
            {
                name: 'StackBlitz',
                url: 'https://stackblitz.com',
                description: 'WebContainer: Node.js прямо в браузере',
                lang: 'JS/TS',
                gradient: 'from-orange-500 to-red-500',
                monogram: 'SB',
            },
            {
                name: 'TypeScript Playground',
                url: 'https://www.typescriptlang.org/play',
                description: 'Песочница компилятора TS с версиями',
                lang: 'TS',
                gradient: 'from-blue-500 to-indigo-600',
                monogram: 'TS',
            },
            {
                name: 'CodePen',
                url: 'https://codepen.io',
                description: 'HTML/CSS/JS-сниппеты и демо',
                lang: 'HTML/CSS/JS',
                gradient: 'from-slate-700 to-slate-900',
                monogram: 'CP',
            },
            {
                name: 'JSFiddle',
                url: 'https://jsfiddle.net',
                description: 'Классическая песочница фронтенд-кода',
                lang: 'HTML/CSS/JS',
                gradient: 'from-emerald-500 to-teal-600',
                monogram: 'JS',
            },
            {
                name: 'PlayCode',
                url: 'https://playcode.io',
                description: 'Быстрый запуск JS/TS проектов',
                lang: 'JS/TS',
                gradient: 'from-fuchsia-500 to-purple-600',
                monogram: 'PC',
            },
        ],
    },
    {
        label: 'Python',
        slug: 'python',
        description: 'Запуск и отладка Python в браузере',
        editors: [
            {
                name: 'Replit',
                url: 'https://replit.com',
                description: 'AI-IDE для любых языков и хостинг',
                lang: 'Python+',
                gradient: 'from-orange-500 to-amber-600',
                monogram: 'Re',
                badge: 'AI',
            },
            {
                name: 'Python Tutor',
                url: 'https://pythontutor.com',
                description: 'Пошаговая визуализация выполнения кода',
                lang: 'Python',
                gradient: 'from-blue-500 to-cyan-600',
                monogram: 'PT',
            },
            {
                name: 'Google Colab',
                url: 'https://colab.research.google.com',
                description: 'Jupyter-ноутбуки с бесплатным GPU',
                lang: 'Python',
                gradient: 'from-amber-400 to-yellow-500',
                monogram: 'Co',
                badge: 'GPU',
            },
            {
                name: 'Programiz',
                url: 'https://www.programiz.com/python-programming/online-compiler',
                description: 'Простой онлайн-компилятор Python',
                lang: 'Python',
                gradient: 'from-emerald-500 to-green-600',
                monogram: 'Pr',
            },
        ],
    },
    {
        label: 'Системные языки',
        slug: 'systems',
        description: 'Rust, Go, C/C++ и компиляция в WASM',
        editors: [
            {
                name: 'Rust Playground',
                url: 'https://play.rust-lang.org',
                description: 'Официальная песочница Rust с Miri',
                lang: 'Rust',
                gradient: 'from-orange-600 to-red-700',
                monogram: 'Rs',
            },
            {
                name: 'Go Playground',
                url: 'https://go.dev/play',
                description: 'Официальная песочница Go с шедулером',
                lang: 'Go',
                gradient: 'from-cyan-500 to-sky-600',
                monogram: 'Go',
            },
            {
                name: 'Compiler Explorer',
                url: 'https://godbolt.org',
                description: 'Godbolt: ассемблерный вывод для C/C++/Rust',
                lang: 'C/C++/Rust',
                gradient: 'from-slate-600 to-slate-800',
                monogram: 'CE',
            },
            {
                name: 'OnlineGDB',
                url: 'https://www.onlinegdb.com',
                description: 'Онлайн-GDB для C/C++/Java/Python',
                lang: 'C/C++',
                gradient: 'from-indigo-500 to-violet-600',
                monogram: 'OG',
            },
        ],
    },
    {
        label: 'Алгоритмы и контесты',
        slug: 'algo',
        description: 'Песочницы для решения задач и собеседований',
        editors: [
            {
                name: 'LeetCode',
                url: 'https://leetcode.com',
                description: 'Задачи по алгоритмам на 20+ языках',
                lang: 'Multi',
                gradient: 'from-amber-500 to-orange-600',
                monogram: 'LC',
                badge: 'Собес',
            },
            {
                name: 'CodeWars',
                url: 'https://www.codewars.com',
                description: 'Каталог ката-задач с геймификацией',
                lang: 'Multi',
                gradient: 'from-rose-500 to-red-600',
                monogram: 'CW',
            },
            {
                name: 'JDoodle',
                url: 'https://www.jdoodle.com',
                description: 'Онлайн-компилятор 70+ языков',
                lang: '70+',
                gradient: 'from-teal-500 to-emerald-600',
                monogram: 'JD',
            },
        ],
    },
]

export const allEditors: CodeEditor[] = editorGroups.flatMap((group) => group.editors)
