import { Worker } from 'worker_threads';
import readline from 'readline';

/* ---------------------------------- */
/* GLOBALS                            */
/* ---------------------------------- */

let worker: Worker | null = null;
let lastSnapshot: any = null;
let readlineInterface: readline.Interface | null = null;

/* ---------------------------------- */
/* DISPLAY SNAPSHOT                   */
/* ---------------------------------- */

function displaySnapshot(msg: any) {
  //console.clear();
  console.log(`\x1b[33m[Tick ${msg.tick}] Day ${Math.floor(msg.state.day)} Time: ${msg.state.timeOfDay.toFixed(2)}h\x1b[0m`);
  console.log(`\x1b[34mWeather: ${msg.state.weather} (${msg.state.weatherDurationTicks}/${msg.state.weatherTotalDurationTicks} ticks)\x1b[0m \n`);
  
  if (msg.status) {
    const s = msg.status;
    console.log(`Temperature: ${s.temperature.avg.toFixed(2)}°C (${s.temperature.min.toFixed(2)} - ${s.temperature.max.toFixed(2)})`);
    console.log(`Moisture:    ${s.moisture.avg.toFixed(2)} (${s.moisture.min.toFixed(2)} - ${s.moisture.max.toFixed(2)})`);
    console.log(`Nutrients:   ${s.nutrients.avg.toFixed(2)} (${s.nutrients.min.toFixed(2)} - ${s.nutrients.max.toFixed(2)})`);
    console.log(`Sunlight:    ${s.light.avg.toFixed(2)} (${s.light.min.toFixed(2)} - ${s.light.max.toFixed(2)})`);
  }
  console.log('\nCommands: fertilize <cell> <amount>, help, exit\n');
}

/* ---------------------------------- */
/* USER INPUT (NON-BLOCKING)         */
/* ---------------------------------- */

function instantiateReadline() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  readlineInterface = rl;
  rl.prompt();

  rl.on('line', (input: string) => {
    parseCommand(input.trim());
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n\x1b[31m[Main] Closing...\x1b[0m');
    if (worker) {
      worker.terminate();
    }
    process.exit(0);
  });
}

function parseCommand(input: string) {
  if (!input) return;

  const [cmd, arg1, arg2] = input.split(' ');

  if (!cmd) return;

  switch (cmd.toLowerCase()) {
    case 'fertilize': {
      const cell = parseInt(arg1 ?? '', 10);
      const amount = parseFloat(arg2 ?? '');
      if (isNaN(cell) || isNaN(amount)) {
        console.log('\x1b[31m[Error] Usage: fertilize <cell> <amount>\x1b[0m');
      } else if (worker) {
        worker.postMessage({
          type: 'command',
          payload: {
            type: 'applyFertilizer',
            cell,
            amount,
          },
        });
        console.log(`\x1b[32m[Main] Sent fertilizer command\x1b[0m`);
      }
      break;
    }
    case 'help': {
      console.log('\x1b[36mAvailable Commands:\x1b[0m');
      console.log('  fertilize <cell> <amount>  - Apply fertilizer to a cell');
      console.log('  help                        - Show this message');
      console.log('  exit                        - Quit the simulator');
      break;
    }
    case 'exit': {
      console.log('\x1b[31m[Main] Shutting down...\x1b[0m');
      if (worker) {
        worker.postMessage({
          type: 'command',
          payload: {
            type: 'stop',
          },
        });
      }
      readlineInterface?.close();
      break;
    }
    default:
      console.log(`\x1b[31m[Error] Unknown command: ${cmd}. Type 'help' for available commands.\x1b[0m`);
  }
}

/* ---------------------------------- */
/* SIMULATION INITIALIZATION          */
/* ---------------------------------- */

function runSimulation(): void {
  worker = new Worker(new URL('./engine.worker.bootstrap.mjs', import.meta.url), {
    type: 'module',
  });

  worker.on('message', (msg) => {
    lastSnapshot = null;
    if (msg.type === 'snapshot') {
      lastSnapshot = msg;
    }
    render();
  });

  worker.on('error', (err) => {
    console.error('\x1b[31m[Worker Error]\x1b[0m', err);
  });

  worker.on('exit', (code) => {
    console.log(`\x1b[31m[Worker] Exited with code ${code}\x1b[0m`);
    process.exit(code);
  });

  console.log('\x1b[32m[Main] Simulation started\x1b[0m\n');
}

function render() {

  if (!readlineInterface) return;

  const current = readlineInterface.line ?? '';     // what user already typed
  const cursor = readlineInterface.cursor ?? 0;    // cursor position inside that text

  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);

  if (lastSnapshot) {
    displaySnapshot(lastSnapshot);
  }
  
  readlineInterface.prompt(true);

  const back = current.length - cursor;
  if (back > 0) readline.moveCursor(process.stdout, -back, 0);
}

function main() { 
  instantiateReadline();
  runSimulation();
}

main();
