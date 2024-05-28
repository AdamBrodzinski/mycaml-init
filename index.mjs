import { program } from "commander";
import { add, build, remove, run, shell, new_ } from "./commands/index.mjs";

program.name("mycaml").description("OCaml Command Line Tool").version("1.0.0");

program.command(new_.COMMAND).description(new_.DESCRIPTION).action(new_.handler);

program
  .command(build.COMMAND)
  .description(build.DESCRIPTION)
  .option("-w, --watch", "Automatically rebuild on change")
  .action(build.handler);

program
  .command(run.COMMAND)
  .description(run.DESCRIPTION)
  .option("-w, --watch", "Automatically restart on change")
  .action(run.handler);

program
  .command(add.COMMAND)
  .description(add.DESCRIPTION)
  .option("--dev", "Add as dev dependency")
  .option("--test", "Add as test dependency")
  .action(add.handler);

program.command(remove.COMMAND).description(remove.DESCRIPTION).action(remove.handler);

program.command(shell.COMMAND).description(shell.DESCRIPTION).action(shell.handler);

program
  .command("publish")
  .description("Publish your OCaml project")
  .action(() => {
    console.log("\nPlease see the opam guide for publishing packages:");
    console.log("https://opam.ocaml.org/doc/Packaging.html");
  });

program
  .command("test")
  .description("Run tests for your OCaml project")
  .action(() => {
    console.log("Running tests...");
  });

program.parse(process.argv);
