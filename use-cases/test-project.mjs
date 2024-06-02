export function attachCommandTest(program) {
  program
    .command("test")
    .description("Run tests for your OCaml project")
    .action(() => {
      // TODO
      console.log("Running tests...");
    });
}
