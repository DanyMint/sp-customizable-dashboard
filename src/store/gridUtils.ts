import type { Card, CardPosition, CardSize } from './types';

/**
 * Parse CardSize string into column and row counts.
 */
export function parseSizeToUnits(size: CardSize): { cols: number; rows: number } {
  const [colStr, rowStr] = size.split('x');
  return { cols: parseInt(colStr, 10), rows: parseInt(rowStr, 10) };
}

/**
 * Check if a cell at (col, row) is occupied by any card.
 */
export function isCellOccupied(cards: Card[], col: number, row: number, excludeId?: string): boolean {
  return cards.some((c) => {
    if (excludeId && c.id === excludeId) return false;
    const { cols, rows } = parseSizeToUnits(c.size);
    const startCol = c.position.col;
    const startRow = c.position.row;
    return col >= startCol && col < startCol + cols && row >= startRow && row < startRow + rows;
  });
}

/**
 * Determine if a card of given size can be placed at the position without overlapping existing cards.
 */
export function canPlaceCard(
  cards: Card[],
  position: CardPosition,
  size: CardSize,
  excludeId?: string,
): boolean {
  const { cols, rows } = parseSizeToUnits(size);
  // Ensure within 12-column grid
  if (position.col < 0 || position.row < 0) return false;
  if (position.col + cols > 12) return false;
  // Check each cell in the rectangle
  for (let c = position.col; c < position.col + cols; c++) {
    for (let r = position.row; r < position.row + rows; r++) {
      if (isCellOccupied(cards, c, r, excludeId)) {
        return false;
      }
    }
  }
  return true;
}
