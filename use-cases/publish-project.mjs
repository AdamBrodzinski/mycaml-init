export function attachCommandPublish(program) {
  program.command("publish").description("Publish your OCaml project").action(handler);
}

function handler() {
  console.log("\nPlease see the opam guide for publishing packages:");
  console.log("https://opam.ocaml.org/doc/Packaging.html");
}
