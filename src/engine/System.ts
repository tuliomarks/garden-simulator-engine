// src/engine/System.ts
import { TickContext } from "./TickContext.ts";
import { Phase } from "./Phase.ts";

export interface System {
  readonly phase: Phase;
  update(ctx: TickContext): void;
}
