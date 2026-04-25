# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands
- **Test**: `npm test` – run all Vitest tests.
- **Single test file**: `npm test -- -f path/to/file.test.ts`.
- **Lint**: `npm run lint`.
- **Format**: `npm run format`.
- **Type check**: `npm run typecheck`.
- **Dev server**: `npm run dev`.
- **Build**: `npm run build`.
- **Package**: `npm run package` (Build + zip).
- **Dependency setup**: `npm run sp-deps:install`.
- **Clean sp‑deps**: `npm run sp-deps:clean`.

## Project Architecture
- `src/` contains the Solid.js application.
  - `app/` holds the main app component (App.tsx) and styles.
  - `plugin.ts` implements the Super Productivity plugin logic and exposes UI, tasks, hooks, and i18n support.
  - `index.html`/`index.tsx` bootstrap the UI in the plugin iframe.
- `i18n/` stores language JSON files for translations.
- `scripts/` hosts build utilities:
  - `sp-core.js` builds the local copies of `@super-productivity/plugin-api` and `@super-productivity/vite-plugin` into `sp-deps/`.
  - `build-plugin.js` zips the distribution for the MP store.
- `sp-deps/` holds vendored copy of plugin dependencies; never edited manually.
- `vite.config.ts` configures Vite with Solid and the Super Productivity Vite plugin.

## Build & Publishing Flow
1. Run `npm run sp-deps:install` to fetch vendor deps.
2. Start dev: `npm run dev`.
3. Build: `npm run build` (results in `dist/`).
4. Package: `npm run package` → creates `sp-customizable-dashboard-v0.0.1.zip`.

## i18n Quick Reference
- XML keys follow `UPPER.SPACE` style: `APP.TITLE`.
- Use `useTranslate` hook inside Solid components.
- Add a new language: add JSON in `i18n/`, add its code to `manifest.json` `i18n.languages`.

## Plugin Registration
- Header button, menu entry, and shortcut are all registered in `plugin.ts`.
- The plugin shows the UI through `plugin.showIndexHtmlAsView()`.
- Hook into task events (complete, update) to show notifications.
- Language change is communicated to the iframe via `postMessage`.

## Testing
- Tests are located under `src/` with `.test.ts` suffix.
- Use jsdom test environment – no network required.
- Run a single test file: `npm test -- -f src/__tests__/example.test.ts`.

## Useful Script Snippets
- To regenerate vendor deps after updating npm versions:
  ```bash
  npm run sp-deps:clean
  npm run sp-deps:install
  ```
- To rebuild after changes to Solid components:
  ```bash
  npm run dev
  ```