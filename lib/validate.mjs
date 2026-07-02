// Dependency-free validator for an agentkan roadmap.
// Mirrors assets/roadmap.schema.json but with friendlier messages and a few
// cross-cutting checks the JSON Schema can't express (unique IDs, label vocab).
import { readFile } from "node:fs/promises";
import path from "node:path";

const ASSIGNEES = new Set(["ai", "me", "ai+verify"]);
const EPIC_STATUS = new Set(["backlog", "next", "active", "blocked", "done"]);
const TASK_STATUS = new Set(["todo", "doing", "done"]);
const PHASE_STATUS = new Set(["planned", "active", "done"]);
const RELEASE_STATUS = new Set(["planned", "active", "done"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[A-Za-z0-9.]+$/;
const TASK_ID_RE = /^[A-Za-z0-9.]+-T[0-9]+$/;

function isDate(v) {
  return v === null || v === undefined || (typeof v === "string" && DATE_RE.test(v));
}

function validateReleases(doc, errors) {
  const releaseIds = new Set();
  if (doc.releases === undefined || doc.releases === null) return releaseIds;
  if (!Array.isArray(doc.releases)) {
    errors.push(`root: "releases" must be an array`);
    return releaseIds;
  }
  for (const r of doc.releases) {
    const rw = `release ${r.id || "?"}`;
    if (!r.id) errors.push(`${rw}: missing id`);
    else if (releaseIds.has(r.id)) errors.push(`${rw}: duplicate id "${r.id}"`);
    else releaseIds.add(r.id);
    if (!r.title) errors.push(`${rw}: missing title`);
    if (!RELEASE_STATUS.has(r.status)) errors.push(`${rw}: status "${r.status}" not one of planned|active|done`);
    if (r.releaseDoc !== undefined && r.releaseDoc !== null && typeof r.releaseDoc !== "string") {
      errors.push(`${rw}: releaseDoc must be a string`);
    }
  }
  return releaseIds;
}

function checkReleaseRef(releaseId, where, releaseIds, hasReleases, errors) {
  if (!releaseId) return;
  if (typeof releaseId !== "string") {
    errors.push(`${where}: release must be a string`);
    return;
  }
  if (hasReleases && !releaseIds.has(releaseId)) {
    errors.push(`${where}: release "${releaseId}" not in releases[]`);
  }
}

// Labels are free-form: any string is valid. board.tokens.json only assigns an
// emoji to known labels; unknown ones simply render without one.
export function validateRoadmap(doc) {
  const errors = [];
  const ids = new Map();
  const dupe = (id, where) => {
    if (!id) return;
    if (ids.has(id)) errors.push(`${where}: duplicate id "${id}" (also at ${ids.get(id)})`);
    else ids.set(id, where);
  };

  if (doc.version !== 1) errors.push(`root: version must be 1`);
  if (!Array.isArray(doc.phases)) {
    errors.push(`root: "phases" must be an array`);
    return errors;
  }
  if (!isDate(doc.updated)) errors.push(`root: "updated" must be YYYY-MM-DD`);

  const releaseIds = validateReleases(doc, errors);
  const hasReleases = doc.releases !== undefined && doc.releases !== null;

  for (const p of doc.phases) {
    const pw = `phase ${p.id || "?"}`;
    if (!p.id) errors.push(`${pw}: missing id`);
    if (!p.title) errors.push(`${pw}: missing title`);
    if (!PHASE_STATUS.has(p.status)) errors.push(`${pw}: status "${p.status}" not one of planned|active|done`);
    checkReleaseRef(p.release, pw, releaseIds, hasReleases, errors);
    if (!Array.isArray(p.epics)) {
      errors.push(`${pw}: "epics" must be an array`);
      continue;
    }
    for (const e of p.epics) {
      const ew = `epic ${e.id || "?"}`;
      dupe(e.id, ew);
      if (!e.id || !ID_RE.test(e.id)) errors.push(`${ew}: id missing or invalid (letters, digits, dots)`);
      if (!e.title) errors.push(`${ew}: missing title`);
      if (!EPIC_STATUS.has(e.status)) errors.push(`${ew}: status "${e.status}" not one of backlog|next|active|blocked|done`);
      if (!ASSIGNEES.has(e.assignee)) errors.push(`${ew}: assignee "${e.assignee}" not one of ai|me|ai+verify`);
      if (!e.goal) errors.push(`${ew}: missing goal`);
      if (!e.exit) errors.push(`${ew}: missing exit`);
      checkReleaseRef(e.release, ew, releaseIds, hasReleases, errors);
      if (e.releaseDoc !== undefined && e.releaseDoc !== null && typeof e.releaseDoc !== "string") {
        errors.push(`${ew}: releaseDoc must be a string`);
      }
      if (!isDate(e.planned)) errors.push(`${ew}: planned must be YYYY-MM-DD or null`);
      if (!isDate(e.shipped)) errors.push(`${ew}: shipped must be YYYY-MM-DD or null`);
      if (e.tasks) {
        if (!Array.isArray(e.tasks)) errors.push(`${ew}: "tasks" must be an array`);
        else for (const t of e.tasks) {
          const tw = `task ${t.id || "?"}`;
          dupe(t.id, tw);
          if (!t.id || !TASK_ID_RE.test(t.id)) errors.push(`${tw}: id missing or not of form <EPIC>-T<n>`);
          if (t.id && e.id && !t.id.startsWith(e.id + "-T")) errors.push(`${tw}: id does not belong to epic ${e.id}`);
          if (!t.title) errors.push(`${tw}: missing title`);
          if (!TASK_STATUS.has(t.status)) errors.push(`${tw}: status "${t.status}" not one of todo|doing|done`);
          if (t.assignee && !ASSIGNEES.has(t.assignee)) errors.push(`${tw}: assignee "${t.assignee}" invalid`);
          if (!isDate(t.planned)) errors.push(`${tw}: planned must be YYYY-MM-DD or null`);
        }
      }
    }
  }
  return errors;
}

export function validateArchive(doc, opts = {}) {
  const errors = [];
  if (doc.version !== 1) errors.push(`archive root: version must be 1`);
  if (!Array.isArray(doc.epics)) {
    errors.push(`archive root: "epics" must be an array`);
    return errors;
  }
  const releaseIds = opts.releaseIds || new Set();
  const hasReleases = opts.hasReleases || false;
  const fake = { version: 1, updated: doc.updated, phases: [{ id: "ARCHIVE", title: "Archive", status: "done", epics: doc.epics }] };
  if (hasReleases) fake.releases = [...releaseIds].map((id) => ({ id, title: id, status: "done" }));
  return errors.concat(
    validateRoadmap(fake)
      .filter((e) => !e.startsWith("phase ARCHIVE") && !e.startsWith("release "))
  );
}

export async function validateBoard(dir) {
  const out = { ok: true, errors: [] };

  const roadmap = JSON.parse(await readFile(path.join(dir, "roadmap.json"), "utf8"));
  out.errors.push(...validateRoadmap(roadmap));

  const hasReleases = roadmap.releases !== undefined && roadmap.releases !== null;
  const releaseIds = new Set((roadmap.releases || []).map((r) => r.id).filter(Boolean));

  try {
    const archive = JSON.parse(await readFile(path.join(dir, "archive.json"), "utf8"));
    out.errors.push(...validateArchive(archive, { releaseIds, hasReleases }));
  } catch { /* archive optional */ }

  out.ok = out.errors.length === 0;
  return out;
}
