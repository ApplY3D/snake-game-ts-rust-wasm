import initWasm, { World, Direction } from 'snake_game';
import { rnd } from './utils/rnd';

const CELL_SIZE = 50;
const WIDTH = 8;
const SNAKE_SIZE = 3;
const INITIAL_INDEX = rnd(0, WIDTH * WIDTH);
const FPS = 6;
const DEFAULT_PALLETTE = {
  head: '#7777db',
  body: '#000',
  reward: '#ff0000',
};

/**
 *
 * @param {number} cellSize
 * @param {number} worldWidth
 * @param {number} snakeSize
 * @param {number} [initialIndex=0]
 * @param {number} [fps=3]
 * @param {number} [pallette=PALLETTE]
 */
async function init(
  cellSize: number,
  worldWidth: number,
  snakeSize: number,
  initialIndex = 0,
  fps = 3,
  pallette: Record<'head' | 'body' | 'reward', string> = DEFAULT_PALLETTE
) {
  const wasm = await initWasm();
  const world = World.new(worldWidth, initialIndex, snakeSize);
  const worldSize = worldWidth * cellSize;

  const canvas = <HTMLCanvasElement>document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.height = worldSize;
  canvas.width = worldSize;

  function getSnakeCells() {
    const snakeCellsPtr = world.snake_cells_ptr();
    const snakeCellsLen = world.snake_cells_len();
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      snakeCellsPtr,
      snakeCellsLen
    );
    return snakeCells;
  }

  function drawWorld() {
    ctx.beginPath();

    for (let index = 0; index < worldWidth + 1; index++) {
      const x = index;
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, worldSize * cellSize);

      const y = index;
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(worldSize * cellSize, y * cellSize);
    }

    ctx.stroke();
  }

  function drawReward() {
    const idx = world.reward_cell();
    const col = idx % worldWidth;
    const row = Math.floor(idx / worldWidth);
    ctx.fillStyle = pallette.reward;
    ctx.beginPath();
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.stroke();
  }

  function drawSnake() {
    getSnakeCells().forEach((cellIndex, i) => {
      const col = cellIndex % worldWidth;
      const row = Math.floor(cellIndex / worldWidth);
      ctx.fillStyle = i === 0 ? pallette.head : pallette.body;
      ctx.beginPath();
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.stroke();
    });
  }

  function paint() {
    drawWorld();
    drawReward();
    drawSnake();
  }

  function update() {
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      requestAnimationFrame(update);
    }, 1000 / fps);
  }

  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
        return world.set_snake_direction(Direction.Up);
      case 'ArrowDown':
        return world.set_snake_direction(Direction.Down);
      case 'ArrowLeft':
        return world.set_snake_direction(Direction.Left);
      case 'ArrowRight':
        return world.set_snake_direction(Direction.Right);
    }
  });

  paint();
  update();
}

init(CELL_SIZE, WIDTH, SNAKE_SIZE, INITIAL_INDEX, FPS, DEFAULT_PALLETTE);
