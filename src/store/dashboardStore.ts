import { createStore } from 'solid-js/store';
import type { Dashboard, DashboardState, Card, CardSettings, CardSize, CardPosition } from './types';
import { repository } from './repository';

/**
 * SolidJS store managing dashboards.
 * All persistence goes through the repository.
 */
export const [dashboardState, setDashboardState] = createStore<DashboardState>({
  dashboards: [],
  activeDashboardId: null,
});

/** Load dashboards and active id from repository */
export async function loadDashboards(): Promise<void> {
  const dashboards = await repository.getAll();
  const activeId = await repository.getActiveDashboardId();
  setDashboardState({ dashboards, activeDashboardId: activeId });
}

/** Generate a simple unique id */
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export async function addDashboard(name = 'New Dashboard'): Promise<void> {
  const newDashboard: Dashboard = {
    id: genId(),
    name,
    cards: [],
    createdAt: Date.now(),
  };
  await repository.save(newDashboard);
  setDashboardState('dashboards', (ds) => [...ds, newDashboard]);
}

export async function deleteDashboard(id: string): Promise<void> {
  await repository.delete(id);
  setDashboardState('dashboards', (ds) => ds.filter((d) => d.id !== id));
  if (dashboardState.activeDashboardId === id) {
    await repository.setActiveDashboardId(null);
    setDashboardState('activeDashboardId', null);
  }
}

export async function renameDashboard(id: string, newName: string): Promise<void> {
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => (d.id === id ? { ...d, name: newName } : d)),
  );
  const dashboard = dashboardState.dashboards.find((d) => d.id === id);
  if (dashboard) {
    await repository.save({ ...dashboard, name: newName });
  }
}

export async function setActiveDashboard(id: string | null): Promise<void> {
  await repository.setActiveDashboardId(id);
  setDashboardState('activeDashboardId', id);
}

export async function addCard(
  dashboardId: string,
  type: Card['type'],
  size: CardSize = '2x2',
  position: CardPosition,
  settings: CardSettings = {},
): Promise<void> {
  const card: Card = {
    id: genId(),
    type,
    size,
    position,
    settings,
  };
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => (d.id === dashboardId ? { ...d, cards: [...d.cards, card] } : d)),
  );
  const dashboard = dashboardState.dashboards.find((d) => d.id === dashboardId);
  if (dashboard) {
    await repository.save({ ...dashboard, cards: [...dashboard.cards, card] });
  }
}

export async function updateCard(
  dashboardId: string,
  cardId: string,
  updates: Partial<Omit<Card, 'id'>>,
): Promise<void> {
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => {
      if (d.id !== dashboardId) return d;
      const newCards = d.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c));
      return { ...d, cards: newCards };
    }),
  );
  const dashboard = dashboardState.dashboards.find((d) => d.id === dashboardId);
  if (dashboard) {
    const updatedCards = dashboard.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c));
    await repository.save({ ...dashboard, cards: updatedCards });
  }
}

export async function deleteCard(dashboardId: string, cardId: string): Promise<void> {
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => {
      if (d.id !== dashboardId) return d;
      return { ...d, cards: d.cards.filter((c) => c.id !== cardId) };
    }),
  );
  const dashboard = dashboardState.dashboards.find((d) => d.id === dashboardId);
  if (dashboard) {
    const filtered = dashboard.cards.filter((c) => c.id !== cardId);
    await repository.save({ ...dashboard, cards: filtered });
  }
}
