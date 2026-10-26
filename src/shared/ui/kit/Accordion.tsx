import { Component } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export class Accordion extends Component<ComponentProps<typeof AccordionPrimitive.Root>> {
    render() {
        return <AccordionPrimitive.Root data-slot="accordion" {...this.props} />
    }
}

export class AccordionItem extends Component<ComponentProps<typeof AccordionPrimitive.Item>> {
    render() {
        const { className, ...props } = this.props

        return (
            <AccordionPrimitive.Item
                data-slot="accordion-item"
                className={cn('border-b last:border-b-0', className)}
                {...props}
            />
        )
    }
}

export class AccordionTrigger extends Component<ComponentProps<typeof AccordionPrimitive.Trigger>> {
    render() {
        const { className, children, ...props } = this.props

        return (
            <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger
                    data-slot="accordion-trigger"
                    className={cn(
                        'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
                        className,
                    )}
                    {...props}
                >
                    {children as ReactNode}
                    <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
        )
    }
}

export class AccordionContent extends Component<ComponentProps<typeof AccordionPrimitive.Content>> {
    render() {
        const { className, children, ...props } = this.props

        return (
            <AccordionPrimitive.Content
                data-slot="accordion-content"
                className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
                {...props}
            >
                <div className={cn('pt-0 pb-4', className)}>{children as ReactNode}</div>
            </AccordionPrimitive.Content>
        )
    }
}

export default Accordion
