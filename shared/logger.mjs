export function print(...args) {
  console.log(...args);
}
export function debug(...args) {
  if (!!process.env.MYCAML_VERBOSE) {
    console.log(...args);
  }
}
