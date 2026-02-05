// src/systems/WorldTimeSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";

export class WorldTimeSystem implements System {
  readonly phase = Phase.TIME;

  update(ctx: TickContext): void {
    const next = ctx.next;
    const current = ctx.current;

    const step = 1 / current.dayLengthTicks;
    next.timeOfDay = (current.timeOfDay + step) % 1;
  }
}
