use wasm_bindgen::prelude::*;

// should be built with `wasm-pack build --target web`

struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
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
        }
    }
}

#[wasm_bindgen]
impl World {
    pub fn new(world_width: usize, snake_index: usize) -> World {
        if world_width < 1 {
            wasm_bindgen::throw_str("world_width must be greater than 0")
        }
        if snake_index >= world_width {
            wasm_bindgen::throw_str("snake_index must be less than world_width")
        }

        World {
            width: world_width,
            size: world_width * world_width,
            snake: Snake::new(snake_index),
        }
    }
    pub fn width(&self) -> usize {
        self.width
    }
    pub fn snake_head(&self) -> usize {
        self.snake.body[0].0
    }
    pub fn update(&mut self) {
        let snake_head = self.snake_head();
        self.snake.body[0].0 = (snake_head - 1) % self.size;
    }
}
