import fs from "fs";
import { exec } from "child_process";
import TOML from "smol-toml";

const CONFIG_FILENAME = "mycaml.toml";

const DUNE_MISSING_MSG =
  "dune is required and is not installed. Please run `opam update; opam install dune` and try again";

export function isCommandMissing(command, msg) {
  let errMessage = msg ? msg : "Error, command ${command} is not available on the path";

  return new Promise((resolve) => {
    exec(`which ${command}`, (error, _stdout, stderr) => {
      if (error || stderr) {
        console.log(errMessage);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function isDuneMissing() {
  return isCommandMissing("dune", DUNE_MISSING_MSG);
}

export function print(...args) {
  console.log(...args);
}

export function parseConfig() {
  try {
    debug("Parsing toml config...");
    const configToml = fs.readFileSync(findConfigPath(), "utf8");
    debug("Config TOML:\n\n", configToml);
    const configJson = TOML.parse(configToml);
    debug("Config JSON:", configJson);
    return configJson;
  } catch (err) {
    if (err?.code === "ENOENT") {
      throw new Error("Could not find a mycaml.toml file in this directory, expected it to exist");
    }
    throw err;
  }
}

export function writeConfig(configJson) {
  // TODO: check for file before writing new one
  debug("Writing toml config to disk...");
  const tomlStr = TOML.stringify(configJson);
  if (isDryRun()) {
    debug("Dry run flag found, skipping toml write");
    debug(tomlStr);
    return;
  }
  fs.writeFileSync(findConfigPath(), tomlStr);
}

function findConfigPath() {
  return `${process.cwd()}/${CONFIG_FILENAME}`;
}

export function debug(...args) {
  if (!!process.env.MYCAML_VERBOSE) {
    console.log(...args);
  }
}

export function isDryRun() {
  return !!process.env.MYCAML_DRY_RUN;
}

export function updateOpam() {
  // TODO: check for last opam update and run
  console.log("TODO");
}
