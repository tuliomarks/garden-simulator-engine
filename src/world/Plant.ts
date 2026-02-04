// src/world/Plant.ts
export interface Plant {
  id: string;
  x: number;
  y: number;
  growth: number; // 0..1
  health: number; // 0..1
}
