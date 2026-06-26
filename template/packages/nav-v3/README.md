# @tapestry/nav-v3

Extractable **Mobile Nav V3** module for coach-pwa integration. Source of truth remains `template/src/` — this package documents boundaries and re-exports the public API.

## Contents

```
packages/nav-v3/
├── README.md           # This file
├── integration.md      # PWA wiring checklist
├── package.json        # Metadata (not published to npm)
├── tokens/
│   └── nav-tokens.css  # Subset import of coach nav tokens
└── src/
    └── index.ts        # Re-exports
```

## Install / use (monorepo)

From coach-pwa or a sibling checkout, copy or symlink:

1. **Styles:** `tokens/nav-tokens.css` + import nav CSS from `src/styles/`:
   - `invoked-menu.css`
   - `nav-enter.css`
   - `v3-menu.css`
   - `v1-typography.css`

2. **Components:** Import from `@tapestry/nav-v3` or relative path to `src/index.ts`

3. **Data contracts:** Types from `data-contracts` exports

## Public API

```ts
import {
  InvokedMenuShell,
  NavV3ImageCollage,
  DrillOverlay,
  DrillLinkSections,
  DrillSubCategorySections,
  NavEnterGroup,
  getNavLinkEnterPreset,
} from '@tapestry/nav-v3'
```

See [integration.md](./integration.md) for PWA-specific steps.

## Docs

- [NAV_V3_HANDOFF.md](../../docs/NAV_V3_HANDOFF.md)
- [NAV_V3_REQUIREMENTS.md](../../docs/NAV_V3_REQUIREMENTS.md)
- [NAV_V3_MOTION.md](../../docs/NAV_V3_MOTION.md)

## Out of scope

Homepage, legacy flyout, sparse menu fill, category fixtures — see handoff doc.
