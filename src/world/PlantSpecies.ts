// src/world/PlantSpecies.ts
export interface PlantSpecies {
  id: number;
  name: string;

  rootRadius: number;        // tiles
  moisturePerTick: number;   // desired
  nutrientsPerTick: number;  // legacy uptake target

  // Phase 1 scalar nutrient fertility model
  nutrientConsumptionRate?: number; // per tick
  nutrientOptimalLevel?: number;    // default 1.0

  growthEfficiency: number;  // how well resources convert to growth

  // temperature preferences (C)
  optimalTemp: number;
  tempTolerance: number;
  minGrowthTemp: number;
}