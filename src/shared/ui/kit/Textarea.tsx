import { Component } from 'react'
import type { ComponentProps, Ref } from 'react'
import { cn } from '@/shared/lib/cn'

interface TextareaProps extends ComponentProps<'textarea'> {
    innerRef?: Ref<HTMLTextAreaElement>
}

class Textarea extends Component<TextareaProps> {
    render() {
        const { className, innerRef, ...props } = this.props

        return (
            <textarea
                data-slot="textarea"
                ref={innerRef}
                className={cn(
                    'border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    'focus-visible:border-ring focus-visible:shadow-[0_3px_8px_-2px_rgba(100,116,139,0.45)] focus-visible:ring-0',
                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    className,
                )}
                {...props}
            />
        )
    }
}

export default Textarea
