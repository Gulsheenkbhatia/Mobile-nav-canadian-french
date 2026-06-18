#!/usr/bin/env bash
# Re-copy reference sources from a local coach-pwa clone into this prototype repo.
# Usage: SRC=/path/to/coach-pwa bash SYNC-FROM-COACH-PWA.sh

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/reference/coach-pwa-src"
SRC="${SRC:?Set SRC to your coach-pwa clone path, e.g. SRC=\$HOME/Documents/GitHub/coach-pwa}"

mkdir -p "$DEST/toro/components" "$DEST/toro/helpers" "$DEST/toro/hooks" "$DEST/toro/hocs" "$DEST/toro/types" "$DEST/toro/icons" "$DEST/toro/cms" "$DEST/toro/analytics" "$DEST/toro/constants" "$DEST/toro/lib/oneSite" "$DEST/components/common" "$DEST/tests/mocks/preferences"

rsync -a "$SRC/src/toro/components/" "$DEST/toro/components/"
rsync -a "$SRC/src/store/" "$DEST/store/"
rsync -a "$SRC/src/toro/helpers/" "$DEST/toro/helpers/"
rsync -a "$SRC/src/toro/hooks/" "$DEST/toro/hooks/"
rsync -a "$SRC/src/toro/hocs/" "$DEST/toro/hocs/"
rsync -a "$SRC/src/toro/types/" "$DEST/toro/types/"
rsync -a "$SRC/src/toro/icons/" "$DEST/toro/icons/"
rsync -a "$SRC/src/toro/cms/" "$DEST/toro/cms/"
rsync -a "$SRC/src/toro/constants/" "$DEST/toro/constants/"

cp "$SRC/src/toro/site-preferences.ts" "$DEST/toro/"
cp "$SRC/src/toro/analytics/useAnalytics.js" "$DEST/toro/analytics/"
cp "$SRC/src/toro/getColorSchemeVariables.ts" "$SRC/src/toro/getColorSchemeVariables.spec.ts" "$DEST/toro/"
cp "$SRC/src/toro/lib/oneSite/config.ts" "$DEST/toro/lib/oneSite/"

rsync -a "$SRC/tests/mocks/preferences/" "$DEST/tests/mocks/preferences/"
cp "$SRC/src/components/common/PWAContext.js" "$DEST/components/common/"

echo "Done. DEST=$DEST"
