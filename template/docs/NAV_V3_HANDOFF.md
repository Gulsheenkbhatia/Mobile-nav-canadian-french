# Nav V3 Developer Handoff

**Spec v1.0** · [Requirements](./NAV_V3_REQUIREMENTS.md) · [Motion](./NAV_V3_MOTION.md) · [Changelog](./NAV_V3_CHANGELOG.md)

Handoff target: **coach-pwa** integration + **Figma** component library. Prototype: `template/` · Live: [mobile-nav-drawer.vercel.app](https://mobile-nav-drawer.vercel.app/)

## Quick start

```bash
cd template
npm install
npm run dev
```

- **375px** width — main experience
- **`?gallery=nav`** — content-spot layout index for QA
- **`?state=t2-women`** — not yet wired; use menu: Women → drill

## Architecture

```
App.tsx
├── NavSearchExposed          # PWA-owned — do not fork
├── CoachHomePage             # Out of nav handoff scope
├── NavScrim
└── NavV3ImageCollage         # Invoked nav V3 entry
    └── InvokedMenuShell
        ├── L1Screen
        └── DrillOverlay × N
            ├── L2Screen
            └── L3Screen
```

Extractable package: [`packages/nav-v3/`](../packages/nav-v3/)

## Figma ↔ code component map

| Figma component | Code | Req IDs |
|-----------------|------|---------|
| `Nav/Icon/Chevron` | `CoachIconMask` + `chevron-right.svg` | REQ-NAV-101 |
| `Nav/Icon/Back-Arrow` | `DrillHeader` / `ArrowBack` | REQ-NAV-005 |
| `Nav/Logo/Coachtopia` | `CoachLogos.tsx` | REQ-NAV-011 |
| `Nav/Search-Field` | PWA SearchWidget — **no change** | REQ-NAV-005 |
| `Nav/Row/L1` | `L1CategoryRow` | REQ-NAV-101 |
| `Nav/Utility/Stacked-Text` | L1 footer links | REQ-NAV-102 |
| `Nav/Header/L2` | `DrillHeader` | REQ-NAV-109 |
| `Nav/Row/L2-Link` | `DrillLinkSections` | REQ-NAV-006 |
| `Nav/Row/L2-Link` (chevron) | `DrillSubCategorySections` | REQ-NAV-006 |
| `Nav/Section/Eyebrow-List` | `MenuLinkSection` + `navEyebrowVisibility` | REQ-NAV-007 |
| `Nav/Image/Tile-*` | `.v3-content-spots--*` in `v3-menu.css` | REQ-NAV-009, REQ-NAV-108 |

## Stable props API (handoff surface)

```ts
type InvokedNavV3Props = {
  open: boolean
  brand: 'coach' | 'outlet'
  menuData: MenuBrandData
  contentSpots: V3ContentSpotsByBrand
  onClose: () => void
  onBrandChange: (brand: BrandId) => void
  renderSearch: () => ReactNode  // PWA injects SearchWidget
}

type NavImageGridProps = {
  layout: V3L2ContentSpotsLayout
  tileAspectRatio?: '16:9' | '4:5'
  tiles: V3L2ContentSpotTile[]
}
```

Do **not** add pixel props (`labelInsetPx`) — polish lives in CSS tokens.

## Data contracts

| Contract | Type / module |
|----------|---------------|
| Menu tree | `mobileMenuData.ts` + SFCC API |
| L1 order | `v3L1Categories.ts` |
| L1 content spots | `V3L1ContentSpotsConfig` — `placement`, `layout`, `tiles[]` |
| L2 body | `resolveNavDrillL2Body()` → `flat-sections` \| `sub-category-sections` |
| L2 content spots | `V3L2ContentSpotsConfig` — `layout`, `tiles`, `tileAspectRatio`, `eyebrow` |
| Eyebrows | `navEyebrowVisibility.ts` |
| Chevrons / View All | `navLinkChevron.ts` |
| Drill titles | `navDrillTitle.ts`, `getV3L2LinkLabel()` |

### Content-spot layouts

| Layout | Description |
|--------|-------------|
| `l1-1` | Single 16:9 |
| `l1-2` | 2-up 16:9 |
| `l1-3` | Hero 16:9 + 2-up row |
| `l2-1` | Single 16:9 |
| `l2-2` | 2-up (16:9 or 4:5 via `tileAspectRatio`) |
| `l2-3` | Hero + 2-up |
| `l2-4` | 2×2 grid |
| `l2-6` | 2×3 grid |

L1 placement: `above-categories` (Coach) or `after-category` (Outlet inline).

Sync menu: `npm run sync:menu`

## Styles & tokens

| Concern | Prototype | PWA target |
|---------|-----------|------------|
| Tokens | `src/coach-tokens.css` | `coach-pwa/.../variables.css` |
| Drawer / drill shell | `invoked-menu.css` | Theme partial |
| Content spots | `v3-menu.css` | Theme partial |
| Link motion | `nav-enter.css` | Theme `@keyframes` |
| Nav typography | `v1-typography.css` | Theme partial |

Key nav tokens: `--spacing-4`, `--text-20`, `--text-16`, `--nav-content-spot-label-inset`, `--transition-duration-*`.

## Out of scope (prototype-only)

- `CoachHomePage` and homepage sync scripts
- `MobileNavFlyout`, `NavV1AccordionFlyout` (reference only)
- `v3SparseMenuFill.ts`, hardcoded `v3CategoryFixtures.ts` (until CMS)
- Duplicate `src/components/NavScrim.tsx` — use `nav/NavScrim.tsx`

## PWA integration checklist

See [`packages/nav-v3/integration.md`](../packages/nav-v3/integration.md).

1. Replace `menuData.live.json` with `Headless-GetCategoryInfo` / menu hook
2. Map CMS → `V3L1ContentSpotsConfig` / `V3L2ContentSpotsConfig`
3. Import nav CSS partials + keyframes
4. `body.drawerOpened` scroll lock
5. `renderSearch` slot — keep existing SearchWidget
6. Wire hamburger to `open` state
7. `prefers-reduced-motion` — verify no override
8. Coachtopia under Coach tab (REQ-NAV-011)
9. Feature flag for rollout; QA iPhone 13–15 @ 375px

## QA URLs

| URL | Purpose |
|-----|---------|
| `/` | Full experience |
| `/?gallery=nav` | Layout gallery |
| Figma canvas `2166:6227` | Visual spec + badges |

## Success criteria

Developer can implement without Cursor repo if they have:

1. Figma components + LOCK/STABLE badges
2. This doc set + `packages/nav-v3/`
3. Live prototype for behavior
4. Requirements registry for tier decisions
