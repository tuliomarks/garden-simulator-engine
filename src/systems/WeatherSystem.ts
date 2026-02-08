// src/systems/WeatherSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { WeatherType } from "../world/WeatherType";

export class WeatherSystem implements System {
  readonly phase = Phase.WEATHER;

  update(ctx: TickContext): void {
    const next = ctx.next;
    const dayLengthTicks = next.dayLengthTicks;

    // Decrease weather duration
    next.weatherDurationTicks -= 1;

    // Transition to new weather if duration expired
    if (next.weatherDurationTicks <= 0) {
      // Pick random weather type
      const weatherTypes = Object.values(WeatherType);
      const newWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      
      if (!newWeather) return; // safety check
      next.weather = newWeather;

      // Set new duration: 2-5 in-game days
      const minDays = 2;
      const maxDays = 5;
      const durationTicks = (minDays + Math.random() * (maxDays - minDays)) * dayLengthTicks;
      next.weatherDurationTicks = durationTicks;
    }
  }
}
