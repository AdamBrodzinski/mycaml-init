import { parseConfig, writeConfig, debug, isDuneMissing } from "../utils.mjs";

const COMMAND = "remove <package>";
const DESCRIPTION = "Remove packages from your project";

async function handler(packageName) {
  if (await isDuneMissing()) return;
  debug("Package name:", packageName);

  // if user passes -- and opam args, pass them through
  const hasDoubleDash = process.argv.includes("--");
  const opamArgs = hasDoubleDash ? process.argv.slice(process.argv.indexOf("--") + 1) : [];

  const configJson = parseConfig();

  configJson.dependencies && (configJson.dependencies[packageName] = undefined);
  configJson["test-dependencies"] && (configJson["test-dependencies"][packageName] = undefined);
  configJson["dev-dependencies"] && (configJson["dev-dependencies"][packageName] = undefined);

  writeConfig(configJson);

  console.log(
    `Removed ${packageName} from project. If you would like to uninstall this from your global opam, run:  opam uninstall ${packageName}`,
  );
}

export const remove = {
  COMMAND,
  DESCRIPTION,
  handler,
};
