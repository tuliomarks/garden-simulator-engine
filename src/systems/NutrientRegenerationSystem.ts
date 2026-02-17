// src/systems/NutrientRegenerationSystem.ts
import { Phase } from "../engine/Phase";
import { System } from "../engine/System";
import { TickContext } from "../engine/TickContext";
import { clamp01 } from "../utils/math";

const REGEN_RATE = 0.001;

export class NutrientRegenerationSystem implements System {
  readonly phase = Phase.NUTRIENT_REGEN;

  update(ctx: TickContext): void {
    const gridCur = ctx.current.grid;
    const gridNext = ctx.next.grid;

    for (let cell = 0; cell < gridCur.size; cell++) {
      const current = gridCur.NPK[cell] ?? 0;
      gridNext.NPK[cell] = clamp01(current + REGEN_RATE);
    }
  }
}