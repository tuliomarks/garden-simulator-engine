// src/world/Plant.ts
export interface Plant {
  id: string;
  cell: number;

  speciesId: number;

  growth: number;      // 0..1
  health: number;      // 0..1

  // internal buffers (per-tick)
  absorbedMoisture: number;
  absorbedNutrients: number;
}
