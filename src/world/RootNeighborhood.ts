// src/world/RootNeighborhood.ts
import { Grid } from "./Grid";

export function rootCells(
  grid: Grid,
  centerCell: number,
  radius: number
): number[] {
  const cx = centerCell % grid.width;
  const cy = Math.floor(centerCell / grid.width);

  const cells: number[] = [];

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = cx + dx;
      const y = cy + dy;

      if (!grid.inBounds(x, y)) continue;

      const cell = grid.index(x, y);
      cells.push(cell);
    }
  }

  return cells;
}
