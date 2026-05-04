// src/app/components/AddDashboardButton/AddDashboardButton.tsx
/**
 * AddDashboardButton – opens a modal to input a dashboard title and creates it.
 */
import { createSignal } from 'solid-js';
import { addDashboard } from '../../../store/dashboardStore';

export function AddDashboardButton() {
  const [open, setOpen] = createSignal(false);
  const [title, setTitle] = createSignal('');

  const openModal = () => setOpen(true);
  const closeModal = () => {
    setOpen(false);
    setTitle('');
  };

  const onConfirm = async () => {
    const name = title().trim() || 'New Dashboard';
    await addDashboard(name);
    closeModal();
  };

  return (
    <>
      <button class="add-dashboard-btn" onClick={openModal}>
        Add Dashboard
      </button>
      {open() && (
        <div class="modal-backdrop" onClick={closeModal}>
          <div class="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Dashboard</h3>
            <input
              type="text"
              placeholder={'Dashboard name'}
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
            />
            <button onClick={onConfirm}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
