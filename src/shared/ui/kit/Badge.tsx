import { Component } from 'react'
import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'
import { badgeVariants } from './badgeVariants.ts'

interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
    asChild?: boolean
}

class Badge extends Component<BadgeProps> {
    render() {
        const { className, variant, asChild = false, ...props } = this.props
        const Comp = asChild ? Slot : 'span'

        return (
            <Comp
                data-slot="badge"
                className={cn(badgeVariants({ variant }), className)}
                {...props}
            />
        )
    }
}

export default Badge
