import { Component } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export class Sheet extends Component<ComponentProps<typeof SheetPrimitive.Root>> {
    render() {
        return <SheetPrimitive.Root data-slot="sheet" {...this.props} />
    }
}

export class SheetTrigger extends Component<ComponentProps<typeof SheetPrimitive.Trigger>> {
    render() {
        return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...this.props} />
    }
}

export class SheetClose extends Component<ComponentProps<typeof SheetPrimitive.Close>> {
    render() {
        return <SheetPrimitive.Close data-slot="sheet-close" {...this.props} />
    }
}

export class SheetPortal extends Component<ComponentProps<typeof SheetPrimitive.Portal>> {
    render() {
        return <SheetPrimitive.Portal data-slot="sheet-portal" {...this.props} />
    }
}

export class SheetOverlay extends Component<ComponentProps<typeof SheetPrimitive.Overlay>> {
    render() {
        const { className, ...props } = this.props

        return (
            <SheetPrimitive.Overlay
                data-slot="sheet-overlay"
                className={cn(
                    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
                    className,
                )}
                {...props}
            />
        )
    }
}

interface SheetContentProps extends ComponentProps<typeof SheetPrimitive.Content> {
    side?: 'top' | 'right' | 'bottom' | 'left'
}

export class SheetContent extends Component<SheetContentProps> {
    render() {
        const { className, children, side = 'right', ...props } = this.props

        return (
            <SheetPortal>
                <SheetOverlay />
                <SheetPrimitive.Content
                    data-slot="sheet-content"
                    className={cn(
                        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
                        side === 'right' &&
                            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
                        side === 'left' &&
                            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                        side === 'top' &&
                            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
                        side === 'bottom' &&
                            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
                        className,
                    )}
                    {...props}
                >
                    {children as ReactNode}
                    <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                        <XIcon className="size-4" />
                        <span className="sr-only">Закрыть</span>
                    </SheetPrimitive.Close>
                </SheetPrimitive.Content>
            </SheetPortal>
        )
    }
}

export class SheetHeader extends Component<ComponentProps<'div'>> {
    render() {
        const { className, ...props } = this.props

        return (
            <div
                data-slot="sheet-header"
                className={cn('flex flex-col gap-1.5 p-4', className)}
                {...props}
            />
        )
    }
}

export class SheetFooter extends Component<ComponentProps<'div'>> {
    render() {
        const { className, ...props } = this.props

        return (
            <div
                data-slot="sheet-footer"
                className={cn('mt-auto flex flex-col gap-2 p-4', className)}
                {...props}
            />
        )
    }
}

export class SheetTitle extends Component<ComponentProps<typeof SheetPrimitive.Title>> {
    render() {
        const { className, ...props } = this.props

        return (
            <SheetPrimitive.Title
                data-slot="sheet-title"
                className={cn('text-foreground font-semibold', className)}
                {...props}
            />
        )
    }
}

export class SheetDescription extends Component<ComponentProps<typeof SheetPrimitive.Description>> {
    render() {
        const { className, ...props } = this.props

        return (
            <SheetPrimitive.Description
                data-slot="sheet-description"
                className={cn('text-muted-foreground text-sm', className)}
                {...props}
            />
        )
    }
}

export default Sheet
