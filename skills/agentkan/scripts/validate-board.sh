#!/usr/bin/env bash
# Validate an agentkan board directory via npx.
# Usage: bash scripts/validate-board.sh [board-dir]
# Default board-dir: docs/board

set -euo pipefail
DIR="${1:-docs/board}"
exec npx agentkan validate "$DIR"
