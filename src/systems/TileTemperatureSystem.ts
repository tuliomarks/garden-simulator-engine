// src/systems/TileTemperatureSystem.ts
import { System } from "../engine/System";
import { Phase } from "../engine/Phase";
import { TickContext } from "../engine/TickContext";
import { WeatherProfileRegistry } from "../world/WeatherProfile";

export class TileTemperatureSystem implements System {
  readonly phase = Phase.TEMPERATURE;

  update(ctx: TickContext): void {
    const current = ctx.current;
    const next = ctx.next;
    const grid = next.grid;

    const timeOfDay = next.timeOfDay;

    // Day / night sinusoidal cycle
    const solarFactor = Math.max(
      0,
      Math.sin((timeOfDay - 0.25) * Math.PI * 2)
    );

    const weatherProfile = WeatherProfileRegistry[next.weather];

    // Base temperature from day/night
    const baseTemp =
      current.nightBaseTemp +
      (current.dayBaseTemp - current.nightBaseTemp) * solarFactor;

    // --- WEATHER PROGRESSION ---
    const remaining = next.weatherDurationTicks;
    const total = next.weatherTotalDurationTicks;

    const progress = Math.min(
      1,
      Math.max(0, 1 - remaining / total)
    );

    // Smooth peak at mid-weather
    const weatherCurve = Math.sin(progress * Math.PI);

    // Total delta applied progressively
    const weatherTempDelta =
      weatherCurve * weatherProfile.tempDeltaTotal;

    for (let cell = 0; cell < grid.size; cell++) {
      const sunlightModifier = grid.ExposedToSunlight[cell] ? 2 : -2;

      const moisture = grid.Moisture[cell] ?? 0;

      // --- MOISTURE × TEMPERATURE INTERACTION ---
      let moistureFactor = 1;

      if (weatherTempDelta < 0 && moisture > 0.6) {
        // Cold + humid = feels colder
        moistureFactor += 0.25;
      }

      if (weatherTempDelta > 0 && moisture > 0.6) {
        // Hot + humid = evaporative buffering
        moistureFactor -= 0.2;
      }

      const effectiveWeatherDelta =
        weatherTempDelta * moistureFactor;

      grid.Temperature[cell] =
        baseTemp * weatherProfile.sunlightMultiplier +
        effectiveWeatherDelta +
        sunlightModifier;
    }
  }
}
