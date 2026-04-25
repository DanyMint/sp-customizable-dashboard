import { createSignal } from 'solid-js';
import { addCard } from '../../store/dashboardStore';
import type { CardType } from '../../store/types';
import './AddCardModal.css';

const CARD_TYPES: {type: CardType; label: string}[] = [
  {type: 'heatmap', label: 'Heatmap'},
  {type: 'correlation', label: 'Correlation Chart'},
  {type: 'stat-circle', label: 'Stat Circle'},
  {type: 'stat-line', label: 'Stat Line'},
];

export default function AddCardModal(props: {dashboardId: string}) {
  const [open, setOpen] = createSignal(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const onSelect = async (type: CardType) => {
    // For simplicity place at (0,0)
    await addCard(props.dashboardId, type, '2x2', {col:0,row:0}, {});
    closeModal();
  };

  return (
    <>
      <button class="add-card-btn" onClick={openModal}>＋ Add Card</button>
      {open() && (
        <div class="modal-backdrop" onClick={closeModal}>
          <div class="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Card Type</h3>
            <ul class="card-type-list">
              {CARD_TYPES.map((c) => (
                <li><button onClick={() => onSelect(c.type)}>{c.label}</button></li>
              ))}
            </ul>
            <button class="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
