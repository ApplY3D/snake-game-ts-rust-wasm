import initWasm, { greet } from 'snake_game';

async function init() {
  const wasm = await initWasm();
  greet('Dmitrii');
}

init();
