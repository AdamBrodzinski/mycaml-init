import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

import { isDuneMissing } from "../shared/platform.mjs";
import { print, debug } from "../shared/logger.mjs";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(MODULE_DIR, "../templates");

export function attachCommandNew(program) {
  program.command("new").description("Create new project from template").action(handler);
}

async function handler() {
  if (await isDuneMissing()) return;

  inquirer
    .prompt([
      {
        type: "list",
        name: "template",
        message: `
----------------- Please choose a starting template -----------------
Minimal executable:
  only contains enough scaffolding to print hello world

OCaml library:
  a minimal config to produce your own library (internal or opam)

JSON API:
  a minimal REST endpoint app using the Dream framework. Includes a fly.io
  docker file, logging, JSON parsing library, and optional Postgres database

Htmx wep app:
  a minimal html app using the Dream framework. Includes a fly.io docker 
  file, logging, html & htmx libraries, and optional Postgres database

Riot stack:
  a multi-core scheduler based on the Erlang/Elixr runtime that brings
  massive concurrency to the OCaml platform. Currently experimental and
  not production ready.

Advent of Code starter:
  boilerplate with common libraries needed to complete the Advent of Code
\n`,
        choices: [
          "Minimal executible",
          "OCaml library",
          "JSON API",
          "Htmx web app",
          "Riot stack",
          "Advent of Code starter",
        ],
      },
      {
        name: "projectName",
        message: "What is your project name? (lowercase & underscore)",
        default: "app",
      },
    ])
    .then((answers) => {
      const projectName = answers.projectName.trim().toLowerCase();

      print("Generating project", projectName, "...");

      debug("MODULE_DIR", MODULE_DIR);
      debug("TEMPLATE_DIR", TEMPLATE_DIR);

      if (isNameInvalid(projectName)) {
        print(
          "Project name is invalid. Name must start with a-z and the following characters can be a-z, _, or 0-9",
        );
        return;
      }

      const projectDir = `${process.cwd()}/${projectName}`;
      debug("Project directory", projectDir);
      if (fs.existsSync(projectDir)) {
        print(`Project folder "${projectName}" already exists. Exiting`);
        return;
      }

      createBasicProject({ projectDir, projectName });
      print(
        `Project created! change into the directory ${projectName} and run "mycaml build" and "mycaml run" to run the project`,
      );
    });
}

function createBasicProject({ projectDir, projectName }) {
  const template = `${TEMPLATE_DIR}/basic`;
  debug("Copying template folder to cwd:", template);
  fs.cpSync(template, projectDir, { recursive: true });

  transformRootConfig({ projectDir, projectName });
  transformVariables(`${projectDir}/src/dune`, [["{{project_name}}", projectName]]);
}

function transformVariables(filePath, variables) {
  try {
    let file = fs.readFileSync(filePath, "utf8");
    for (const [variable, replacement] of variables) {
      file = file.replaceAll(variable, replacement);
    }
    fs.writeFileSync(filePath, file, "utf8");
  } catch (err) {
    print("Error transforming template variables...");
    throw err;
  }
}

function transformRootConfig({ projectDir, projectName }) {
  const duneVersion = getDuneVersion();
  const ocamlVersion = getOCamlVersion();

  transformVariables(`${projectDir}/dune-project`, [
    ["{{dune_version}}", duneVersion],
    ["{{project_name}}", projectName],
    ["{{ocaml_version}}", ocamlVersion],
  ]);
  transformVariables(`${projectDir}/mycaml.toml`, [
    ["{{dune_version}}", duneVersion],
    ["{{project_name}}", projectName],
    ["{{ocaml_version}}", ocamlVersion],
  ]);
}

function isNameInvalid(name) {
  return !/^[a-z][a-z0-9_]+$/.test(name);
}

function getDuneVersion() {
  debug("Checking dune version...");
  let duneVersion = execSync("dune --version", { encoding: "utf8" }).trim();
  // dune-project does not accept the minor version, removing that
  duneVersion = duneVersion.replace(/\.\d\d?$/, "");
  debug("Dune version", duneVersion);
  return duneVersion;
}

function getOCamlVersion() {
  debug("Checking OCaml version...");
  let ocamlVersion = execSync("ocaml --version", { encoding: "utf8" }).trim();
  // remove the text "The OCaml toplevel, version "
  ocamlVersion = ocamlVersion.replace(/[^\d\.]/g, "");
  debug("OCaml version", ocamlVersion);
  return ocamlVersion;
}
