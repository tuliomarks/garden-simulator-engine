// src/systems/TemperatureDecaySystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";

export class TemperatureDecaySystem implements System {
  readonly phase = Phase.ENVIRONMENT;

  update(ctx: TickContext): void {
    const current = ctx.current.grid;
    const next = ctx.next.grid;

    const ambient = 15;
    const rate = 0.01;

    for (let cell = 0; cell < current.size; cell++) {
      const t = current.Temperature[cell];
      if (t){
        next.Temperature[cell] = t + (ambient - t) * rate;
      }
    }
  }
}
