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
| Typography | `src/styles/v1-typography.css` — **20px** L1 links, **16px** L2/L3 drill links + header, **12px** utility footer |

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

## Developer handoff (v1.0)

Full handoff package for PWA integration:

| Doc | Purpose |
|-----|---------|
| [`docs/NAV_V3_HANDOFF.md`](docs/NAV_V3_HANDOFF.md) | Component map, data contracts, PWA checklist |
| [`docs/NAV_V3_REQUIREMENTS.md`](docs/NAV_V3_REQUIREMENTS.md) | Tiered requirements (Frozen / Stable / Polish / Open) |
| [`docs/NAV_V3_MOTION.md`](docs/NAV_V3_MOTION.md) | Motion tokens and arming protocol |
| [`docs/FIGMA_HANDOFF_GUIDE.md`](docs/FIGMA_HANDOFF_GUIDE.md) | Figma canvas structure and badges |
| [`packages/nav-v3/`](packages/nav-v3/) | Extractable module + `integration.md` |

**Layout gallery:** `?gallery=nav` (e.g. `http://localhost:5173/?gallery=nav`)

## Motion

Tokens follow **coach-pwa** [`variables.css`](../../coach-pwa/public/styles/theme/coach/variables.css). Drill panel motion matches **[coach-nav.vercel.app](https://coach-nav.vercel.app/) V3** (ease-drawer + content stagger).

| Surface | Timing |
|---------|--------|
| Menu drawer open/close | `--transition-duration-drawer` (400ms ease, PWA SearchWidget searchV2) |
| Scrim | `--transition-duration-scrim` (400ms ease fade) |
| L2/L3 drill panels | `--transition-duration-drill` (500ms) + `--transition-easing-panel` |
| Nav link stagger | `--transition-duration-nav-link-enter` (480ms) |
| Content load-in (images, links, sections) | `--transition-duration-content` (700ms ease-drawer) with stagger via `NavEnterGroup` |
| Brand tabs | `--transition-duration-tab` (100ms ease-out) |

V3 uses an **overlay stack** (L1 base + sliding overlays for L2/L3), not a horizontal 3-panel track. Content entrance is CSS keyframes in `nav-enter.css` — PWA handoff pattern (theme `@keyframes` + delay).

Future search overlay: use `.nav-drawer-slide` / `.nav-drawer-slide--open` in `invoked-menu.css`.

## Behavior

1. Tap **menu + search** in the header to open the invoked menu.
2. **L1:** search field, 20px category list with chevrons, 12px utility links, then **full-bleed image collage** (1px gutters, no outer margin).
3. Tap a category (e.g. **Bags**) for **L2** — back arrow, optional 2×3 product grid, optional eyebrow sections + 16px links.
4. Close with **X**, scrim tap, or **Escape**.
5. Switch **Coach / Outlet** tabs in header or menu header.

## Deploy to Vercel

The Vite app lives in **`template/`**. The repo root **`vercel.json`** tells Vercel to build that folder (so you do **not** need a separate Root Directory override if this file is committed).

### Git integration (recommended)

1. Push to [github.com/wchan26/mobile-nav-drawer](https://github.com/wchan26/mobile-nav-drawer)
2. [vercel.com/new](https://vercel.com/new) → Import the repo (if not already connected)
3. Default settings are fine — root `vercel.json` sets build/output paths
4. Every push to `main` redeploys production

**If you already imported without root `vercel.json`:** either push this fix, or set **Root Directory** → `template` in Vercel → Project → Settings → General.

`template/vercel.json` is used when deploying from the `template/` folder via CLI only.

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
