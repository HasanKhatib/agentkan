import { fileURLToPath } from "node:url";
import path from "node:path";

export const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const ASSETS = path.join(PKG_ROOT, "assets");
export const TEMPLATES = path.join(PKG_ROOT, "templates");

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
