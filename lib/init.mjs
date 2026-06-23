import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { ASSETS, TEMPLATES, today, c } from "./util.mjs";

const exists = (p) => access(p).then(() => true).catch(() => false);

// Scaffold a board into <cwd>/<dir> (default docs/board).
export async function init({ dir = "docs/board", project, force = false } = {}) {
  const target = path.resolve(process.cwd(), dir);
  await mkdir(path.join(target, "epics"), { recursive: true });

  const proj = project || path.basename(process.cwd());
  const date = today();

  // Data files from templates, with placeholders filled.
  const fillers = [
    ["roadmap.json", (s) => s.replace("PROJECT_NAME", proj).replace("DATE", date)],
    ["archive.json", (s) => s.replace("DATE", date)],
    ["next.json", (s) => s.replace("DATE", date)],
    ["board.tokens.json", (s) => s],
  ];
  for (const [name, transform] of fillers) {
    const dest = path.join(target, name);
    if ((await exists(dest)) && !force) {
      console.log(c.yellow(`skip  ${dir}/${name} (exists)`));
      continue;
    }
    const src = await readFile(path.join(TEMPLATES, name), "utf8");
    await writeFile(dest, transform(src));
    console.log(c.green(`write ${dir}/${name}`));
  }

  // Static assets copied verbatim.
  for (const name of ["index.html", "favicon.svg", "roadmap.schema.json"]) {
    const dest = path.join(target, name);
    if ((await exists(dest)) && !force) {
      console.log(c.yellow(`skip  ${dir}/${name} (exists)`));
      continue;
    }
    await copyFile(path.join(ASSETS, name), dest);
    console.log(c.green(`write ${dir}/${name}`));
  }

  // Keep epics/ tracked even when empty.
  const keep = path.join(target, "epics", ".gitkeep");
  if (!(await exists(keep))) await writeFile(keep, "");

  console.log("");
  console.log(c.bold("Board ready.") + ` ${dir}/`);
  console.log(`  ${c.dim("run")}   npx agentkan serve ${dir === "docs/board" ? "" : dir}`);
  console.log(`  ${c.dim("add")}   npx agentkan epic new "My first epic"`);
}
