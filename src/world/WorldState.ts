// src/world/WorldState.ts
import { Grid } from "./Grid";
import { GridStatus } from "./GridStatus";
import { Plant } from "./Plant";

export class WorldState {
  readonly grid: Grid;
  readonly plants: Plant[];
  timeOfDay: number;     // 0..1
  dayLengthTicks: number;
  dayBaseTemp: number;
  nightBaseTemp: number;

  constructor(
    grid: Grid,
    plants: Plant[] = [],
    timeOfDay = 0,
    dayLengthTicks = 20,
    dayBaseTemp = 24,
    nightBaseTemp = 12
  ) {
    this.grid = grid;
    this.plants = plants;
    this.timeOfDay = timeOfDay;
    this.dayLengthTicks = dayLengthTicks;
    this.dayBaseTemp = dayBaseTemp;
    this.nightBaseTemp = nightBaseTemp;
  }

  clone(): WorldState {
    return new WorldState(
      this.grid.clone(),
      this.plants.map(p => ({ ...p })),
      this.timeOfDay,
      this.dayLengthTicks,
      this.dayBaseTemp,
      this.nightBaseTemp
    );
  }

  static initialize(grid: Grid): WorldState {  
    
    for (let cell = 0; cell < grid.size; cell++) {
      grid.Moisture[cell] = 0.5;
      grid.NPK[cell] = 0.5;
      grid.Light[cell] = 1000;
      grid.Temperature[cell] = 20;
      grid.ExposedToSunlight[cell] = 1;
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
        tempAccumulator: 0,
        tempSamples: 0,
        isDormant: false,
      },
    ]);
  }

   getGridStatus(): GridStatus {
    const g = this.grid;
    const n = g.size;

    let minMoisture = Infinity;
    let maxMoisture = -Infinity;
    let sumMoisture = 0;

    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let sumTemp = 0;

    let minLight = Infinity;
    let maxLight = -Infinity;
    let sumLight = 0;

    for (let cell = 0; cell < n; cell++) {
      const m = g.Moisture[cell] ?? 0;
      minMoisture = Math.min(minMoisture, m);
      maxMoisture = Math.max(maxMoisture, m);
      sumMoisture += m;

      const t = g.Temperature[cell] ?? 0;
      minTemp = Math.min(minTemp, t);
      maxTemp = Math.max(maxTemp, t);
      sumTemp += t;

      const l = g.Light[cell] ?? 0;
      minLight = Math.min(minLight, l);
      maxLight = Math.max(maxLight, l);
      sumLight += l;
    }

    return {
      size: n,
      moisture: {
        min: minMoisture,
        max: maxMoisture,
        avg: sumMoisture / n,
      },
      temperature: {
        min: minTemp,
        max: maxTemp,
        avg: sumTemp / n,
      },
      light: {
        min: minLight,
        max: maxLight,
        avg: sumLight / n,
      },
    };
  }
}
