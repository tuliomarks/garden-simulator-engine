// src/engine/TickContext.ts
import { WorldState } from "../world/WorldState";

export class TickContext {
  constructor(
    public readonly tick: number,
    public readonly current: WorldState,
    public readonly next: WorldState
  ) {}
}
