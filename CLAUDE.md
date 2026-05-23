# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser extension for parsing Bitrix24 tasks and generating AI prompts. Built with Vue 3 + Vite, targeting Manifest V3 for Chrome and Firefox.

## Commands

```bash
npm run dev:chrome      # Dev server for Chrome (HMR, sourcemaps)
npm run dev:firefox     # Dev build + watch for Firefox
npm run build           # Production build for both browsers → dist/chrome, dist/firefox
npm run build:chrome    # Production build for Chrome only
npm run build:firefox   # Production build for Firefox only
npm run lint            # ESLint with auto-fix (caches results)
npm run typecheck       # vue-tsc --noEmit (strict TypeScript)
npm run format          # Prettier formatting
```

No test framework is configured. There is no `npm test`.

## Architecture

### Extension Contexts

Each context is an isolated Vue app with its own entry point (`index.ts`, `index.html`, `app.vue`):

- **`src/background/`** — Service worker. Opens side-panel on extension icon click.
- **`src/content-script/`** — Injected into Bitrix24 pages. Parses task data from DOM.
- **`src/ui/side-panel/`** — Main UI. Shows parsed task, generates AI prompts.
- **`src/ui/options-page/`** — Extension settings.
- **`src/ui/common/pages/`** — Shared pages (404) accessible from all contexts.

### File-Based Routing

Pages auto-register from `src/ui/<context>/pages/`. Add a `.vue` file there to create a new route. The `vue-router/vite` plugin scans all UI context directories and generates typed routes (`src/types/typed-router.d.ts`). Use `definePage()` macro for route metadata.

Router uses `createWebHashHistory()` — all routes are hash-based.

### Build System

Two separate Vite configs inherit from `vite.config.ts`:
- `vite.chrome.config.ts` — Uses `@crxjs/vite-plugin` for Chrome Manifest V3
- `vite.firefox.config.ts` — Similar for Firefox

The base `vite.config.ts` configures:
- `@vitejs/plugin-vue` — Vue SFC support
- `vue-router/vite` — file-based routing
- `@tailwindcss/vite` — Tailwind CSS v4
- Build-time constants via `define.config.mjs` (accessible as `__VERSION__`, `__NAME__`, etc.)

### State Management

- **Pinia** stores in `src/stores/`, suffix: `*.store.ts`, Composition API style
- **`useBrowserSyncStorage`** / **`useBrowserLocalStorage`** (`src/composables/useBrowserStorage.ts`) — reactive refs synced with `chrome.storage.sync` / `chrome.storage.local`
- **`useTheme`** — dark/light mode persisted via `useBrowserLocalStorage`

### Communication

- `webext-bridge` for cross-context messaging between background, content scripts, and UI
- `webextension-polyfill` for cross-browser API compatibility

### Build-Time Constants

`define.config.mjs` reads from `package.json` and git, exposes: `__VERSION__`, `__NAME__`, `__DISPLAY_NAME__`, `__CHANGELOG__`, `__GIT_COMMIT__`, `__GITHUB_URL__`, `__HTML_TITLE__`. Usable in Vue templates and TS code.

## Code Style

- **No semicolons**, double quotes, trailing commas, 2-space indent (Prettier enforced)
- **Vue SFC**: `<script setup lang="ts">` exclusively
- **TypeScript**: strict mode, avoid `any`
- **Console**: use `console.info`, `console.warn`, `console.error` — `console.log` is an ESLint warning
- **Explicit imports**: Vue functions (`ref`, `computed`, `watch`), Pinia (`defineStore`), vue-router — must be imported explicitly, no auto-imports
- **Path aliases**: `@/` → `src/`, `~/` → project root, `src/` → `src/`, `@assets/` → `src/assets/`

## UI Framework

- **Tailwind CSS 4** with `@tailwindcss/typography` via `@tailwindcss/vite` plugin
- Custom CSS variables in `src/assets/base.css` (`--primary`, `--background`, `--foreground`, etc.)
- Plain HTML elements + Tailwind utility classes (no component library)

## Before Committing

1. `npm run lint` — zero errors
2. `npm run typecheck` — no type errors
3. Test in Chrome (load `dist/chrome` unpacked) and Firefox if making cross-browser changes

## Key Technical Notes

- Chrome config uses `@crxjs/vite-plugin` which handles manifest generation and HMR in dev mode
- Firefox config does a watch-mode build (no full HMR)
- Content script targets Bitrix24 domains (`*://*.bitrix24.ru/*`, `*://*.bitrix24.com/*`)
- Clicking extension icon opens side-panel via `chrome.sidePanel.open()`
- Production builds are zipped (`vite-plugin-zip-pack`) for store submission
- `npm run launch` / `npm run launch:all` — auto-launches extension in installed browsers via `scripts/launch.ts`