// src/world/Grid.ts
export class Grid {
  readonly width: number;
  readonly height: number;
  readonly size: number;

  // Terrain / environment arrays
  Solid: Uint8Array;             // 0 = walkable, 1 = blocked
  Foundation: Uint8Array;        // 0 = natural, 1 = built
  Element: Uint16Array;          // soil / terrain type
  Temperature: Float32Array;     // °C (surface)
  Moisture: Float32Array;        // 0..1 soil moisture
  NPK: Float32Array;              // 0..1 nutrients  
  Disease: Uint32Array;          // contamination / pests
  ExposedToSunlight: Float32Array; // 0 = dark, 1 = full sun
  Properties: Uint32Array;       // bitmask flags

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.size = width * height;

    this.Solid = new Uint8Array(this.size);
    this.Foundation = new Uint8Array(this.size);
    this.Element = new Uint16Array(this.size);
    this.Temperature = new Float32Array(this.size);
    this.Moisture = new Float32Array(this.size);
    this.NPK = new Float32Array(this.size);
    this.Disease = new Uint32Array(this.size);
    this.ExposedToSunlight = new Float32Array(this.size);
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
    g.Temperature.set(this.Temperature);
    g.Moisture.set(this.Moisture);
    g.NPK.set(this.NPK);
    g.Disease.set(this.Disease);
    g.ExposedToSunlight.set(this.ExposedToSunlight);
    g.Properties.set(this.Properties);
    return g;
  }
}
