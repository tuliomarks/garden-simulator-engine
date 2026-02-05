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

  static initialize(grid: Grid): WorldState {  
    
    for (let cell = 0; cell < grid.size; cell++) {
      grid.Moisture[cell] = 0.5;
      grid.NPK[cell] = 0.5;
      grid.Light[cell] = 1000;
      grid.Temperature[cell] = 20;
    }

    return new WorldState(grid, [
      {
        id: "plant-1",
        cell: grid.index(5, 5),
        speciesId: 1,
        growth: 0,
        health: 1,
        absorbedMoisture: 0,
        absorbedNutrients: 0,
      },
    ]);
  }
}
