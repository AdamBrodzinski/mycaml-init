import { spawn } from "child_process";
import { isDuneMissing } from "../utils.mjs";

const COMMAND = "build";
const DESCRIPTION = "Build your project with Dune";

async function handler(opts, _command) {
  if (await isDuneMissing()) return;
  const options = opts.watch ? ["-w"] : [];

  const hasDoubleDash = process.argv.includes("--");
  const duneArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const utop = spawn("dune", ["build", ...options, ...duneArgs], { stdio: "inherit" });

  utop.on("error", (error) => {
    console.log("Failed to start subprocess.");
    console.error(error);
  });

  utop.on("exit", (code, signal) => {
    if (code) console.log(`Process exit code: ${code}`);
    if (signal) console.log(`Process killed with signal: ${signal}`);
  });
}

export const build = {
  COMMAND,
  DESCRIPTION,
  handler,
};
