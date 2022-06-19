import { WorldHelper } from './WorldHelper';

type Colors = Record<'head' | 'body' | 'reward', string>;

export type DrawerConfig = {
  $status: HTMLElement;
  $points: HTMLElement;
  $btn: HTMLElement;
  $canvas: HTMLCanvasElement;
  colors: Colors;
  cellSize: number;
  width: number;
};

type DrawerConstructor = DrawerConfig & { wh: WorldHelper };

export class Drawer {
  $status: HTMLElement;
  $points: HTMLElement;
  $btn: HTMLElement;
  $canvas: HTMLCanvasElement;
  colors: Colors;
  width: number;
  cellSize: number;
  wh: WorldHelper;

  worldSize: number;
  ctx: CanvasRenderingContext2D;

  constructor(props: DrawerConstructor) {
    Object.assign(this, props);
    this.worldSize = this.width * this.cellSize;
    this.$canvas.height = this.worldSize;
    this.$canvas.width = this.worldSize;
    this.ctx = props.$canvas.getContext('2d');
  }

  drawWorld() {
    const { cellSize, worldSize, width } = this;
    this.ctx.beginPath();
    for (let index = 0; index < width + 1; index++) {
      const x = index;
      this.ctx.moveTo(x * cellSize, 0);
      this.ctx.lineTo(x * cellSize, worldSize * cellSize);
      const y = index;
      this.ctx.moveTo(0, y * cellSize);
      this.ctx.lineTo(worldSize * cellSize, y * cellSize);
    }
    this.ctx.stroke();
  }

  drawReward(rewardIdx: number) {
    const { cellSize, colors, width } = this;
    const col = rewardIdx % width;
    const row = Math.floor(rewardIdx / width);
    this.ctx.fillStyle = colors.reward;
    this.ctx.beginPath();
    this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    this.ctx.stroke();
  }

  drawSnake(cells: Uint32Array) {
    const { cellSize, colors, width } = this;
    for (let i = cells.length - 1; i >= 0; i--) {
      const cellIndex = cells[i];
      const col = cellIndex % width;
      const row = Math.floor(cellIndex / width);
      this.ctx.fillStyle = i === 0 ? colors.head : colors.body;
      this.ctx.beginPath();
      this.ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      this.ctx.stroke();
    }
  }

  drawStatus(status: string, points: number) {
    this.$status.textContent = status;
    this.$points.textContent = points.toString();
  }

  drawButton(text: string) {
    this.$btn.textContent = text;
  }

  paint() {
    this.drawWorld();
    this.drawReward(this.wh.rewardIdx);
    this.drawSnake(this.wh.cells);
    this.drawStatus(this.wh.statusText, this.wh.points);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
  }
}
