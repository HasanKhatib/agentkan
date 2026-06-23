#!/usr/bin/env bash
# Git + board snapshot before handoff.
# Usage: bash scripts/status.sh [board-dir]
# Default board-dir: docs/board

set -euo pipefail
BOARD="${1:-docs/board}"

echo "=== git status ==="
git status --short

echo ""
echo "=== recent commits ==="
git log --oneline -5

echo ""
echo "=== ${BOARD}/next.json ==="
cat "${BOARD}/next.json" 2>/dev/null || echo "(${BOARD}/next.json not found)"
