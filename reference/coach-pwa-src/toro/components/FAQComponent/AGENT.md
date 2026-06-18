# FAQ Accordion Feature Guide

**Owner:** [@tapestry-engineering]
**Last Updated:** 2026-02-19
**Related Tickets:** DIGIT-38945

## 1. Overview

The FAQ Accordion feature renders a collapsible Frequently Asked Questions section on the Product Detail Page (PDP). FAQ content is authored per-product in SFCC via a custom attribute, fetched server-side through a Next.js API route, and rendered client-side as an accessible accordion with analytics tracking.

**Purpose:** Display product-specific FAQ content in an expandable accordion UI, improving customer self-service and contributing to SEO via FAQPage structured data (JSON-LD).

**Scope:**
- Server-side FAQ data fetching and normalisation inside the PDP API route
- Client-side accordion rendering with lazy loading
- FAQPage JSON-LD schema generation for SEO
- Analytics tracking (impressions and interactions)
- Multi-brand styling via Chakra UI theme variants
- Feature-flag gating via `enableFaqAccordions` site preference

**What this feature does NOT cover:**
- FAQ content authoring (managed in SFCC Business Manager)
- FAQ data for non-PDP pages

## 2. Data Source & Server-Side Fetching

### 2.1. SFCC Product Attribute

The raw FAQ configuration lives on each SFCC product master as a custom attribute:

**Attribute:** `c_faqAccordionContent`
**Type:** JSON string
**Structure:**
```json
{
  "accordions": [
    {
      "title": "How do I care for this product?" | { "en-US": "How do I care for this product?", "fr-CA": "Comment entretenir ce produit?" },
      "contentAssetId": "faq-care-instructions"
    }
  ]
}
```

Each entry maps a question title (string or locale map) to a Content Asset ID that holds the answer body HTML.

### 2.2. Extraction in the PDP API Route

**File:** `src/pages/api/products/[...slug].js`

Inside `getPageData()`, the JSON string is extracted from normalised product data:

```javascript
// Line ~490
const faqDataString = productData?.custom?.c_faqAccordionContent
```

It is then passed to `fetchFaqData` inside the main `Promise.all` block alongside other parallel server-side fetches:

```javascript
// Line ~545
faqDataString ? fetchFaqData(req, faqDataString, locale) : null
```

The resolved `faqData` array is included in the returned `pageData` object (line ~788), which flows to the client-side product store.

### 2.3. fetchFaqData Helper

**File:** `src/toro/helpers/fetchFaqData.ts`

This is the server-side orchestrator that transforms the raw JSON config into renderable FAQ items.

**Step-by-step flow:**

1. **Parse JSON** — Extracts the `accordions` array from the JSON string. Returns `undefined` on parse failure or empty array.
2. **Collect Content Asset IDs** — Maps each FAQ item to its `contentAssetId`, filtering out empty/null IDs.
3. **Fetch Content Assets** — Calls `fetchContentAssets(req, contentAssetIds)` which hits the internal API route `/api/get-content-assets` (Headless-GetContent integration). This returns full content asset objects including `c_body` markup and `online` status.
4. **Filter Online Assets** — Only assets with `online.default === true` are included.
5. **Localise Titles** — `getLocalizedTitle()` resolves the correct title string for the current locale, falling back to `en_US`.
6. **Localise Content** — Reads `c_body.{locale}.markup` with fallback to `c_body.default.markup`.
7. **Sanitise HTML** — Passes content through `sanitizeHtmlMarkup()`.
8. **Generate Plain Text** — Uses cheerio to strip HTML tags, producing `text` for the JSON-LD schema.
9. **Filter Empty** — Removes items with no HTML content.
10. **Cap at 10** — `MAX_QUESTIONS_COUNT = 10` limits the output array.

**Returns:** `FAQItemWithContent[]` (defined in `src/generated/productSchema.ts`)

```typescript
export interface FAQItemWithContent {
  title: string
  html: string   // sanitised HTML for rendering
  text: string   // plain text for JSON-LD schema
}
```

### 2.4. Content Asset Fetching (Headless-GetContent)

**File:** `src/toro/helpers/fetchContentAssets.ts`

The helper calls the internal Next.js API route:

```
GET /api/get-content-assets?ids=faq-asset-1,faq-asset-2,...
```

This is the standard Headless-GetContent integration used across the codebase. It returns content assets keyed by ID with full `c_body` locale markup and `online` status.

## 3. Client-Side Consumption

### 3.1. FAQComponent (Accordion UI)

