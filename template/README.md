# Browser template — mobile nav flyout

Coach-style **static** mobile navigation flyout (brand tabs, search field, horizontal categories, accordion sub-links, footer utilities).

## Run locally

```bash
cd template
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- The flyout opens **by default** so you see it immediately; close with **X**, reopen with the **menu + search** control in the demo header.
- Edit **`src/data/coachNavMock.ts`** for category labels and tree structure.
- Edit **`src/components/MobileNavFlyout.tsx`** + **`MobileNavFlyout.css`** for layout and behavior.

This app is **not** connected to `reference/coach-pwa-src/`; that folder remains a production code snapshot for handoff.
