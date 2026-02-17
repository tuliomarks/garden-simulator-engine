// src/world/NutrientModel.ts
import { clamp01 } from "../utils/math";
import { PlantSpecies } from "./PlantSpecies";

export const DEFAULT_NUTRIENT_CONSUMPTION_RATE = 0.0005;
export const DEFAULT_NUTRIENT_OPTIMAL_LEVEL = 1.0;

export function getNutrientConsumptionRate(species: PlantSpecies): number {
  return species.nutrientConsumptionRate ?? DEFAULT_NUTRIENT_CONSUMPTION_RATE;
}

export function getNutrientOptimalLevel(species: PlantSpecies): number {
  return species.nutrientOptimalLevel ?? DEFAULT_NUTRIENT_OPTIMAL_LEVEL;
}

// Kept as a helper so scalar fertility can later be swapped for N/P/K channels.
export function computeNutrientFactor(
  nutrientLevel: number,
  nutrientOptimalLevel: number
): number {
  if (!Number.isFinite(nutrientLevel) || nutrientLevel <= 0) return 0;
  if (!Number.isFinite(nutrientOptimalLevel) || nutrientOptimalLevel <= 0) return 1;
  return clamp01(nutrientLevel / nutrientOptimalLevel);
}