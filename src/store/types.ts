export type CardType = 'heatmap' | 'correlation' | 'pie' | 'stat-circle' | 'stat-line';
export type CardSize = '2x2' | '2x3' | '3x2' | '2x6' | '6x2' | '4x6';

export interface CardPosition {
  col: number;
  row: number;
}

export interface CardSettings {
  dataSource?: string;
  filters?: Record<string, unknown>;
}

export interface Card {
  /** Human‑readable title of the card */
  title?: string;
  /** Creation timestamp (ISO string) */
  createdAt?: number;
  /** Last update timestamp (ISO string) */
  updatedAt?: number;
  /** Human‑readable title of the card */
  title: string;
  /** Creation timestamp (ISO string) */
  createdAt: number;
  /** Last update timestamp (ISO string) */
  updatedAt: number;
  id: string;
  type: CardType;
  size: CardSize;
  position: CardPosition;
  settings: CardSettings;
}

export interface Dashboard {
  /** Human‑readable name of the dashboard */
  title: string;
  /** Whether this dashboard is currently active */
  isActive: boolean;
  /** Last update timestamp (ISO string) */
  updatedAt: number;
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
}

export interface DashboardState {
  dashboards: Dashboard[];
  activeDashboardId: string | null;
}
