# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser extension built with Vue 3 + Vite, targeting Manifest V3 for Chrome and Firefox (with Edge support). Based on the [vite-vue3-browser-extension-v3](https://github.com/mubaidr/vite-vue3-browser-extension-v3) template.

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

- **`src/background/`** — Service worker (`chrome.runtime.onInstalled`, lifecycle events)
- **`src/content-script/`** — Injected into all pages (`*://*/*`, `document_end`). Creates an iframe pointing to `content-script-iframe` UI
- **`src/ui/action-popup/`** — Browser action popup (click extension icon)
- **`src/ui/options-page/`** — Full options page
- **`src/ui/side-panel/`** — Chrome side panel
- **`src/ui/devtools-panel/`** — DevTools panel (separate HTML entry via `rollupOptions.input`)
- **`src/ui/setup/`** — Install/update wizard (opened by background on `onInstalled`)
- **`src/ui/content-script-iframe/`** — UI rendered inside content script's iframe
- **`src/ui/common/pages/`** — Shared pages (404, about, help, etc.) accessible from all contexts

### File-Based Routing

Pages auto-register from `src/ui/<context>/pages/`. Add a `.vue` file there to create a new route. The `vue-router/vite` plugin scans all UI context directories and generates typed routes (`src/types/typed-router.d.ts`). Use `definePage()` macro for route metadata.

Router uses `createWebHashHistory()` — all routes are hash-based.

### Build System

Two separate Vite configs inherit from `vite.config.ts`:
- `vite.chrome.config.ts` — Uses `@crxjs/vite-plugin` for Chrome Manifest V3
- `vite.firefox.config.ts` — Similar for Firefox

The base `vite.config.ts` configures:
- `@nuxt/ui/vite` — handles auto-imports, component registration, and UI framework
- `vue-router/vite` — file-based routing
- `@intlify/unplugin-vue-i18n` — i18n from `src/locales/`
- `unplugin-turbo-console` — enhanced console logging
- Build-time constants via `define.config.mjs` (accessible as `__VERSION__`, `__NAME__`, etc.)

### State Management

- **Pinia** stores in `src/stores/`, suffix: `*.store.ts`, Composition API style
- **`useBrowserSyncStorage`** / **`useBrowserLocalStorage`** (`src/composables/useBrowserStorage.ts`) — reactive refs synced with `chrome.storage.sync` / `chrome.storage.local`, with deep merge for nested objects and type checking
- **`useTheme`** — dark/light mode persisted via `useBrowserLocalStorage`, supports both shadow DOM and main document

### Communication

- `webext-bridge` for cross-context messaging between background, content scripts, and UI
- `webextension-polyfill` for cross-browser API compatibility (auto-imported as `browser`)

### Build-Time Constants

`define.config.mjs` reads from `package.json` and git, exposes: `__VERSION__`, `__NAME__`, `__DISPLAY_NAME__`, `__CHANGELOG__`, `__GIT_COMMIT__`, `__GITHUB_URL__`, `__HTML_TITLE__`. Usable in Vue templates and TS code.

## Code Style

- **No semicolons**, double quotes, trailing commas, 2-space indent (Prettier enforced)
- **Vue SFC**: `<script setup lang="ts">` exclusively
- **TypeScript**: strict mode, avoid `any`
- **Console**: use `console.info`, `console.warn`, `console.error` — `console.log` is an ESLint warning
- **Auto-imports**: Vue functions (`ref`, `computed`, `watch`), Pinia (`defineStore`), vue-router, vue-i18n, stores, composables, and utils are all auto-imported — do not add explicit imports for these
- **Path aliases**: `@/` → `src/`, `~/` → project root, `src/` → `src/`, `@assets/` → `src/assets/`
- **Components**: PascalCase `.vue` files. Shared in `src/components/`, context-specific colocated. `@nuxt/ui` auto-registers components from `src/components/` with directory-as-namespace

## UI Framework

- **@nuxt/ui v4** (not Nuxt itself — just the UI layer via Vite plugin)
- **shadcn-vue** (new-york style, stone base color) — components go to `src/components/ui/`
- **Tailwind CSS 4** with `@tailwindcss/typography`
- Primary color: green, neutral: slate
- **Lucide** icons via `lucide-vue-next` and `@iconify-json/lucide`

## i18n

Locale files in `src/locales/` (en.json, zh.json). Auto-imported `useI18n` and `t` functions. SFC global scope enabled.

## Before Committing

1. `npm run lint` — zero errors
2. `npm run typecheck` — no type errors
3. Test in Chrome (load `dist/chrome` unpacked) and Firefox if making cross-browser changes

## Key Technical Notes

- Chrome config uses `@crxjs/vite-plugin` which handles manifest generation and HMR in dev mode
- Firefox config does a watch-mode build (no full HMR)
- Content script injects an iframe into the host page; the actual UI lives in `content-script-iframe`
- `src/ui/setup/index.html` and `src/ui/content-script-iframe/index.html` are web-accessible resources
- Production builds are zipped (`vite-plugin-zip-pack`) for store submission
- `npm run launch` / `npm run launch:all` — auto-launches extension in installed browsers via `scripts/launch.ts`