**File:** `src/toro/components/FAQComponent/index.tsx`

The component is prop-less; it reads data from the global product store and site preferences.

**Data retrieval:**
```typescript
const faqItemsWithContent = useProductData('faqData') as ProductData['faqData']
```

**Feature flag check:**
```typescript
const {
  toggleSiteFeatures: { enableFaqAccordions = false },
} = usePreferenceNew({
  ToggleSiteFeatures: ['enableFaqAccordions'],
})
```

**Guard clause — returns `null` when:**
- `enableFaqAccordions` is `false`
- `faqItemsWithContent` is `null`/`undefined`
- `faqItemsWithContent` is empty

**Template variant detection:**
```typescript
const isPDPv6 = useTemplate([TemplateName.pdpv6])
const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
const variant = isPDPv6 ? 'pdpv6' : isPDPv5_1 ? 'pdpv5_1' : undefined
```

**Accordion items transformation:**
Each `FAQItemWithContent` is mapped to `{ title, content: <HtmlContent /> }` and passed to `PrestyledAccordion`. The `HtmlContent` component handles safe HTML rendering with lazy-loaded images and videos.

### 3.2. FAQPage JSON-LD Schema (SEO)

**File:** `src/toro/components/AppMetaTags/ProductSchema/index.tsx`

The same `faqData` from `pageData` is consumed to generate structured data:

```typescript
const faqData = enableFaqAccordions ? get(pageData, 'faqData', []) : []
```

The `getFAQSchema()` function builds a standard `FAQPage` JSON-LD object:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

This uses the `text` field (plain text, HTML-stripped) from `FAQItemWithContent` — not the `html` field.

## 4. Component Hierarchy & Placement

### 4.1. Where FAQComponent is Rendered

The component appears in **four** PDP template entry points:

| Template | File | Placement |
|----------|------|-----------|
| PDP v6 (mobile, configurable) | `src/toro/components/product/mobile/ProductDetails/componentsMapping.tsx` | Registered in `componentsMap` as `FAQComponent`, order controlled by template config |
| PDP v6 (mobile, default) | `src/toro/components/product/mobile/ProductDetails/LowerPDPSection/index.tsx` | After `UGCContainer`, before `RatingsAndReviewsSection` |
| PDP v5.1 (desktop) | `src/toro/components/product/desktop/TemplateContainer/v5_1.tsx` | After `CompareToolsSection`, before `UGCContainer` |
| Legacy PDP (desktop) | `src/toro/components/product/ProductMainSection/AdditionalDetails2.jsx` | After `UGCContainer`, before Reviews |

### 4.2. Internal Component Tree

```
FAQComponent
├── Lazy (intersection observer wrapper)
│   └── onVisible → analytics "faq module impression"
└── PrestyledAccordion
    ├── Flex (styles.wrapper)
    ├── Text "Customer FAQs" (styles.title)
    └── Accordion (Chakra UI, allowToggle + allowMultiple)
        └── AccordionItem × N (styles.accordionItem)
            ├── AccordionButton (styles.button)
            │   ├── Text (question title) (styles.buttonText)
            │   └── AccordionIcon / AccordionIconExpanded
            └── AccordionPanel (styles.panel)
                └── HtmlContent (answer HTML, lazy images/videos)
```

### 4.3. Template Configurability (PDP v6)

In PDP v6, the component is registered in the template components mapping:

**File:** `src/toro/helpers/templating/types.ts`
```typescript
FAQ_COMPONENT: 'FAQComponent'
```

This means its position in the PDP layout can be overridden via the `pdpTemplates` site preference without a code change.

## 5. Styling

### 5.1. Architecture

Styling is handled through Chakra UI's multi-part component theme system via `useMultiStyleConfig('PrestyledAccordion', { variant })`.

**Theme parts:** `wrapper`, `title`, `accordionWrapper`, `accordionItem`, `button`, `buttonText`, `icon`, `panel`

### 5.2. Brand Themes

| Brand | Theme File | Notes |
|-------|-----------|-------|
| Coach (base) | `src/toro/components/PrestyledAccordion/themes/theme.ts` | Full `baseStyle` + `pdpv6` variant |
| Kate Spade | `src/toro/components/PrestyledAccordion/themes/theme-kate-spade.ts` | Overrides only; `pdpv6` and `pdpv5_1` variants |

**Coach base style highlights:**
- Wrapper: `width: 68%`, centered, `padding: 60px 30px 30px`
- Items: top/bottom borders with `var(--color-neutral-inactive)`
- Title: `text-display1-l` typography

