# Claude Code Prompt: Architecture Review & Setup

**Objective**: Review the current project structure, compare it against the target architecture, and update documentation.

## Task Overview

You need to:
1. **Review** the current structure of the plugin
2. **Compare** it against the desired architecture described below
3. **Document** findings and gaps in `README.md` (target structure)
4. **Document** current vs. desired state in `CLAUDE.md` (technical setup guide)

---

## Current Structure

The project is initialized with:

```
src/
├── assets/                  # Static assets
├── app/                     # Solid.js app components (empty)
├── store/                   # State management (empty)
├── utils/                   # Helper utilities (empty)
├── index.html               # HTML entry
├── index.tsx                # App bootstrap
├── plugin.ts                # Super Productivity plugin logic
└── manifest.json            # Plugin metadata

i18n/                         # Translations (empty)
scripts/                      # Build utilities
sp-deps/                      # Vendored dependencies
```

---

## Target Architecture

The plugin should implement a customizable dashboard with the following structure:

### Component Hierarchy

```
App (root)
├── DashboardTabs (manages dashboard/tab state + layout)
│   ├── TabBar (displays dashboards as tabs)
│   │   ├── Tab (individual dashboard tab)
│   │   │   ├── DashboardName
│   │   │   └── Actions (rename, delete)
│   │   └── AddDashboardButton
│   └── GridContainer (CSS Grid layout for cards)
│       ├── CardGrid (manages card rendering)
│       │   ├── Card (renders individual card)
│       │   │   ├── CardContent (type-specific rendering)
│       │   │   │   ├── HeatmapCard
│       │   │   │   ├── CorrelationCard
│       │   │   │   └── PieChartCard
│       │   │   ├── CardHeader (title + actions)
│       │   │   └── CardFilters (filter UI)
│       │   └── AddCardButton
│       └── GridSettings (responsive layout config)
```

### File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── DashboardTabs/
│   │   │   ├── DashboardTabs.tsx
│   │   │   └── DashboardTabs.css
│   │   ├── TabBar/
│   │   │   ├── TabBar.tsx
│   │   │   ├── Tab.tsx
│   │   │   ├── AddDashboardButton.tsx
│   │   │   └── TabBar.css
│   │   ├── GridContainer/
│   │   │   ├── GridContainer.tsx
│   │   │   ├── CardGrid.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CardHeader.tsx
│   │   │   ├── CardFilters.tsx
│   │   │   ├── AddCardButton.tsx
│   │   │   ├── GridSettings.tsx
│   │   │   └── GridContainer.css
│   │   └── CardTypes/
│   │       ├── HeatmapCard.tsx
│   │       ├── CorrelationCard.tsx
│   │       └── PieChartCard.tsx
│   ├── App.tsx             # Main app (orchestrates DashboardTabs)
│   └── App.css
├── store/
│   ├── dashboardStore.ts   # Solid.js store for dashboard state
│   ├── cardStore.ts        # Solid.js store for card state
│   └── types.ts            # TypeScript interfaces
├── utils/
│   ├── useTranslate.ts     # i18n hook
│   ├── gridUtils.ts        # CSS Grid calculations
│   ├── persistence.ts      # Save/load dashboard config
│   └── defaults.ts         # Default configurations
├── index.html
├── index.tsx
├── plugin.ts               # Plugin logic (hooks, persistence, communication)
└─�� manifest.json
```

### Data Model

```typescript
// types.ts
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
  gridSize: GridSize;
  filters: DataFilter[];
  title: string;
  position?: GridPosition; // auto or manual (for future dragging)
  data?: any; // cached card data
}

interface GridSize {
  columns: number;
  rows: number;
}

interface GridPosition {
  column: number;
  row: number;
}

interface DataFilter {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'includes' | 'contains';
  value: unknown;
}

