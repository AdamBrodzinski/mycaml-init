import { program } from "commander";

import { add, build, remove, run, shell } from "./commands/index.mjs";

program.name("ocaml").description("OCaml Command Line Tool").version("0.1.0");
program.command("new").description("");
program.command(build.COMMAND).description(build.DESCRIPTION).action(build.handler);
program.command(run.COMMAND).description(run.DESCRIPTION).action(run.handler);
program.command(remove.COMMAND).description(remove.DESCRIPTION).action(remove.handler);
program
  .command(add.COMMAND)
  .description(add.DESCRIPTION)
  .option("--dev", "Add as dev dependency")
  .option("--test", "Add as test dependency")
  .action(add.handler);

program.command(shell.COMMAND).description(shell.DESCRIPTION).action(shell.handler);

program
  .command("publish")
  .description("Publish your OCaml project")
  .action(() => {
    console.log("Publishing OCaml project...");
  });

program
  .command("test")
  .description("Run tests for your OCaml project")
  .action(() => {
    console.log("Running tests...");
  });

program.parse(process.argv);