**Coach `pdpv6` variant overrides:**
- Wrapper: `padding: 30px 10px`, `border-radius: var(--border-radius-m)`, `background: var(--color-white-base)`, `margin: 10px`, auto width
- Title: `text-display4-s` typography
- Items: borders use `var(--color-neutral-light-2)`
- Button text: `text-display4-xxs` typography

**Kate Spade `pdpv6` variant overrides:**
- Title: `text-display2-m` typography
- Button text: `text-display2-s` typography

**Kate Spade `pdpv5_1` variant overrides:**
- Custom font families, sizes, weights, and letter spacing

### 5.3. Theme Registration

The theme is registered in the global brand theme files:

- `src/toro/theme.js` (Coach)
- `src/toro/theme-kate-spade.js` (Kate Spade)
- `src/toro/components/product/mobile/theme.ts` (mobile PDP)
- `src/toro/components/product/mobile/theme-kate-spade.ts` (mobile PDP Kate Spade)
- `src/toro/components/product/desktop/theme/v5_1/theme-kate-spade.ts` (desktop v5.1 Kate Spade)

## 6. Analytics

### 6.1. Events

Event labels are **dynamically generated** from `accordionTitle.toLowerCase()`. The `accordionTitle` is the localised value of `pdp.product.customerFaq.title` (default: `"Customer FAQs"`), so labels are locale-dependent.

| Event Action | Event Label | Trigger |
|-------------|-------------|---------|
| `faq module impression` | `accordionTitle.toLowerCase()` (e.g. `"customer faqs"`) | Component scrolls into viewport (via `Lazy` `onVisible`) |
| `faq module click` | `` `${accordionTitle.toLowerCase()}:${newItem.title.toLowerCase()}` `` (e.g. `"customer faqs:how do i care for this product?"`) | User expands a specific accordion item |

### 6.2. Implementation Details

**Impression tracking** uses `handleOnVisible` callback from the `Lazy` wrapper. Fires once when the component becomes visible.

```typescript
// Line ~62 in FAQComponent/index.tsx
analytics.send('productInteraction', {
  eventAction: 'faq module impression',
  eventLabel: accordionTitle.toLowerCase(),
  eventLocation: 'product',
})
```

**Click tracking** uses `handleAccordionChange` on the Chakra `Accordion` `onChange` callback. It compares current expanded indexes with a `previousItemsRef` to detect newly opened items only (collapses are ignored via early return).

```typescript
// Line ~50 in FAQComponent/index.tsx
const eventLabel = `${accordionTitle.toLowerCase()}:${newItem.title.toLowerCase()}`
analytics.send('productInteraction', {
  eventAction: 'faq module click',
  eventLabel,
  eventLocation: 'product',
})
```

**Note:** Because labels derive from `accordionTitle` (a localised `react-intl` message), non-English locales will produce different label values. Analytics consumers should account for this.

## 7. Dependencies & Feature Flags

### 7.1. Site Preference

| Preference | Group | Purpose |
|-----------|-------|---------|
| `enableFaqAccordions` | `ToggleSiteFeatures` | Master on/off toggle for the entire FAQ feature |

**Definition:** `src/toro/site-preferences.ts` (in the `siteFeaturesPreferences` array)

When `false`, both the accordion UI and the FAQPage JSON-LD schema are suppressed.

### 7.2. PDP Template Dependencies

The `variant` prop passed to `PrestyledAccordion` depends on template detection:

- `pdpv6` → Uses `useTemplate([TemplateName.pdpv6])`
- `pdpv5_1` → Uses `useTemplate([TemplateName.pdpv5_1])`
- `undefined` → Falls back to base styles (legacy templates)

### 7.3. Key Hook & Component Dependencies

| Dependency | Purpose |
|-----------|---------|
| `useProductData('faqData')` | Retrieves FAQ data from global product state |
| `usePreferenceNew` | Reads `enableFaqAccordions` toggle |
| `useTemplate` | Detects current PDP template version |
| `useAnalytics` | Sends impression and click events |
| `useIntl` (react-intl) | Localises accordion section title |
| `PrestyledAccordion` | Reusable accordion wrapper with theme support |
| `HtmlContent` | Safe HTML rendering with lazy media |
| `Lazy` | Intersection observer for deferred rendering and impression tracking |

## 8. Vulnerable Points & Key Considerations

### 8.1. Data Integrity

