import { spawn } from "child_process";
import { isDuneMissing } from "../utils.mjs";

const COMMAND = "add <package-names...>";
const DESCRIPTION = "Add packages to your project, optionally as dev dependencies";

async function handler(names, _options, _command) {
  if (await isDuneMissing()) return;

  const hasDoubleDash = process.argv.includes("--");
  const duneArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const utop = spawn("opam", ["install", ...names, ...duneArgs], { stdio: "inherit" });

  utop.on("error", (error) => {
    console.log("Failed to start subprocess.");
    console.error(error);
  });

  utop.on("exit", (code, signal) => {
    if (code) console.log(`Process exit code: ${code}`);
    if (signal) console.log(`Process killed with signal: ${signal}`);
  });
}

export const add = {
  COMMAND,
  DESCRIPTION,
  handler,
};
