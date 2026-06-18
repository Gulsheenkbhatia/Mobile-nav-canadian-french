# Coach PWA integration map

Most production code for mobile nav now lives under **`reference/coach-pwa-src/`** in this folder. Use this file for **what still lives only in a full clone** and for mental model.

## Fully mirrored in `reference/coach-pwa-src/`

- `toro/components/` (**entire** `src/toro/components` from PWA — header, SearchWidget, **full Flyout**, Box/Flex/Portal, etc.)
- `store/` (entire `src/store` from PWA)
- `toro/site-preferences.ts`
- `tests/mocks/preferences/`
- `toro/helpers/` (entire)
- `toro/hooks/` (entire)
- `toro/hocs/` (entire)
- `toro/types/` (entire)
- `toro/icons/` (entire)
- `toro/cms/` (entire — includes `ContentSlot` used by mobile header)
- `toro/styles/` (entire `src/toro/styles` — global CSS, CMS styles, `mobile-menu-drawer.css`, etc.)
- `public/styles/` (theme `variables.css` + `font-face.css` per brand/region)
- `components/assets/` (SVGs used by header icons and others)
- `toro/components/SplideSlider/splide-default.css` (from `_app`)
- `coach-pwa-resolve-alias.config.js` (copy of `resolve.alias.config.js` — shows `design-tokens` / `cms-styles` aliases)
- `node_modules/@tapestry-inc/design-tokens/` **when present** in your `coach-pwa` install after `npm ci`, or use **`COPY-DESIGN-TOKENS-FROM-PWA.sh`**

## Not copied (still only in full `coach-pwa`)

Typical gaps when you try to compile this bundle alone:

- **Next.js** — `pages/`, `next.config`, `_app`, routing.
- **Root `src/hooks/`** (if any import uses `hooks/` without `toro/` prefix — uncommon in this slice).
- **`package.json` / most of `node_modules`** — Chakra, Emotion, Jotai, Next, etc. (**Exception:** `node_modules/@tapestry-inc/design-tokens` is copied when you run sync from a machine that has run `npm ci` in `coach-pwa`, or use `COPY-DESIGN-TOKENS-FROM-PWA.sh`.)
- **API / SFCC** — live menu and search payloads.
- **Other `src/` trees** — e.g. `components/` outside `toro`, test utils, unless you add them.

## Quick “where do I merge?” in real PWA

| Concern | Primary path in `coach-pwa` |
|--------|-----------------------------|
| Drawer shell (portal, slide, close) | `src/toro/components/header/MobileMenu/` |
| V2 drawer UI | `src/toro/components/header/MobileMenuDrawerContentV2/` |
| Drawer footer | `src/toro/components/header/MobileMenuDrawerContentFooterV2/` |
| Brand tabs in drawer | `src/toro/components/header/MobileMenuTabs/` |
| Mobile header page chrome | `src/toro/components/header/Header/mobile/index.js` |
| Open/close atom | `src/store/global.atom.ts` → `isMobileMenuVisibleAtom` |
| Category tree + selection | `src/store/menu-data.atom.ts` |
| Search drawer flags | `src/store/search.atom.ts` |

## Distinction: two “flyouts”

- **Hamburger / mobile menu** → `MobileMenu` + `MobileMenuDrawerContentV2` (this prototype).
- **Account / marketing drawer** loading HTML via API → `Flyout` + `fetchFlyoutContent` (different flow).
