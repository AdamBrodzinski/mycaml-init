import { program } from "commander";
import { attachCommandAdd } from "./use-cases/add-package.mjs";
import { attachCommandBuild } from "./use-cases/build-project.mjs";
import { attachCommandNew } from "./use-cases/new-project.mjs";
import { attachCommandPublish } from "./use-cases/publish-project.mjs";
import { attachCommandRemove } from "./use-cases/remove-package.mjs";
import { attachCommandRun } from "./use-cases/run-project.mjs";
import { attachCommandShell } from "./use-cases/shell.mjs";
import { attachCommandTest } from "./use-cases/test-project.mjs";

program.name("mycaml").description("OCaml Command Line Tool").version("1.0.0");

attachCommandAdd(program);
attachCommandBuild(program);
attachCommandNew(program);
attachCommandPublish(program);
attachCommandRemove(program);
attachCommandRun(program);
attachCommandShell(program);
attachCommandTest(program);

program.parse(process.argv);
