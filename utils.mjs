import { exec } from "child_process";

const DUNE_MISSING_MSG =
  "dune is required and is not installed. Please run `opam update; opam install dune` and try again";

export function isCommandMissing(command, msg) {
  let errMessage = msg
    ? msg
    : "Error, command ${command} is not available on the path";

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
