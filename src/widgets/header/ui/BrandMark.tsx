import { Component } from 'react'
import { Link } from 'react-router-dom'
import { Terminal } from 'lucide-react'
import { paths } from '@/shared/config'
import { cn } from '@/shared/lib/cn'

interface BrandMarkProps {
    className?: string
}

class BrandMark extends Component<BrandMarkProps> {
    render() {
        return (
            <Link
                to={paths.home}
                aria-label="Place of Power — на главную"
                className={cn('group flex items-center gap-2.5', this.props.className)}
            >
                <span className="relative grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm transition-transform group-hover:scale-105">
                    <Terminal className="size-[1.15rem]" />
                    <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
                </span>
                <span className="flex flex-col leading-none">
                    <span className="text-[0.95rem] font-bold tracking-tight text-foreground">Place of Power</span>
                    <span className="text-[0.66rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                        IT · AI · Code
                    </span>
                </span>
            </Link>
        )
    }
}

export default BrandMark
