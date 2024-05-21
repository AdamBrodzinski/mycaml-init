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

export function parseConfig() {
  try {
    const config = fs.readFileSync(findConfigPath(), "utf8");
    return TOML.parse(config);
  } catch (err) {
    if (err?.code === "ENOENT") {
      console.log("Could not find a mycaml.toml file in this directory.");
      return;
    }
    throw err;
  }
}

export function writeConfig(configJson) {
  // TODO: check for file before writing new one
  const tomlStr = TOML.stringify(configJson);
  fs.writeFileSync(findConfigPath(), tomlStr);
}

function findConfigPath() {
  return `${process.cwd()}/${CONFIG_FILENAME}`;
}
