// src/systems/WeatherSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { WeatherType } from "../world/WeatherType";
import { WeatherProfileRegistry } from "../world/WeatherProfile";

export class WeatherSystem implements System {
  readonly phase = Phase.WEATHER;

  update(ctx: TickContext): void {
    const next = ctx.next;

    // Decrease weather duration
    next.weatherDurationTicks -= 1;

    // Transition to new weather if duration expired
    if (next.weatherDurationTicks <= 0) {
      // Pick random weather type
      const weatherTypes = Object.values(WeatherType);
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      
      if (!newWeather) return; // safety check

      const weatherProfile = WeatherProfileRegistry[newWeather];
      next.weather = newWeather;

      // Set new duration
      const rawMin = weatherProfile.minDurationTicks;
      const rawMax = weatherProfile.maxDurationTicks;

      const min = Math.max(1, Math.min(rawMin, rawMax));
      const max = Math.max(min, Math.max(rawMin, rawMax));

      const durationTicks =
        Math.floor(Math.random() * (max - min + 1)) + min;
        
      next.weatherDurationTicks = durationTicks;
      next.weatherTotalDurationTicks = durationTicks;
    }
  }
}
