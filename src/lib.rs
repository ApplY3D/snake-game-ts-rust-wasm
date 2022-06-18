use wasm_bindgen::prelude::*;

// should be built with `wasm-pack build --target web`

#[wasm_bindgen]
pub struct World {
    width: usize,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize) -> World {
        World { width }
    }
    pub fn width(&self) -> usize {
        self.width
    }
}
