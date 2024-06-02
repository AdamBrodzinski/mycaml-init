import { spawn } from "child_process";
import { isUtopMissing } from "../shared/platform.mjs";

export function attachCommandShell(program) {
  program.command("shell").description("Start an OCaml shell").action(handler);
}

async function handler(_args) {
  if (await isUtopMissing()) return;

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
