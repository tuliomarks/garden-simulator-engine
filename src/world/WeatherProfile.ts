// src/world/WeatherProfile.ts
import { WeatherType } from "./WeatherType";

export interface WeatherProfile {
  minDurationTicks: number;
  maxDurationTicks: number;
  sunlightMultiplier: number;
  tempDeltaTotal: number;
  moisturePerTick: number;
}

export const WeatherProfileRegistry: Record<WeatherType, WeatherProfile> = {
  [WeatherType.CLEAR]: {
    minDurationTicks: 10,
    maxDurationTicks: 100,
    sunlightMultiplier: 1.0,
    tempDeltaTotal: 5,
    moisturePerTick: -0.01,
  },
  [WeatherType.CLOUDY]: {
    minDurationTicks: 10,
    maxDurationTicks: 60,
    sunlightMultiplier: 0.6,
    tempDeltaTotal: -1.5,
    moisturePerTick: 0,
  },
  [WeatherType.RAIN]: {
    minDurationTicks: 10,
    maxDurationTicks: 60,
    sunlightMultiplier: 0.5,
    tempDeltaTotal: -4,
    moisturePerTick: 0.01,
  },
  [WeatherType.HEAVY_RAIN]: {
    minDurationTicks: 5,
    maxDurationTicks: 15,
    sunlightMultiplier: 0.3,
    tempDeltaTotal: -6,
    moisturePerTick: 0.05,
  },
  [WeatherType.HEATWAVE]: {
    minDurationTicks: 5,
    maxDurationTicks: 15,
    sunlightMultiplier: 1.1,
    tempDeltaTotal: 12,
    moisturePerTick: -0.05,
  },
  [WeatherType.COLD_SNAP]: {
    minDurationTicks: 20,
    maxDurationTicks: 60,
    sunlightMultiplier: 0.9,
    tempDeltaTotal: -14,
    moisturePerTick: 0,
  },
};
