import initWasm, { World } from 'snake_game';

const CELL_SIZE = 50;
const WIDTH = 8;

/**
 *
 * @param {number} cellSize
 * @param {number} worldWidth
 */
async function init(cellSize, worldWidth) {
  const wasm = await initWasm();
  const world = World.new(worldWidth);
  const worldSize = worldWidth * cellSize;

  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('game');
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

  drawWorld();
}

init(CELL_SIZE, WIDTH);
