import { Component } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Mail, Sparkles } from 'lucide-react'
import { Badge, Button, Input } from '@/shared/ui/kit'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const benefits = [
    '5–7 минут чтения',
    'Только проверенные источники',
    'Без спама, отписка в один клик',
]

type Status = 'idle' | 'sending' | 'done'

interface NewsletterState {
    email: string
    status: Status
    error: string
}

class Newsletter extends Component<Record<string, never>, NewsletterState> {
    state: NewsletterState = { email: '', status: 'idle', error: '' }

    timer?: number

    componentWillUnmount() {
        window.clearTimeout(this.timer)
    }

    handleChange = (event: { target: { value: string } }) => {
        this.setState({ email: event.target.value, error: '' })
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const email = this.state.email.trim()

        if (!EMAIL_PATTERN.test(email)) {
            this.setState({ error: 'Укажите корректный e-mail', status: 'idle' })
            return
        }

        this.setState({ status: 'sending', error: '' })
        this.timer = window.setTimeout(() => {
            this.setState({ status: 'done', email: '' })
        }, 700)
    }

    render() {
        const { status, email, error } = this.state

        return (
            <section id="newsletter" className="border-b bg-background">
                <div className="mx-auto w-full max-w-[var(--container)] px-[var(--gutter)] py-16 lg:py-24">
                    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white sm:p-12 lg:p-16">
                        <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" />
                        <div className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-white/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-black/10 blur-3xl" />

                        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
                            <div>
                                <Badge className="border-white/30 bg-white/15 text-white">
                                    <Sparkles className="size-3" /> Еженедельный дайджест
                                </Badge>
                                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                    Главное про IT и ИИ — раз в неделю на почту
                                </h2>
                                <p className="mt-3 max-w-xl text-white/85">
                                    Подборка статей, свежие онлайн-редакторы ЯП и ссылки на
                                    инструменты. Без спама, отписаться можно в один клик.
                                </p>
                                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                                    {benefits.map((benefit) => (
                                        <li key={benefit} className="inline-flex items-center gap-1.5">
                                            <CheckCircle2 className="size-4" /> {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <form
                                onSubmit={this.handleSubmit}
                                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md"
                            >
                                <label htmlFor="newsletter-email" className="sr-only">
                                    E-mail
                                </label>
                                <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                                    <Mail className="size-4 shrink-0 text-muted-foreground" />
                                    <Input
                                        id="newsletter-email"
                                        type="email"
                                        inputMode="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={this.handleChange}
                                        className="h-9 border-0 bg-transparent px-0 text-sm text-foreground shadow-none focus-visible:ring-0"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="mt-3 h-11 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                                >
                                    {status === 'sending' ? 'Отправляем…' : 'Подписаться'}
                                </Button>
                                {error ? (
                                    <p className="mt-2 text-center text-[0.7rem] text-white">
                                        {error}
                                    </p>
                                ) : null}
                                {status === 'done' ? (
                                    <p className="mt-2 text-center text-[0.7rem] text-white">
                                        Готово! Подписка оформлена.
                                    </p>
                                ) : null}
                                <p className="mt-2.5 text-center text-[0.7rem] text-white/70">
                                    Нажимая «Подписаться», вы соглашаетесь с обработкой персональных
                                    данных.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Newsletter
