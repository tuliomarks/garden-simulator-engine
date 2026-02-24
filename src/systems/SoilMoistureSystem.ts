// src/systems/SoilMoistureSystem.ts
import { System } from "../engine/System.ts";
import { Phase } from "../engine/Phase.ts";
import { TickContext } from "../engine/TickContext.ts";
import { WeatherProfileRegistry } from "../world/WeatherProfile.ts";

export class SoilMoistureSystem implements System {
  readonly phase = Phase.MOISTURE;

  update(ctx: TickContext): void {
    const current = ctx.current.grid;
    const next = ctx.next;
    const grid = next.grid;
    const weather = ctx.next.weather;
    
    const evaporationRate = 0.001;
    const weatherProfile = WeatherProfileRegistry[weather];
    const rainInjection = weatherProfile.moisturePerTick;

    for (let cell = 0; cell < current.size; cell++) {
      const t = current.Moisture[cell];
      if (t !== undefined) {
        // Apply evaporation
        let newMoisture = Math.max(0, t - evaporationRate);
        
        // Apply rain injection (can be negative for dry weather like heatwave)
        newMoisture += rainInjection;
        
        // Clamp to valid range [0, 1]
        grid.Moisture[cell] = Math.max(0, Math.min(1, newMoisture));
      }
    }
  }
}
