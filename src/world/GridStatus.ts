// src/world/GridStatus.ts
export interface GridStatus {
  size: number;

  moisture: {
    min: number;
    max: number;
    avg: number;
  };

  temperature: {
    min: number;
    max: number;
    avg: number;
  };

  light: {
    min: number;
    max: number;
    avg: number;
  };
}
