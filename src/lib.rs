use wasm_bindgen::prelude::*;

// should be built with `wasm-pack build --target web`

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left,
}

struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

impl Snake {
    fn new(index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(index)],
            direction: Direction::Right,
        }
    }
}

#[wasm_bindgen]
impl World {
    pub fn new(world_width: usize, snake_index: usize) -> World {
        let size = world_width * world_width;

        if world_width < 1 {
            wasm_bindgen::throw_str("world_width must be greater than 0")
        }
        if snake_index >= size {
            wasm_bindgen::throw_str(format!("snake_index must be less than {}", size).as_str())
        }

        World {
            size,
            width: world_width,
            snake: Snake::new(snake_index),
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn set_snake_direction(&mut self, direction: Direction) {
        self.snake.direction = direction;
    }

    pub fn update(&mut self) {
        let snake_head = self.snake_head();

        let (row, col) = self.index_to_cell(snake_head);
        let (row, col) = match self.snake.direction {
            Direction::Right => (row, (col + 1) % self.width),
            Direction::Left => (row, (col - 1) % self.width),
            Direction::Up => ((row - 1) % self.width, col),
            Direction::Down => ((row + 1) % self.width, col),
        };

        let next_idx = self.cell_to_index(row, col);
        self.set_snake_head(next_idx)
    }

    fn set_snake_head(&mut self, index: usize) {
        self.snake.body[0].0 = index
    }

    fn index_to_cell(&self, index: usize) -> (usize, usize) {
        (index / self.width, index % self.width)
    }

    fn cell_to_index(&self, row: usize, col: usize) -> usize {
        (row * self.width) + col
    }
}
