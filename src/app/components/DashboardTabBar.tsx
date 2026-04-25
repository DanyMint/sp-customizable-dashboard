import { For, Show, createSignal } from 'solid-js';
import { dashboardState, loadDashboards, addDashboard, deleteDashboard, renameDashboard, setActiveDashboard } from '../../store/dashboardStore';
import './DashboardTabBar.css';

export default function DashboardTabBar() {
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [editName, setEditName] = createSignal('');

  // Load dashboards on mount
  loadDashboards();

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const confirmRename = async (id: string) => {
    const newName = editName().trim();
    if (newName) {
      await renameDashboard(id, newName);
    }
    setEditingId(null);
  };

  return (
    <div class="dashboard-tab-bar">
      <For each={dashboardState.dashboards}>
        {(dash) => (
          <div
            class="tab"
            classList={{ active: dash.id === dashboardState.activeDashboardId }}
            onClick={() => setActiveDashboard(dash.id)}
          >
            <Show when={editingId() === dash.id} fallback={dash.name}>
              <input
                type="text"
                value={editName()}
                onInput={(e) => setEditName(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmRename(dash.id)}
                onBlur={() => confirmRename(dash.id)}
                autofocus
              />
            </Show>
            <button class="close" onClick={(e) => { e.stopPropagation(); deleteDashboard(dash.id); }}>
              ✕
            </button>
            <button class="rename" onDblClick={(e) => { e.stopPropagation(); startRename(dash.id, dash.name); }}>
              ✎
            </button>
          </div>
        )}
      </For>
      <button class="add" onClick={() => addDashboard('New Dashboard')}>
        ＋
      </button>
    </div>
  );
}
