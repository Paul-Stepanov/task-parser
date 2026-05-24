# Bitrix24 Task Parser

Browser extension для парсинга задач из Bitrix24 и генерации AI-промптов.

## Описание

Расширение извлекает данные задач из DOM Bitrix24 и генерирует структурированные промпты для AI-ассистентов. Построено на Vue 3 + Vite с использованием Manifest V3 для Chrome.

## Установка

```bash
git clone https://github.com/Paul-Stepanov/task-parser.git
cd task-parser
npm install
```

## Команды

| Команда             | Описание                                   |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Dev-сервер для Chrome (HMR, sourcemaps)    |
| `npm run build`     | Production-сборка для Chrome → dist/chrome |
| `npm run lint`      | ESLint с авто-исправлением (кешируется)    |
| `npm run typecheck` | Проверка типов TypeScript                  |
| `npm run format`    | Форматирование через Prettier              |
| `npm run launch`    | Запуск Chrome с загруженным расширением    |

## Архитектура

### Контексты расширения

Каждый контекст — изолированное Vue-приложение с собственной точкой входа:

- **`src/background/`** — Service worker. Открывает side-panel по клику на иконку расширения.
- **`src/content-script/`** — Внедряется в страницы Bitrix24. Парсит данные задач из DOM.
- **`src/ui/side-panel/`** — Основной UI. Отображает распаршенную задачу, генерирует AI-промпты.
- **`src/ui/options-page/`** — Настройки расширения.
- **`src/ui/common/pages/`** — Общие страницы (404), доступные из всех контекстов.

### Файловая маршрутизация

Страницы автоматически регистрируются из `src/ui/<context>/pages/`. Создайте `.vue` файл для нового маршрута. Плагин `vue-router/vite` сканирует все UI-контексты и генерирует типизированные маршруты (`src/types/typed-router.d.ts`).

Маршрутизатор использует `createWebHashHistory()` — все маршруты хеш-базированные.

### Система сборки

Vite конфиг наследуется от `vite.config.ts`:

- `vite.chrome.config.ts` — Использует `@crxjs/vite-plugin` для Chrome Manifest V3

Базовый конфиг настраивает:

- `@vitejs/plugin-vue` — поддержка Vue SFC
- `vue-router/vite` — файловая маршрутизация
- `@tailwindcss/vite` — Tailwind CSS v4
- Build-time константы через `define.config.mjs` (`__VERSION__`, `__NAME__` и т.д.)

### Управление состоянием

- **Pinia** stores в `src/stores/`, суффикс: `*.store.ts`, стиль Composition API
- **`useBrowserSyncStorage`** / **`useBrowserLocalStorage`** — реактивные refs, синхронизированные с `chrome.storage`
- **`useTheme`** — тёмная/светлая тема с персистентностью

### Коммуникация

- `chrome.runtime.sendMessage` / `chrome.tabs.sendMessage` для обмена между контекстами
- Side Panel использует `chrome.scripting.executeScript` для парсинга содержимого страницы

## Загрузка расширения в Chrome

1. Перейдите в `chrome://extensions`
2. Включите **Режим разработчика** (toggle вверху справа)
3. Нажмите **Загрузить распакованное расширение**
4. Выберите папку `dist/chrome`

## Кодстайл

- **Без точек с запятой**, двойные кавычки, висящие запятые, отступ 2 пробела
- **Vue SFC**: только `<script setup lang="ts">`
- **TypeScript**: strict mode, избегать `any`
- **Консоль**: используйте `console.info`, `console.warn`, `console.error`
- **Явные импорты**: Vue-функции, Pinia, vue-router — должны быть импортированы явно
- **Алиасы путей**: `@/` → `src/`, `~/` → корень проекта

## Перед коммитом

1. `npm run lint` — ноль ошибок
2. `npm run typecheck` — без ошибок типов
3. Протестировать в Chrome (загрузить `dist/chrome` как распакованное расширение)

## Лицензия

MIT
