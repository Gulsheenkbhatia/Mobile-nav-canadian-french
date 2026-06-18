# BYVRecommendationsCarouselContainer

## Overview

Collapsible "Because You Viewed" recommendation drawer for PLP (Mobile Only). Sits directly beneath the Recently Viewed collapsible in `RVAndBecauseYouViewedContainer`. Products are sourced from XGen container `sm_el_sitevisit1` via `useBYVRecommendations` and rendered by the generic `CollapsibleRecommendationsCarousel` in BYV header mode.

## Location
`src/toro/components/BecauseYouViewedRecommendation/plp/`

## Component Structure

| File | Role |
|------|------|
| `BYVRecommendationsCarouselContainer.tsx` | Outer gate component — checks all experiment/preference gates; renders nothing if any gate fails |
| `BYVCollapsibleInner` (in same file) | Inner component — calls `useBYVRecommendations` and passes data to `CollapsibleRecommendationsCarousel` in BYV mode |
| `AGENTS.md` | This file |

## Experiment Gates (all must be true to render)
| Gate | Value |
|------|-------|
| SFCC preference | `adaptiveExperience.becauseYouViewed.plp = true` |
| Experiment | `EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2` (`abtest3930_b`) |
| Experiment | `EXPERIMENTS.XGEN_RECOMMENDATIONS` (`abtest4515_a`) |
| XGen client | `xgenClientAtom` must be initialized |

## State Management

- **Reads from:** `xgenClientAtom`, `mostViewedProductAtom`, `activeFiltersAtom`, `xgenBYVCacheAtom` (via `useBYVRecommendations`), `adaptiveExperience.becauseYouViewed` preferences
- **Writes to:** `xgenBYVCacheAtom` (raw response cached after each fetch, keyed by most-viewed VG ID)

## Default Open/Closed
Controlled by `adaptiveExperience.becauseYouViewed.plpTopExpanded` (boolean SFCC preference).

## XGen Cache Behavior
`useBYVRecommendations` caches the raw XGen response in `xgenBYVCacheAtom` keyed by the
"most-viewed product" VG ID. When the most-viewed product changes the hook refetches.

## Certona Fallback
When `EXPERIMENTS.XGEN_RECOMMENDATIONS` is **not** active, `RVAndBecauseYouViewedContainer`
renders the legacy `BecauseYouViewedContainer` (Certona) instead of this component.

## Props (BYVCollapsibleInner, passed from container)
None — all data comes from `useBYVRecommendations()` and the SFCC preference.

## SSR
Imported with `dynamic(..., { ssr: false })` from `RVAndBecauseYouViewedContainer` because
`useBYVRecommendations` depends on browser-side XGen client and localStorage.
