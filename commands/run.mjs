import { spawn } from "child_process";
import { print, isDuneMissing, parseConfig } from "../utils.mjs";

const COMMAND = "run";
const DESCRIPTION = "Run your project with Dune exec";

async function handler(opts, _command) {
  if (await isDuneMissing()) return;

  const options = opts.watch ? ["-w"] : [];
  const hasDoubleDash = process.argv.includes("--");
  const duneArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const config = parseConfig();
  if (!config["project-config"].name) {
    const msg =
      "Expected mycaml.toml to have project name to defined. Cannot run without a project name";
    print(msg);
    return;
  }
  const projectName = config["project-config"].name;

  const utop = spawn("dune", ["exec", "--", projectName, ...options, ...duneArgs], {
    stdio: "inherit",
  });

  utop.on("error", (error) => {
    print("Failed to start subprocess.");
    print(error);
  });

  utop.on("exit", (code, signal) => {
    if (code) print(`Process exit code: ${code}`);
    if (signal) print(`Process killed with signal: ${signal}`);
  });
}

export const run = {
  COMMAND,
  DESCRIPTION,
  handler,
};
