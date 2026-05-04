# Customizable Dashboard Plugin for Super Productivity

A TypeScript Solid.js plugin providing a fully customizable dashboard with tabs, grid layouts, and card components.

## Architecture Overview
```
App (root)
├─ DashboardTabs (state manager)
│  ├─ TabBar (dashboard tabs)
│  │  ├─ Tab (individual dashboard)
│  │  └─ AddDashboardButton
│  └─ GridContainer (grid layout)
│     ├─ CardGrid (renders cards)
│     │  ├─ Card (individual card)
│     │  │  ├─ CardHeader
│     │  │  ├─ CardFilters
│     │  │  └─ CardContent
│     │  │     ├─ HeatmapCard
│     │  │     ├─ CorrelationCard
│     │  │     └─ PieChartCard
│     │  └─ AddCardButton
│     └─ GridSettings (responsive config)
```

## Component Guide
| Component | Responsibility |
|-----------|-----------------|
| **App** | Top‑level entry, renders `DashboardTabs` |
| **DashboardTabs** | Holds active dashboard state, coordinates tab bar & grid |
| **TabBar** | Displays tabs, handles add/rename/delete actions |
| **Tab** | Represents a single dashboard tab |
| **AddDashboardButton** | Creates a new empty dashboard |
| **GridContainer** | Wraps the CSS Grid, passes layout config |
| **CardGrid** | Maps dashboard.cards to `Card` components |
| **Card** | Base card UI, delegates rendering to type‑specific child |
| **CardHeader** | Title + action icons |
| **CardFilters** | UI for data filter configuration |
| **CardContent** | Renders a specific visualization (`HeatmapCard`, `CorrelationCard`, `PieChartCard`) |
| **AddCardButton** | Opens modal to pick card type & size |
| **GridSettings** | Controls responsive columns/rows |
| **HeatmapCard / CorrelationCard / PieChartCard** | Visualisation implementations |

## File Structure (Target)
```
src/
├─ app/
│  ├─ components/
│  │  ├─ DashboardTabs/
│  │  │  ├─ DashboardTabs.tsx
│  │  │  └─ DashboardTabs.css
│  │  ├─ TabBar/
│  │  │  ├─ TabBar.tsx
│  │  │  ├─ Tab.tsx
│  │  │  ├─ AddDashboardButton.tsx
│  │  │  └─ TabBar.css
│  │  ├─ GridContainer/
│  │  │  ├─ GridContainer.tsx
│  │  │  ├─ CardGrid.tsx
│  │  │  ├─ Card.tsx
│  │  │  ├─ CardHeader.tsx
│  │  │  ├─ CardFilters.tsx
│  │  │  ├─ AddCardButton.tsx
│  │  │  ├─ GridSettings.tsx
│  │  │  └─ GridContainer.css
│  │  └─ CardTypes/
│  │     ├─ HeatmapCard.tsx
│  │     ├─ CorrelationCard.tsx
│  │     └─ PieChartCard.tsx
│  ├─ App.tsx
│  └─ App.css
├─ store/
│  ├─ dashboardStore.ts   // Solid store for dashboards
│  ├─ cardStore.ts        // Solid store for cards
│  └─ types.ts            // TypeScript interfaces (see Data Model)
├─ utils/
│  ├─ useTranslate.ts
│  ├─ gridUtils.ts        // CSS Grid calculations
│  ├─ persistence.ts      // Save/load dashboard config
│  └─ defaults.ts         // Default dashboard/card configs
├─ index.html
├─ index.tsx
├─ plugin.ts               // Plugin hooks, persistence, messaging
└─ manifest.json
```

## Data Model
```typescript
interface Dashboard {
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
  updatedAt: number;
}

interface Card {
  id: string;
  type: 'heatmap' | 'correlation' | 'pie-chart';
  gridSize: GridSize;          // e.g., {columns:2, rows:2}
  filters: DataFilter[];
  title: string;
  position?: GridPosition;     // future drag‑and‑drop support
  data?: any;                  // cached API result
}

interface GridSize { columns: number; rows: number; }
interface GridPosition { column: number; row: number; }
interface DataFilter {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'includes' | 'contains';
  value: unknown;
}

// Aspect ratios supported by the grid layout
type AspectRatio = '2x2' | '2x3' | '3x2' | '2x6' | '6x2';
```

## Feature List
- **Dashboard Tab Management** – add, rename, delete, switch dashboards
- **Responsive CSS Grid** – auto‑sizing, uniform cell size, configurable aspect ratios
- **Card Types** – Heatmap, Correlation, Pie Chart visualisations
- **Card CRUD** – add, edit filters, delete with confirmation
- **Persistence** – automatic save/load via `plugin.persistDataSynced()` / `plugin.loadSyncedData()`
- **Internationalization** – all UI strings use `useTranslate()` and are defined in `i18n/`
- **Solid Store Architecture** – separate stores for dashboards and cards, reactive signals for UI updates

## Development
```bash
# Install vendor dependencies
npm run sp-deps:install

# Start dev server (Vite watches Solid files)
npm run dev

# Build for production
npm run build

# Package for Super Productivity Marketplace
npm run package
```

## Contributing
Feel free to submit PRs that add new card types, improve grid algorithms, or refine i18n strings. Follow the existing Solid.js + TypeScript conventions.
