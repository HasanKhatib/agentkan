#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/skill"
zip -r "$ROOT/agentkan.skill" .
echo "Wrote $ROOT/agentkan.skill"
