import { createSignal } from 'solid-js';
import type { Card as CardType } from '../../store/types';
import { updateCard } from '../../store/dashboardStore';
import './Card.css';

export default function CardComponent(props: { card: CardType; style: any }) {
  const [showSettings, setShowSettings] = createSignal(false);

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer?.setData('text/plain', props.card.id);
  };

  const openSettings = (e: MouseEvent) => {
    e.stopPropagation();
    setShowSettings(true);
  };

  // Placeholder bodies
  const renderBody = () => {
    switch (props.card.type) {
      case 'heatmap':
        return <div class="placeholder heatmap" />;
      case 'correlation':
        return <div class="placeholder correlation" />;
      case 'stat-circle':
        return <div class="placeholder stat-circle" />;
      case 'stat-line':
        return <div class="placeholder stat-line" />;
      default:
        return null;
    }
  };

  return (
    <div class="card" style={props.style} draggable="true" onDragStart={onDragStart}>
      <div class="card-header">
        <span class="card-type">{props.card.type}</span>
        <button class="card-settings" onClick={openSettings}>⋯</button>
      </div>
      <div class="card-body">{renderBody()}</div>
      {/* Settings modal placeholder */}
      {showSettings() && (
        <div class="card-settings-modal" onClick={() => setShowSettings(false)}>
          {/* In a full implementation, settings UI would go here */}
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Card Settings (stub)</h3>
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
