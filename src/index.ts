import { Engine } from "./engine/Engine";
import { WorldState } from "./world/WorldState";
import { Grid } from "./world/Grid";
import { PlantMetabolismSystem } from "./systems/PlantMetabolismSystem";
import { PlantGrowthSystem } from "./systems/PlantGrowthSystem";
import { TemperatureDecaySystem } from "./systems/TemperatureDecaySystem";
import { SoilMoistureSystem } from "./systems/SoilMoistureSystem";

const grid = new Grid(10, 10);
const world = WorldState.initialize(grid);

/* ---------------------------------- */
/* ENGINE INITIZATION                 */
/* ---------------------------------- */

const engine = new Engine(world);
engine.register(new TemperatureDecaySystem());
engine.register(new SoilMoistureSystem());
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
