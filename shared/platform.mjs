import { exec } from "child_process";

const DUNE_MISSING_MSG =
  "dune is required and is not installed. Please run `opam update; opam install dune` and try again";

const UTOP_MISSING_MSG =
  "utop is an enhanced shell for OCaml and was not found. Please run `opam install utop` and try again";

export function isDuneMissing() {
  return isCommandMissing("dune", DUNE_MISSING_MSG);
}

export function isUtopMissing() {
  return isCommandMissing("utop", UTOP_MISSING_MSG);
}

export function updateOpam() {
  // TODO: check for last opam update and run
  console.log("TODO");
}

function isCommandMissing(command, msg) {
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
