// src/systems/MoistureDiffusionSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { Neighbors4 } from "../world/Neighbors";

export class MoistureDiffusionSystem implements System {
  readonly phase = Phase.MOISTURE;

  update(ctx: TickContext): void {
    const gridCur = ctx.current.grid;
    const gridNext = ctx.next.grid;

    const rate = 0.1; // diffusion strength per tick

    const w = gridCur.width;
    const h = gridCur.height;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cell = gridCur.index(x, y);

        const m = gridCur.Moisture[cell];
        if (m === undefined) continue;

        let delta = 0;

        for (const n of Neighbors4) {
          const nx = x + n.dx;
          const ny = y + n.dy;

          if (!gridCur.inBounds(nx, ny)) continue;

          const nCell = gridCur.index(nx, ny);
          const nm = gridCur.Moisture[nCell];

          if (nm === undefined) continue;

          delta += (nm - m);
        }

        // average neighbor influence
        delta /= Neighbors4.length;

        if (delta === 0) continue; // no change
        
        gridNext.Moisture[cell] =
          Math.max(0, m + delta * rate);
        
      }
    }
  }
}
