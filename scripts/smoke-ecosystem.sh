#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ROOT="$(cd "$ROOT_DIR/.." && pwd)"

required=(
  "$PROJECT_ROOT/Chips-core"
  "$PROJECT_ROOT/Chips-Foundation"
  "$PROJECT_ROOT/Chips-SDK"
)

for dir in "${required[@]}"; do
  if [[ ! -d "$dir" ]]; then
    echo "[smoke] missing dependency repo: $dir"
    exit 1
  fi
  echo "[smoke] found: $dir"
done

echo "[smoke] running component contract tests"
pnpm --dir "$ROOT_DIR" test:contracts

echo "[smoke] ecosystem baseline checks completed"
