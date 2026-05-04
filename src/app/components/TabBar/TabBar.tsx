// src/app/components/TabBar/TabBar.tsx
/**
 * TabBar component – renders a horizontal list of dashboard tabs and an AddDashboardButton.
 */
import { For, createSignal, Show } from 'solid-js';
import { Tab } from './Tab';
import { AddDashboardButton } from '../AddDashboardButton/AddDashboardButton';
import { dashboardState, renameDashboard, deleteDashboard, setActiveDashboard } from '../../../store/dashboardStore';

export function TabBar() {
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [editName, setEditName] = createSignal('');

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
  const handleKeyDown = (e: KeyboardEvent) => {
    const tabs = dashboardState.dashboards;
    const activeIdx = tabs.findIndex((d) => d.id === dashboardState.activeDashboardId);
    if (e.key === 'ArrowRight') {
      const next = tabs[(activeIdx + 1) % tabs.length];
      setActiveDashboard(next.id);
    } else if (e.key === 'ArrowLeft') {
      const prev = tabs[(activeIdx - 1 + tabs.length) % tabs.length];
      setActiveDashboard(prev.id);
    } else if (e.key === 'Home') {
      if (tabs.length) setActiveDashboard(tabs[0].id);
    } else if (e.key === 'End') {
      if (tabs.length) setActiveDashboard(tabs[tabs.length - 1].id);
    }
  };

  return (
    <nav class="tab-bar" role="tablist" onKeyDown={handleKeyDown}>
      <For each={dashboardState.dashboards}>
        {(dash) => (
          <div class="tab-wrapper">
            <Show when={editingId() === dash.id} fallback={
              <Tab dashboardId={dash.id} />
            }>
              <input
                type="text"
                value={editName()}
                onInput={(e) => setEditName(e.currentTarget.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmRename(dash.id)}
                onBlur={() => confirmRename(dash.id)}
                autofocus
              />
            </Show>
            {/* rename button */}
            <button
              class="rename"
              onClick={(e) => {
                e.stopPropagation();
                startRename(dash.id, dash.name);
              }}
            >✎</button>
            {/* delete button */}
            <button
              class="close"
              onClick={(e) => {
                e.stopPropagation();
                deleteDashboard(dash.id);
              }}
            >✕</button>
          </div>
        )}
      </For>
      <AddDashboardButton />
    </nav>
  );
}
