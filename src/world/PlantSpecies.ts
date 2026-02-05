// src/world/PlantSpecies.ts
export interface PlantSpecies {
  id: number;
  name: string;

  rootRadius: number;        // tiles
  moisturePerTick: number;   // desired
  nutrientsPerTick: number;

  growthEfficiency: number;  // how well resources convert to growth

  // temperature preferences (C)
  optimalTemp: number;
  tempTolerance: number;
  minGrowthTemp: number;
}
