import { program } from "commander";

import { add, build, run, shell } from "./commands/index.mjs";

program.name("ocaml").description("OCaml Command Line Tool").version("0.1.0");

program.command("new").description("");
program.command(build.COMMAND).description(build.DESCRIPTION).action(build.handler);
program.command(run.COMMAND).description(run.DESCRIPTION).action(run.handler);
program
  .command(add.COMMAND)
  .description(add.DESCRIPTION)
  .option("--dev", "Add as dev dependency")
  .action(add.handler);

program
  .command("remove <package-names...>")
  .description("Remove packages from your project")
  .action((packageNames) => {
    console.log(`Removing packages: ${packageNames.join(", ")}...`);
  });

program
  .command("docs")
  .description("Generate documentation")
  .action(() => console.log("Generating documentation..."));

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
