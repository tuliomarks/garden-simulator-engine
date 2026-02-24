// EngineWorker.ts

import { parentPort } from 'worker_threads';
import { Engine } from './engine/Engine.ts';
import { WorldState } from './world/WorldState.ts';
import { Grid } from './world/Grid.ts';
import { PlantMetabolismSystem } from './systems/PlantMetabolismSystem.ts';
import { PlantGrowthSystem } from './systems/PlantGrowthSystem.ts';
import { SoilMoistureSystem } from './systems/SoilMoistureSystem.ts';
import { MoistureDiffusionSystem } from './systems/MoistureDiffusionSystem.ts';
import { WorldTimeSystem } from './systems/WorldTimeSystem.ts';
import { TileTemperatureSystem } from './systems/TileTemperatureSystem.ts';
import { WeatherSystem } from './systems/WeatherSystem.ts';
import { NutrientRegenerationSystem } from './systems/NutrientRegenerationSystem.ts';

class EngineWorker {
  private readonly TICK_INTERVAL_MS = 200;
  private readonly GRID_WIDTH = 10;
  private readonly GRID_HEIGHT = 10;

  private engine: Engine;
  private tickIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    const grid = new Grid(this.GRID_WIDTH, this.GRID_HEIGHT);
    const world = WorldState.initialize(grid);
    this.engine = new Engine(world);

    this.registerSystems();
  }

  private registerSystems(): void {
    this.engine.register(new WorldTimeSystem());
    this.engine.register(new WeatherSystem());
    this.engine.register(new SoilMoistureSystem());
    this.engine.register(new MoistureDiffusionSystem());
    this.engine.register(new TileTemperatureSystem());
    this.engine.register(new NutrientRegenerationSystem());
    this.engine.register(new PlantMetabolismSystem());
    this.engine.register(new PlantGrowthSystem());
  }

  private tick(): void {
    this.engine.step();

    // Send lightweight snapshot
    const state = this.engine.getState();
    const gridStatus = state.getGridStatus();

    parentPort?.postMessage({
      type: 'snapshot',
      tick: this.engine.getTick(),
      state: this.serializeState(state),
      status: gridStatus,
    });
  }

  private serializeState(state: WorldState): object {
    return {
      day: state.day,
      timeOfDay: state.timeOfDay,
      weather: state.weather,
      weatherTotalDurationTicks: state.weatherTotalDurationTicks,
      weatherDurationTicks: state.weatherDurationTicks,
      plants: state.plants.map(p => ({
        id: p.id,
        cell: p.cell,
        health: p.health,
      })),
    };
  }

  private handleCommand(command: any): void {
    switch (command.type) {
      case 'applyFertilizer': {
        const { cell, amount } = command;
        const grid = this.engine.getState().grid;
        if (cell >= 0 && cell < grid.size) {
          grid.NPK[cell] = Math.min(1, grid.NPK[cell] + amount);
          console.log(`[Worker] Applied ${amount} fertilizer to cell ${cell}`);
        }
        break;
      }
      case 'stop': {
        console.log('[Worker] Received stop command');
        this.stop();
        break;
      }
      default:
        console.warn(`[Worker] Unknown command: ${command.type}`);
    }
  }

  start(): void {
    // Start the simulation tick loop
    this.tickIntervalId = setInterval(() => this.tick(), this.TICK_INTERVAL_MS);

    // Handle commands from the main thread
    parentPort?.on('message', (msg: { type: string; payload: any }) => {
      if (msg.type === 'command') {
        this.handleCommand(msg.payload);
      }
    });

    console.log('[Worker] Engine worker started');
  }

  stop(): void {
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
      console.log('[Worker] Engine worker stopped');
    }
  }
}

// Instantiate and start the worker when module loads
const engineWorker = new EngineWorker();
engineWorker.start();

export { EngineWorker };