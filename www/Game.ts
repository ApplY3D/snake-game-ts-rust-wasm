import { InitOutput, Direction, GameStatus } from 'snake_game';
import { Drawer, DrawerConfig } from './Drawer';
import { WorldHelper, WorldHelperConfig } from './WorldHelper';

type GameConfig = { fps: number };

export class Game {
  private timeout: number | null = null;
  private wh: WorldHelper;
  private drawer: Drawer;

  constructor(
    private wasm: InitOutput,
    private document: Document,
    private gameConfig: GameConfig,
    worldConfig: WorldHelperConfig,
    drawerConfig: DrawerConfig
  ) {
    this.wh = new WorldHelper(wasm, worldConfig);
    this.drawer = new Drawer({ ...drawerConfig, wh: this.wh });
    this.initListeners();
    this.drawer.paint();
  }

  private initListeners() {
    this.document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowUp':
          return this.wh.setSnakeDirection(Direction.Up);
        case 'ArrowDown':
          return this.wh.setSnakeDirection(Direction.Down);
        case 'ArrowLeft':
          return this.wh.setSnakeDirection(Direction.Left);
        case 'ArrowRight':
          return this.wh.setSnakeDirection(Direction.Right);
      }
    });

    this.drawer.$btn.addEventListener('click', () => {
      if (this.wh.status === undefined) {
        this.stop();
        this.start();
      } else {
        this.stop();
        this.restart();
      }
    });
  }

  play() {
    const status = this.wh.status;
    if (status === GameStatus.Won || status === GameStatus.Lost) {
      this.drawer.drawButton('Try again');
      return this.stop();
    }
    this.timeout = setTimeout(() => {
      this.drawer.clear();
      this.wh.update();
      this.drawer.paint();
      requestAnimationFrame(() => this.play());
    }, 1000 / this.gameConfig.fps) as unknown as number;
  }

  private restart() {
    this.wh.recreate();
    this.drawer.drawButton('Start');
    this.play();
  }

  private start() {
    this.wh.start();
    this.drawer.drawButton('Restart');
    this.play();
  }

  private stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
}
