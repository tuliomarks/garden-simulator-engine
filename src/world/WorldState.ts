// src/world/WorldState.ts
import { Grid } from "./Grid";
import { GridStatus } from "./GridStatus";
import { Plant } from "./Plant";
import { WeatherType } from "./WeatherType";

export class WorldState {
  readonly grid: Grid;
  plants: Plant[];
  timeOfDay: number;     // 0..1
  dayLengthTicks: number;
  dayBaseTemp: number;
  nightBaseTemp: number;
  weather: WeatherType;
  weatherDurationTicks: number;

  constructor(
    grid: Grid,
    timeOfDay = 0,
    dayLengthTicks = 20,
    dayBaseTemp = 24,
    nightBaseTemp = 12,
    weather = WeatherType.CLEAR,
    weatherDurationTicks = 0
  ) {
    this.grid = grid;
    this.plants = [];
    this.timeOfDay = timeOfDay;
    this.dayLengthTicks = dayLengthTicks;
    this.dayBaseTemp = dayBaseTemp;
    this.nightBaseTemp = nightBaseTemp;
    this.weather = weather;
    this.weatherDurationTicks = weatherDurationTicks;
  }

  clone(): WorldState {
    const newWorldState = new WorldState(
      this.grid.clone(),
      this.timeOfDay,
      this.dayLengthTicks,
      this.dayBaseTemp,
      this.nightBaseTemp,
      this.weather,
      this.weatherDurationTicks
    );
    newWorldState.plants = this.plants.map(p => ({...p}));
    return newWorldState;
  }

  static initialize(grid: Grid): WorldState {  
    
    for (let cell = 0; cell < grid.size; cell++) {
      grid.Moisture[cell] = 0.5;
      grid.NPK[cell] = 0.5;
      grid.Light[cell] = 1000;
      grid.Temperature[cell] = 20;
      grid.ExposedToSunlight[cell] = 1;
    }

    // Pick initial weather randomly (2-5 in-game days duration)
    const weatherTypes = Object.values(WeatherType);
    const initialWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const daysLength = 20; // dayLengthTicks
    const minDays = 2;
    const maxDays = 5;
    const weatherDurationTicks = (minDays + Math.random() * (maxDays - minDays)) * daysLength;
    const worldState = new WorldState(grid, 0, 20, 24, 12, initialWeather, weatherDurationTicks);

    //worldState.instantiatePlants();
    
    return worldState;
  }

  instantiatePlants(): Plant[] { 

    this.plants.push(
      {
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
      }
    );

    return this.plants;
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
