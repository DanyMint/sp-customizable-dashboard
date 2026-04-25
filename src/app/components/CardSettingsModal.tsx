import { createSignal } from 'solid-js';
import { updateCard, deleteCard } from '../../store/dashboardStore';
import type { Card, CardSize } from '../../store/types';
import './CardSettingsModal.css';

export default function CardSettingsModal(props: { card: Card; dashboardId: string; onClose: () => void }) {
  const [size, setSize] = createSignal<CardSize>(props.card.size);
  const [dataSource, setDataSource] = createSignal(props.card.settings.dataSource || '');
  const [filters, setFilters] = createSignal(JSON.stringify(props.card.settings.filters || {}));

  const save = async () => {
    const newSettings = {
      dataSource: dataSource() || undefined,
      filters: filters() ? JSON.parse(filters()) : undefined,
    };
    await updateCard(props.dashboardId, props.card.id, { size: size(), settings: newSettings });
    props.onClose();
  };

  const remove = async () => {
    await deleteCard(props.dashboardId, props.card.id);
    props.onClose();
  };

  return (
    <div class="modal-backdrop" onClick={props.onClose}>
      <div class="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Card Settings</h3>
        <label>
          Size:
          <select value={size()} onChange={(e) => setSize(e.currentTarget.value as CardSize)}>
            <option value="2x2">2x2</option>
            <option value="2x4">2x4</option>
            <option value="2x6">2x6</option>
            <option value="4x6">4x6</option>
          </select>
        </label>
        <label>
          Data source:
          <input type="text" value={dataSource()} onInput={(e) => setDataSource(e.currentTarget.value)} />
        </label>
        <label>
          Filters (JSON):
          <textarea value={filters()} onInput={(e) => setFilters(e.currentTarget.value)} />
        </label>
        <button onClick={save}>Save</button>
        <button onClick={remove} style={{ color: 'red' }}>
          Delete Card
        </button>
        <button onClick={props.onClose}>Cancel</button>
      </div>
    </div>
  );
}
