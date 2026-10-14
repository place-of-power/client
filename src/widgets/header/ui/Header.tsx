import { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BoltIcon, MoonIcon, SunIcon } from '@/shared/ui/icons'
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

    navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'header-nav-link header-nav-link--active' : 'header-nav-link'

    render() {
        const { theme } = this.state

        return (
            <header className="header">
                <div className="header-inner">
                    <Link className="header-logo" to="/">
                        <span className="header-logo-mark" aria-hidden="true">
                            <BoltIcon />
                        </span>
                        <span className="header-logo-text">Place of Power</span>
                    </Link>
                    <nav className="header-nav">
                        <NavLink className={this.navLinkClass} to="/" end>
                            Главная
                        </NavLink>
                        <NavLink className={this.navLinkClass} to="/categories">
                            Категории
                        </NavLink>
                    </nav>
                    <button
                        className="header-theme"
                        type="button"
                        onClick={this.toggleTheme}
                        aria-label="Переключить тему"
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="header-theme-icon" />
                        ) : (
                            <MoonIcon className="header-theme-icon" />
                        )}
                    </button>
                </div>
            </header>
        )
    }
}

export default Header
