import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { TEMPLATES, today, c } from "./util.mjs";

const exists = (p) => access(p).then(() => true).catch(() => false);

function nextEpicId(phase) {
  const num = (phase.id || "").replace(/\D/g, "") || "1";
  let max = 0;
  for (const e of phase.epics || []) {
    const m = new RegExp(`^E${num}\\.(\\d+)$`).exec(e.id || "");
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `E${num}.${max + 1}`;
}

// Create an epic stub in roadmap.json + a markdown body, ready for AI to fill.
export async function epicNew(title, opts = {}) {
  const dir = path.resolve(process.cwd(), opts.dir || "docs/board");
  const roadmapPath = path.join(dir, "roadmap.json");
  if (!(await exists(roadmapPath))) {
    throw new Error(`No roadmap.json in ${opts.dir || "docs/board"}. Run \`agentkan init\` first.`);
  }
  const roadmap = JSON.parse(await readFile(roadmapPath, "utf8"));
  if (!roadmap.phases?.length) throw new Error("roadmap.json has no phases.");

  const phase = opts.phase
    ? roadmap.phases.find((p) => p.id === opts.phase)
    : roadmap.phases.find((p) => p.status === "active") || roadmap.phases[roadmap.phases.length - 1];
  if (!phase) throw new Error(`Phase ${opts.phase} not found.`);
  phase.epics = phase.epics || [];

  const id = opts.id || nextEpicId(phase);
  if (phase.epics.some((e) => e.id === id)) throw new Error(`Epic ${id} already exists.`);

  const labels = opts.labels ? String(opts.labels).split(",").map((s) => s.trim()).filter(Boolean) : [];
  const assignee = opts.assignee || "ai";
  const order = phase.epics.length + 1;

  const epic = {
    id,
    title,
    emoji: opts.emoji || "🧩",
    status: "backlog",
    assignee,
    labels,
    planned: opts.planned || null,
    order,
    goal: opts.goal || "TODO: one line, what done looks like.",
    exit: opts.exit || "TODO: one AI-verifiable line, observable behavior.",
    body: `epics/${id}.md`,
    tasks: [],
  };
  if (opts.release) epic.release = opts.release;
  else if (phase.release) epic.release = phase.release;
  phase.epics.push(epic);
  roadmap.updated = today();
  await writeFile(roadmapPath, JSON.stringify(roadmap, null, 2) + "\n");

  // Markdown body from template.
  const bodyPath = path.join(dir, "epics", `${id}.md`);
  let tpl = await readFile(path.join(TEMPLATES, "epic.md"), "utf8");
  tpl = tpl
    .replaceAll("{{ID}}", id)
    .replaceAll("{{TITLE}}", title)
    .replaceAll("{{STATUS}}", "backlog")
    .replaceAll("{{ASSIGNEE}}", assignee)
    .replaceAll("{{PLANNED}}", epic.planned || "—")
    .replaceAll("{{GOAL}}", epic.goal)
    .replaceAll("{{EXIT}}", epic.exit);
  await writeFile(bodyPath, tpl);

  console.log(c.green(`Created ${id}`) + ` "${title}"  ${c.dim("[" + assignee + "]")}`);
  console.log(`  ${c.dim("body")}  ${opts.dir || "docs/board"}/epics/${id}.md`);
  console.log("");
  console.log(c.bold("Next:") + " ask your AI to fill it, e.g.");
  console.log(c.dim(`  "Fill epic ${id}: ask me the questions you need, then write goal, exit, and tasks."`));
}
