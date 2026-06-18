# CollapsibleRVRecommendationsCarousel

Generic collapsible recommendation carousel (previously RV-specific, now shared by RV and BYV).

## Location
`src/toro/components/CollapsibleRVRecommendationsCarousel/`

## Component Structure
| File | Role |
|------|------|
| `index.tsx` | Generic presentational `CollapsibleRecommendationsCarousel` — no data-fetching hooks |
| `CollapsibleItem.tsx` | Single product tile (image + ATB + price) used by the generic carousel |
| `RVCollapsibleRecommendationsCarousel.tsx` | Thin RV-specific wrapper calling `useRVRecommendations` |
| `theme.ts` | Chakra multi-style config for `CollapsibleRVCarousel` theme key |
| `themes/theme-kate-spade.ts` | Kate Spade overrides |

## State Management

The generic carousel (`index.tsx`) is fully presentational — it reads no atoms directly.
All state flows in via props from the caller:

- **RV path** (`RVCollapsibleRecommendationsCarousel`) — reads from `useRVRecommendations`, which internally reads `xgenClientAtom`, `xgenRecentlyViewedRawDataAtom`, Certona scheme atoms, and preference atoms.
- **BYV path** (`BYVRecommendationsCarouselContainer`) — reads from `useBYVRecommendations`, which reads `xgenClientAtom`, `mostViewedProductAtom`, `activeFiltersAtom`, and `xgenBYVCacheAtom`.

## Making changes
- **Visual styles** → `theme.ts` (or brand-specific override in `themes/`)
- **RV data/analytics** → `RVCollapsibleRecommendationsCarousel.tsx` or `useRVRecommendations`
- **BYV data/analytics** → `BYVRecommendationsCarouselContainer` or `useBYVRecommendations`

## Header modes
The generic component renders one of two header layouts based on the presence of `eyebrowText`:

| Mode | Props required | Layout |
|------|---------------|--------|
| **RV** | `title` only | Stacked circle thumbnails + single title |
| **BYV** | `eyebrowText` + `primaryTitle` + `referenceProduct` | Reference-product thumbnail + eyebrow label + product name |

No product name appears in the carousel tiles (`CollapsibleItem`) per acceptance criteria.

## Carousel behaviour
- Horizontal scrollable, start-to-end (no infinite scroll)
- Starts at 3.5 tiles visible via CSS `width: 24.7vw` on each tile
- Collapse/expand powered by Chakra `<Collapse>`

## Height measurement (RV only)
`RVCollapsibleRecommendationsCarousel` passes a `containerCallbackRef` that sets `carouselRef.current`
on the container DOM node. `useRVRecommendations` exposes the height via its `forwardedRef` 
`useImperativeHandle` — used by the PLP sticky header offset calculation.

BYV does **not** participate in height measurement (`forwardedRef` not applicable today).

## Experiment gates (caller responsibility)
The generic carousel has no gates. Both wrappers apply their own gates before rendering:
- RV: gated inside `RVRecommendationsCarouselContainer` via `COLLAPSIBLE_RV_EXPERIMENTS` + `XGEN_RECOMMENDATIONS`
- BYV: gated inside `BYVRecommendationsCarouselContainer` via `BECAUSE_YOU_VIEWED_PLP_VARIANT_2` + `XGEN_RECOMMENDATIONS`
