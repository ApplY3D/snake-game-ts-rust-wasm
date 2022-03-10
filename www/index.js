async function init() {
  const objToImport = {
    console: {
      log: () => console.log('console.log'),
      error: () => console.error('console.error'),
    },
  };
  const resWasm = await fetch('sum_with_export.wasm');
  const buffer = await resWasm.arrayBuffer();

  const wasm = await WebAssembly.instantiate(buffer, objToImport);
  const { sum, mem } = wasm.instance.exports;

  const res = sum(100, 1000);
  console.log(res); // -> 1100

  const fiveBytes = new Uint8Array(mem.buffer, 0, 5);
  const helloText = new TextDecoder().decode(fiveBytes);
  console.log(helloText); // -> "Hello"
}

init();
