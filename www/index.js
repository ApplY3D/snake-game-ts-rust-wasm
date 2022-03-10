async function init() {
  const resWasm = await fetch('sum.wasm');
  const buffer = await resWasm.arrayBuffer();

  const wasm = await WebAssembly.instantiate(buffer);
  const { sum } = wasm.instance.exports;
  const res = sum(100, 1000);
  alert(res); // -> 1100
}

init();
