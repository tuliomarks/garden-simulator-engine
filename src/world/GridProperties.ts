// src/world/GridProperties.ts
export const enum GridProperty {
  Walkable        = 1 << 0,
  Tillable        = 1 << 1,
  Irrigated       = 1 << 2,
  Built           = 1 << 3,
  BlocksLight     = 1 << 4,
}
