// src/engine/TickContext.ts
import { WorldState } from "../world/WorldState.ts";

export class TickContext {
  public readonly tick: number;
  public readonly current: WorldState;
  public readonly next: WorldState;

  constructor(tick: number, current: WorldState, next: WorldState) {
    this.tick = tick;
    this.current = current;
    this.next = next;
  }
}
