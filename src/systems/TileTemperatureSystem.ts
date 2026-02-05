// src/systems/TileTemperatureSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";

export class TileTemperatureSystem implements System {
  readonly phase = Phase.TEMPERATURE;

  update(ctx: TickContext): void {
    const current = ctx.current;
    const next = ctx.next;
    const grid = next.grid;

    const timeOfDay = next.timeOfDay;
    const solarFactor = Math.max(
      0,
      Math.sin((timeOfDay - 0.25) * Math.PI * 2)
    );

    const baseTemp =
      current.nightBaseTemp +
      (current.dayBaseTemp - current.nightBaseTemp) * solarFactor;

    for (let cell = 0; cell < grid.size; cell++) {
      const sunlightModifier = grid.ExposedToSunlight[cell] ? 2 : -2;

      const moisture = grid.Moisture[cell] ?? 0;
      let moistureModifier = 0;

      if (moisture > 0.6) {
        moistureModifier -= 1.5;
      } else if (moisture < 0.2) {
        moistureModifier += 1.5 * solarFactor;
      }

      grid.Temperature[cell] =
        baseTemp + sunlightModifier + moistureModifier;
    }
  }
}
