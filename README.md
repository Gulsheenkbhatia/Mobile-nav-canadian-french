# mobile-nav-drawer

Reference snapshots from **Coach PWA** for vibe-coding UI prototypes and eventual handoff to engineering.

## What is in `reference/coach-pwa-src/`

Broad copy of everything that typically touches **mobile global nav + drawer + search-in-drawer + menu state**, plus the **full shared `toro/components` library** and the **`toro/` support trees** listed below. Paths mirror the PWA. After a full sync this folder is about **~19 MB** and **~3.1k files** (varies with PWA revision and whether `design-tokens` is copied from `node_modules`).

| Area | Location in this bundle |
|------|-------------------------|
| **Entire `toro/components` tree** | `toro/components/` — ~2.2k files (~13 MB): header, `SearchWidget`, **full `Flyout/`**, primitives (`Box`, `Flex`, `Portal`, …), product/CMS widgets, etc. Same slice as in PWA (not everything needed to *run* the app). |
| **Header / search / flyout** | Covered inside `toro/components/` (no separate partial copies). |
| **Jotai store (full)** | `store/` — all atoms including `global.atom`, `menu-data.atom`, `search.atom`, `preferences.atom`, … |
| **Site preference keys** | `toro/site-preferences.ts` |
| **Preference test mocks** | `tests/mocks/preferences/` |
| **All `toro/helpers`** | `toro/helpers/` — full tree (`menu`, `toggleBodyScroll`, `experiments`, `fetchFlyoutContent`, …). |
| **Hooks / HOCs / icons / CMS** | `toro/hooks/`, `toro/hocs/`, `toro/icons/`, `toro/cms/` — full trees as in PWA. |
| **App context** | `components/common/PWAContext.js` |
| **Menu-data / nav config deps** | `toro/constants/` (full), `toro/types/` (full), `toro/lib/oneSite/config.ts`; full `LanguageSelector` UI under `toro/components/LanguageSelector/`. |
| **Analytics + color scheme** | `toro/analytics/useAnalytics.js`, `toro/getColorSchemeVariables.ts` (+ spec) |
| **CSS — app & CMS** | `toro/styles/` — `styles.css`, `mobile-menu-drawer.css`, CMS brand folders, headroom, etc. |
| **CSS — theme / fonts** | `public/styles/theme/**` — `variables.css`, `font-face.css` (CDN URLs) |
| **SVG assets (shared)** | `components/assets/` — chevrons, search overlay, etc. used with icons |
| **`@tapestry-inc/design-tokens`** | `node_modules/@tapestry-inc/design-tokens/` — copied when present in `SRC` after `npm ci`, or via **`COPY-DESIGN-TOKENS-FROM-PWA.sh`** |
| **Webpack alias reference** | `coach-pwa-resolve-alias.config.js` |

These files **still depend on a full PWA checkout** (Next.js, `pages/_app`, global Chakra/theme wiring, `package.json` deps, API routes, and other `src/` modules such as `hooks/` at repo root) and are **not** a runnable app by themselves.

## Verification: “clone” of global nav + drawer

| Use case | Supported? |
|----------|------------|
| **Same source files** as production for `Header/mobile`, hamburger, `MobileMenu`, `MobileMenuDrawerContentV2`, footer, tabs, `SearchWidget`, and related `store` atoms | **Yes** — paths under `reference/coach-pwa-src/` match `coach-pwa` (`rsync` from your machine). |
| **Imports under `toro/`** for those features (`components`, `hooks`, `helpers`, `hocs`, `icons`, `cms`, `types`, `constants`) | **Largely yes** — full trees are mirrored so typical `toro/...` imports resolve **within this folder**. **`design-tokens/...`** resolves only if **`node_modules/@tapestry-inc/design-tokens`** is populated (see **`COPY-DESIGN-TOKENS-FROM-PWA.sh`**). |
| **Drop-in replacement for a `coach-pwa` checkout** (build / run / test without the rest of the repo) | **No** — you still need the real app for `next/*`, `pages/`, root `hooks/`, Jest/tsconfig path aliases (`toro` → `src/toro`), `node_modules`, SFCC/API data, etc. |

## Browser template (runnable)

A minimal **Vite + React** flyout lives in **`template/`** — see `template/README.md` (`npm install` && `npm run dev`).

## Fonts & design assets

- **`FONTS-AND-ICONS.md`** — design tokens (private npm), CSS trees, fonts (CDN), icons, and how to run **`COPY-DESIGN-TOKENS-FROM-PWA.sh`** after `npm ci` in `coach-pwa`.

## Docs

- **`COACH-PWA-FILE-MAP.md`** — integration map and notes (updated where this bundle fills gaps).

## Source of truth

Tapestry repo **`coach-pwa`**. To refresh this bundle from your clone:

```bash
SRC="/path/to/coach-pwa" bash SYNC-FROM-COACH-PWA.sh
```

## Handoff

Point engineers at `reference/coach-pwa-src/toro/components/header/` for UI merges and `reference/coach-pwa-src/store/` for state. Open a PR in `coach-pwa` with a short list of files you actually changed in prototype work.
