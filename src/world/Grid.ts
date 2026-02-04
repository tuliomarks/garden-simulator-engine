// src/world/Grid.ts
export class Grid {
  readonly width: number;
  readonly height: number;
  readonly size: number;

  // ONI-like arrays
  Solid: Uint8Array;                // 0 / 1
  Foundation: Uint8Array;           // 0 = natural, 1 = built
  Element: Uint16Array;             // element id
  Mass: Float32Array;               // kg
  Temperature: Float32Array;        // °C
  Moisture: Float32Array;           // % moisture
  Disease: Uint32Array;             // germs
  Light: Uint16Array;               // light level
  ExposedToSunlight: Uint8Array;    // 0 / 1
  Properties: Uint32Array;          // bitmask

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;

    this.Solid = new Uint8Array(this.size);
    this.Foundation = new Uint8Array(this.size);
    this.Element = new Uint16Array(this.size);
    this.Mass = new Float32Array(this.size);
    this.Temperature = new Float32Array(this.size);
    this.Moisture = new Float32Array(this.size);
    this.Disease = new Uint32Array(this.size);
    this.Light = new Uint16Array(this.size);
    this.ExposedToSunlight = new Uint8Array(this.size);
    this.Properties = new Uint32Array(this.size);
  }

  index(x: number, y: number): number {
    return y * this.width + x;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  clone(): Grid {
    const g = new Grid(this.width, this.height);
    g.Solid.set(this.Solid);
    g.Foundation.set(this.Foundation);
    g.Element.set(this.Element);
    g.Mass.set(this.Mass);
    g.Temperature.set(this.Temperature);
    g.Moisture.set(this.Moisture);
    g.Disease.set(this.Disease);
    g.Light.set(this.Light);
    g.ExposedToSunlight.set(this.ExposedToSunlight);
    g.Properties.set(this.Properties);
    return g;
  }
}
