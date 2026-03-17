import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createSimulationWorker,
  registerWorkerHandlers,
  sendApplyFertilizerCommand,
  sendStopCommand,
  terminateWorker,
  WorkerSnapshotMessage,
} from './utils/worker.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
  },
});

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

let worker: ReturnType<typeof createSimulationWorker> | null = createSimulationWorker();
let lastSnapshot: WorkerSnapshotMessage | null = null;

function startWorker() {
  if (worker) return;
  worker = createSimulationWorker();
  registerWorkerHandlers(worker, handlers);
}

function stopWorker() {
  if (!worker) return;
  terminateWorker(worker).catch(() => {});
  worker = null;
}

const handlers = {
  onMessage: (msg: WorkerSnapshotMessage) => {
    if (msg.type === 'snapshot') {
      lastSnapshot = msg;
      io.emit('snapshot', msg);
    }
  },
  onError: (err: Error) => {
    console.error('[Worker Error]', err);
    io.emit('error', { message: err.message });
  },
  onExit: (code: number) => {
    console.log(`[Worker] Exited with code ${code}`);
    io.emit('stopped', { code });
  },
};

registerWorkerHandlers(worker, handlers);

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  if (lastSnapshot) {
    socket.emit('snapshot', lastSnapshot);
  }

  socket.on('fertilize', (payload: { cell: number; amount: number }) => {
    if (!worker) {
      socket.emit('error', { message: 'Worker not started' });
      return;
    }
    const { cell, amount } = payload;
    if (typeof cell !== 'number' || typeof amount !== 'number') {
      socket.emit('error', { message: 'Invalid payload' });
      return;
    }
    sendApplyFertilizerCommand(worker, cell, amount);
  });

  socket.on('stop', () => {
    if (worker) {
      sendStopCommand(worker);
    }
  });

  socket.on('requestSnapshot', () => {
    if (lastSnapshot) {
      socket.emit('snapshot', lastSnapshot);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({ running: worker !== null, lastSnapshot: lastSnapshot ?? null });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
httpServer.listen(PORT, () => {
  console.log(`[Web] Server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('[Web] SIGINT received. Shutting down...');
  stopWorker();
  process.exit(0);
});
