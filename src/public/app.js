import { io } from 'https://cdn.socket.io/4.9.4/socket.io.esm.min.js';

const socket = io();
const connectionEl = document.getElementById('connection');
const tickEl = document.getElementById('tick');
const weatherEl = document.getElementById('weather');
const timeEl = document.getElementById('time');
const snapshotEl = document.getElementById('snapshot');
const btnStop = document.getElementById('btn-stop');
const btnFertilize = document.getElementById('btn-fertilize');
const btnRefresh = document.getElementById('btn-refresh');
const cellInput = document.getElementById('cell');
const amountInput = document.getElementById('amount');
const statusEl = document.getElementById('fertilizeStatus');

function setStatus(text, color = '#8edb8e') {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.style.color = color;
}

socket.on('connect', () => {
  connectionEl.textContent = 'Connected';
  connectionEl.style.color = '#74d38e';
});

socket.on('disconnect', () => {
  connectionEl.textContent = 'Disconnected';
  connectionEl.style.color = '#ff7b7b';
});

socket.on('snapshot', (msg) => {
  tickEl.textContent = String(msg.tick ?? '-');
  const state = msg.state ?? {};
  weatherEl.textContent = `${state.weather ?? '-'} (${state.weatherDurationTicks ?? 0}/${state.weatherTotalDurationTicks ?? 0})`;
  timeEl.textContent = `${Math.floor(state.day ?? 0)} day ${Number(state.timeOfDay ?? 0).toFixed(2)}h`;
  snapshotEl.textContent = JSON.stringify(msg, null, 2);
});

socket.on('error', (e) => {
  setStatus(`Error: ${e?.message ?? JSON.stringify(e)}`, '#ff9f9f');
});

btnStop?.addEventListener('click', () => {
  socket.emit('stop');
  setStatus('Sent stop command', '#ffd47a');
});

btnFertilize?.addEventListener('click', () => {
  const cell = Number(cellInput?.value ?? '');
  const amount = Number(amountInput?.value ?? '');
  if (Number.isNaN(cell) || Number.isNaN(amount)) {
    setStatus('Cell and amount must be numeric', '#ff9f9f');
    return;
  }
  socket.emit('fertilize', { cell, amount });
  setStatus(`Sent fertilizer to cell ${cell} amount ${amount}`, '#8edb8e');
});

btnRefresh?.addEventListener('click', () => {
  socket.emit('requestSnapshot');
});
