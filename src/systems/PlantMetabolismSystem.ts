// src/systems/PlantMetabolismSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { SpeciesRegistry } from "../world/PlantSpeciesRegistry";
import { rootCells } from "../world/RootNeighborhood";
import { clamp01 } from "../utils/math";

export class PlantMetabolismSystem implements System {
  readonly phase = Phase.PLANT_METABOLISM;

  update(ctx: TickContext): void {
    const gridCur = ctx.current.grid;
    const gridNext = ctx.next.grid;

    for (const plant of ctx.next.plants) {
      const species = SpeciesRegistry[plant.speciesId];

      if (!species) continue; // skip unknown species

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

      const cells = rootCells(
        gridCur,
        plant.cell,
        species.rootRadius
      );

      for (const cell of cells) {
        if (!gridNext.Moisture[cell]) continue; 

        // Moisture
        const desiredMoisture = Math.min(
          gridCur.Moisture[cell] ?? 0,
          species.moisturePerTick / cells.length
        );

        const moistureTake = desiredMoisture * tempFactor;
        gridNext.Moisture[cell] -= moistureTake;
        plant.absorbedMoisture += moistureTake;
      
        if (!gridNext.NPK[cell]) continue; 

        // Nutrients
        const desiredNutrients = Math.min(
          gridCur.NPK[cell] ?? 0,
          species.nutrientsPerTick / cells.length
        );
        
        const nutrientTake = desiredNutrients * tempFactor;
        gridNext.NPK[cell] -= nutrientTake;
        plant.absorbedNutrients += nutrientTake;
      }
    }
  }
}
