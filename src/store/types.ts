export type CardType = 'heatmap' | 'correlation' | 'stat-circle' | 'stat-line';
export type CardSize = '2x2' | '2x4' | '2x6' | '4x6';

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
  type: CardType;
  size: CardSize;
  position: CardPosition;
  settings: CardSettings;
}

export interface Dashboard {
  id: string;
  name: string;
  cards: Card[];
  createdAt: number;
}

export interface DashboardState {
  dashboards: Dashboard[];
  activeDashboardId: string | null;
}
