// src/app/components/DashboardTabs/DashboardTabs.tsx
/**
 * DashboardTabs component – top‑level view for the dashboard UI.
 * Renders the TabBar and the GridContainer for the currently active dashboard.
 * Relies on `dashboardState` from the store to obtain the active dashboard.
 */
import { dashboardState } from '../../../store/dashboardStore';
import { Show } from 'solid-js';
import { TabBar } from '../TabBar/TabBar';
import { GridContainer } from '../GridContainer/GridContainer';

export function DashboardTabs() {
  const activeId = () => dashboardState.activeDashboardId;
  const activeDashboard = () =>
    dashboardState.dashboards.find((d) => d.id === activeId()) ?? null;

  return (
    <section class="dashboard-tabs">
      <TabBar />
      <Show when={activeDashboard()} fallback={<p>No dashboard selected.</p>}> {
        (dash) => (
          <GridContainer>
            {/* Placeholder – actual card grid will be rendered inside GridContainer */}
            <p>Dashboard {dash().name} content goes here.</p>
          </GridContainer>
        )
      } </Show>
    </section>
  );
}
