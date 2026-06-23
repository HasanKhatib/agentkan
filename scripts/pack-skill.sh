#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/SKILLS/agentkan"
zip -r "$ROOT/agentkan.skill" .
echo "Wrote $ROOT/agentkan.skill (upload to claude.ai or unzip into ~/.claude/skills/agentkan)"
