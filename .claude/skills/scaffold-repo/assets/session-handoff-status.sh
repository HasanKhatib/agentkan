#!/usr/bin/env bash
# status.sh — session snapshot for handoff
# Outputs: git status, recent commits, in-progress issues, current next.md

echo "=== git status ==="
git status --short

echo ""
echo "=== recent commits ==="
git log --oneline -5

echo ""
echo "=== in-progress issues ==="
gh issue list --label in-progress 2>/dev/null || echo "(gh not available or no in-progress issues)"

echo ""
echo "=== docs/next.md ==="
cat docs/next.md 2>/dev/null || echo "(docs/next.md not found)"
