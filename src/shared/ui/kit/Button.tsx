import { Component } from 'react'
import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from './buttonVariants.ts'

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

class Button extends Component<ButtonProps> {
    render() {
        const { className, variant, size, asChild = false, ...props } = this.props
        const Comp = asChild ? Slot : 'button'

        return (
            <Comp
                data-slot="button"
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            />
        )
    }
}

export default Button
