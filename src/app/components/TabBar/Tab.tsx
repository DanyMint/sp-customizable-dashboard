// src/app/components/TabBar/Tab.tsx
/**
 * Tab component – represents a single dashboard tab.
 * Props: dashboardId (string) – the id of the dashboard this tab represents.
 * Uses dashboardState to read the dashboard name and active status.
 * Clicking the tab activates the dashboard via setActiveDashboard.
 */
import { dashboardState, setActiveDashboard } from '../../../store/dashboardStore';

export interface TabProps {
  dashboardId: string;
}

export function Tab(props: TabProps) {
  const dash = () => dashboardState.dashboards.find((d) => d.id === props.dashboardId);
  const isActive = () => dashboardState.activeDashboardId === props.dashboardId;

  // Simple label – dashboard name or placeholder if not found
  return (
    <button
      class="tab"
      classList={{ active: isActive() }}
      onClick={() => setActiveDashboard(props.dashboardId)}
    >
      {dash()?.name ?? 'Unnamed'}
    </button>
  );
}
