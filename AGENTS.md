# AGENTS.md

Это клиент Place of Power: SPA на React 19 + TypeScript + Vite с архитектурой
Feature-Sliced Design. Точные версии смотри в `package.json`. Всё запускается
через контейнеры в `_infrastructure/`.

## Команды

- `_infrastructure/npm run dev` — dev-сервер Vite (:5173).
- `_infrastructure/npm run build` — сборка (`tsc -b && vite build`).
- `_infrastructure/npm run lint` — oxlint (линтер проекта, не ESLint).
- `_infrastructure/npm run preview` — превью сборки.
- `_infrastructure/up` — поднять контейнеры (nginx отдаёт клиент на :8090).

После правок `npm run lint` и `npm run build` должны проходить чисто. Если Vite
не стартовал: `docker compose exec -T -d node-cli npm run dev -- --host 0.0.0.0`.
Если :8090 не отвечает: `docker compose restart nginx`.

## Архитектура (FSD)

- Слои сверху вниз: `app`, `pages`, `widgets`, `features`, `entities`,
  `shared`. Зависимости — только вниз; импорт из чужого слайса — через его
  публичный API (`index.ts`), не вглубь.
- Alias `@/` → `src/` (см. `vite.config.ts` и `tsconfig.app.json`). Импорт
  слайса — через `@/...`; файлы — с явным расширением (`./App.tsx`,
  `./routes.ts`).
- `app` — композиция и роутинг (`app/App.tsx`, `app/main.tsx`), глобальные
  стили (`app/styles/index.css`). `shared/ui` — переиспользуемые компоненты
  (в т.ч. `shared/ui/icons`), `shared/lib` — markdown и подсветка, `shared/api`
  — данные и DTO-типы, `shared/config` — маршруты, `shared/model` — доменные
  типы.
- Компоненты лежат в `ui/` слайса, стили — рядом. Каждый компонент —
  `export default` из своего файла плюс реэкспорт из barrel'а слайса.

## Код

- Классовые компоненты (`extends Component`) с `render()`. Функциональные
  компоненты и хуки в этом проекте не используем — новый код тоже.
- Один компонент — один файл `.tsx`; стили — соседний одноимённый `.css`,
  подключаемый через `import './X.css'`.
- Стиль: 4 пробела, без точек с запятой, одинарные кавычки, висячие запятые,
  перевод строки в конце файла. TS строгий: `noUnusedLocals`/`noUnusedParameters`,
  `verbatimModuleSyntax` (используй `import type`), `erasableSyntaxOnly` (без
  `enum`, `namespace`, parameter properties).
- Типизируй пропсы и данные; бери типы из `shared/api`/`shared/model`, не
  дублируй DTO.
- Не добавляй зависимости без необходимости — сначала спрашивай.
- Именование: компоненты и типы PascalCase, переменные/утилиты camelCase,
  CSS-классы kebab-case с префиксом блока (`header-nav-link`).

## Стили (CSS)

- Единый источник токенов и темы — `app/styles/index.css` (`:root` и
  `[data-theme='dark']`). Не хардкодь цвета и радиусы — бери токены; новые
  значения добавляй в `:root` (цвет — в обе темы).
- Токены: цвета `--text`, `--text-h`, `--bg`, `--bg-page`, `--border`,
  `--accent`, `--accent-bg`, `--accent-border`, `--on-accent`, `--code-bg`;
  градиенты `--brand-gradient`, `--brand-gradient-horizontal`,
  `--cover-gradient`; радиусы `--radius-sm|md|lg|xl|pill`; лейаут
  `--container: 1126px`, `--gutter: 24px`; шрифты `--sans`, `--heading`,
  `--mono`.
- Лейаут: `#root` — на всю ширину (flex-колонка), контент страницы
  центрируется классом `.page` (`max-width: var(--container)` + паддинги
  `var(--gutter)`). Тема — атрибут `data-theme` на `<html>` (anti-FOUC скрипт
  в `index.html`).
- Стилизуй компонент в его собственном `.css`, классами с префиксом блока;
  модификатор — `--mod`, состояние — `.active`. Не стилизуй внутренние классы
  чужих компонентов; контекстные оверрайды допустимы только для чисто
  презентационных вещей (отступы/выравнивание), напр.
  `.home-categories .link-button`.
- Общий вид: серый фон страницы (`--bg-page`), белые поверхности (`--bg`) с
  рамкой `--border` и радиусом `--radius-xl`. Медиа-запросы — точки `1024px` и
  `640px`.

## Данные и маршруты

- Данные идут из мока (`shared/api/mock/data.ts`) через `fetchArticles()` /
  `fetchCategories()`; контракт сервера ещё не подключён.
- Маршруты — в `shared/config/routes.ts` (`ROUTES` и `paths`). Ссылки строй
  через `paths.*`, не хардкодь URL.
- Markdown рендерится в `shared/lib/markdown` (marked), подсветка кода — в
  `shared/lib/highlight` (highlight.js, тема `github-dark`).

## Git

- Репозиторий `git@github.com:place-of-power/client.git`, ветка `main`.
- Коммиты — на русском, краткие, по сути изменения. Коммить только по просьбе,
  но после коммита всегда сразу пушить в `main`.

## Сначала изучи, потом пиши

- Переиспользуй существующие компоненты и токены, прежде чем добавлять новые.
- Сверяйся с проектом (`package.json`, `tsconfig*.json`, `vite.config.ts`,
  `.oxlintrc.json`), а не полагайся на память о версиях и API.
