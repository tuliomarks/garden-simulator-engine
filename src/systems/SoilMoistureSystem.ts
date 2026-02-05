// src/systems/SoilMoistureSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";

export class SoilMoistureSystem implements System {
  readonly phase = Phase.MOISTURE;

  update(ctx: TickContext): void {
    const current = ctx.current.grid;
    const next = ctx.next.grid;
    
    const evaporationRate = 0.001;

    for (let cell = 0; cell < current.size; cell++) {
      const t = current.Moisture[cell];
      if (t){
        next.Moisture[cell] = Math.max(0, t - evaporationRate);
      }
    }
  }
}
