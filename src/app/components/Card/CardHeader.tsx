// src/app/components/Card/CardHeader.tsx
/**
 * CardHeader – displays the card title and action buttons (edit/delete).
 * Props: { title: string }
 */
export function CardHeader(props: { title: string }) {
  return (
    <header class="card-header">
      <h3>{props.title}</h3>
      <div class="card-actions">
        <button class="edit-btn" aria-label="Edit">✎</button>
        <button class="delete-btn" aria-label="Delete">✕</button>
      </div>
    </header>
  );
}
