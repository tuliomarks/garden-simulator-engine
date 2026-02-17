import { Engine } from "./engine/Engine";
import { WorldState } from "./world/WorldState";
import { Grid } from "./world/Grid";
import { PlantMetabolismSystem } from "./systems/PlantMetabolismSystem";
import { PlantGrowthSystem } from "./systems/PlantGrowthSystem";
import { SoilMoistureSystem } from "./systems/SoilMoistureSystem";
import { MoistureDiffusionSystem } from "./systems/MoistureDiffusionSystem";
import { WorldTimeSystem } from "./systems/WorldTimeSystem";
import { TileTemperatureSystem } from "./systems/TileTemperatureSystem";
import { WeatherSystem } from "./systems/WeatherSystem";
import { NutrientRegenerationSystem } from "./systems/NutrientRegenerationSystem";

const grid = new Grid(10, 10);
const world = WorldState.initialize(grid);

/* ---------------------------------- */
/* ENGINE INITIZATION                 */
/* ---------------------------------- */

const engine = new Engine(world);
engine.register(new WorldTimeSystem());
engine.register(new WeatherSystem());
engine.register(new SoilMoistureSystem());
engine.register(new MoistureDiffusionSystem());
engine.register(new TileTemperatureSystem());
engine.register(new NutrientRegenerationSystem());
engine.register(new PlantMetabolismSystem());
engine.register(new PlantGrowthSystem());

/* ---------------------------------- */
/* SIMULATION LOOP                    */
/* ---------------------------------- */

async function runSimulation() {
  const TOTAL_TICKS = 60;

  for (let i = 0; i < TOTAL_TICKS; i++) {
    engine.step();

    const tick = engine.getTick();
    const state = engine.getState();

    const gridStatus = state.getGridStatus();

    const time = state.timeOfDay * 24;
    const day = Math.floor(tick / state.dayLengthTicks) + 1;
    //console.clear();
    console.log(`\x1b[33m[Tick ${tick}] [Day ${day}] [Time ${time.toFixed(2)}] | \n\x1b[0m`);

    console.log(
      `[Weather ${state.weather}: ${Math.floor(state.weatherDurationTicks)}] | ` +
      `[isDay ${state.timeOfDay > 0.25 && state.timeOfDay < 0.75}] | \n` +
      `Moisture avg=${gridStatus.moisture.avg.toFixed(3)} \n` +
      `Nutrients avg=${gridStatus.nutrients.avg.toFixed(3)} ` +
      `(min=${gridStatus.moisture.min.toFixed(2)}, ` +
      `max=${gridStatus.moisture.max.toFixed(2)}) |\n` +
      `Temp avg=${gridStatus.temperature.avg.toFixed(2)}C |\n` +
      `Light avg=${gridStatus.light.avg.toFixed(1)} `
    );

    for (const plant of state.plants) {
      console.log(
        `[Plant ${plant.id} ] | ` +
          `Growth=${plant.growth.toFixed(3)} | ` +
          `Health=${plant.health.toFixed(3)} | ` +
          `Abs(M)=${plant.absorbedMoisture.toFixed(3)} | ` +
          `Abs(N)=${plant.absorbedNutrients.toFixed(3)}`
      );
    }
    console.log("\x1b[32m--------------------------------------------------\x1b[0m \n");

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

runSimulation();