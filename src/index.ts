// src/index.ts
import { Engine } from "./engine/Engine";
import { WorldState } from "./world/WorldState";
import { Grid } from "./world/Grid";
import { TemperatureDecaySystem } from "./systems/TemperatureDecaySystem";
import { SoilMoistureSystem } from "./systems/SoilMoistureSystem";

const grid = new Grid(10, 10);

// initialize like ONI does
for (let cell = 0; cell < grid.size; cell++) {
  grid.Element[cell] = 1;        // soil
  grid.Mass[cell] = 100;         // kg
  grid.Temperature[cell] = 20;   // °C
  grid.Moisture[cell] = 50;      // % moisture
  grid.Solid[cell] = 1;
}

const world = new WorldState(grid);
const engine = new Engine(world);

engine.register(new TemperatureDecaySystem());
engine.register(new SoilMoistureSystem());

engine.run(50);

console.log(
  engine.getState().grid.Temperature[grid.index(5, 5)],
  engine.getState().grid.Moisture[grid.index(5, 5)]
);
