/**
 * Default dashboard configuration used when creating a new dashboard.
 */
import { v4 as uuid } from 'uuid';
import { Dashboard, Card } from '../store/types';

export const DEFAULT_DASHBOARD: Dashboard = {
  id: uuid(),
  title: 'New dashboard',
  name: 'New dashboard',
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  cards: [],
};

/**
 * Default card configuration used when adding a new card.
 */
export const DEFAULT_CARD: Card = {
  id: uuid(),
  title: 'New card',
  type: 'heatmap',
  size: '2x2',
  position: { col: 0, row: 0 },
  settings: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
