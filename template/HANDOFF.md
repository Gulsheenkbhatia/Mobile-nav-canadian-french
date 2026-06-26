# Handoff — mobile nav V3 prototype

Use this file to continue work in a new chat:

> Read `template/HANDOFF.md` and continue.

---

## Project

**Path:** `mobile-nav-drawer/template/`

**Run:**

```bash
cd template
npm install
npm run dev
```

Test at **375px** width.

**Reference:** [coach-nav.vercel.app](https://coach-nav.vercel.app/) V3 (“Nav + image collage”)

**Do not git commit unless explicitly requested.**

---

## Goals for next session

1. **Refine UI details** — spacing, typography, alignment (parity with vercel)
2. **Copy Coach experience to Coach Outlet** — nav, homepage, pseudo content
3. **Refine transitions** — drill slide, content enter, back behavior
4. **Refine pseudo content** — collage labels, L2 grids, placeholder copy

---

## What’s already built (Coach tab)

**V3 menu** — `NavV3ImageCollage.tsx` + `InvokedMenuShell`

- L1: search, category list, image collage, utility links
- L2/L3: overlay drill stack (`DrillOverlay`, `useDrillBack`)
- Back: panel slides right (reverses entrance); previous panel does **not** replay enter
- View All: no drill (`isViewAllNavLink` in `navLinkChevron.ts`)
- Drill titles match nav link labels (`getV3DrillTitle`, `v3L2LinkLabelOverrides`)
- Title: full-width, ellipsis at 28 chars (`navDrillTitle.ts`)
- Spacing: 16px top inset on drill pages; 16px below title to first content
- L1 collage: same fade-up stagger as L2 (`COLLAGE_ENTER`)
- Brand tabs scroll with menu body (not sticky on drill scroll)

### Key files

| Area | Path |
|------|------|
| V3 UI | `src/components/nav/v3/NavV3ImageCollage.tsx` |
| Drill motion | `src/components/nav/drill/DrillOverlay.tsx`, `useDrillBack.ts` |
| Content enter | `src/components/nav/v3/NavEnter.tsx`, `src/styles/nav-enter.css` |
| Layout / drill CSS | `src/styles/invoked-menu.css`, `src/styles/v3-menu.css` |
| L1 order | `src/data/v3L1Categories.ts` |
| L2 collage + labels | `src/data/v3L2Collage.ts` |
| Bags L2 fixture | `src/data/v3CategoryFixtures.ts` |
| Live nav data | `src/data/menuData.live.json` |
| Motion tokens | `src/coach-tokens.css` (`--transition-duration-drill` 600ms) |
| Title truncate | `src/utils/navDrillTitle.ts` |
| View All rules | `src/utils/navLinkChevron.ts` |

**Optional prior chat transcript:** `b9eee29c-eca3-43cc-8da3-856ebf434b34`

---

## Coach Outlet — gaps to fill

**Homepage:** `OutletBrandPlaceholder.tsx` is a skeleton only. Coach has full `CoachHomePage.tsx`. Outlet needs an equivalent or shared homepage with brand-specific content.

**Nav L1:** `getV3L1Categories('outlet')` in `v3L1Categories.ts` — Women, Men, Bags, New (+ QA Auto). Live data in `menuData.live.json` under `"outlet"`.

### Not yet mirrored for Outlet

- L2 collage configs in `v3L2Collage.ts` — only Coach ids (`coach-women`, `bags`). No `outlet-women`, `outlet-bags-bags`, etc.
- `v3L2LinkLabelOverrides` — Coach sub-category ids only
- `v3CategoryFixtures.ts` — Bags fixture is Coach-only
- L1 collage uses single `v3-campaign.png` + hardcoded `"Copy Goes Here"` in `CollageImage`
- Homepage hero/content — likely Coach-only (`homepageData.ts`, `homepageHeroes.live.json`)

**Brand switching:** Header + menu tabs switch `menuBrand` via `NavBrandContext` + `InvokedMenuShell`. Menu resets stack on brand change. Outlet nav should match Coach unless design specifies otherwise.

---

## UI details to audit (Coach + Outlet)

- Search → collage gap: **4px** below search (keep); no double margin on collage
- Drill header: grid layout, centered truncating title
- L2 layouts: collage + sub-list vs flat sections (e.g. Bags)
- Full-bleed images, 1px gutters (`v3-menu.css`)
- Typography: 20px nav/L2, 16px utility (`v1-typography.css`)

Compare side-by-side with coach-nav.vercel.app at 375px.

---

## Transitions to refine

- **Panel drill:** 600ms `ease-drawer` — enter from right; exit reverses (remove `--entered`)
- **Content enter:** `NavEnterGroup` fade-up (collage) vs slide-in (links); stagger 0.05–0.1s
- **Back:** no enter replay on revealed panel
- **V1 drill:** `V1MenuBody.tsx` uses same `DrillOverlay` if still relevant

Motion: no bounce/spring. See `coach-tokens.css` and `README.md` motion table.

---

## Pseudo content to refine

- L1/L2 collage overlay: `"Copy Goes Here"` in `CollageImage` — consider per-brand/per-tile labels
- L2 images: Coach Women/Bags in `v3L2Collage.ts`; Outlet needs config and/or assets
- Assets: `public/assets/figma/` (campaign, bags, women shots)
- Utility footer: Track Order, Help, $USD, Login
- Optional live sync: `npm run sync:menu`

---

## Suggested order of work

1. Outlet L1 nav parity (categories, collage, labels)
2. Outlet L2/L3 drill + collages + label overrides for outlet ids
3. Outlet homepage (replace skeleton)
4. UI polish pass both brands
5. Transition tuning vs vercel

Start by diffing Coach vs Outlet in the open menu (Women, Bags, Men) and listing specific gaps before coding.

---

## New chat starter prompt

```text
Read template/HANDOFF.md in mobile-nav-drawer and continue.
Focus: [UI details | Coach Outlet parity | transitions | pseudo content]
Do not commit unless I ask.
```
