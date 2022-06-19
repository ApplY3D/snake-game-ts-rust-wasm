import { Direction, InitOutput, World } from 'snake_game';

export type WorldHelperConfig = {
  width: number;
  initialIndex: number;
  snakeSize: number;
};

export class WorldHelper {
  world: World;

  constructor(private wasm: InitOutput, private config: WorldHelperConfig) {
    this.world = this.createWorld();
  }

  private createWorld(): World {
    const { width, initialIndex, snakeSize } = this.config;
    return World.new(width, initialIndex, snakeSize);
  }

  get status() {
    return this.world.game_status();
  }

  get statusText() {
    return this.world.game_status_text();
  }

  get points() {
    return this.world.points();
  }

  get rewardIdx() {
    return this.world.reward_cell();
  }

  get cells() {
    const snakeCellsPtr = this.world.snake_cells_ptr();
    const snakeCellsLen = this.world.snake_cells_len();
    const snakeCells = new Uint32Array(
      this.wasm.memory.buffer,
      snakeCellsPtr,
      snakeCellsLen
    );
    return snakeCells;
  }

  start() {
    this.world.start_game();
  }

  recreate() {
    this.world = this.createWorld();
  }

  setSnakeDirection(dir: Direction) {
    this.world.set_snake_direction(dir);
  }

  update() {
    this.world.update();
  }
}
