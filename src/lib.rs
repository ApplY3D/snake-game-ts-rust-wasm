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
        let size = world_width * world_width;

        if world_width < 1 {
            wasm_bindgen::throw_str("world_width must be greater than 0")
        }
        if snake_index >= size {
            wasm_bindgen::throw_str(format!("snake_index must be less than {}", size).as_str())
        }

        World {
            width: world_width,
            size: size,
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
