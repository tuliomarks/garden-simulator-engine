// src/systems/WeatherSystem.ts
import { System } from "../engine/System.ts";
import { Phase } from "../engine/Phase.ts";
import { TickContext } from "../engine/TickContext.ts";
import { WeatherType } from "../world/WeatherType.ts";
import { WeatherProfileRegistry } from "../world/WeatherProfile.ts";

export class WeatherSystem implements System {
  readonly phase = Phase.WEATHER;

  update(ctx: TickContext): void {
    const next = ctx.next;
    const grid = next.grid;

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

    // Solar exposure 
    const solarFactor = Math.max(
      0,
      Math.sin((next.timeOfDay - 0.25) * Math.PI * 2)
    );

    let weatherSunlightModifier = 1;

    if (next.weather === WeatherType.CLOUDY || next.weather === WeatherType.RAIN || next.weather === WeatherType.HEAVY_RAIN) {
      weatherSunlightModifier = 0.5; 
    }

    for (let cell = 0; cell < grid.size; cell++) {
      grid.ExposedToSunlight[cell] = solarFactor * weatherSunlightModifier;
    }
  }
}
