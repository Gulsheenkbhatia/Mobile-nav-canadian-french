# Nav V3 Motion Spec

**Related:** [NAV_V3_REQUIREMENTS.md](./NAV_V3_REQUIREMENTS.md) (REQ-NAV-012) · [coach-tokens.css](../src/coach-tokens.css)

## Design intent

Motion matches [coach-nav.vercel.app](https://coach-nav.vercel.app/) V3: panel slide with content stagger. No bounce/spring. PWA handoff uses **CSS keyframes + CSS variables** (not Framer Motion).

## Token reference (source of truth: `coach-tokens.css`)

| Surface | CSS variable | Value |
|---------|--------------|-------|
| Drawer open/close | `--transition-duration-drawer` | 400ms |
| Scrim fade | `--transition-duration-scrim` | 400ms |
| L2/L3 panel slide | `--transition-duration-drill` | 500ms |
| L1 content spots | `--transition-duration-content-l1` | 500ms |
| L2/L3 content spots | `--transition-duration-content` | 700ms |
| Nav link stagger | `--transition-duration-nav-link-enter` | 480ms |
| Nav link exit | `--transition-duration-nav-link-exit` | 300ms |
| Content spot exit | `--transition-duration-content-exit` | 300ms |
| Panel easing | `--transition-easing-panel` | cubic-bezier(0.49, 0, 0.47, 0.98) |
| Nav link enter easing | `--transition-easing-nav-link-enter` | same as panel |
| Brand tabs | `--transition-duration-tab` | 100ms |

JS constant: `NAV_DRILL_MS = 500` in `src/components/nav/navDrillMotion.ts` (must match `--transition-duration-drill`).

## Motion variants

### Content spots — fade-down (`Fd`)

- Keyframe: `nav-enter-fade-down` in `nav-enter.css`
- Presets: `NAV_CONTENT_SPOTS_L1_ENTER`, `NAV_CONTENT_SPOTS_DRILL_ENTER`, `NAV_CONTENT_SPOTS_DRILL_EXIT`
- Stagger via `--nav-enter-i`, `--nav-enter-delay`, `--nav-enter-stagger`

### Nav links — slide-in (`Id`)

- Keyframe: `nav-enter-slide-in`
- Preset: `getNavLinkEnterPreset(depth, phase)` in `NavEnter.tsx`
- L1 delay: 0.08s overlap with drawer
- Drill delay: 0.08s overlap after overlay entered

## Arming protocol

Motion does **not** run on mount alone. CSS gates on parent state classes.

### L1 (drawer open)

1. Menu opens → `NAV_DRAWER_CONTENT_DELAY_MS` (100ms)
2. Double `requestAnimationFrame` → `l1StaggerReady = true`
3. `.invoked-menu__base--l1-ready` added
4. `nav-enter-group--enter` on link groups → stagger runs

### L2/L3 (drill forward)

1. User taps category → `l2ShouldEnter = true`, `l2StaggerReady = false`, direction `idle`
2. `DrillOverlay` mounts; after double rAF → `onEntered` → `l2StaggerReady = true`
3. `.invoked-menu__overlay--entered.invoked-menu__overlay--active` on panel
4. When `l2ShouldEnter && l2StaggerReady` → direction `enter` → link stagger runs
5. After `NAV_DRILL_MS`, `l2ShouldEnter = false` → direction `idle` (links stay visible)

### Drill back

1. `useDrillBack` sets `exitingIndex` → panel loses `--entered`, slides right
2. `nav-enter-group--exit` on exiting panel (reverse stagger)
3. Stack pops after `NAV_DRILL_MS`
4. Revealed panel: **no enter replay**

### Phase classes

| Class | Meaning |
|-------|---------|
| `nav-enter-group--enter` | Forward stagger active |
| `nav-enter-group--exit` | Reverse stagger on back |
| `nav-enter-group--idle` | Resting visible state (must not be hidden by pre-enter rules) |

### Critical CSS selectors

```css
/* L1 links */
.invoked-menu__base--l1-ready
  .nav-link-enter-group.nav-enter-group--enter ...

/* L2/L3 links */
.invoked-menu__overlay--entered.invoked-menu__overlay--active
  .nav-link-enter-group.nav-enter-group--enter ...

/* Exit */
.invoked-menu__overlay--exiting
  .nav-link-enter-group.nav-enter-group--exit ...
```

Pre-enter hidden state excludes `--idle` so links are not invisible while waiting for stagger.

## Sequence diagram

```
User taps category
  → NavV3ImageCollage: push stack, l2ShouldEnter=true
  → DrillOverlay mounts
  → double rAF → onEntered → l2StaggerReady=true
  → direction enter + overlay --entered --active
  → nav-enter.css runs slide-in stagger
  → after 500ms: l2ShouldEnter=false, direction idle
```

## Reduced motion

`@media (prefers-reduced-motion: reduce)` in `nav-enter.css` disables animations and sets `opacity: 1`.

## PWA integration notes

1. Copy `@keyframes` and stagger rules from `nav-enter.css` into theme CSS
2. Preserve class contract on overlay shell (`--entered`, `--active`, `--exiting`)
3. If not using React `NavEnterGroup`, set `--nav-enter-i` / `--nav-enter-delay` / `--nav-enter-stagger` on each child
4. Verify global PWA reset does not override `animation-fill-mode: both`

## Reference files

| File | Role |
|------|------|
| `src/components/nav/drill/DrillOverlay.tsx` | `--entered` lifecycle |
| `src/components/nav/drill/useDrillBack.ts` | Back timing |
| `src/components/nav/v3/NavEnter.tsx` | Stagger presets |
| `src/components/nav/v3/NavV3ImageCollage.tsx` | L1/L2/L3 arming state |
| `src/styles/nav-enter.css` | Keyframes + context matrix |
| `src/styles/invoked-menu.css` | Panel transform |
