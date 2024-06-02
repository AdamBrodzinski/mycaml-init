import fs from "fs";
import TOML from "smol-toml";
import { debug } from "./logger.mjs";
import { isDryRun } from "./utils.mjs";

const CONFIG_FILENAME = "mycaml.toml";

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
