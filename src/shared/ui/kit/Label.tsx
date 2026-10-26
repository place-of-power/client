import { Component } from 'react'
import type { ComponentProps } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/shared/lib/cn'

class Label extends Component<ComponentProps<typeof LabelPrimitive.Root>> {
    render() {
        const { className, ...props } = this.props

        return (
            <LabelPrimitive.Root
                data-slot="label"
                className={cn(
                    'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                    className,
                )}
                {...props}
            />
        )
    }
}

export default Label
