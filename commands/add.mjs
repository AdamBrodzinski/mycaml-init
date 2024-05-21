import { parseConfig, writeConfig, debug, isDuneMissing, updateOpam } from "../utils.mjs";
import { spawn } from "child_process";

const COMMAND = "add <package> <version>";
const DESCRIPTION = "Add an opam package to your project";

async function handler(packageName, version, options) {
  if (await isDuneMissing()) return;
  debug("Package name:", packageName);
  debug("Package version:", version);
  debug(`Dev flag: ${options.dev ? "true" : "false"}`);
  debug(`Test flag: ${options.test ? "true" : "false"}`);

  // if user passes -- and opam args, pass them through
  const hasDoubleDash = process.argv.includes("--");
  const opamArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const configJson = parseConfig();

  // dev flag
  if (options.dev) {
    if (configJson["dev-dependencies"] === undefined) {
      debug("[dev-dependencies] not found in toml, adding...");
      configJson["dev-dependencies"] = {};
    }
    debug("Adding dev dep:", packageName, "version:", version);
    configJson["dev-dependencies"][packageName] = version;
    // clear other deps
    configJson["test-dependencies"] && (configJson["test-dependencies"][packageName] = undefined);
    configJson.dependencies && (configJson.dependencies[packageName] = undefined);
  }
  // test flag
  else if (options.test) {
    if (configJson["test-dependencies"] === undefined) {
      debug("[test-dependencies] not found in toml, adding...");
      configJson["test-dependencies"] = {};
    }
    debug("Adding test dep:", packageName, "version:", version);
    configJson["test-dependencies"][packageName] = version;
    // clear other deps
    configJson["dev-dependencies"] && (configJson["dev-dependencies"][packageName] = undefined);
    configJson.dependencies && (configJson.dependencies[packageName] = undefined);
  }
  // reg dependency
  else {
    if (configJson.dependencies === undefined) {
      debug("[dependencies] not found in toml, adding...");
      configJson.dependencies = {};
    }
    debug("Adding dep:", packageName, "version:", version);
    configJson.dependencies[packageName] = version;
    // clear other deps
    configJson["test-dependencies"] && (configJson["test-dependencies"][packageName] = undefined);
    configJson["dev-dependencies"] && (configJson["dev-dependencies"][packageName] = undefined);
  }

  writeConfig(configJson);
  updateOpam();

  // TODO: handle <= and =
  const utop = spawn("opam", ["install", `${packageName}.${version}`, ...opamArgs], {
    stdio: "inherit",
  })
    .on("error", console.log)
    .on("exit", (code, signal) => {
      if (code) console.log(`Process exit code: ${code}`);
      if (signal) console.log(`Process killed with signal: ${signal}`);
      if (code === 0) {
        console.log("Process completed successfully.");
      }
    });
}

export const add = {
  COMMAND,
  DESCRIPTION,
  handler,
};
