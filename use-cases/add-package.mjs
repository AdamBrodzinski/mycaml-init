import { isDuneMissing } from "../shared/platform.mjs";
import { parseConfig, writeConfig } from "../shared/config.mjs";
import { updateOpam } from "../shared/platform.mjs";
import { print, debug } from "../shared/logger.mjs";
import { spawn } from "child_process";

export function attachCommandAdd(program) {
  program
    .command("add <package> <version>")
    .description("Add an opam package to your project")
    .option("--dev", "Add as dev dependency")
    .option("--test", "Add as test dependency")
    .action(handler);
}

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

  const packageNameVersion = version.match(/^\d/)
    ? `${packageName}.${version}`.replace(/\s/g, "")
    : `${packageName}${version}`.replace(/\s/g, "");

  spawn("opam", ["install", packageNameVersion, ...opamArgs], {
    stdio: "inherit",
  })
    .on("error", print)
    .on("exit", (code, signal) => {
      if (code) print(`Process exit code: ${code}`);
      if (signal) print(`Process killed with signal: ${signal}`);
      if (code === 0) {
        print("Process completed successfully.");
      }
    });
}
