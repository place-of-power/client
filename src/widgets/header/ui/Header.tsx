import { Component } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

type Theme = 'light' | 'dark'

class Header extends Component {
    state = { theme: this.readTheme() }

    componentDidMount() {
        this.applyTheme(this.state.theme)
    }

    readTheme(): Theme {
        const stored = window.localStorage.getItem('theme')

        if (stored === 'light' || stored === 'dark') {
            return stored
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    applyTheme(theme: Theme) {
        document.documentElement.dataset.theme = theme
    }

    toggleTheme = () => {
        const theme: Theme = this.state.theme === 'dark' ? 'light' : 'dark'
        window.localStorage.setItem('theme', theme)
        this.applyTheme(theme)
        this.setState({ theme })
    }

    render() {
        const { theme } = this.state

        return (
            <header className="header">
                <div className="header-inner">
                    <Link className="header-logo" to="/">
                        Place of Power
                    </Link>
                    <nav className="header-nav">
                        <Link className="header-nav-link" to="/">
                            Главная
                        </Link>
                    </nav>
                    <button
                        className="header-theme"
                        type="button"
                        onClick={this.toggleTheme}
                        aria-label="Переключить тему"
                    >
                        {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                    </button>
                </div>
            </header>
        )
    }
}

export default Header
