// src/systems/PlantMetabolismSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { SpeciesRegistry } from "../world/PlantSpeciesRegistry";
import { rootCells } from "../world/RootNeighborhood";

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

      const cells = rootCells(
        gridCur,
        plant.cell,
        species.rootRadius
      );

      for (const cell of cells) {
        if (!gridNext.Moisture[cell]) continue; 

        // Moisture
        const moistureTake = Math.min(
          gridCur.Moisture[cell] ?? 0,
          species.moisturePerTick / cells.length
        );

        gridNext.Moisture[cell] -= moistureTake;
        plant.absorbedMoisture += moistureTake;
      
        if (!gridNext.NPK[cell]) continue; 

        // Nutrients
        const nutrientTake = Math.min(
          gridCur.NPK[cell] ?? 0,
          species.nutrientsPerTick / cells.length
        );
        
        gridNext.NPK[cell] -= nutrientTake;
        plant.absorbedNutrients += nutrientTake;
      }
    }
  }
}
