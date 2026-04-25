import type { Dashboard } from '../types';
import type { DashboardRepository } from './IRepository';

/**
 * Repository that persists dashboards in browser localStorage.
 * Uses the key "sp-plugin-dashboards".
 * All methods are async to keep a consistent API.
 */
export class LocalStorageRepository implements DashboardRepository {
  private readonly storageKey = 'sp-plugin-dashboards';

  private async getData(): Promise<{ dashboards: Dashboard[]; activeDashboardId: string | null }> {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
    if (!raw) {
      return { dashboards: [], activeDashboardId: null };
    }
    try {
      return JSON.parse(raw);
    } catch {
      // Corrupt data – reset
      return { dashboards: [], activeDashboardId: null };
    }
  }

  private async setData(data: { dashboards: Dashboard[]; activeDashboardId: string | null }): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  async getAll(): Promise<Dashboard[]> {
    const { dashboards } = await this.getData();
    return dashboards;
  }

  async save(dashboard: Dashboard): Promise<void> {
    const { dashboards } = await this.getData();
    const idx = dashboards.findIndex((d) => d.id === dashboard.id);
    if (idx >= 0) {
      dashboards[idx] = dashboard;
    } else {
      dashboards.push(dashboard);
    }
    await this.setData({ dashboards, activeDashboardId: (await this.getActiveDashboardId()) });
  }

  async delete(id: string): Promise<void> {
    const { dashboards, activeDashboardId } = await this.getData();
    const filtered = dashboards.filter((d) => d.id !== id);
    const newActive = activeDashboardId === id ? null : activeDashboardId;
    await this.setData({ dashboards: filtered, activeDashboardId: newActive });
  }

  async getActiveDashboardId(): Promise<string | null> {
    const { activeDashboardId } = await this.getData();
    return activeDashboardId;
  }

  async setActiveDashboardId(id: string | null): Promise<void> {
    const { dashboards } = await this.getData();
    await this.setData({ dashboards, activeDashboardId: id });
  }
}
