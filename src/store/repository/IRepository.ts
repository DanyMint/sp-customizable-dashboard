import type { Dashboard } from '../types';

export interface DashboardRepository {
  /** Retrieve all dashboards */
  getAll(): Promise<Dashboard[]>;
  /** Save (add or update) a dashboard */
  save(dashboard: Dashboard): Promise<void>;
  /** Delete a dashboard by id */
  delete(id: string): Promise<void>;
  /** Get currently active dashboard id */
  getActiveDashboardId(): Promise<string | null>;
  /** Set active dashboard id (or null) */
  setActiveDashboardId(id: string | null): Promise<void>;
}
