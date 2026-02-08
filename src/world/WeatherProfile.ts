// src/world/WeatherProfile.ts
import { WeatherType } from "./WeatherType";

export interface WeatherProfile {
  sunlightMultiplier: number;
  tempOffset: number;
  moisturePerTick: number;
}

export const WeatherProfileRegistry: Record<WeatherType, WeatherProfile> = {
  [WeatherType.CLEAR]: {
    sunlightMultiplier: 1.0,
    tempOffset: 0,
    moisturePerTick: 0,
  },
  [WeatherType.CLOUDY]: {
    sunlightMultiplier: 0.6,
    tempOffset: -1,
    moisturePerTick: 0,
  },
  [WeatherType.RAIN]: {
    sunlightMultiplier: 0.5,
    tempOffset: -2,
    moisturePerTick: 0.002,
  },
  [WeatherType.HEAVY_RAIN]: {
    sunlightMultiplier: 0.3,
    tempOffset: -3,
    moisturePerTick: 0.006,
  },
  [WeatherType.HEATWAVE]: {
    sunlightMultiplier: 1.1,
    tempOffset: 6,
    moisturePerTick: -0.002,
  },
  [WeatherType.COLD_SNAP]: {
    sunlightMultiplier: 0.9,
    tempOffset: -6,
    moisturePerTick: 0,
  },
};
