import initWasm from 'snake_game';
import { Game } from './Game';
import { rnd } from './utils/rnd';

const WIDTH = 8;

initWasm().then((wasm) => {
  new Game(
    wasm,
    document,
    { fps: 6 },
    { width: WIDTH, initialIndex: rnd(0, WIDTH * WIDTH - 1), snakeSize: 3 },
    {
      $btn: document.getElementById('game-control-btn'),
      $canvas: document.getElementById('game') as HTMLCanvasElement,
      $points: document.getElementById('game-points'),
      $status: document.getElementById('game-status'),
      cellSize: 50,
      colors: { head: '#7777db', body: '#000', reward: '#ff0000' },
      width: WIDTH,
    }
  );
});
