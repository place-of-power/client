import { Component, createRef } from 'react'
import { ChevronIcon } from '../icons/index.ts'
import './Select.css'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps {
    value: string
    options: SelectOption[]
    onChange: (value: string) => void
    id?: string
}

interface SelectState {
    open: boolean
}

class Select extends Component<SelectProps, SelectState> {
    state: SelectState = { open: false }

    rootRef = createRef<HTMLDivElement>()

    componentDidMount() {
        document.addEventListener('mousedown', this.handleOutsideClick)
        document.addEventListener('keydown', this.handleKeydown)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleOutsideClick)
        document.removeEventListener('keydown', this.handleKeydown)
    }

    handleOutsideClick = (event: MouseEvent) => {
        const root = this.rootRef.current

        if (this.state.open && root && !root.contains(event.target as Node)) {
            this.setState({ open: false })
        }
    }

    handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.setState({ open: false })
        }
    }

    toggle = () => {
        this.setState((state) => ({ open: !state.open }))
    }

    select = (value: string) => {
        this.props.onChange(value)
        this.setState({ open: false })
    }

    render() {
        const { value, options, id } = this.props
        const { open } = this.state
        const current = options.find((option) => option.value === value)

        return (
            <div className="select" ref={this.rootRef}>
                <button
                    id={id}
                    className={open ? 'select-button select-button--open' : 'select-button'}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={this.toggle}
                >
                    <span className="select-value">{current?.label ?? ''}</span>
                    <ChevronIcon className="select-icon" />
                </button>

                {open && (
                    <ul className="select-list" role="listbox">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    className={
                                        option.value === value
                                            ? 'select-option select-option--active'
                                            : 'select-option'
                                    }
                                    type="button"
                                    role="option"
                                    aria-selected={option.value === value}
                                    onClick={() => this.select(option.value)}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }
}

export default Select
