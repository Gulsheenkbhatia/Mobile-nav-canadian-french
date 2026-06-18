# Browser template — mobile nav flyout

Coach-style **static** mobile navigation flyout (brand tabs, search field, horizontal categories, accordion sub-links, footer utilities).

## Run locally

```bash
cd template
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- The flyout starts **closed**; open it with the **menu + search** icon in the demo header. Close with **X** or **Escape**.
- **`src/styles/design-tokens.css`** — color, type, space, radius, motion, and icon tokens (aligned loosely with PWA-style names like `--coach-color-neutral-dark-1`).
- **`src/components/icons.tsx`** — shared SVG marks (bag, menu+search combo, search, close, footer utilities, US flag, accordion plus).
- Edit **`src/data/coachNavMock.ts`** for category labels and tree structure.
- Edit **`src/components/MobileNavFlyout.tsx`** + **`MobileNavFlyout.css`** for layout and behavior.

This app is **not** connected to `reference/coach-pwa-src/`; that folder remains a production code snapshot for handoff.
