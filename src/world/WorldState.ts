// src/world/WorldState.ts
import { Grid } from "./Grid";
import { Plant } from "./Plant";

export class WorldState {
  readonly grid: Grid;
  readonly plants: Plant[];

  constructor(grid: Grid, plants: Plant[] = []) {
    this.grid = grid;
    this.plants = plants;
  }

  clone(): WorldState {
    return new WorldState(
      this.grid.clone(),
      this.plants.map(p => ({ ...p }))
    );
  }
}
