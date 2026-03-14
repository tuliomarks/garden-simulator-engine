import { Worker } from 'worker_threads';
import { WorldStateMessage } from './WorldStateMessage.ts';

export interface WorkerSnapshotMessage<TState = WorldStateMessage> {
  type: string;
  tick: number;
  state: TState;
  status?: unknown;
}

type WorkerEventHandlers = {
  onMessage: (msg: WorkerSnapshotMessage<WorldStateMessage>) => void;
  onError: (err: Error) => void;
  onExit: (code: number) => void;
};

export function createSimulationWorker(): Worker {
  return new Worker(new URL('../engine.worker.bootstrap.mjs', import.meta.url));
}

export function registerWorkerHandlers(worker: Worker, handlers: WorkerEventHandlers): void {
  worker.on('message', handlers.onMessage);
  worker.on('error', handlers.onError);
  worker.on('exit', handlers.onExit);
}

export function sendApplyFertilizerCommand(worker: Worker, cell: number, amount: number): void {
  worker.postMessage({
    type: 'command',
    payload: {
      type: 'applyFertilizer',
      cell,
      amount,
    },
  });
}

export function sendStopCommand(worker: Worker): void {
  worker.postMessage({
    type: 'command',
    payload: {
      type: 'stop',
    },
  });
}

export function terminateWorker(worker: Worker): Promise<number> {
  return worker.terminate();
}
