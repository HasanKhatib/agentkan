#!/usr/bin/env bash
# validate.sh — check Agent Skill structure against Anthropic authoring rules
# Usage: bash scripts/validate.sh [path/to/skill-dir]
# Exit 0 if valid (warnings may still print). Exit 1 on errors.

set -euo pipefail

SKILL_DIR="${1:-.}"
SKILL_FILE="$SKILL_DIR/SKILL.md"
ERRORS=0
WARNINGS=0

err() { echo "ERROR: $*"; ERRORS=$((ERRORS + 1)); }
warn() { echo "WARN:  $*"; WARNINGS=$((WARNINGS + 1)); }
ok() { echo "OK:    $*"; }

if [[ ! -f "$SKILL_FILE" ]]; then
  err "Missing SKILL.md in $SKILL_DIR"
  echo ""
  echo "Result: $ERRORS error(s), $WARNINGS warning(s)"
  exit 1
fi

# --- Frontmatter extraction ---
FRONTMATTER=$(awk '/^---$/{c++; if(c==1) next; if(c==2) exit} c==1' "$SKILL_FILE")

NAME=$(echo "$FRONTMATTER" | grep -E '^name:' | head -1 | sed 's/^name:[[:space:]]*//' | tr -d '\r')
DESCRIPTION=$(echo "$FRONTMATTER" | sed -n 's/^description:[[:space:]]*//p' | tr -d '\r' | head -1)

if [[ -z "$NAME" ]]; then
  err "Frontmatter missing required field: name"
else
  ok "name: $NAME"
  if [[ ${#NAME} -gt 64 ]]; then
    err "name exceeds 64 characters (${#NAME})"
  fi
  if [[ ! "$NAME" =~ ^[a-z0-9-]+$ ]]; then
    err "name must be lowercase letters, numbers, and hyphens only"
  fi
  if [[ "$NAME" == *anthropic* ]] || [[ "$NAME" == *claude* ]]; then
    err "name contains reserved word (anthropic, claude)"
  fi
  if [[ "$NAME" =~ ^(helper|utils|tools)$ ]]; then
    warn "name '$NAME' is vague — prefer gerund or noun-phrase naming"
  fi
fi

if [[ -z "$DESCRIPTION" ]]; then
  err "Frontmatter missing required field: description"
else
  ok "description present (${#DESCRIPTION} chars)"
  if [[ ${#DESCRIPTION} -gt 1024 ]]; then
    err "description exceeds 1024 characters (${#DESCRIPTION})"
  fi
  if echo "$DESCRIPTION" | grep -qiE '^(I can|I will|You can|You should|Use this to)'; then
    warn "description may be wrong person — use third person ('Processes…', not 'I can help…')"
  fi
  if ! echo "$DESCRIPTION" | grep -qiE '(use when|when asked|when the user|when creating|when working|at the end|for )'; then
    warn "description may lack WHEN triggers — include when the agent should use this skill"
  fi
fi

# --- Body checks ---
BODY_LINES=$(awk '/^---$/{c++; next} c>=2' "$SKILL_FILE" | wc -l | tr -d ' ')
ok "SKILL.md body: $BODY_LINES lines"
if [[ "$BODY_LINES" -gt 500 ]]; then
  warn "SKILL.md body exceeds 500 lines ($BODY_LINES) — split into references/"
fi

if grep -q '\\' "$SKILL_FILE"; then
  warn "Possible Windows-style backslash paths found — use forward slashes"
fi

# --- Reference depth (SKILL.md only — examples in references/ are OK) ---
if grep -qE '\]\([^)]+\.md\)' "$SKILL_FILE" 2>/dev/null; then
  LINK_COUNT=$(grep -oE '\]\([^)]+\.md\)' "$SKILL_FILE" | wc -l | tr -d ' ')
  ok "SKILL.md links to $LINK_COUNT reference file(s)"
fi

# --- Scripts ---
if [[ -d "$SKILL_DIR/scripts" ]]; then
  while IFS= read -r -d '' script; do
    if [[ -x "$script" ]] || [[ "$script" == *.sh ]]; then
      if ! head -5 "$script" | grep -qE '^#!'; then
        warn "$(basename "$script") has no shebang"
      fi
    fi
  done < <(find "$SKILL_DIR/scripts" -type f -print0 2>/dev/null)
  ok "scripts/ directory present"
fi

# --- Summary ---
echo ""
if [[ $ERRORS -gt 0 ]]; then
  echo "Result: $ERRORS error(s), $WARNINGS warning(s) — fix errors before shipping"
  exit 1
else
  echo "Result: valid — $WARNINGS warning(s)"
  exit 0
fi