// Grid aspect ratios
type AspectRatio = '2x2' | '2x3' | '3x2' | '2x6' | '6x2';
```

### Key Features

**Dashboard Tab Management:**
- Add new dashboard → creates empty dashboard with default name
- Rename dashboard → edit mode on tab
- Delete dashboard → with confirmation
- Switch dashboard → updates grid content

**Grid Layout:**
- Auto-sizing CSS Grid (no horizontal scroll)
- Responsive: calculates grid columns based on viewport width
- Cells normalize to uniform size (e.g., 100px × 100px minimum)
- Card grid sizes in multiples: 2×2 = 200×200px, 3×2 = 300×200px, etc.

**Card Management:**
- Add card → modal/dialog to select type and size
- Delete card → with confirmation
- Edit filters → inline or modal UI
- Card types render appropriate visualizations (heatmap, correlation, pie chart)

**Data Persistence:**
- Save dashboard config to Super Productivity storage via `plugin.persistDataSynced()`
- Load on plugin init via `plugin.loadSyncedData()`
- Auto-save on every dashboard/card change

**Internationalization:**
- Dashboard actions: "New Dashboard", "Rename", "Delete"
- Card actions: "Add Card", "Delete", "Edit Filters"
- Card types: "Heatmap", "Correlation", "Pie Chart"
- Filters: "Field", "Operator", "Value"

---

## What Needs to be Done

### Phase 1: Documentation & Architecture Setup (ClaudeCode)
- [ ] Review current vs. target structure
- [ ] Update `README.md` with:
  - Target component hierarchy (diagram)
  - Target file structure
  - Data model (TypeScript interfaces)
  - Feature list
- [ ] Update `CLAUDE.md` with:
  - Current state summary
  - Gaps/missing pieces
  - Technical decisions (state management, grid logic, etc.)
  - Step-by-step implementation plan
  - Key challenges & solutions

### Phase 2: Core Infrastructure (to be done separately)
- Set up store files with TypeScript interfaces
- Implement dashboard persistence layer
- Create default dashboard/card configurations

### Phase 3: Component Implementation
- Build TabBar + Tab components
- Build GridContainer + CardGrid components
- Build Card component with type-specific renders
- Implement filter UI

### Phase 4: Integration & Polish
- Connect UI to store
- Implement all CRUD operations
- Add i18n strings
- Test persistence & recovery

---

## Deliverables

### README.md Updates

Add/update the following sections:

1. **Architecture Overview**
   - Component hierarchy (tree diagram)
   - Data flow description

2. **Component Guide**
   - Brief description of each major component
   - Key props/interfaces
   - Relationship to other components

3. **File Structure**
   - Complete tree of target structure
   - Brief explanation of each folder/file

4. **Data Model**
   - TypeScript interface definitions
   - Example dashboard/card objects

5. **Grid Layout System**
   - How CSS Grid is used
   - Responsive sizing strategy
   - Aspect ratio system

### CLAUDE.md Updates

Add/update the following sections:

1. **Current State Summary**
   - What exists now
   - What is scaffolded but empty

2. **Gaps & Missing Pieces**
   - List what needs to be built
   - Priority order

3. **Technical Decisions**
   - Why Solid.js store (not Context API)
   - Why CSS Grid (not flexbox)
   - Persistence strategy
   - i18n approach

4. **Implementation Plan**
   - Phase breakdown
   - Step-by-step tasks
   - Dependencies between tasks

5. **Key Challenges & Solutions**
   - Grid overflow prevention
   - Responsive grid sizing
   - Persistence & recovery
   - Potential pitfalls

6. **Store Structure**
   - How dashboard store is organized
   - How card store is organized
   - Communication between stores
   - Example store usage in components

7. **Component Responsibilities**
   - One-liner for each major component
   - What each component owns vs. receives

---

## Review Checklist

Before submitting, verify:

- [ ] `README.md` contains complete component hierarchy
- [ ] `README.md` shows target file structure (not current)
- [ ] `README.md` includes TypeScript interface definitions
- [ ] `CLAUDE.md` documents current vs. target state clearly
- [ ] `CLAUDE.md` explains all design decisions
- [ ] `CLAUDE.md` provides an actionable implementation plan
- [ ] Both files are written for a developer (DanyMintIncluded) to use next
- [ ] No contradictions between `README.md` and `CLAUDE.md`
- [ ] All aspect ratios (2x2, 2x3, 3x2, 2x6, 6x2) are documented
- [ ] Grid layout strategy is clearly explained

---

## Reference: Architecture Visualization

```
┌─────────────────────────────────────────────────────────┐
│                       App.tsx                            │
│  ┌────────────────────────────────────────────────────┐ │
│  │          DashboardTabs (State Manager)             │ │
│  │  ┌─────────────────────────────────────────────┐  │ │
│  │  │  TabBar (Select Active Dashboard)           │  │ │
│  │  │  [Tab][Tab][Tab][+]                         │  │ │
│  │  └─────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────┐  │ │
│  │  │  GridContainer (Renders Cards for Active)   │  │ │
│  │  │  ┌──────────┬──────────┬──────────┐         │  │ │
│  │  │  │  Card    │  Card    │  Card    │         │  │ │
│  │  │  │ (2x2)    │ (3x2)    │ (2x3)    │         │  │ │
│  │  │  └──────────┴──────────┴──────────┘         │  │ │
│  │  │  ┌──────────┬──────────┐                    │  │ │
│  │  │  │  Card    │  [+]     │                    │  │ │
│  │  │  │ (2x2)    │          │                    │  │ │
│  │  │  └──────────┴──────────┘                    │  │ │
│  │  └─────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Notes for Claude Code

- **You are not writing code yet**, just documentation.
- **Assumptions**: Assume Solid.js store pattern (reactive signals + stores).
- **Scope**: This review should take 15-30 minutes. If it's taking longer, focus on the main sections.
- **Tone**: Write for a developer who understands React/Vue but may be new to Solid.js.
- **Clarity**: Use concrete examples (not abstract theory) where possible.
- **Completeness**: Ensure the next developer (or yourself later) can pick up Phase 2 without ambiguity.

Good luck! 🚀
