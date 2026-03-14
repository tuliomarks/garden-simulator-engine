import { WeatherType } from "src/world/WeatherType.ts";

export interface WorldStateMessage {
   day: number;
    timeOfDay: number;
    weather: WeatherType;
    weatherTotalDurationTicks: number
    weatherDurationTicks: number;
    plants: PlantMessage[];
}

export interface PlantMessage {
    id: string;
    cell: number;
    health: number;
}