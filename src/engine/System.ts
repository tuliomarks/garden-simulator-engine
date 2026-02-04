// src/engine/System.ts
import { TickContext } from "./TickContext";
import { Phase } from "./Phase";

export interface System {
  readonly phase: Phase;
  update(ctx: TickContext): void;
}
