/**
 * Persistence utilities for the dashboard plugin.
 * Uses Super Productivity's `plugin.persistDataSynced` and `plugin.loadSyncedData`
 * to store and retrieve JSON‑serialisable data.
 */

declare const plugin: any; // Global PluginAPI injected at runtime

/** Save an arbitrary object (e.g., the dashboard store) */
export async function saveDashboardState(state: unknown): Promise<void> {
  const payload = JSON.stringify(state);
  await plugin.persistDataSynced(payload);
}

/** Load previously saved state. Returns parsed JSON or null if nothing stored. */
export async function loadDashboardState<T = unknown>(): Promise<T | null> {
  const raw = await plugin.loadSyncedData();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // If parsing fails, return null so callers can fallback to defaults
    return null;
  }
}
