# Figma Handoff Guide — Nav V3

**Figma file:** [Nav Redesign FY26-27](https://www.figma.com/design/xSgWjrAdmKMtV5fce0XsdJ/Nav-Redesign---FY26-27?node-id=2166-6227)  
**Canvas:** `↳ ✏️` (node `2166:6227`)

This doc mirrors what should live in Figma. Use it to complete or audit the handoff canvas.

## Prototype → Figma editable components

**Location:** Section [`Nav V3 / Prototype Components`](https://www.figma.com/design/xSgWjrAdmKMtV5fce0XsdJ/Nav-Redesign---FY26-27?node-id=2298-7067) on handoff page `↳ ✏️`

This is the **correct** code-to-Figma translation: proper component hierarchy with editable properties — not flattened screenshot stacks.

### Hierarchy (atoms → molecules → templates)

```
Nav/Image/Tile          variant set: ratio=16:9 | 4:5
  └─ Image, Gradient (30%), Label (TEXT prop, 12px inset)

Nav/Row/L1              Label (TEXT) + Chevron instance
Nav/Row/L2-Chevron      Label (TEXT) + Chevron instance
Nav/Row/L2-Link         Label (TEXT) only — terminal L3 links

Nav/Content-Spots       variant set: layout=1 | 2 | 3 | 4 | 6
  └─ Each variant = auto-layout grid of Tile instances (1px gap)

Nav/Header/L2           Back arrow instance + Title (TEXT) + spacer

Nav/Template/T1-Invoked   Content-Spots layout=3 + L1 row instances
Nav/Template/T2-Women   Header + layout=6 + L2-Chevron rows
Nav/Template/T3-Shoes     Header + L2-Link rows (no content spots)
```

### How to edit

| Change | Where |
|--------|-------|
| Tile label copy | `Nav/Image/Tile` → **Label** property |
| Row label | `Nav/Row/*` → **Label** property |
| Drill title | `Nav/Header/L2` → **Title** property |
| Grid layout | `Nav/Content-Spots` → **layout** variant |
| Image ratio | `Nav/Image/Tile` → **ratio** variant |
| Full screen | Use `Nav/Template/*` instances; swap nested instances |

Updating a **symbol** propagates to all template instances.

### vs. old `Nav Components — Dev Handoff` (`2224:752`)

The older section has flattened groups (`Group 2147229354`), duplicate frames instead of row instances, and a broken L2 header (chevron on the right). **Use `Nav V3 / Prototype Components` for dev handoff**; retire or refactor `2224:752` symbols over time.

### Still recommended: capture pass

For pixel QA against the running prototype (`?gallery=nav`), run `generate_figma_design` capture alongside these components — captures are reference-only; components are the editable source.

## Canvas structure

| Section | Node / name | Status |
|---------|-------------|--------|
| Global Spec v1.0 | `Nav V3 / Global Spec` | Create — consolidate 3 Design Notes frames |
| Component index | `Nav Components — Dev Handoff` (`2224:752`) | Extend with variant props |
| Template matrix | `Nav V3 / Template Matrix` | Create — one frame per permutation |
| Polish backlog | `Nav V3 / Polish Backlog` | Create — unconstrained tweak notes |
| Journey refs | `Nav V3 / Journeys` | Create — 6 golden paths |

## Global Spec v1.0 (STABLE annotations)

Single frame listing token names (not raw px in body copy):

| Spec | Figma variable / annotation |
|------|----------------------------|
| Page margin | `--spacing-4` |
| Nav link type | `--text-20` + Extended |
| Utility type | `--text-16` |
| Spacing scale | `--spacing-1`…`--spacing-12` (4px base) |
| Font family | `--font-face1-extended` |
| Tile gradient | `--linear-gradient-scrim-bottom` (30% height) |
| Label inset | `--nav-content-spot-label-inset` = `--spacing-3` (12px) |
| Ratios | `16:9` \| `4:5` |
| Drawer | `--transition-duration-drawer` |
| Scrim | `--transition-duration-scrim` |
| Drill | `--transition-duration-drill` |

Badge: **STABLE** on each row.

## Component index variants

Add component properties on image components:

| Property | Values |
|----------|--------|
| `ratio` | `16:9`, `4:5` |
| `layout` | `1`, `2`, `3`, `4`, `6` |
| `placement` | `top`, `middle`, `none` |

Existing symbols to keep:

- `Nav/Icon/Chevron`, `Nav/Icon/Back-Arrow`, `Nav/Logo/Coachtopia`
- `Nav/Row/L1`, `Nav/Utility/Stacked-Text`, `Nav/Header/L2`
- `Nav/Image/Tile-16x9`, `Nav/Image/Tile-Hero-16x9`, `Nav/Image/Grid-2x3-16x9`, etc.

## Template matrix frames

Each frame: 390×~844 mobile, badge + prototype link.

### T1 Invoked (`LOCK` + Dev Ready when Frozen met)

| Frame ID | Layout | Placement | Prototype |
|----------|--------|-----------|-----------|
| T1-CS-1-TOP | l1-1 | above-categories | `?gallery=nav#l1-1` |
| T1-CS-2-TOP | l1-2 | above-categories | `#l1-2` |
| T1-CS-3-TOP | l1-3 | above-categories | `#l1-3` |
| T1-CS-1-MID | l1-1 | after-category | Outlet inline |
| T1-TEXT | none | — | Open menu, no spots |
| T1-EYEBROW | eyebrow list | — | Bags L2 flat |
| T1-LIST | chevron list | — | Women L2 |

### T2 Click (`LOCK`)

| Frame | Layout | Ratio | Gallery anchor |
|-------|--------|-------|----------------|
| T2-CS-1 | l2-1 | 16:9 | `#l2-1` |
| T2-CS-2-45 | l2-2 | 4:5 | `#l2-2-45` |
| T2-CS-2-169 | l2-2 | 16:9 | `#l2-2` |
| T2-CS-3 | l2-3 | 16:9 | `#l2-3` |
| T2-CS-4 | l2-4 | 16:9 | `#l2-4` |
| T2-CS-6 | l2-6 | 16:9 | `#l2-6` |

### T3 Click

- Text-only, eyebrow+list, list-only — no content spots (`LOCK`)

## Badge rules

| Badge | Color suggestion | When |
|-------|------------------|------|
| LOCK | Blue | Frozen req linked |
| STABLE | Gray | Token-named |
| POLISH | Yellow | Deferrable |
| OPEN | Red | Blocks Dev Ready for that item |

## Dev Ready gate

Per frame: all **LOCK** requirements for that template pass. Link to `REQ-NAV-###` in description field.

## Prototype cross-reference

- Gallery: https://mobile-nav-drawer.vercel.app/?gallery=nav
- Requirements: `template/docs/NAV_V3_REQUIREMENTS.md`
- Code map: `template/docs/NAV_V3_HANDOFF.md`

## Polish backlog (examples)

Move these off LOCK frames:

- Campaign copy / placeholder images (REQ-NAV-203)
- Outlet asset swaps (REQ-NAV-204)
- Stagger fine-tuning (REQ-NAV-202)

## Terminology on canvas

Use **T1 / T2 / T3** in Figma; footnote maps to **L1 / L2 / L3** in code.
