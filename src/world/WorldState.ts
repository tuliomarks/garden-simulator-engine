// src/world/WorldState.ts
import { Grid } from "./Grid.ts";
import { GridStatus } from "./GridStatus.ts";
import { Plant } from "./Plant.ts";
import { WeatherType } from "./WeatherType.ts";

export class WorldState {
  readonly grid: Grid;
  plants: Plant[];
  day: number;
  timeOfDay: number;     // 0..1
  dayLengthTicks: number;
  dayBaseTemp: number;
  nightBaseTemp: number;
  weather: WeatherType;
  weatherDurationTicks: number;
  weatherTotalDurationTicks: number;

  constructor(
    grid: Grid,
    day = 0,
    timeOfDay = 0,
    dayLengthTicks = 3000,
    dayBaseTemp = 24,
    nightBaseTemp = 12,
  ) {
    this.grid = grid;
    this.plants = [];
    this.day = day;
    this.timeOfDay = timeOfDay;
    this.dayLengthTicks = dayLengthTicks;
    this.dayBaseTemp = dayBaseTemp;
    this.nightBaseTemp = nightBaseTemp;

    this.weather = WeatherType.CLEAR;
    this.weatherDurationTicks = 0;
    this.weatherTotalDurationTicks = 0;
  }

  clone(): WorldState {
    const newWorldState = new WorldState(
      this.grid.clone(),
      this.timeOfDay,
      this.dayLengthTicks,
      this.dayBaseTemp,
      this.nightBaseTemp
    );
    newWorldState.weather = this.weather;
    newWorldState.weatherDurationTicks = this.weatherDurationTicks;
    newWorldState.weatherTotalDurationTicks = this.weatherTotalDurationTicks;
    newWorldState.plants = this.plants.map((p) => ({ ...p }));
    return newWorldState;
  }

  static initialize(grid: Grid): WorldState {
    for (let cell = 0; cell < grid.size; cell++) {
      grid.Moisture[cell] = 0.5;
      grid.NPK[cell] = 0.5;
      grid.Temperature[cell] = 20;
      grid.ExposedToSunlight[cell] = 1;
    }

    const worldState = new WorldState(grid);

    // worldState.instantiatePlants();

    return worldState;
  }

  instantiatePlants(): Plant[] {
    this.plants.push({
      id: "plant-1",
      cell: this.grid.index(5, 5),
      speciesId: 1,
      growth: 0,
      health: 1,
      absorbedMoisture: 0,
      absorbedNutrients: 0,
      tempAccumulator: 0,
      tempSamples: 0,
      isDormant: false,
    });

    return this.plants;
  }

  getGridStatus(): GridStatus {
    const g = this.grid;
    const n = g.size;

    let minMoisture = Infinity;
    let maxMoisture = -Infinity;
    let sumMoisture = 0;

    let minNutrient = Infinity;
    let maxNutrient = -Infinity;
    let sumNutrient = 0;

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

      const nutr = g.NPK[cell] ?? 0;
      minNutrient = Math.min(minNutrient, nutr);
      maxNutrient = Math.max(maxNutrient, nutr);
      sumNutrient += nutr;

      const t = g.Temperature[cell] ?? 0;
      minTemp = Math.min(minTemp, t);
      maxTemp = Math.max(maxTemp, t);
      sumTemp += t;

      const l = g.ExposedToSunlight[cell] ?? 0;
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
      nutrients: {
        min: minNutrient,
        max: maxNutrient,
        avg: sumNutrient / n,
      },
    };
  }
}