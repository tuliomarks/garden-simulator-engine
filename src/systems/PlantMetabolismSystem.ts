// src/systems/PlantMetabolismSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { SpeciesRegistry } from "../world/PlantSpeciesRegistry";
import { rootCells } from "../world/RootNeighborhood";
import { clamp01 } from "../utils/math";
import {
  computeNutrientFactor,
  getNutrientConsumptionRate,
  getNutrientOptimalLevel,
} from "../world/NutrientModel";

export class PlantMetabolismSystem implements System {
  readonly phase = Phase.PLANT_METABOLISM;

  update(ctx: TickContext): void {
    const gridCur = ctx.current.grid;
    const gridNext = ctx.next.grid;

    for (const plant of ctx.next.plants) {
      const species = SpeciesRegistry[plant.speciesId];
      if (!species) continue;

      plant.absorbedMoisture = 0;
      plant.absorbedNutrients = 0;

      if (plant.isDormant) continue;

      const tileTemp =
        gridNext.Temperature[plant.cell] ??
        gridCur.Temperature[plant.cell] ??
        0;

      const tempFactor = clamp01(
        1 - Math.abs(tileTemp - species.optimalTemp) / species.tempTolerance
      );

      const cells = rootCells(gridCur, plant.cell, species.rootRadius);
      if (cells.length === 0) continue;

      const desiredMoisturePerCell = species.moisturePerTick / cells.length;
      const nutrientConsumptionRate = getNutrientConsumptionRate(species);
      const nutrientOptimalLevel = getNutrientOptimalLevel(species);

      for (const cell of cells) {
        const currentMoisture = clamp01(gridNext.Moisture[cell] ?? 0);

        const moistureTake =
          Math.min(currentMoisture, desiredMoisturePerCell) * tempFactor;

        gridNext.Moisture[cell] = clamp01(currentMoisture - moistureTake);
        plant.absorbedMoisture += moistureTake;

        const moistureFactor =
          desiredMoisturePerCell > 0
            ? clamp01(moistureTake / desiredMoisturePerCell)
            : 1;

        const currentNutrient = clamp01(gridNext.NPK[cell] ?? 0);
        const nutrientFactor = computeNutrientFactor(
          currentNutrient,
          nutrientOptimalLevel
        );

        const growthRate =
          species.growthEfficiency *
          tempFactor *
          moistureFactor *
          nutrientFactor;

        const nutrientUse = nutrientConsumptionRate * growthRate;
        const nextNutrient = clamp01(currentNutrient - nutrientUse);

        gridNext.NPK[cell] = nextNutrient;
        plant.absorbedNutrients += currentNutrient - nextNutrient;
      }
    }
  }
}