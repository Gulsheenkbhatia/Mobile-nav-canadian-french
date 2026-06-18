#!/usr/bin/env bash
# Copy @tapestry-inc/design-tokens from a coach-pwa install (private GitHub npm package).
# Requires: npm ci (or npm install) already run in coach-pwa with .npmrc GitHub token.
#
# Usage:
#   COACH_PWA=/path/to/coach-pwa bash COPY-DESIGN-TOKENS-FROM-PWA.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/reference/coach-pwa-src/node_modules/@tapestry-inc/design-tokens"
SRC="${COACH_PWA:?Set COACH_PWA to your coach-pwa clone, e.g. COACH_PWA=\$HOME/Documents/GitHub/coach-pwa}/node_modules/@tapestry-inc/design-tokens"

if [ ! -d "$SRC" ]; then
  echo "ERROR: design-tokens not found at:"
  echo "  $SRC"
  echo "Run in coach-pwa (Node 20): npm ci"
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
rsync -a --delete "$SRC/" "$DEST/"
echo "Copied design-tokens to: $DEST"
du -sh "$DEST"
