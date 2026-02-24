import { register } from 'tsx/esm/api';

await register();
await import('./engine.worker.ts');
