// src/world/PlantSpeciesRegistry.ts
import { PlantSpecies } from "./PlantSpecies";

export const SpeciesRegistry: Record<number, PlantSpecies> = {
  1: {
    id: 1,
    name: "Carrot",
    rootRadius: 1,
    moisturePerTick: 0.02,
    nutrientsPerTick: 0.01,
    nutrientConsumptionRate: 0.0005,
    nutrientOptimalLevel: 1.0,
    growthEfficiency: 0.8,
    optimalTemp: 22,
    tempTolerance: 10,
    minGrowthTemp: 6,
  },
};