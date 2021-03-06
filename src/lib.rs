use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/www/utils/rnd.js")]
extern "C" {
    fn rnd(from: usize, to: usize) -> usize;
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameStatus {
    Won,
    Lost,
    Play,
}

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left,
}

#[derive(Clone, Copy, PartialEq)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
    reward_cell: Option<usize>,
    status: Option<GameStatus>,
    points: usize,
}

impl Snake {
    fn new(index: usize, size: usize) -> Snake {
        let mut body = vec![SnakeCell(index)];

        for i in 0..size - 1 {
            body.push(SnakeCell(index - i - 1))
        }

        Snake {
            body,
            direction: Direction::Right,
        }
    }
}

#[wasm_bindgen]
impl World {
    pub fn new(world_width: usize, snake_index: usize, snake_size: usize) -> World {
        World::create_world(world_width, snake_index, snake_size)
    }

    fn create_world(world_width: usize, snake_index: usize, snake_size: usize) -> World {
        let size = world_width * world_width;
        let reward_count = 1;

        if world_width < 1 {
            wasm_bindgen::throw_str("world_width must be greater than 0")
        }
        if snake_index >= size {
            wasm_bindgen::throw_str(format!("snake_index must be less than {}", size).as_str())
        }
        if snake_size + reward_count >= size {
            wasm_bindgen::throw_str(
                format!(
                    "snake_size {} + reward_count {} overflow world_size {}",
                    snake_size, reward_count, size
                )
                .as_str(),
            )
        }

        let snake = Snake::new(snake_index, snake_size);

        World {
            size,
            width: world_width,
            reward_cell: World::gen_reward_cell(size - 1, &snake.body),
            snake,
            next_cell: None,
            status: None,
            points: 0,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    fn gen_reward_cell(max: usize, snake_body: &Vec<SnakeCell>) -> Option<usize> {
        let mut reward_cell: usize;

        loop {
            reward_cell = rnd(0, max);
            if !snake_body.contains(&SnakeCell(reward_cell)) {
                break;
            }
        }

        Some(reward_cell)
    }

    pub fn points(&self) -> usize {
        self.points
    }

    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn reward_cell(&self) -> Option<usize> {
        self.reward_cell
    }

    pub fn start_game(&mut self) {
        self.status = Some(GameStatus::Play);
    }

    pub fn game_status(&self) -> Option<GameStatus> {
        self.status
    }

    pub fn game_status_text(&self) -> String {
        match self.status {
            Some(GameStatus::Won) => "Won".to_string(),
            Some(GameStatus::Lost) => "Lost".to_string(),
            Some(GameStatus::Play) => "Play".to_string(),
            None => "No status".to_string(),
        }
    }

    pub fn set_snake_direction(&mut self, direction: Direction) {
        let next_cell = self.get_next_snake_cell(&direction);
        if self.snake.body[1].0 == next_cell.0 {
            return;
        }
        self.next_cell = Option::Some(next_cell);
        self.snake.direction = direction;
    }

    pub fn update(&mut self) {
        match self.status {
            Some(GameStatus::Play) => {
                let mut temp = self.snake.body.clone();

                match self.next_cell {
                    Option::Some(cell) => {
                        self.snake.body[0] = cell;
                        self.next_cell = None;
                    }
                    Option::None => {
                        self.snake.body[0] = self.get_next_snake_cell(&self.snake.direction);
                    }
                }

                for i in 1..self.snake_cells_len() {
                    self.snake.body[i] = SnakeCell(temp[i - 1].0);
                }

                if self.snake.body[1..self.snake_cells_len()].contains(&self.snake.body[0]) {
                    self.status = Some(GameStatus::Lost)
                }

                if self.reward_cell == Some(self.snake_head()) {
                    if self.snake_cells_len() < self.size {
                        self.points += 1;
                        self.reward_cell = World::gen_reward_cell(self.size - 1, &self.snake.body);
                    } else {
                        self.reward_cell = None;
                        self.status = Some(GameStatus::Won)
                    }

                    self.snake.body.push(SnakeCell(self.snake.body[1].0));
                }
            }
            _ => {}
        }
    }

    fn get_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_head = self.snake_head();
        let row = snake_head / self.width;

        return match direction {
            Direction::Right => SnakeCell((row * self.width + (snake_head + 1) % self.width)),
            Direction::Left => SnakeCell((row * self.width + (snake_head - 1) % self.width)),
            Direction::Up => SnakeCell((snake_head - self.width) % self.size),
            Direction::Down => SnakeCell((snake_head + self.width) % self.size),
        };
    }

    pub fn snake_cells_ptr(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn snake_cells_len(&self) -> usize {
        self.snake.body.len()
    }
}
