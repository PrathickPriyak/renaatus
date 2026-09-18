#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/website/public/assets"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$ROOT/assets/." "$DEST/"
echo "Synced assets -> website/public/assets"
