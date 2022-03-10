async function init() {
  const objToImport = {
    console: {
      log: () => console.log('console.log'),
      error: () => console.error('console.error'),
    },
  };
  const resWasm = await fetch('sum_with_import.wasm');
  const buffer = await resWasm.arrayBuffer();

  const wasm = await WebAssembly.instantiate(buffer, objToImport);
  const { sum } = wasm.instance.exports;
  const res = sum(100, 1000);
  alert(res); // -> 1100
}

init();
