import { Component } from 'react'
import { Article } from '@/widgets/article'

const CONTENT = [
    '## Как работает tsvector',
    '',
    'Полнотекстовый поиск часто сводят к банальному `LIKE`-запросу, но уже на нескольких тысячах документов это перестаёт работать. PostgreSQL из коробки даёт `tsvector` для нормализованных лексем и GIN-индекс для быстрого поиска.',
    '',
    'tsvector превращает текст в лексемы — слова, приведённые к нормальной форме. Поиск идёт по индексированным токенам, а не по строкам, поэтому запросы остаются быстрыми на любом объёме данных.',
    '',
    '```sql',
    'ALTER TABLE articles',
    '    ADD COLUMN body_tsv tsvector',
    "    GENERATED ALWAYS AS (to_tsvector('russian', body)) STORED;",
    '',
    'CREATE INDEX idx_articles_body_tsv',
    '    ON articles USING GIN (body_tsv);',
    '```',
    '',
    'Генерируемый столбец считает вектор один раз при записи статьи, а GIN-индекс делает поиск почти мгновенным.',
    '',
    '## Комбинируем русский и английский словари',
    '',
    'Один словарь не справляется: русский лемматизатор «съедает» `Docker` как обычное слово, а английский не понимает падежей.',
    '',
    '> Решение — собственный `text search config`, объединяющий словари `russian` и `english`.',
    '',
    '### Кастомный конфиг',
    '',
    '```sql',
    'CREATE TEXT SEARCH CONFIGURATION ru_en ( COPY = russian );',
    'ALTER TEXT SEARCH CONFIGURATION ru_en',
    '    ADD MAPPING FOR asciiword WITH english_stem;',
    '```',
    '',
    '### Поиск по запросу',
    '',
    'Финальный запрос выглядит читаемо, а индекс строится один раз при записи статьи — даже без отдельного поискового движка.',
    '',
    '```sql',
    'SELECT id, title',
    'FROM articles',
    "WHERE body_tsv @@ to_tsquery('ru_en', 'docker & symfony');",
    '```',
].join('\n')

class ArticlePage extends Component {
    render() {
        return (
            <Article
                title="Как устроен полнотекстовый поиск в PostgreSQL"
                excerpt="Разбираем tsvector, GIN-индексы и кастомный русско-английский словарь для поиска по техническим статьям."
                meta={{
                    author: 'Stanislav Ermolaev',
                    role: 'Backend-разработчик',
                    publishedAt: '12 октября 2026',
                    readingTime: '5 мин чтения',
                    tags: ['PostgreSQL', 'Symfony'],
                }}
                content={CONTENT}
            />
        )
    }
}

export default ArticlePage