import { copyFile, access } from "node:fs/promises";
import path from "node:path";
import { ASSETS, c } from "./util.mjs";

// Static assets that ship with the package and are never hand-edited by a board.
const STATIC_ASSETS = ["index.html", "favicon.svg", "roadmap.schema.json"];
const exists = (p) => access(p).then(() => true).catch(() => false);

// Refresh a board's viewer to match the installed agentkan version, without
// touching roadmap.json / archive.json / next.json / board.tokens.json / epics.
export async function upgrade({ dir = "docs/board" } = {}) {
  const target = path.resolve(process.cwd(), dir);
  if (!(await exists(path.join(target, "roadmap.json")))) {
    throw new Error(`No roadmap.json in ${dir}. Run \`agentkan init ${dir}\` first.`);
  }

  for (const name of STATIC_ASSETS) {
    await copyFile(path.join(ASSETS, name), path.join(target, name));
    console.log(c.green(`write ${dir}/${name}`));
  }

  console.log("");
  console.log(c.bold("Viewer updated.") + ` ${dir}/`);
}
