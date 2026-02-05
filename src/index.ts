import { Engine } from "./engine/Engine";
import { WorldState } from "./world/WorldState";
import { Grid } from "./world/Grid";
import { PlantMetabolismSystem } from "./systems/PlantMetabolismSystem";
import { PlantGrowthSystem } from "./systems/PlantGrowthSystem";
import { SoilMoistureSystem } from "./systems/SoilMoistureSystem";
import { MoistureDiffusionSystem } from "./systems/MoistureDiffusionSystem";
import { WorldTimeSystem } from "./systems/WorldTimeSystem";
import { TileTemperatureSystem } from "./systems/TileTemperatureSystem";

const grid = new Grid(10, 10);
const world = WorldState.initialize(grid);

/* ---------------------------------- */
/* ENGINE INITIZATION                 */
/* ---------------------------------- */

const engine = new Engine(world);
engine.register(new WorldTimeSystem());
engine.register(new SoilMoistureSystem());
engine.register(new MoistureDiffusionSystem());
engine.register(new TileTemperatureSystem());
engine.register(new PlantMetabolismSystem());
engine.register(new PlantGrowthSystem());

/* ---------------------------------- */
/* SIMULATION LOOP                    */
/* ---------------------------------- */

const TOTAL_TICKS = 20;

for (let i = 0; i < TOTAL_TICKS; i++) {
  engine.step();

  const tick = engine.getTick();
  const state = engine.getState();

  const gridStatus = state.getGridStatus();

  console.log(
    `[Tick ${tick}] Grid | ` +
    `[isDay=${state.timeOfDay > 0.25 && state.timeOfDay < 0.75}] | ` +
    `Moisture avg=${gridStatus.moisture.avg.toFixed(3)} ` +
    `(min=${gridStatus.moisture.min.toFixed(2)}, ` +
    `max=${gridStatus.moisture.max.toFixed(2)})` +
    ` | Temp avg=${gridStatus.temperature.avg.toFixed(2)}°C ` +
    ` | Light avg=${gridStatus.light.avg.toFixed(1)} `
    
  );

  for (const plant of state.plants) {
    console.log(
      `[Tick ${tick}] Plant ${plant.id} | ` +
      `Growth=${plant.growth.toFixed(3)} | ` +
      `Health=${plant.health.toFixed(3)} | ` +
      `Abs(M)=${plant.absorbedMoisture.toFixed(3)} | ` +
      `Abs(N)=${plant.absorbedNutrients.toFixed(3)}`
    );
  }
}
