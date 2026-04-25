import { Show } from 'solid-js';
import { dashboardState } from '../../store/dashboardStore';
import DashboardGrid from './DashboardGrid';
import AddCardModal from './AddCardModal';
import './DashboardView.css';

export default function DashboardView() {
  const active = () => dashboardState.dashboards.find((d) => d.id === dashboardState.activeDashboardId);

  return (
    <Show when={active()} fallback={<div class="no-dashboard">Select or create a dashboard.</div>}>
      {(dash) => (
        <div class="dashboard-view">
          <DashboardGrid dashboard={dash()} />
          <AddCardModal dashboardId={dash().id} />
        </div>
      )}
    </Show>
  );
}
