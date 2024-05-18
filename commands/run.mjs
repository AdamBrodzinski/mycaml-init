import { spawn } from "child_process";
import { isDuneMissing } from "../utils.mjs";

const COMMAND = "run";
const DESCRIPTION = "Run your project with Dune exec";

async function handler(_args, _options, _command) {
  if (await isDuneMissing()) return;

  const hasDoubleDash = process.argv.includes("--");
  const duneArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];
  const projectName = "foo";

  const utop = spawn("dune", ["exec", "--", projectName], { stdio: "inherit" });

  utop.on("error", (error) => {
    console.log("Failed to start subprocess.");
    console.error(error);
  });

  utop.on("exit", (code, signal) => {
    if (code) console.log(`Process exit code: ${code}`);
    if (signal) console.log(`Process killed with signal: ${signal}`);
  });
}

export const run = {
  COMMAND,
  DESCRIPTION,
  handler,
};
