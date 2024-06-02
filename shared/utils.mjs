export function isDryRun() {
  return !!process.env.MYCAML_DRY_RUN;
}
