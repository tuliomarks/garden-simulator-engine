// src/systems/WorldTimeSystem.ts
import { System } from "../engine/System.ts";
import { Phase } from "../engine/Phase.ts";
import { TickContext } from "../engine/TickContext.ts";

export class WorldTimeSystem implements System {
  readonly phase = Phase.TIME;

  update(ctx: TickContext): void {
    const next = ctx.next;
    const current = ctx.current;
    const tick = ctx.tick;

    const step = 1 / current.dayLengthTicks;
    next.timeOfDay = (current.timeOfDay + step) % 1;
    next.day = Math.floor(tick / current.dayLengthTicks);
  }
}
