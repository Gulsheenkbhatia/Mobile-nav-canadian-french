#!/usr/bin/env bash
# Re-copy reference sources from a local coach-pwa clone into this prototype repo.
# Usage: SRC=/path/to/coach-pwa bash SYNC-FROM-COACH-PWA.sh
#
# Optional: after npm ci in coach-pwa, also run:
#   COACH_PWA=/path/to/coach-pwa bash COPY-DESIGN-TOKENS-FROM-PWA.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/reference/coach-pwa-src"
SRC="${SRC:?Set SRC to your coach-pwa clone path, e.g. SRC=\$HOME/Documents/GitHub/coach-pwa}"

mkdir -p "$DEST/toro/components" "$DEST/toro/helpers" "$DEST/toro/hooks" "$DEST/toro/hocs" "$DEST/toro/types" "$DEST/toro/icons" "$DEST/toro/cms" "$DEST/toro/analytics" "$DEST/toro/constants" "$DEST/toro/lib/oneSite" "$DEST/toro/styles" "$DEST/components/common" "$DEST/components/assets" "$DEST/tests/mocks/preferences" "$DEST/public"

rsync -a "$SRC/src/toro/components/" "$DEST/toro/components/"
rsync -a "$SRC/src/store/" "$DEST/store/"
rsync -a "$SRC/src/toro/helpers/" "$DEST/toro/helpers/"
rsync -a "$SRC/src/toro/hooks/" "$DEST/toro/hooks/"
rsync -a "$SRC/src/toro/hocs/" "$DEST/toro/hocs/"
rsync -a "$SRC/src/toro/types/" "$DEST/toro/types/"
rsync -a "$SRC/src/toro/icons/" "$DEST/toro/icons/"
rsync -a "$SRC/src/toro/cms/" "$DEST/toro/cms/"
rsync -a "$SRC/src/toro/constants/" "$DEST/toro/constants/"
rsync -a "$SRC/src/toro/styles/" "$DEST/toro/styles/"
rsync -a "$SRC/src/components/assets/" "$DEST/components/assets/"
rsync -a "$SRC/public/styles/" "$DEST/public/styles/"

mkdir -p "$DEST/toro/components/SplideSlider"
if [ -f "$SRC/src/toro/components/SplideSlider/splide-default.css" ]; then
  cp "$SRC/src/toro/components/SplideSlider/splide-default.css" "$DEST/toro/components/SplideSlider/"
fi

if [ -d "$SRC/node_modules/@tapestry-inc/design-tokens" ]; then
  mkdir -p "$DEST/node_modules/@tapestry-inc"
  rsync -a "$SRC/node_modules/@tapestry-inc/design-tokens/" "$DEST/node_modules/@tapestry-inc/design-tokens/"
  echo "Included: node_modules/@tapestry-inc/design-tokens"
else
  echo "Skipped: @tapestry-inc/design-tokens (run npm ci in coach-pwa, then COPY-DESIGN-TOKENS-FROM-PWA.sh)"
fi

cp "$SRC/src/toro/site-preferences.ts" "$DEST/toro/"
cp "$SRC/src/toro/analytics/useAnalytics.js" "$DEST/toro/analytics/"
cp "$SRC/src/toro/getColorSchemeVariables.ts" "$SRC/src/toro/getColorSchemeVariables.spec.ts" "$DEST/toro/"
cp "$SRC/src/toro/lib/oneSite/config.ts" "$DEST/toro/lib/oneSite/"

rsync -a "$SRC/tests/mocks/preferences/" "$DEST/tests/mocks/preferences/"
cp "$SRC/src/components/common/PWAContext.js" "$DEST/components/common/"

if [ -f "$SRC/resolve.alias.config.js" ]; then
  cp "$SRC/resolve.alias.config.js" "$DEST/coach-pwa-resolve-alias.config.js"
fi

echo "Done. DEST=$DEST"
