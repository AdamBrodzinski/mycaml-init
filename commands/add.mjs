import { spawn } from "child_process";
import { isDuneMissing } from "../utils.mjs";
import { parseConfig, writeConfig } from "../utils.mjs";

const COMMAND = "add <package> <version>";
const DESCRIPTION = "Add packages to your project, optionally as dev dependencies";

async function handler(packageName, version, options) {
  if (await isDuneMissing()) return;
  console.log({ packageName, version });
  console.log(`Dev: ${options.dev ? "Yes" : "No"}`);

  const hasDoubleDash = process.argv.includes("--");
  const opamArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const configJson = parseConfig();
  console.log("CONFIG", configJson);

  if (configJson.dependencies === undefined) {
    configJson.dependencies = {};
  }
  configJson.dependencies[packageName] = version;

  writeConfig(configJson);

  const utop = spawn("opam", ["install", packageName, ...opamArgs], { stdio: "inherit" });

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
