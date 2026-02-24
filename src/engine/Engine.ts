// src/engine/Engine.ts
import { WorldState } from "../world/WorldState.ts";
import { System } from "./System.ts";
import { TickContext } from "./TickContext.ts";

export class Engine {
  private tick = 0;
  private systems: System[] = [];
  private state: WorldState;

  constructor(initialState: WorldState) {
    this.state = initialState;
  }

  register(system: System): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.phase - b.phase);
  }

  step(): void {
    const nextState = this.state.clone();
    const ctx = new TickContext(this.tick, this.state, nextState);

    for (const system of this.systems) {
      //console.log(`\x1b[36mRunning system: ${system.constructor.name} (Phase ${system.phase})\x1b[0m`);
      system.update(ctx);

    }
    this.state = nextState;
    this.tick++;
  }

  run(ticks: number): void {
    for (let i = 0; i < ticks; i++) {
      this.step();
    }
  }

  getState(): WorldState {
    return this.state;
  }

  getTick(): number {
    return this.tick;
  }
}
