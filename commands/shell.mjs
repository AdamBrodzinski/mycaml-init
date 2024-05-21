import { spawn } from "child_process";
import { isCommandMissing } from "../utils.mjs";

const COMMAND = "shell";
const DESCRIPTION = "Start an OCaml shell";
const UTOP_MISSING_MSG =
  "utop is required and is not installed. Please run `opam install utop` and try again";

async function handler(_args) {
  if (await isCommandMissing("utop", UTOP_MISSING_MSG)) return;

  const utop = spawn("utop", { stdio: "inherit" });

  utop.on("error", (error) => {
    console.log("Failed to start subprocess.");
    console.error(error);
  });

  utop.on("exit", (code, signal) => {
    if (code) console.log(`Process exit code: ${code}`);
    if (signal) console.log(`Process killed with signal: ${signal}`);
  });
}

export const shell = {
  COMMAND,
  DESCRIPTION,
  handler,
};
