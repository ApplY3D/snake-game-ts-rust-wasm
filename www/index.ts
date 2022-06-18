import initWasm, { World } from 'snake_game';

const CELL_SIZE = 50;
const WIDTH = 8;
const INITIAL_INDEX = 1;

/**
 *
 * @param {number} cellSize
 * @param {number} worldWidth
 * @param {number} [initialIndex=0]
 */
async function init(cellSize: number, worldWidth: number, initialIndex = 0) {
  const wasm = await initWasm();
  const world = World.new(worldWidth, initialIndex);
  const worldSize = worldWidth * cellSize;

  const canvas = <HTMLCanvasElement>document.getElementById('game');
  const ctx = canvas.getContext('2d');
  canvas.height = worldSize;
  canvas.width = worldSize;

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

  function drawSnake() {
    const snakeIdx = world.snake_head();
    const col = snakeIdx % worldWidth;
    const row = Math.floor(snakeIdx / worldWidth);

    ctx.beginPath();
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawSnake();
  }

  function update() {
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      paint();
      requestAnimationFrame(update);
    }, 100);
  }

  paint();
  update();
}

init(CELL_SIZE, WIDTH, INITIAL_INDEX);
