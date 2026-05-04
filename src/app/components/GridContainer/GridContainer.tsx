// src/app/components/GridContainer/GridContainer.tsx
/**
 * GridContainer – a responsive CSS‑grid wrapper.
 * Accepts child elements and calculates column count based on viewport width.
 * Uses `calculateColumns` from utils/gridUtils if available; otherwise defaults to 4 columns.
 */
import { onMount } from 'solid-js';
import { calculateColumns } from '../../../utils/gridUtils.ts';

export interface GridContainerProps {
  children: any;
}

export function GridContainer(props: GridContainerProps) {
  let containerRef: HTMLElement | undefined;
  const cols = () => {
    if (typeof window !== 'undefined') {
      return calculateColumns(window.innerWidth);
    }
    return 4;
  };

  // Simple effect to set CSS variable for columns on mount and resize
  onMount(() => {
    const update = () => {
      if (containerRef) {
        containerRef.style.setProperty('--grid-columns', String(cols()));
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  });

  return (
    <section ref={containerRef} class="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(var(--grid-columns, 4), 1fr)', gap: '8px' }}>
      {props.children}
    </section>
  );
}