- **Malformed JSON:** If `c_faqAccordionContent` contains invalid JSON, `fetchFaqData` catches the error, logs it, and returns `undefined`. The component safely renders nothing. However, the error is only logged to server console — no alerting or monitoring.
- **Missing Content Assets:** If a `contentAssetId` references a non-existent or offline asset, that FAQ item is silently filtered out. If all assets are offline, the component renders nothing.
- **Empty HTML:** Items where `c_body` resolves to an empty string after sanitisation are filtered out.

### 8.2. Locale Handling

- **Title locale mismatch:** The `getLocalizedTitle()` function normalises hyphens to underscores (`en-US` → `en_US`) for matching. If the title object uses a locale key format that doesn't match after normalisation, it falls back to `en_US` or returns empty string.
- **Content locale fallback:** Content reads `c_body.{locale}.markup` first, then `c_body.default.markup`. A product with FAQ content authored only for `en_US` will show English content for all locales via the `default` fallback — this is intentional SFCC behaviour.

### 8.3. Performance

- **Server-side parallel fetch:** `fetchFaqData` runs inside `Promise.all` with other data fetches, so it does not add to the critical path unless it is the slowest call.
- **Lazy rendering:** The `Lazy` wrapper defers DOM rendering until the user scrolls near the component, minimising initial paint cost.
- **`useMemo` for accordion items:** Item transformation is memoised on `faqItemsWithContent` reference.
- **Cap at 10 items:** `MAX_QUESTIONS_COUNT` prevents excessive DOM and network overhead.

### 8.4. SEO Schema

- The FAQPage schema uses the `text` field (plain text via cheerio). If HTML content contains only images/videos with no text, `text` will be empty and that Q&A pair will be filtered from the schema (via `.filter(item => item?.title && item?.text)`).
- The schema is gated by the same `enableFaqAccordions` preference — toggling it off removes both the UI and the structured data.

## 9. Testing

### 9.1. Test Files

| File | Scope |
|------|-------|
| `src/toro/helpers/fetchFaqData.test.ts` | Server-side fetching, normalisation, locale handling, edge cases |

**Key tested scenarios:**
- Invalid JSON handling
- Empty accordions array
- Correct locale resolution (exact match, fallback to `en_US`)
- Offline asset filtering
- Missing content asset filtering
- Empty HTML filtering
- `MAX_QUESTIONS_COUNT` cap (10 items)
- `htmlToPlainText` null/undefined handling

### 9.2. Mocking Requirements

```typescript
jest.mock('toro/helpers/fetchContentAssets')
jest.mock('toro/lib/cheerio', () => require('cheerio'))
```

## 10. Key Files & Directories

**Core Component:**
- `src/toro/components/FAQComponent/index.tsx` — Client-side accordion component

**Server-Side Data:**
- `src/pages/api/products/[...slug].js` — PDP API route (lines ~490, ~545, ~788)
- `src/toro/helpers/fetchFaqData.ts` — FAQ data fetch and normalisation helper
- `src/toro/helpers/fetchContentAssets.ts` — Generic content asset fetcher (`/api/get-content-assets`)

**SEO Schema:**
- `src/toro/components/AppMetaTags/ProductSchema/index.tsx` — FAQPage JSON-LD generation

**UI Components:**
- `src/toro/components/PrestyledAccordion/index.tsx` — Reusable themed accordion wrapper
- `src/toro/components/HtmlContent/` — Safe HTML renderer

**Themes:**
- `src/toro/components/PrestyledAccordion/themes/theme.ts` — Coach base + pdpv6 variant
- `src/toro/components/PrestyledAccordion/themes/theme-kate-spade.ts` — Kate Spade pdpv6 + pdpv5_1 variants

**Types:**
- `src/generated/productSchema.ts` — `FAQItemWithContent` interface, `ProductData.faqData` field

**Preferences:**
- `src/toro/site-preferences.ts` — `enableFaqAccordions` in `ToggleSiteFeatures` group

**Template Registration:**
- `src/toro/helpers/templating/types.ts` — `FAQ_COMPONENT` key
- `src/toro/components/product/mobile/ProductDetails/componentsMapping.tsx` — PDP v6 components map

**Tests:**
- `src/toro/helpers/fetchFaqData.test.ts` — Server-side helper tests

## 11. Related Documentation

**Domain Guides:**
- @.agents/domains/site-preferences.md — Preference system
- @.agents/domains/analytics-integration.md — Analytics tracking
- @.agents/domains/design-tokens.md — Multi-brand theming
- @.agents/domains/salesforce-integration.md — SFCC integration patterns
- @.agents/domains/code-style.md - Theming structure
