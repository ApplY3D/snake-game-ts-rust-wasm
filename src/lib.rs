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

#[derive(Clone, Copy)]
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
}

impl Snake {
    fn new(index: usize, size: usize) -> Snake {
        let mut body = vec![SnakeCell(index)];

        for i in 0..size {
            body.push(SnakeCell(index - i))
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
            snake: Snake::new(snake_index, snake_size),
            next_cell: None,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
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

        for i in 1..self.snake.body.len() {
            self.snake.body[i] = SnakeCell(temp[i - 1].0);
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
