# AEDrawer (Adaptive Experience Drawer)

## Overview

Slide-out drawer that shows product recommendations ("Similar To") when triggered from PDP or PLP product tiles. Supports multiple recommendation vendors (XGen, Certona, Einstein, LLM/Visually Similar) with automatic vendor selection.

## Purpose

Provides contextual "similar product" recommendations in a non-blocking drawer UI. The drawer opens from the right on desktop and bottom on mobile, displaying a product thumbnail header and a grid/carousel of recommended products.

## Location

`src/toro/components/AEDrawer/`

## Component Structure

| File | Role |
|------|------|
| `index.tsx` | Root — manages drawer open/close lifecycle, analytics, configuration |
| `AEDrawerContent.tsx` | Layout shell — product thumbnail header + drawer chrome |
| `AEDrawerBody.tsx` | Vendor router — selects recommendation source based on feature flags |
| `AEXgenRecommendation.tsx` | XGen vendor — resolves container ID and delegates to `RecommendationsContainer` |
| `AECertonaRecommendations.tsx` | Certona vendor fallback |
| `AEEinsteinRecommendation.tsx` | Einstein vendor |
| `WhoopsMessage.tsx` | Empty state when recommendations are unavailable or disabled |

## Vendor Selection Logic (AEDrawerBody)

Priority order in `AEDrawerBody`:
1. **PLP + Visually Similar data exists** → `LLMRecommendations`
2. **Einstein enabled** (`isEinsteinRecomEnabled`) → `AEEinsteinRecommendation`
3. **XGen enabled** (`xgenFeaturesAtom.recommendations`) → `AEXgenRecommendation`
4. **Fallback** → `AECertonaRecommendations`

## State Management

- **Reads from:** `aeDrawerConfigAtom` (active product, recommenders, event location), `xgenFeaturesAtom`, `drawerAtom` (ATB drawer state for scroll blocking)
- **Writes to:** `setAEDrawerConfigAtom` (reset on close)

## AEXgenRecommendation Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'aeDrawerGrid' \| 'aeDrawer'` | Yes | Display layout (grid or carousel) |
| `closeAeDrawer` | `() => void` | Yes | Callback to close the drawer |
| `pageType` | `string` | Yes | `'PDP'` or `'PLP'` — determines default container ID |

### Container ID Resolution

1. Check `aeDrawerConfig.recommenders` (runtime override)
2. Fall back to `enableAEDrawerExp[pageType].recommenders` preference
3. Default: PDP → `ae_drawer` (`sm_el_pdp7`), PLP → `ae_drawer_plp` (`sm_el_plp5`)

Renders `WhoopsMessage` if the response is empty or the container is in `disabledSchemes`.

## Example Usage

The drawer is triggered externally by setting `aeDrawerConfigAtom`:

```typescript
import { useUpdateAtom } from 'jotai/utils'
import { setAEDrawerConfigAtom } from 'store/ae-drawer.atom'

const setConfig = useUpdateAtom(setAEDrawerConfigAtom)
setConfig({
  showDrawer: true,
  activeProduct: { vgId, name, firstThumbnailSrc },
  eventLocation: 'product tile',
})
```

## Testing

```bash
npm test -- --testPathPattern="AEDrawer"
```

## Related Documentation

- Domain Guide: @.agents/domains/xgen-integration.md — XGen recommendation patterns and container IDs
- Domain Guide: @.agents/domains/experiments.md — Experiment-gated feature activation
