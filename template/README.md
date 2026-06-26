# Coach MVP V3 — mobile nav prototype

Standalone **full-viewport** Coach mobile experience matching **[coach-nav.vercel.app](https://coach-nav.vercel.app/) V3** (“Nav + image collage”): retail header, scrollable homepage, and invoked menu with search, category list, full-bleed image collage, utility links, and L2 drill-down (including Bags product grid).

No device frame, Safari chrome, or browser UI mockups — open in a mobile-width browser window or responsive devtools.

## Run locally

```bash
cd template
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Test at **375px** or **430px** width.

## What’s included

| Area | Location |
|------|----------|
| App shell | `src/App.tsx` — full `100dvh` layout, brand tabs, menu toggle |
| V3 menu | `src/components/nav/v3/NavV3ImageCollage.tsx` |
| Homepage | `src/components/homepage/CoachHomePage.tsx` |
| Header | `src/components/nav/NavSearchExposed.tsx` |
| Menu data | `src/data/mobileMenuData.ts` + live fixture `src/data/menuData.live.json` |
| Image assets | `public/assets/figma/` — V3 campaign, Bags L2 shots, chevron |
| Design tokens | `src/coach-tokens.css` + Tailwind `@theme` in `src/index.css` |
| Typography | `src/styles/v1-typography.css` — **20px** nav/L2 links, **16px** utility footer |

## Assets

Fonts and media are in `public/`:

- `public/fonts/*.woff2` — Helvetica Extended / Now (from coach-nav)
- `public/assets/figma/` — V3 campaign + Bags L2 images, chevron icon
- `public/assets/videos/` — homepage hero `.webm`

Homepage hero images load from `src/data/homepageHeroes.live.json` (coach.com CDN URLs).

## Sync nav links from coach-pwa

Menu categories and URLs are synced from SFCC via coach-pwa. The generated fixture is committed at `src/data/menuData.live.json`.

**Preferred:** start coach-pwa, then sync from the template directory:

```bash
cd ../coach-pwa && npm run dev   # Node 20, SFCC credentials in .env.local
cd ../mobile-nav-drawer/template
npm run sync:menu
```

**Fallback:** if coach-pwa is not running, the sync script reads `coach-pwa/.env.local` and calls SFCC `Headless-GetCategoryInfo` directly:

```bash
npm run sync:menu -- --sfcc
```

Optional env:

- `COACH_PWA_URL` — default `http://localhost:3000`
- `COACH_PWA_ROOT` — path to coach-pwa (auto-detected as sibling of `mobile-nav-drawer`)

Coachtopia is merged as an **L1 category under the Coach tab** (not a third brand tab), matching production OneSite behavior.

## Nav section eyebrows

Section eyebrows label grouped link lists on **L2 flat-section** views. They are separate from L1 collage content-spot eyebrows.

| Nav depth | Section eyebrows |
|-----------|------------------|
| **L1** | Collage/content-spot eyebrows only (CMS) — not `MenuLinkSection` |
| **L2 sub-list** (e.g. Women → Shoes row) | Chevron rows only — no section eyebrows |
| **L2 flat sections** (e.g. Bags with groups) | Shown when grouped or `showEyebrow: true` in data |
| **L3** | Never — drill header is the title |

**Data contract** (`MenuLinkSection` in `mobileMenuData.ts`):

- `eyebrow` — optional group label
- `showEyebrow` — explicit override from sync; when omitted, UI uses default rules

**UI helper:** `shouldShowSectionEyebrow()` in [`src/data/navEyebrowVisibility.ts`](src/data/navEyebrowVisibility.ts) — shared by V3 and V1 L2 renderers.

Sync sets `showEyebrow` when generating `menuData.live.json` (L3 sections always `false`).

## Motion

Tokens follow **coach-pwa** [`variables.css`](../../coach-pwa/public/styles/theme/coach/variables.css). Drill panel motion matches **[coach-nav.vercel.app](https://coach-nav.vercel.app/) V3** (ease-drawer + content stagger).

| Surface | Timing |
|---------|--------|
| Menu drawer open/close | `--transition-duration-drawer` (400ms ease, PWA SearchWidget searchV2) |
| Scrim | `--transition-duration-scrim` (300ms ease fade) |
| L2/L3 drill panels | `--transition-duration-drill` (600ms) + `--transition-easing-drill` (ease-drawer) |
| Content load-in (images, links, sections) | `--transition-duration-content` (700ms ease-drawer) with stagger via `NavEnterGroup` |
| Brand tabs | `--transition-duration-tab` (100ms ease-out) |

V3 uses an **overlay stack** (L1 base + sliding overlays for L2/L3), not a horizontal 3-panel track. Content entrance is CSS keyframes in `nav-enter.css` — PWA handoff pattern (theme `@keyframes` + delay).

Future search overlay: use `.nav-drawer-slide` / `.nav-drawer-slide--open` in `invoked-menu.css`.

## Behavior

1. Tap **menu + search** in the header to open the invoked menu.
2. **L1:** search field, 20px category list with chevrons, 16px utility links, then **full-bleed image collage** (1px gutters, no outer margin).
3. Tap a category (e.g. **Bags**) for **L2** — back arrow, optional 2×3 product grid, optional eyebrow sections + 20px links.
4. Close with **X**, scrim tap, or **Escape**.
5. Switch **Coach / Outlet** tabs in header or menu header.

## Deploy to Vercel

The Vite app lives in **`template/`** — set that as the project **Root Directory** when importing the repo.

### Git integration (recommended)

1. Push this repo to GitHub: [github.com/wchan26/mobile-nav-drawer](https://github.com/wchan26/mobile-nav-drawer)
2. [vercel.com/new](https://vercel.com/new) → **Import** `wchan26/mobile-nav-drawer`
3. Configure:
   - **Root Directory:** `template`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy — Vercel redeploys on every push to `main`.

`template/vercel.json` includes SPA rewrites so deep links resolve to `index.html`.

### CLI (one-off or local deploy)

```bash
npm i -g vercel
cd template
vercel          # first time: link project, confirm settings
vercel --prod   # production URL
```

To match the reference hostname pattern (`coach-nav.vercel.app`), add a custom domain or rename the project in Vercel → **Settings → Domains**.

## Legacy

The original plain-CSS flyout (`MobileNavFlyout.tsx`, `design-tokens.css`) remains for reference but is **not** wired to the app.
