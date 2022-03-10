async function init() {
  const memory = new WebAssembly.Memory({ initial: 1 });

  const objToImport = {
    js: {
      mem: memory,
    },
    console: {
      log: () => console.log('console.log'),
      error: () => console.error('console.error'),
    },
  };
  const resWasm = await fetch('sum_with_import_v2.wasm');
  const buffer = await resWasm.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer, objToImport);

  const fiveBytes = new Uint8Array(memory.buffer, 0, 5);
  const helloText = new TextDecoder().decode(fiveBytes);
  console.log(helloText); // -> "Hello"
}

init();
