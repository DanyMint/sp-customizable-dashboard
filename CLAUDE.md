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

## Project Architecture (Current)
- `src/` contains the Solid.js application.
  - `app/` holds the main app component (`App.tsx`) and styles.
  - `plugin.ts` implements the Super Productivity plugin logic and exposes UI, tasks, hooks, and i18n support.
  - `index.html`/`index.tsx` bootstrap the UI in the plugin iframe.
- `i18n/` stores language JSON files for translations.
- `scripts/` hosts build utilities:
  - `sp-core.js` builds the local copies of `@super-productivity/plugin-api` and `@super-productivity/vite-plugin` into `sp-deps/`.
  - `build-plugin.js` zips the distribution for the MP store.
- `sp-deps/` holds vendored copy of plugin dependencies; never edited manually.
- `vite.config.ts` configures Vite with Solid and the Super Productivity Vite plugin.

## Current State Summary
- Scaffolded Solid.js app with `App.tsx` and minimal styling.
- Plugin entry points (`plugin.ts`) are present and register UI hooks.
- Basic i18n hook (`useTranslate.ts`) and a few translation files exist.
- No dashboard/store implementation, grid layout, or card components yet.
- File structure is shallow: only `app/`, `utils/`, and top‑level plugin files.

## Gaps & Missing Pieces (Target vs. Current)
- **Store layer**: `store/dashboardStore.ts`, `store/cardStore.ts`, `store/types.ts` are missing.
- **Component hierarchy**: `DashboardTabs`, `TabBar`, `Tab`, `AddDashboardButton`, `GridContainer`, `CardGrid`, `Card`, `CardHeader`, `CardFilters`, `CardContent` (heatmap, correlation, pie‑chart), `AddCardButton`, `GridSettings` not implemented.
- **File structure**: `src/app/components/…` subfolders for each UI block are absent.
- **Data model**: TypeScript interfaces for Dashboard, Card, GridSize, etc., are not defined.
- **Persistence layer**: `utils/persistence.ts` for saving/loading dashboard config via `plugin.persistDataSynced()` is missing.
- **Grid utilities**: `utils/gridUtils.ts` for responsive calculations is absent.
- **i18n keys** for new UI strings (dashboard actions, card actions) need to be added.
- **Testing**: No tests for the new stores or components.

## Technical Decisions
- **State Management**: Use Solid.js stores (reactive signals) in `store/` instead of Context API – aligns with Solid's reactivity model and keeps state centralized.
- **Layout**: CSS Grid provides deterministic placement and aspect‑ratio handling; Flexbox would be less suitable for the fixed‑size, multi‑row/column cards.
- **Persistence**: Leverage Super Productivity's `plugin.persistDataSynced()` / `plugin.loadSyncedData()` to automatically sync dashboard config across devices and sessions.
- **Internationalization**: All UI strings go through `useTranslate()`; new keys will follow `APP`, `DASHBOARD`, `CARD` namespaces.
- **Modularity**: Each UI block lives in its own folder under `src/app/components/` for clear separation and easier testing.

## Implementation Plan (Phased)
1. **Infrastructure Setup**
   - Add `store/` files with TypeScript interfaces (Dashboard, Card, etc.).
   - Implement `utils/persistence.ts` and `utils/gridUtils.ts`.
   - Add default configurations in `utils/defaults.ts`.
2. **Component Skeletons**
   - Scaffold component folders and empty `.tsx` files for all hierarchy items.
   - Wire `App.tsx` to render `DashboardTabs`.
3. **Dashboard Tab Management**
   - Implement `DashboardTabs`, `TabBar`, `Tab`, `AddDashboardButton` with store integration.
   - Add rename/delete actions via modal dialogs.
4. **Grid Layout & Card System**
   - Build `GridContainer`, `CardGrid`, `Card`, `CardHeader`, `CardFilters`.
   - Implement `AddCardButton` modal for type/size selection.
   - Create type‑specific card components (`HeatmapCard`, `CorrelationCard`, `PieChartCard`).
5. **Persistence & Sync**
   - Hook store changes to `utils/persistence.ts` to auto‑save.
   - Load saved config on plugin init (`plugin.ts`).
6. **i18n Expansion**
   - Add new translation keys for dashboard and card actions.
   - Update language files.
7. **Testing**
   - Write unit tests for stores and critical components.
   - Add integration test for persistence round‑trip.
8. **Polish & Documentation**
   - Finalize README and CLAUDE.md sections (this document).
   - Ensure lint, type‑check, and build pass.

## Key Challenges & Solutions
- **Responsive Grid Sizing**: Calculating columns based on viewport width; solution – `gridUtils.calculateColumns(viewportWidth)` and CSS `grid-template-columns: repeat(var(--cols), 1fr)`.
- **Aspect Ratio Enforcement**: Map `AspectRatio` to concrete `gridSize` values; enforce via `Card` prop validation.
- **State Consistency**: Ensure store updates trigger persistence without race conditions – use Solid's `onCleanup` and debounce save calls.
- **i18n Synchronization**: Keep translation files in sync with UI; CI lint can enforce key presence.
- **Future Drag‑and‑Drop**: Design `position` field in `Card` now, even if not used yet, to avoid later schema changes.

## Store Structure
- `store/types.ts` – defines `Dashboard`, `Card`, `GridSize`, `DataFilter`, `AspectRatio`.
- `store/dashboardStore.ts` – holds an array of dashboards, active dashboard id, and actions (`addDashboard`, `renameDashboard`, `deleteDashboard`, `setActive`).
- `store/cardStore.ts` – manages cards for the active dashboard, actions (`addCard`, `updateCard`, `removeCard`).
- Stores expose Solid `createSignal`/`createStore` and are imported by components.

## Component Responsibilities
- **App** – top‑level entry, loads persisted state, renders `DashboardTabs`.
- **DashboardTabs** – orchestrates tab bar and grid container, passes active dashboard data.
- **TabBar** – displays all dashboard tabs, handles selection, add/rename/delete UI.
- **Tab** – represents a single dashboard tab with name and action icons.
- **AddDashboardButton** – creates a new dashboard with default config.
- **GridContainer** – sets up CSS Grid container, applies responsive column count.
- **CardGrid** – iterates over `dashboard.cards` and renders a `Card` for each.
- **Card** – generic wrapper displaying header, filters, and type‑specific content.
- **CardHeader** – title and action buttons (delete, edit).
- **CardFilters** – UI for configuring `DataFilter` objects.
- **CardContent** – delegates to `HeatmapCard`, `CorrelationCard`, or `PieChartCard` based on `card.type`.
- **AddCardButton** – opens modal to select card type and aspect ratio.
- **GridSettings** – optional UI for adjusting column count or global layout options.
- **HeatmapCard / CorrelationCard / PieChartCard** – render respective visualisations (placeholder SVG/Canvas for now).

## Development Commands
```bash
npm run sp-deps:install   # vendor deps
npm run dev               # start Vite watch
npm run build             # production build
npm run package           # zip for Marketplace
npm run test              # run Vitest suite
npm run lint && npm run format && npm run typecheck
```
