# Nav V3 — coach-pwa Integration

## Prerequisites

- coach-pwa with existing SearchWidget, brand tabs, hamburger handler
- Theme CSS pipeline (`public/styles/theme/coach/variables.css`)

## Step 1 — Tokens

Merge or import from prototype:

| Prototype | PWA |
|-----------|-----|
| `src/coach-tokens.css` (nav subset) | `variables.css` |
| `--nav-content-spot-label-inset` | Add if missing |
| `--transition-duration-*` | Align names 1:1 |

Use `packages/nav-v3/tokens/nav-tokens.css` as a starting partial.

## Step 2 — Stylesheets

Add theme partials (order matters):

1. `invoked-menu.css` — drawer shell, overlays, scroll lock
2. `v3-menu.css` — content spot grids
3. `v1-typography.css` — 20px / 16px nav type
4. `nav-enter.css` — keyframes + stagger matrix

Verify `body.drawerOpened { overflow: hidden }` matches prototype.

## Step 3 — Components

Wire `NavV3ImageCollage` (or rename `InvokedNavV3`) with:

```tsx
<InvokedNavV3
  open={menuOpen}
  brand={brand}
  menuData={menuFromSfcc}
  contentSpots={contentSpotsFromCms}
  onClose={closeMenu}
  onBrandChange={setBrand}
  renderSearch={() => <SearchWidget ... />}
/>
```

**Do not fork:** `NavSearchExposed` / SearchWidget UI.

## Step 4 — Data

| Source | Maps to |
|--------|---------|
| SFCC `Headless-GetCategoryInfo` | `MenuBrandData` |
| CMS / config map | `V3L1ContentSpotsConfig`, `V3L2ContentSpotsConfig` |
| Curated L1 | `getV3L1Categories(brand)` |

Helpers to port:

- `resolveNavDrillL2Body`
- `shouldShowSectionEyebrow`
- `shouldDrillNavLink` / `isViewAllNavLink`
- `formatDrillTitle`

## Step 5 — Motion

Preserve class contract on drill overlays:

- `invoked-menu__overlay--entered`
- `invoked-menu__overlay--active`
- `invoked-menu__overlay--exiting`
- `invoked-menu__base--l1-ready`

See [NAV_V3_MOTION.md](../../docs/NAV_V3_MOTION.md).

## Step 6 — Accessibility

- `aria-hidden` on covered panels
- Escape closes menu
- `prefers-reduced-motion` in `nav-enter.css`

## Step 7 — Feature flag

Ship behind flag; QA at 375px on iPhone 13–15.

### Golden paths

1. Coach → Bags T2
2. Coach → Women → Shoes T3
3. Coach → Coachtopia
4. Outlet — same three

## Step 8 — Open items (post-v1)

- REQ-NAV-301: Post-click highlight
- REQ-NAV-302: Returner journey

## Checklist

- [ ] Tokens merged
- [ ] CSS partials imported
- [ ] Menu data from API
- [ ] Content spots from CMS/config
- [ ] Search slot wired
- [ ] Scroll lock
- [ ] Brand switch resets stack
- [ ] Coachtopia under Coach tab
- [ ] Reduced motion verified
- [ ] Feature flag + QA
