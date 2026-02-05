// src/systems/PlantGrowthSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { SpeciesRegistry } from "../world/PlantSpeciesRegistry";
import { clamp01 } from "../utils/math";

export class PlantGrowthSystem implements System {
  readonly phase = Phase.PLANT_GROWTH;

  update(ctx: TickContext): void {
    const dayBoundary = ctx.next.timeOfDay < ctx.current.timeOfDay;

    for (const plant of ctx.next.plants) {
      const species = SpeciesRegistry[plant.speciesId];

      if (!species) continue; // skip unknown species

      const tileTemp = ctx.next.grid.Temperature[plant.cell] ?? 0;
      plant.tempAccumulator += tileTemp;
      plant.tempSamples += 1;

      if (!dayBoundary) continue;

      const avgTemp =
        plant.tempSamples > 0
          ? plant.tempAccumulator / plant.tempSamples
          : tileTemp;

      plant.tempAccumulator = 0;
      plant.tempSamples = 0;

      plant.isDormant = avgTemp < species.minGrowthTemp;

      if (plant.isDormant) continue;

      const moistureRatio =
        plant.absorbedMoisture / species.moisturePerTick;

      const nutrientRatio =
        plant.absorbedNutrients / species.nutrientsPerTick;

      const limitingFactor = Math.min(moistureRatio, nutrientRatio, 1);

      const tempFactor = clamp01(
        1 - Math.abs(avgTemp - species.optimalTemp) / species.tempTolerance
      );

      const dailyScale = ctx.current.dayLengthTicks;
      const growthDelta =
        limitingFactor *
        tempFactor *
        species.growthEfficiency *
        0.01 *
        dailyScale;

      plant.growth = Math.min(1, plant.growth + growthDelta);

      // Health decay if starving
      if (limitingFactor < 0.5) {
        plant.health = Math.max(0, plant.health - 0.01 * dailyScale);
      } else {
        plant.health = Math.min(1, plant.health + 0.005 * dailyScale);
      }
    }
  }
}
