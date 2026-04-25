import { For } from 'solid-js';
import type { Dashboard } from '../../store/types';
import CardComponent from './Card';
import './DashboardGrid.css';

import { updateCard } from '../../store/dashboardStore';
import { canPlaceCard } from '../../store/gridUtils';
export default function DashboardGrid(props: { dashboard: Dashboard }) {
  const cellSize = 80; // px per grid unit
  const gap = 8;

  const getStyle = (card: Card) => {
    const { cols, rows } = parseSize(card.size);
    const left = card.position.col * (cellSize + gap);
    const top = card.position.row * (cellSize + gap);
    const width = cols * cellSize + (cols - 1) * gap;
    const height = rows * cellSize + (rows - 1) * gap;
    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const parseSize = (size: string) => {
    const [c, r] = size.split('x').map((v) => parseInt(v, 10));
    return { cols: c, rows: r };
  };

  return (
    <div class="dashboard-grid" style={{ position: 'relative', height: '100%', minHeight: '400px' }} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <For each={props.dashboard.cards}>
        {(card) => <CardComponent card={card} style={getStyle(card)} />}
      </For>
    </div>
  );
}
