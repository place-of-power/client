import { Component } from 'react'
import type { ChangeEvent } from 'react'
import './SearchBar.css'

interface SearchBarProps {
    placeholder?: string
    onChange?: (value: string) => void
}

interface SearchBarState {
    value: string
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
    state: SearchBarState = { value: '' }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target

        this.setState({ value })
        this.props.onChange?.(value)
    }

    render() {
        const { placeholder } = this.props

        return (
            <div className="search-bar">
                <svg className="search-bar-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
                <input
                    className="search-bar-input"
                    type="search"
                    value={this.state.value}
                    placeholder={placeholder ?? 'Поиск статей'}
                    aria-label="Поиск статей"
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default SearchBar
