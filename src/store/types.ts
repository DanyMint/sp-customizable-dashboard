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
  id: string;
  title: string;
  type: CardType;
  size: CardSize;
  position: CardPosition;
  settings: CardSettings;
  createdAt: number;
  updatedAt: number;
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
