// src/systems/PlantGrowthSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { SpeciesRegistry } from "../world/PlantSpeciesRegistry";

export class PlantGrowthSystem implements System {
  readonly phase = Phase.PLANT_GROWTH;

  update(ctx: TickContext): void {
    for (const plant of ctx.next.plants) {
      const species = SpeciesRegistry[plant.speciesId];

      if (!species) continue; // skip unknown species

      const moistureRatio =
        plant.absorbedMoisture / species.moisturePerTick;

      const nutrientRatio =
        plant.absorbedNutrients / species.nutrientsPerTick;

      const limitingFactor = Math.min(moistureRatio, nutrientRatio, 1);

      const growthDelta =
        limitingFactor *
        species.growthEfficiency *
        0.01;

      plant.growth = Math.min(1, plant.growth + growthDelta);

      // Health decay if starving
      if (limitingFactor < 0.5) {
        plant.health = Math.max(0, plant.health - 0.01);
      } else {
        plant.health = Math.min(1, plant.health + 0.005);
      }
    }
  }
}
