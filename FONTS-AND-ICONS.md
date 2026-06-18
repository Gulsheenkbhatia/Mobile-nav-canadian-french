# Design tokens, CSS, fonts & icons

## Design tokens (`@tapestry-inc/design-tokens`)

The package is **private** (GitHub Packages, `@tapestry-inc` scope). It is **not** in git and cannot be downloaded from the public npm registry without your Tapestry `.npmrc` token.

**After** you run `npm ci` in **`coach-pwa`** (Node **20** + configured `.npmrc`):

```bash
COACH_PWA=/path/to/coach-pwa bash COPY-DESIGN-TOKENS-FROM-PWA.sh
```

That copies:

`coach-pwa/node_modules/@tapestry-inc/design-tokens/`
→ `reference/coach-pwa-src/node_modules/@tapestry-inc/design-tokens/`

Webpack aliases in `coach-pwa/resolve.alias.config.js` map:

- `design-tokens/...` → `node_modules/@tapestry-inc/design-tokens/<BRAND>/...` (e.g. `coach`)
- `sub-theme-tokens/...` → same package, sub-brand path when `SUB_BRAND` is set

So the **full package directory** is the right artifact to mirror.

## CSS / styles (in this extraction)

| Path in `reference/coach-pwa-src/` | Source in `coach-pwa` | Contents |
|------------------------------------|------------------------|----------|
| `public/styles/` | `public/styles/` | Theme **`variables.css`**, **`font-face.css`** (CDN font URLs), per brand/region |
| `toro/styles/` | `src/toro/styles/` | Global **`styles.css`**, **`font-face.css`**, **`mobile-menu-drawer.css`**, CMS chunks, headroom, toast, PDP, etc. |
| `components/assets/` | `src/components/assets/` | SVGs imported from `toro/icons/header-icons.tsx` and similar |
| `toro/components/SplideSlider/splide-default.css` | `src/toro/components/SplideSlider/` | Pulled in from `_app` |

**`cms-styles`** in `_app` is an alias to a **brand-specific subfolder** of `src/toro/styles/` (see `resolve.alias.config.js` → `getCmsStyles()`). The whole `toro/styles/` tree is copied so all CMS variants are present.

## Fonts

There are **no** checked-in `.woff2` binaries for main themes; **`public/styles/theme/**/font-face.css`** uses **CDN** URLs (`assets.coach.com`, etc.). See previous section for the copied CSS files.

## Icons (`toro/icons`)

Repo icons live under **`toro/icons/`**. Many React icon entrypoints import **`design-tokens/icon/...`** (the private package above) and **`components/assets/`** (now copied).

## Vite template (`template/`)

Still uses **system fonts** + **inline SVGs** unless you wire Coach CSS/tokens yourself.
