# Simulation Viewer Integration (Socket.IO + PixiJS)

## Objective

Add a real-time visual layer to the simulation engine without modifying core logic. The system will stream grid state from the backend and render it efficiently using GPU acceleration.

---

## Architecture Overview

```
Simulation Engine (Worker)
        │
        │ snapshot
        ▼
Main Thread
        │
        │ Socket.IO broadcast
        ▼
Web Client
        │
        ▼
PixiJS Renderer (GPU Texture आधारित)
```

### Principles

* Engine remains headless
* Rendering is read-only
* Simulation timing is independent from rendering

---

## Data Contract

### GridSnapshot

```ts
export interface GridSnapshot {
  tick: number
  width: number
  height: number
  weather: string
  cells: CellSnapshot[]
}

export interface CellSnapshot {
  x: number
  y: number
  moisture: number
  temperature: number
  nutrients: number
  plant?: {
    stage: number
    health: number
  }
}
```

### Emission Frequency

* Send snapshot every 5–10 ticks

---

## Backend Implementation

### Dependencies

```
npm install express socket.io
```

### Socket Server

```ts
import express from "express"
import { Server } from "socket.io"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

server.listen(3000)

export function broadcastSnapshot(snapshot) {
  io.emit("grid:update", snapshot)
}
```

### Worker Integration

```ts
worker.on("message", (msg) => {
  if (msg.type === "snapshot") {
    broadcastSnapshot(msg.data)
  }
})
```

### Worker Snapshot Emit

```ts
parentPort.postMessage({
  type: "snapshot",
  data: engine.getSnapshot()
})
```

---

## Frontend Implementation

### Dependencies

```
npm install pixi.js socket.io-client
```

---

## Rendering Strategy (High Performance)

### Key Concept

* Use ONE texture for entire grid
* Use Uint8Array as RGBA buffer

---

## Pixi Initialization

```ts
import * as PIXI from "pixi.js"

const GRID_WIDTH = 200
const GRID_HEIGHT = 200

const app = new PIXI.Application({
  width: 800,
  height: 800,
  backgroundColor: 0x111111
})

document.body.appendChild(app.view)
```

---

## Pixel Buffer

```ts
const buffer = new Uint8Array(GRID_WIDTH * GRID_HEIGHT * 4)
```

---

## Texture Creation

```ts
const texture = PIXI.Texture.fromBuffer(
  buffer,
  GRID_WIDTH,
  GRID_HEIGHT
)

const sprite = new PIXI.Sprite(texture)

sprite.width = app.screen.width
sprite.height = app.screen.height

app.stage.addChild(sprite)
```

---

## Cell → Pixel Mapping

```ts
function writeCell(buffer, x, y, cell) {
  const index = (y * GRID_WIDTH + x) * 4

  const nutrient = Math.min(255, cell.nutrients * 255)
  const moisture = Math.min(255, cell.moisture * 255)
  const temp = Math.min(255, (cell.temperature + 10) * 10)

  buffer[index] = temp
  buffer[index + 1] = nutrient
  buffer[index + 2] = moisture
  buffer[index + 3] = 255
}
```

---

## Texture Update

```ts
function updateTexture(snapshot) {
  for (const cell of snapshot.cells) {
    writeCell(buffer, cell.x, cell.y, cell)
  }

  texture.update()
}
```

---

## Socket Client

```ts
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

socket.on("grid:update", snapshot => {
  updateTexture(snapshot)
})
```

---

## Visualization Modes

Support multiple debug views:

* nutrients
* moisture
* temperature
* plant stage

Example:

```ts
let viewMode = "nutrients"
```

---

## Performance Notes

* One sprite only → GPU optimized
* Supports up to ~1M cells depending on hardware
* Avoid per-cell objects

---

## Future Improvements

### Rendering

* Zoom & pan
* Grid overlay
* Multi-layer rendering
* Plant sprites

### Simulation Debug

* Cell inspector (click)
* Heatmaps
* Time replay

### Networking

* Delta updates (changed cells only)
* Binary transport (ArrayBuffer)

---

## Recommended Folder Structure

```
src/
  engine/
  worker/
  server/
  viewer/
```

---

## Key Constraints

* Renderer must not affect simulation timing
* Avoid blocking main thread
* Keep snapshot lightweight

---

## Outcome

* Real-time visual simulation
* Scalable rendering
* Clean separation of concerns
* Ready for future gameplay features
