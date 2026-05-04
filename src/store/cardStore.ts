import { dashboardState, setDashboardState } from './dashboardStore';
import type { Card, CardSettings, CardSize, CardPosition } from './types';

/** Add a card to the active dashboard */
export async function addCard(
  type: Card['type'],
  size: CardSize = '2x2',
  position: CardPosition,
  settings: CardSettings = {},
): Promise<void> {
  const activeId = dashboardState.activeDashboardId;
  if (!activeId) return;
  const card: Card = {
    id: crypto.randomUUID(),
    title: 'New card',
    type,
    size,
    position,
    settings,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => (d.id === activeId ? { ...d, cards: [...d.cards, card] } : d)),
  );
}

/** Update an existing card on the active dashboard */
export async function updateCard(
  cardId: string,
  updates: Partial<Omit<Card, 'id'>>,
): Promise<void> {
  const activeId = dashboardState.activeDashboardId;
  if (!activeId) return;
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => {
      if (d.id !== activeId) return d;
      const newCards = d.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c));
      return { ...d, cards: newCards };
    }),
  );
}

/** Remove a card from the active dashboard */
export async function removeCard(cardId: string): Promise<void> {
  const activeId = dashboardState.activeDashboardId;
  if (!activeId) return;
  setDashboardState('dashboards', (ds) =>
    ds.map((d) => {
      if (d.id !== activeId) return d;
      const filtered = d.cards.filter((c) => c.id !== cardId);
      return { ...d, cards: filtered };
    }),
  );
}
