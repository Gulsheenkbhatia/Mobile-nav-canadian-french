# ProductCard Component - AI Agent Context Node

> **Component Type:** Product Display / Visual Presentation
> **Location:** `src/toro/components/product/desktop/ProductCard/`
> **Created:** 2026-01-21
> **Last Updated:** 2026-01-21 (Enhanced with data sources, templates, and preferences)

---

## 1. Component Purpose & Business Context

### What This Component Does

The `ProductCard` is a **compound component** that displays individual product highlights within the Product Details Page (PDP). It presents product features, materials, craftsmanship details, or design stories in an elegant, branded card format. Each card can include:

- A title and optional subtitle/description
- A high-quality product image with lazy loading support
- Interactive hotspots highlighting specific features
- Optional Tangiblee AR/VR "Try-On" controls for immersive product viewing
- Brand-specific styling and hover interactions

### Business Value

- **Product Storytelling:** Enables rich, visual communication of product features and brand narratives
- **Engagement:** Interactive elements (hotspots, AR) increase customer engagement and time-on-page
- **Conversion Optimization:** Detailed product information reduces uncertainty and supports purchase decisions
- **Multi-Brand Flexibility:** Single component serves Coach, Kate Spade, and Stuart Weitzman with brand-appropriate styling
- **Premium Experience:** Sophisticated animations and layouts reinforce luxury brand positioning

### Where It's Used

- **Primary:** Product Detail Pages (PDP) - Desktop view (v5.0, v5.1 templates)
- **Secondary:** Product Detail Pages (PDP) - Mobile view (v6 template, rendered via ProductHighlights component)
- **Feature Sections:** "Product Highlights" carousel on desktop PDPs
- **Content Types:** Material details, craftsmanship stories, design features, sustainability messaging, bag size comparisons, hardware closeups

### Template Applicability

ProductCard is used in the following PDP templates:

| Template | Device | Status | Component Location |
|----------|--------|--------|-------------------|
| **PDP v5.0** | Desktop | Active (Optimizely experiment) | `ProductDetails` component in carousel |
| **PDP v5.1** | Desktop | Active (Optimizely experiment) | `ProductDetails` component in carousel |
| **PDP v6** | Mobile | Active (Optimizely experiment) | `ProductHighlights` component in carousel |
| **Default** | Desktop | Legacy | Not used (older PDP template) |

**Template Selection Logic:**
- **Desktop v5.1:** Requires `EXPERIMENTS.PDP_V5_1` enabled AND `isPdpV5Applicable: true` product attribute
- **Desktop v5.0:** Requires `EXPERIMENTS.PDP_V5` enabled AND `isPdpV5Applicable: true` product attribute
- **Mobile v6:** Requires `EXPERIMENTS.PDP_V6` enabled AND NOT bundle product
- **Default:** Fallback when no experiments active or product not eligible

**Template Detection:**
```typescript
// See: src/toro/helpers/templates.ts
const templates = getPdpTemplates({ req, productData, isBundleProduct })
// Returns: { mobile: 'pdpv6', desktop: 'pdpv5_1' }
```

---

## 2. Data Source & Content Generation

### SFCC Product Attributes

ProductCard content is **dynamically generated** from Salesforce Commerce Cloud (SFCC) product data. The data transformation happens server-side in the Next.js API route.

**Primary SFCC Attribute:**
- `c_visualProductDetail` (JSON string) - Contains configuration for all product card types

**Data Flow:**
```
SFCC Product Object
  ↓
  custom.c_visualProductDetail (JSON string)
  ↓
  Next.js API Route: /api/products/[...slug].js
  ↓
  getProductCardsData() helper (src/toro/helpers/getProductCardsData.ts)
  ↓
  productCardDetails array (typed as ProductCardItem[])
  ↓
  Stored in pageData.productCardDetails
  ↓
  useProductData(['productCardDetails']) hook
  ↓
  ProductDetails/ProductHighlights components
  ↓
  ProductCard instances (rendered via .map())
```

### Product Card Types

The `c_visualProductDetail` JSON defines multiple card types, each with specific data requirements:

| Card Type | Purpose | SFCC Attributes Used | Example Use Case |
|-----------|---------|---------------------|------------------|
| **bagsize** | Bag size comparison | `c_bagSize`, `c_height`, `c_length`, `c_itemWidth` | Show bag dimensions with visual comparison |
| **bagSpace** | Interior capacity | `c_bagSpace`, custom images | Demonstrate storage capacity |
| **seeHowFits** | Lifestyle imagery | `c_seeHowItFits`, model images | Show bag on model or in use |
| **hardware** | Hardware details | `c_handleDetail`, hardware images | Highlight zippers, clasps, turnlocks |
| **material** | Material closeups | `c_material`, `c_materialVal`, `c_additionalMaterials` | Showcase leather, fabric, or texture |
| **measurement** | Product dimensions | `c_height`, `c_length`, `c_itemWidth` | Display exact measurements |
| **features** | Product features | `c_closerLookText`, feature images | Highlight pockets, compartments, straps |
| **footwearMaterial** | Shoe materials | `c_material`, footwear-specific images | Leather, suede, or fabric details |
| **rtwMeasurement** | Ready-to-wear sizing | RTW-specific dimensions | Clothing measurements |
| **rtwFeatures** | RTW features with hotspots | Feature descriptions + hotspot coordinates | Interactive clothing details |
| **walletsMeasurement** | Wallet dimensions | Wallet-specific measurements | Small leather goods sizing |
| **walletsFeatures** | Wallet features | Card slots, compartments | Interior organization details |
| **miscMeasurement** | Misc product sizing | Generic dimensions | Accessories, jewelry |
| **miscFeatures** | Misc product features | Generic feature descriptions | Accessory-specific details |

### Data Transformation Logic

**Location:** `src/toro/helpers/getProductCardsData.ts`

**Key Functions:**
```typescript
// Main orchestrator - parses c_visualProductDetail and generates cards
getProductCardsData(
  vgImageGroups,        // Variation group images
  menuData,             // Navigation/category data
  visualProductDetailData,  // c_visualProductDetail JSON string
  pageDataCustomAttributes, // Product custom attributes
  categoryData,         // Category metadata
  templates             // PDP template (v5.0, v5.1, v6)
): ProductCardItem[]

// Individual card generators (14 types)
getBagSizeCard({ cardConfigs, pageDataCustomAttributes, ... })
getMaterialCard({ cardConfigs, vgImageGroups, ... })
getFeaturesWithHotspotCard({ cardConfigs, ... })
// ... etc for each card type
```

**ProductCardItem Type:**
```typescript
export type ProductCardItem = {
  title: string                    // Main heading
  subtitle?: string                // Optional eyebrow text
  description?: string             // Optional subtext
  images: Record<string, string>   // Image URLs by variation group
  loadStrategy: 'lazy' | null      // Lazy load in carousels
  tangibleeCta?: TangibleeControlType  // AR/VR control type
  hotspots?: HotSpot[]            // Interactive badges
  styleVariant?: string           // Theme variant key
  imgShift?: {                    // Image positioning adjustments
    mt?: number | string
    mr?: number | string
    mb?: number | string
    ml?: number | string
    transform?: string
  }
}
```

### Image Selection Logic

Product card images are selected from variation group image groups using configured suffixes:

**Pattern:**
1. SFCC stores multiple image views: `Product`, `Swatch`, `Large`, etc.
2. Each card type config specifies desired image suffix (e.g., `"_a1"`, `"_b1"`)
3. `getImageWithConfiguredSuffix()` matches suffix to available images
4. Returns image URL per variation group (color)

**Example:**
```json
// c_visualProductDetail excerpt
{
  "material": {
    "title": "Premium Leather",
    "defaultAsset": "materialImage",
    "materialImage": "_a1,_b1"  // Try _a1 first, fallback to _b1
  }
}
```

### Category-Based Configuration

Some card attributes are configured at the **category level** via site preferences:

**Site Preference:** `visualProductDetailConfigs` (JSON object)

**Structure:**
```json
{
  "handbags": {
    "bagsize": { "enabled": true, "dimensions": ["height", "length", "width"] },
    "material": { "enabled": true, "defaultAsset": "materialImage" }
  },
  "footwear": {
    "footwearMaterial": { "enabled": true },
    "measurement": { "enabled": true }
  }
}
```

**Resolution Logic:**
1. Product's category ID determines which config object to use
2. `getProductCategoryAttributeConfig()` resolves category-specific settings
3. Card generators merge category config with product-level data

### Template-Specific Behavior

Product cards render differently based on active PDP template:

**Template Detection:**
```typescript
// In getProductCardsData()
const templates = { mobile: 'pdpv6', desktop: 'pdpv5_1' }

// Passed to card generators
isTemplateSupportsProductCards(templates)
```

**Template Variations:**
- **v5.0/v5.1 Desktop:** Full carousel with all card types
- **v6 Mobile:** Simplified cards, some types hidden
- **Default:** Product cards not rendered (legacy template)

---

## 3. Component Architecture

### Compound Component Pattern

ProductCard follows a **compound component** architecture pattern, exposing three sub-components as static properties:

```typescript
<ProductCard styleVariant="handleStrap" tangibleeCta="tryOn" imageUrl="...">
  <ProductCard.Header>
    <h3>Subtitle</h3>
    <h2>Main Title</h2>
    <h3>Description</h3>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image image="product.jpg" loadStrategy="lazy">
      {/* Optional: HotSpotBadge components */}
    </ProductCard.Image>
  </ProductCard.Body>
</ProductCard>
```

**Why Compound Components?**
- Provides flexible composition for varying content structures
- Maintains semantic HTML hierarchy (header, body, image)
- Allows consumers to control layout while enforcing consistent styling
- Simplifies testing and maintenance of individual sub-components

### Sub-Components

#### `ProductCard` (Root)
- Container managing overall card layout and styles
- Handles StylesProvider context for nested components
- Conditionally renders Tangiblee AR/VR controls
- Applies brand-specific variants via `useMultiStyleConfig`

#### `ProductCard.Header`
- Displays card titles, subtitles, and descriptions
- Manages text hierarchy and spacing
- Handles hover animations for secondary text
- Semantic HTML: Uses `<h2>` for main title, `<h3>` for supporting text

#### `ProductCard.Body`
- Wrapper for main card content (typically the product image)
- Provides flex container for layout management
- No direct business logic—pure presentational

#### `ProductCard.Image`
- Handles product image display with performance optimization
- Supports lazy loading via Splide carousel integration
- Applies image transformations (positioning shifts)
- Manages image preset query parameters for CDN optimization
- **CDN Pattern:** Appends `?$productTile-1-1-m$` for optimized delivery

---

## 3. Props API Reference

### ProductCard (Root Component)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `styleVariant` | `string` | No | `undefined` | Theme variant key (e.g., `"handleStrap"`) to apply alternative styling. Maps to variants in `themes/theme.ts`. |
| `tangibleeCta` | `TangibleeControlType` | No | `undefined` | Enables AR/VR "Try-On" feature. See `ProductTangibleeControl` for valid types. |
| `imageUrl` | `string` | No | `undefined` | Product image URL passed to Tangiblee for AR rendering. Required if `tangibleeCta` is provided. |
| `children` | `ReactNode` | Yes | - | Must include `ProductCard.Header` and `ProductCard.Body` sub-components. |

**Props Pattern Mapping:**
- **Styling Props:** Follow Chakra UI's variant pattern (see @.agents/adrs/003-chakra-ui-adoption.md)
- **Integration Props:** `tangibleeCta` and `imageUrl` for third-party service integration
- **Composition Props:** `children` for compound component pattern

### ProductCard.Image

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `image` | `string` | Yes | - | Base product image URL (without query parameters). Component appends CDN presets. |
| `loadStrategy` | `'lazy' \| null` | No | `null` | Enables lazy loading via Splide's `data-splide-lazy` attribute. Use `'lazy'` for images in carousels. |
| `imgShift` | `object` | No | `{}` | Fine-tune image positioning. Accepts: `{ mt, mr, mb, ml, transform }` (Chakra UI style props). |
| `children` | `ReactNode` | No | `undefined` | Typically `HotSpotBadge` components for interactive feature highlighting. |

**Image URL Pattern:**
- **Input:** `https://cdn.coach.com/products/12345.jpg`
- **Output:** `https://cdn.coach.com/products/12345.jpg?$productTile-1-1-m$`
- **CDN Preset:** `$productTile-1-1-m$` requests 1:1 aspect ratio, medium quality for product tiles

### ProductCard.Header

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Expected structure: `<h3>` (subtitle), `<h2>` (title), `<h3>` (description). Order matters for styling. |

**Semantic HTML Requirements:**
- **Main Title:** Must be `<h2>` (styled as display heading)
- **Subtitle/Eyebrow:** Optional `<h3>` before title (small, uppercase)
- **Description:** Optional `<h3>` after title (body text, animated on hover)

### ProductCard.Body

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Typically `ProductCard.Image`. Can include other decorative elements. |

---

## 4. State Management & Internal Logic

### State Approach

**This component is STATELESS.** It follows a **pure presentational pattern** with NO internal state management.

**Why Stateless?**
- Product card data comes from parent components (ProductDetails, ProductHighlights)
- No user interactions that modify component state
- Styling states (hover, focus) handled via CSS-in-JS
- Tangiblee integration is self-contained (no state lifted to ProductCard)

### Data Flow

```
ProductDetails (Parent)
  ↓
  useProductData hook → Fetches SFCC product data
  ↓
  productCardDetails array
  ↓
  .map() → ProductCard instances
  ↓
  ProductCard (Presentational)
  ↓
  Renders with provided props
```

**Data Source:** Product card content originates from Salesforce Commerce Cloud (SFCC) via the `useProductData` hook. This hook fetches data from SFCC through Next.js API routes (NEVER direct client-side calls).

### Key Internal Logic

1. **Theme Application:**
   ```typescript
   const styles = useMultiStyleConfig('ProductCard', { variant: styleVariant })
   ```
   - Resolves brand-specific and variant-specific styles from theme files
   - Returns multi-part style object (wrapper, header, body, image, tangiblee)
   - Provided to children via `StylesProvider` context

2. **Image URL Construction:**
   ```typescript
   const presetImage = `${image}?$productTile-1-1-m$`
   const dataSplideLazy = loadStrategy ? presetImage : null
   const imageSrc = !loadStrategy ? presetImage : null
   ```
   - Conditionally sets `src` vs `data-splide-lazy` based on loading strategy
   - Ensures images in carousels load lazily, standalone images load immediately

3. **Conditional Tangiblee Rendering:**
   ```typescript
   {tangibleeCta && (
     <Box sx={styles.productCardTangibleeWrapper}>
       <ProductTangibleeControl type={tangibleeCta} imageUrl={imageUrl} onVpdCards />
     </Box>
   )}
   ```
   - Only renders AR/VR controls when `tangibleeCta` prop is provided
   - Positioned absolutely via theme styles (bottom center)

---

## 5. Multi-Brand Theme System

### Theme Architecture

ProductCard uses Chakra UI's **multi-part component** theming pattern with brand-specific overrides.

**Theme File Structure:**
```
themes/
  ├── theme.ts              # Base styles (all brands)
  └── v5_1/
      └── kate-spade.ts     # Kate Spade v5.1 overrides
```

### Base Theme (`themes/theme.ts`)

**Parts Defined:**
- `productCardWrapper` - Outer container, aspect ratio, borders, shadows
- `productCardTitleContainer` - Header text layout and typography
- `productCardBodyContainer` - Body flex container
- `productCardImageWrapper` - Image container with hover transforms
- `productCardImage` - Image element styles
- `productCardTangibleeWrapper` - AR/VR control positioning

**Key Styling Features:**
- **Aspect Ratio:** Fixed `359 / 617` (portrait card)
- **Responsive Height:** `calc(100vh - 350px)` with `425px` minimum
- **Hover Animations:**
  - Image translates down 25px
  - Hidden description text fades in
  - Smooth 400ms transitions
- **Design Tokens:** Uses CSS variables for colors, spacing, typography
  - `var(--color-neutral-light-2)` - Border color
  - `var(--color-page-bg)` - Background
  - `var(--spacing-4)` - Padding scale
  - `var(--text-display4-s)` - Display typography

**Variants:**
- **`handleStrap`** - Adjusted for products with visible handle straps
  - Increases hover translation to 32px
  - Adds bottom margin to body container
  - Disables default image transform

### Brand-Specific Overrides (`v5_1/kate-spade.ts`)

Kate Spade v5.1 applies these modifications:
- **Background:** Lighter neutral (`--color-neutral-light-1`)
- **Typography:** Custom font family (`--font-face1-light` for subtitles)
- **Title Styling:** Center-aligned, 24px font size, 120% line height
- **Animation:** Disables hover image translation

**How Overrides Work:**
1. Base theme defines all styling parts and default values
2. Brand themes use `mergeWith` to override specific properties
3. `useMultiStyleConfig` hook resolves the final merged theme
4. Current brand determined by environment variable (build-time)

### Accessing Theme in Components

```typescript
// Root component - merge variant with base theme
const styles = useMultiStyleConfig('ProductCard', { variant: styleVariant })

// Sub-components - access inherited styles
const styles = useStyles()
```

**Pattern Rules:**
- ✅ **DO:** Use `useMultiStyleConfig` in root component
- ✅ **DO:** Use `useStyles` in sub-components (accesses StylesProvider context)
- ❌ **DON'T:** Hardcode brand-specific values in component code
- ❌ **DON'T:** Use conditional brand checks (e.g., `if (brand === 'coach')`)

---

## 6. Integration Points

### Tangiblee AR/VR Integration

**Component:** `ProductTangibleeControl`
**Purpose:** Enables customers to view products in augmented reality (AR) or virtual reality (VR)

**Integration Pattern:**
```typescript
{tangibleeCta && (
  <ProductTangibleeControl
    type={tangibleeCta}
    imageUrl={imageUrl}
    onVpdCards
  />
)}
```

**Props Passed:**
- `type` - Type of CTA button (e.g., "tryOn", "viewIn3D")
- `imageUrl` - Product image URL for Tangiblee rendering
- `onVpdCards` - Boolean flag indicating component is on VPD (View Product Details) cards

**Business Logic:**
- Tangiblee script loads asynchronously (configured in `public/scripts/`)
- Control only renders if `tangibleeCta` prop is truthy
- Positioned absolutely at card bottom (centered)

### HotSpotBadge Integration

**Component:** `HotSpotBadge` (imported by parent, passed as children to ProductCard.Image)
**Purpose:** Interactive badges highlighting specific product features

**Integration Pattern:**
```typescript
<ProductCard.Image image="...">
  {card?.hotspots?.map((item, idx) => (
    <HotSpotBadge
      key={`${idx}-${item?.title}`}
      {...item}
      styleVariant={card?.styleVariant}
    />
  ))}
</ProductCard.Image>
```

**Data Flow:**
- Hotspot data comes from SFCC product attributes
- Parent component (ProductDetails/ProductHighlights) maps hotspots array
- Rendered as children of ProductCard.Image for absolute positioning over image

### Splide Carousel Integration

**Library:** Splide.js (carousel/slider)
**Usage:** Lazy loading images within carousel contexts

**Integration Pattern:**
```typescript
// When in carousel:
<Image data-splide-lazy={presetImage} />

// When standalone:
<Image src={presetImage} />
```

**Logic:**
- If `loadStrategy="lazy"`, image URL set on `data-splide-lazy` attribute
- Splide library observes this attribute and loads image when slide becomes visible
- Improves performance in multi-card carousels (only loads visible cards)

---

## 7. Performance Optimization

### Image Loading Strategy

**CDN Presets:** Automatically applies Akamai image transformations
- **Preset:** `?$productTile-1-1-m$`
- **Effect:** Requests optimized 1:1 aspect ratio, medium quality
- **Benefit:** Reduces image payload by ~60% vs. full resolution

**Lazy Loading:**
- Defers image loading until needed (carousel scrolling)
- Reduces initial page weight and Time to Interactive (TTI)
- **Usage:** Set `loadStrategy="lazy"` for images in carousels

**Image Format Optimization:**
- CDN automatically serves WebP to supporting browsers
- Falls back to JPEG for legacy browsers
- No component code changes required

### Component Rendering

**Optimization:** Memoized style computation via `useMultiStyleConfig`
- Custom hook (`useMemoizedStyleConfig`) replaces Chakra's default
- Prevents costly theme object merging on every render
- Dependency tracking ensures re-computation only when variant changes

**Bundle Size Impact:**
- **Component:** ~2.5KB uncompressed
- **Theme Files:** ~3KB total (base + brand overrides)
- **Total Impact:** ~5.5KB per component (shared across instances)

### Performance Monitoring

**Key Metrics to Watch:**
- **Largest Contentful Paint (LCP):** ProductCard images are often LCP candidates
- **Cumulative Layout Shift (CLS):** Ensure aspect ratio prevents layout shifts
- **Time to Interactive (TTI):** Lazy loading improves TTI on long PDPs

**Optimization Checklist:**
- ✅ Images use CDN presets
- ✅ Lazy loading enabled in carousels
- ✅ Aspect ratio defined (prevents CLS)
- ✅ Theme styles memoized
- ✅ No expensive computations in render path

---

## 8. Testing Strategy

### Current State

⚠️ **No test file currently exists for this component.**

### Required Test Coverage

Following project testing standards (Jest + React Testing Library), ProductCard tests should cover:

#### **Rendering Tests**
- Renders all sub-components (Header, Body, Image) correctly
- Displays title, subtitle, and description when provided
- Renders children passed to sub-components

#### **Props Tests**
- Applies correct `styleVariant` to theme system
- Conditionally renders Tangiblee control when `tangibleeCta` provided
- Passes `imageUrl` to Tangiblee component correctly
- Applies `imgShift` styles to Image component

#### **Multi-Brand Tests**
- Renders with Coach theme styles
- Renders with Kate Spade theme overrides
- Applies correct CSS variables for each brand

#### **Image Loading Tests**
- Sets `src` attribute when `loadStrategy` is null
- Sets `data-splide-lazy` when `loadStrategy="lazy"`
- Appends CDN preset query parameter to image URLs

#### **Accessibility Tests**
- Root container has `role="group"` for semantic grouping
- Heading hierarchy is correct (h2 for main title, h3 for supporting text)
- Images have appropriate alt text (tested at integration level)

### Test File Template

```typescript
// index.test.tsx
import { render } from 'test-utils/react'
import ProductCard from './index'

describe('ProductCard', () => {
  describe('Rendering', () => {
    it('should render Header, Body, and Image sub-components', () => {
      // Test compound component rendering
    })
  })

  describe('Props - styleVariant', () => {
    it('should apply variant styles from theme', () => {
      // Test variant application
    })
  })

  describe('Props - Tangiblee Integration', () => {
    it('should render Tangiblee control when tangibleeCta provided', () => {
      // Test conditional rendering
    })

    it('should not render Tangiblee control when tangibleeCta is undefined', () => {
      // Test default behavior
    })
  })

  describe('Image Loading Strategy', () => {
    it('should set src when loadStrategy is null', () => {
      // Test immediate loading
    })

    it('should set data-splide-lazy when loadStrategy="lazy"', () => {
      // Test lazy loading
    })

    it('should append CDN preset to image URL', () => {
      // Test URL transformation
    })
  })

  describe('Accessibility', () => {
    it('should have role="group" on root container', () => {
      // Test semantic grouping
    })
  })
})
```

### Testing Best Practices

**From Project Guidelines:**
- Use custom `render()` from `src/test-utils/react` (pre-configured providers)
- Use `data-qa` attributes instead of `data-testid`
- Use `toBeVisible()` instead of `toBeInTheDocument()`
- Use `jest.mocked()` instead of `jest.Mock` for TypeScript safety
- Mock external dependencies (ProductTangibleeControl, HotSpotBadge)

**Multi-Brand Testing:**
- Create mock theme objects for each brand
- Test style resolution via `useMultiStyleConfig` with different themes
- Verify CSS variable values applied correctly

---

## 13. Common Usage Patterns

### Pattern 1: Basic Product Highlight Card

**Use Case:** Simple product feature card with title and image

```typescript
<ProductCard>
  <ProductCard.Header>
    <Box as="h2">Premium Leather</Box>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image
      image="https://cdn.coach.com/leather-detail.jpg"
    />
  </ProductCard.Body>
</ProductCard>
```

### Pattern 2: Card with Subtitle and Description

**Use Case:** Detailed product story with multiple text elements

```typescript
<ProductCard>
  <ProductCard.Header>
    <Box as="h3">Craftsmanship</Box>
    <Box as="h2">Hand-Stitched Excellence</Box>
    <Box as="h3">Each bag requires 8 hours of expert craftsmanship</Box>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image
      image="https://cdn.coach.com/craftsmanship.jpg"
    />
  </ProductCard.Body>
</ProductCard>
```

### Pattern 3: Card with Interactive Hotspots

**Use Case:** Feature callouts highlighting specific product elements

```typescript
<ProductCard>
  <ProductCard.Header>
    <Box as="h2">Thoughtful Details</Box>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image image="https://cdn.coach.com/details.jpg">
      <HotSpotBadge
        title="Turnlock Closure"
        position={{ top: '20%', left: '30%' }}
      />
      <HotSpotBadge
        title="Interior Pockets"
        position={{ top: '60%', left: '50%' }}
      />
    </ProductCard.Image>
  </ProductCard.Body>
</ProductCard>
```

### Pattern 4: Card with Tangiblee AR Integration

**Use Case:** Enable "Try On" feature for bags and accessories

```typescript
<ProductCard
  tangibleeCta="tryOn"
  imageUrl="https://cdn.coach.com/handbag.jpg"
>
  <ProductCard.Header>
    <Box as="h2">See It In Your Space</Box>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image image="https://cdn.coach.com/handbag.jpg" />
  </ProductCard.Body>
</ProductCard>
```

### Pattern 5: Variant Styling (Handle Strap)

**Use Case:** Products with visible straps requiring adjusted hover animation

```typescript
<ProductCard styleVariant="handleStrap">
  <ProductCard.Header>
    <Box as="h2">Adjustable Strap</Box>
  </ProductCard.Header>

  <ProductCard.Body>
    <ProductCard.Image
      image="https://cdn.coach.com/strap-detail.jpg"
      imgShift={{ transform: 'translateY(-20px)' }}
    />
  </ProductCard.Body>
</ProductCard>
```

### Pattern 6: Lazy Loading in Carousel

**Use Case:** ProductCard instances in Splide carousel (ProductDetails component)

```typescript
{productCardDetails.map((card) => (
  <ProductCard
    key={card.title}
    styleVariant={card.styleVariant}
  >
    <ProductCard.Header>
      <Box as="h2">{card.title}</Box>
    </ProductCard.Header>

    <ProductCard.Body>
      <ProductCard.Image
        image={card.image}
        loadStrategy="lazy"  // Important: enables lazy loading
      />
    </ProductCard.Body>
  </ProductCard>
))}
```

---

## 14. Anti-Patterns & Common Mistakes

### ❌ Anti-Pattern 1: Hardcoding Brand-Specific Styles

**WRONG:**
```typescript
<ProductCard>
  <ProductCard.Header>
    <Box
      as="h2"
      style={{
        color: brand === 'coach' ? '#000' : '#333',
        fontFamily: brand === 'kate-spade' ? 'Proxima Nova' : 'Helvetica'
      }}
    >
      {title}
    </Box>
  </ProductCard.Header>
</ProductCard>
```

**RIGHT:**
```typescript
<ProductCard>
  <ProductCard.Header>
    <Box as="h2">{title}</Box>  {/* Styling via theme */}
  </ProductCard.Header>
</ProductCard>
```

**Why:** Theme system automatically applies brand-specific styles. Hardcoding creates maintenance burden and bypasses multi-brand architecture.

### ❌ Anti-Pattern 2: Importing Chakra Components Directly

**WRONG:**
```typescript
import { Flex, Box, Image } from '@chakra-ui/react'
```

**RIGHT:**
```typescript
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
```

**Why:** Custom Toro components include optimizations (memoized theme resolution) and project-specific enhancements. Direct Chakra imports bypass these.

### ❌ Anti-Pattern 3: Incorrect Heading Hierarchy

**WRONG:**
```typescript
<ProductCard.Header>
  <Box as="h1">{title}</Box>  {/* h1 not appropriate here */}
  <Box as="h4">{subtitle}</Box>
  <Box as="h5">{description}</Box>
</ProductCard.Header>
```

**RIGHT:**
```typescript
<ProductCard.Header>
  <Box as="h3">{subtitle}</Box>      {/* Optional eyebrow */}
  <Box as="h2">{title}</Box>         {/* Main heading */}
  <Box as="h3">{description}</Box>   {/* Optional subtext */}
</ProductCard.Header>
```

**Why:** Theme styles target specific heading elements (`h2` for title, `h3` for subtitle/description). Wrong elements break styling and accessibility.

### ❌ Anti-Pattern 4: Missing CDN Preset

**WRONG:**
```typescript
<ProductCard.Image
  image="https://cdn.coach.com/products/12345.jpg?width=800&height=800"
/>
```

**RIGHT:**
```typescript
<ProductCard.Image
  image="https://cdn.coach.com/products/12345.jpg"
  // Component appends: ?$productTile-1-1-m$
/>
```

**Why:** Component automatically appends optimized CDN presets. Manual query parameters override this and may result in oversized images.

### ❌ Anti-Pattern 5: Using State in ProductCard

**WRONG:**
```typescript
const ProductCard = ({ title, image }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <ProductCard onClick={() => setIsExpanded(!isExpanded)}>
      {/* ... */}
    </ProductCard>
  )
}
```

**RIGHT:**
```typescript
// State managed in parent component
const ProductDetails = () => {
  const [expandedCard, setExpandedCard] = useState(null)

  return (
    <ProductCard>  {/* Stateless, pure presentation */}
      {/* ... */}
    </ProductCard>
  )
}
```

**Why:** ProductCard is a presentational component. State management belongs in parent containers (ProductDetails, ProductHighlights).

### ❌ Anti-Pattern 6: Tangiblee Without imageUrl

**WRONG:**
```typescript
<ProductCard tangibleeCta="tryOn">
  {/* Missing imageUrl prop */}
</ProductCard>
```

**RIGHT:**
```typescript
<ProductCard
  tangibleeCta="tryOn"
  imageUrl="https://cdn.coach.com/handbag.jpg"
>
  {/* ... */}
</ProductCard>
```

**Why:** Tangiblee requires product image URL for AR rendering. Missing `imageUrl` will cause runtime errors in ProductTangibleeControl.

---

## 15. Context Brain Links

### Related Global Documentation

This component implements patterns and principles from:

- **[@.agents/adrs/001-multi-brand-architecture.md](../../../../../../.agents/adrs/001-multi-brand-architecture.md)**
  *Why:* Explains environment-based configuration and theme inheritance systems that enable ProductCard to work across Coach, Kate Spade, and Stuart Weitzman.

- **[@.agents/adrs/003-chakra-ui-adoption.md](../../../../../../.agents/adrs/003-chakra-ui-adoption.md)**
  *Why:* Documents Chakra UI integration patterns, particularly multi-part component theming used by ProductCard.

- **[@.agents/domains/design-tokens.md](../../../../../../.agents/domains/design-tokens.md)**
  *Why:* CSS variables used throughout ProductCard theme files (`var(--color-primary)`, `var(--spacing-4)`) are defined and documented here.

- **[@.agents/domains/performance-optimization.md](../../../../../../.agents/domains/performance-optimization.md)**
  *Why:* Image optimization strategies (CDN presets, lazy loading) and memoized style computation patterns.

- **[@AGENTS.md](../../../../../../AGENTS.md)**
  *Why:* Project-wide conventions for file naming, component organization, testing standards, and security guidelines.

### Related Components

**Parent Components:**
- `ProductDetails` - Desktop PDP component that renders ProductCard in carousel
- `ProductHighlights` - Mobile PDP component using ProductCard for feature display

**Child/Integration Components:**
- `ProductTangibleeControl` - AR/VR integration for try-on experiences
- `HotSpotBadge` - Interactive feature callouts overlaid on product images

**Peer Components:**
- `ProductCardTable` - Companion component displaying product specifications below cards
- `ProductDetailsContentWrapper` - Splide carousel wrapper managing card layout

### SFCC Integration

**Data Source:** Product card content originates from Salesforce Commerce Cloud (SFCC) via:
- **Primary Attribute:** `c_visualProductDetail` (JSON string containing card configurations)
- **API Route:** `/api/products/[...slug].js` - Proxies SFCC data through Next.js (NEVER direct client-side calls)
- **Helper Function:** `getProductCardsData()` in `src/toro/helpers/getProductCardsData.ts`
- **Hook:** `useProductData(['productCardDetails'])` - Accesses transformed data in parent components
- **Reference:** See @.agents/adrs/005-salesforce-commerce-cloud-integration.md for SFCC patterns

**Critical Security Rule:** All SFCC API calls MUST go through Next.js API routes. Direct client-side SFCC calls are prohibited for security reasons (API credentials exposure).

---

## 12. Site Preferences & Configuration Toggles

### Global Feature Toggles

ProductCard visibility and behavior is controlled by multiple site preferences and product attributes.

#### Primary Feature Toggle

**Site Preference:** `enableVisualProductDetail`
**Type:** Boolean
**Location:** `pdpPreferences` bundle
**Purpose:** Master switch for product card feature across entire site

```typescript
// Usage in code
const { PDPPreferences: { enableVisualProductDetail } } = usePreference({
  PDPPreferences: ['enableVisualProductDetail']
})

// If false, product cards don't render at all
```

**Business Impact:**
- `true` - Product cards render on eligible products (default for v5+ templates)
- `false` - Product cards hidden site-wide (fallback for legacy experience)

#### Configuration Preference

**Site Preference:** `visualProductDetailConfigs`
**Type:** JSON Object
**Location:** `pdpPreferences` bundle
**Purpose:** Category-specific card type configurations

**Structure:**
```json
{
  "categoryId": {
    "cardType": {
      "enabled": boolean,
      "title": string,
      "defaultAsset": string,
      "dimensions": string[],
      // ... card-specific config
    }
  }
}
```

**Example Configuration:**
```json
{
  "handbags": {
    "bagsize": {
      "enabled": true,
      "title": "Size Comparison",
      "dimensions": ["height", "length", "width"]
    },
    "material": {
      "enabled": true,
      "defaultAsset": "materialImage",
      "materialImage": "_a1,_b1"
    },
    "hardware": {
      "enabled": true,
      "title": "Hardware Details"
    }
  },
  "footwear": {
    "footwearMaterial": {
      "enabled": true
    },
    "measurement": {
      "enabled": false
    }
  }
}
```

**Resolution Logic:**
1. Product's `category_id` or `primaryCategoryId` determines config object
2. `getProductCategoryAttributeConfig()` helper resolves category hierarchy
3. Falls back to parent category if specific category not configured
4. Card type only renders if `enabled: true` in config

### Template-Based Toggles

Product cards are **template-dependent**. They only render in specific PDP templates:

**Template Requirements:**
- **Desktop:** Requires `pdpv5_0` OR `pdpv5_1` template
- **Mobile:** Requires `pdpv6` template
- **Legacy:** Product cards NOT supported in `default` template

**Template Detection:**
```typescript
// In API route: /api/products/[...slug].js
const templates = getPdpTemplates({ req, productData, isBundleProduct })
// Returns: { mobile: 'pdpv6', desktop: 'pdpv5_1' }

// Passed to getProductCardsData()
const productCardDetails = getProductCardsData(
  vgImageGroups,
  menuData,
  visualProductDetailData,
  pageDataCustomAttributes,
  categoryData,
  templates  // Template info used for conditional rendering
)
```

**Template Activation:**
- **PDP v5.1:** `EXPERIMENTS.PDP_V5_1` enabled + `isPdpV5Applicable: true` product attribute
- **PDP v5.0:** `EXPERIMENTS.PDP_V5` enabled + `isPdpV5Applicable: true` product attribute
- **PDP v6:** `EXPERIMENTS.PDP_V6` enabled + NOT bundle product

### Product-Level Attributes

Individual products control card content via SFCC custom attributes:

#### Required Attributes

| Attribute | Type | Purpose | Example Value |
|-----------|------|---------|---------------|
| `c_visualProductDetail` | JSON String | Master configuration for all cards | `{"bagsize": {...}, "material": {...}}` |
| `isPdpV5Applicable` | Boolean | Enables v5+ template eligibility | `true` |

#### Optional Card-Specific Attributes

| Attribute | Used By Card Types | Purpose |
|-----------|-------------------|---------|
| `c_bagSize` | bagsize | Bag size category (S/M/L) |
| `c_height` | measurement, bagsize, walletsMeasurement | Product height dimension |
| `c_length` | measurement, bagsize | Product length dimension |
| `c_itemWidth` | measurement, bagsize | Product width dimension |
| `c_material` | material, footwearMaterial | Primary material name |
| `c_materialVal` | material | Material display value |
| `c_additionalMaterials` | material | Secondary materials |
| `c_handleDetail` | hardware | Handle/strap description |
| `c_closerLookText` | features | Feature descriptions |
| `c_seeHowItFits` | seeHowFits | Lifestyle image flag |
| `c_bagSpace` | bagSpace | Interior capacity description |

**Attribute Priority:**
1. Product-level attributes (most specific)
2. Variation group attributes (color-specific)
3. Master product attributes (fallback)

### Tangiblee Integration Preferences

Tangiblee AR/VR controls on product cards require additional preferences:

**Site Preference Bundle:** `Tangiblee`

| Preference | Type | Purpose |
|------------|------|---------|
| `IS_TANGIBLEE_ENABLED` | Boolean | Master Tangiblee feature toggle |
| `TANGIBLEE_API` | String | Tangiblee API endpoint URL |
| `BRAND_URL` | String | Brand-specific Tangiblee configuration |
| `enableStrategicTangiblee` | Boolean | Strategic placement toggle |

**Usage in ProductCard:**
```typescript
// In ProductTangibleeControl (child component)
const { tangiblee: { enableStrategicTangiblee } } = usePreference({
  Tangiblee: ['enableStrategicTangiblee']
})

// Control only renders if:
// 1. tangibleeCta prop provided
// 2. IS_TANGIBLEE_ENABLED = true
// 3. Product has Tangiblee data
```

### Category-Based Overrides

Some configurations cascade from category to product:

**Mechanism:** `getProductCategoryAttributeConfig()` helper

**Hierarchy:**
1. Check product's primary category ID
2. Check parent category IDs (up to 3 levels)
3. Check global default configuration
4. Return first match or empty object

**Example:**
```
Product: Coach Tabby Shoulder Bag
  └─ Category: handbags-shoulder-bags (no config)
      └─ Parent: handbags (HAS config)
          └─ Uses handbags configuration
```

### Configuration Debugging

**How to verify ProductCard configuration:**

1. **Check Site Preferences:**
   ```typescript
   // In browser console on PDP
   window.__NEXT_DATA__.props.pageProps.preferences.PDPPreferences
   ```

2. **Check Product Attributes:**
   ```typescript
   // In browser console on PDP
   window.__NEXT_DATA__.props.pageProps.pageData.custom.c_visualProductDetail
   ```

3. **Check Resolved Cards:**
   ```typescript
   // In browser console on PDP
   window.__NEXT_DATA__.props.pageProps.pageData.productCardDetails
   ```

4. **Check Active Template:**
   ```typescript
   // In browser console on PDP
   window.__NEXT_DATA__.props.pageProps.pageData.templates
   // Expected: { mobile: 'pdpv6', desktop: 'pdpv5_1' }
   ```

### Common Configuration Issues

**Issue:** Product cards not rendering
**Checklist:**
- ✅ `enableVisualProductDetail` preference is `true`
- ✅ Product has `c_visualProductDetail` attribute with valid JSON
- ✅ Product has `isPdpV5Applicable: true`
- ✅ Appropriate experiment enabled (`PDP_V5_1`, `PDP_V5`, or `PDP_V6`)
- ✅ Template detected correctly (not `default`)
- ✅ Category has configuration in `visualProductDetailConfigs`

**Issue:** Specific card type missing
**Checklist:**
- ✅ Card type enabled in category configuration
- ✅ Product has required custom attributes for that card type
- ✅ Images available with configured suffix
- ✅ Card type supported in active template

**Issue:** Tangiblee control not showing
**Checklist:**
- ✅ `IS_TANGIBLEE_ENABLED` preference is `true`
- ✅ `tangibleeCta` prop provided to ProductCard
- ✅ `imageUrl` prop provided
- ✅ Product not discontinued (`c_isDiscontinued: false`)
- ✅ Tangiblee data available for product SKU

---

## 16. Change Log & Maintenance

### Version History

| Date | Change | JIRA Ticket |
|------|--------|-------------|
| 2026-01-21 | Initial AGENTS.md documentation created with comprehensive coverage | TM-XXXX |
| 2026-01-21 | Added data source documentation (Section 2) | TM-XXXX |
| 2026-01-21 | Added template applicability details (Section 1) | TM-XXXX |
| 2026-01-21 | Added site preferences & configuration section (Section 12) | TM-XXXX |

### Known Issues & Tech Debt

**None currently documented.** Future issues should be logged here.

### Upcoming Planned Changes

**None currently planned.** Future enhancements should be documented here before implementation.

### Maintenance Ownership

**Team:** Frontend - Product Detail Pages
**Primary Contact:** [Team Lead Name]
**Review Cadence:** Quarterly (or when significant changes occur)

---

## 17. Quick Reference

### File Locations

```
src/toro/components/product/desktop/ProductCard/
├── index.tsx                    # Main component file
├── AGENTS.md                    # This documentation
└── themes/
    ├── theme.ts                 # Base theme (all brands)
    └── v5_1/
        └── kate-spade.ts        # Kate Spade v5.1 overrides

Related Files:
src/toro/helpers/getProductCardsData.ts    # Data transformation logic
src/toro/constants/templates.ts            # Template definitions
src/toro/helpers/templates.ts              # Template detection logic
src/pages/api/products/[...slug].js        # SFCC data proxy
src/toro/site-preferences.ts               # Preference definitions
```

### Key Imports

```typescript
// Component
import ProductCard from 'toro/components/product/desktop/ProductCard'

// Theme Hook
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useStyles } from '@chakra-ui/react'

// Toro Components (NOT direct Chakra imports)
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'

// Integration Components
import ProductTangibleeControl from 'toro/components/product/desktop/ProductTangibleeControl'
import HotSpotBadge from 'toro/components/product/desktop/HotSpotBadge'
```

### Essential Commands

```bash
# Run component tests (when created)
npm test -- ProductCard

# View component in Storybook (if available)
npm run storybook

# Check bundle impact
npm run analyze-coach

# Lint component code
npm run lint -- src/toro/components/product/desktop/ProductCard/

# Type check
npm run typecheck
```

### Theme Style Parts

When customizing themes, reference these part names:

- `productCardWrapper` - Outer container
- `productCardTitleContainer` - Header text wrapper
- `productCardBodyContainer` - Body content wrapper
- `productCardImageWrapper` - Image container
- `productCardImage` - Image element
- `productCardTangibleeWrapper` - Tangiblee control container

### Key SFCC Attributes

**Master Configuration:**
- `c_visualProductDetail` - JSON string with all card configurations

**Product Eligibility:**
- `isPdpV5Applicable` - Boolean flag for v5+ template support

**Card-Specific Attributes:**
- `c_bagSize`, `c_height`, `c_length`, `c_itemWidth` - Dimensions
- `c_material`, `c_materialVal`, `c_additionalMaterials` - Materials
- `c_handleDetail`, `c_closerLookText` - Feature descriptions
- `c_seeHowItFits`, `c_bagSpace` - Lifestyle content flags

### Key Site Preferences

**Feature Toggles:**
- `enableVisualProductDetail` - Master product card toggle
- `visualProductDetailConfigs` - Category-specific configurations
- `IS_TANGIBLEE_ENABLED` - Tangiblee AR/VR feature toggle

**Template Experiments:**
- `EXPERIMENTS.PDP_V5_1` - Desktop v5.1 template
- `EXPERIMENTS.PDP_V5` - Desktop v5.0 template
- `EXPERIMENTS.PDP_V6` - Mobile v6 template

### Supported Templates

- ✅ **PDP v5.0** (Desktop) - Full product card support
- ✅ **PDP v5.1** (Desktop) - Full product card support with Kate Spade styling
- ✅ **PDP v6** (Mobile) - Product cards via ProductHighlights component
- ❌ **Default** (Legacy) - Product cards NOT supported

---

**This document is a living artifact. When you modify the ProductCard component, update this AGENTS.md file immediately to maintain accuracy.**

**Questions or Issues?** Reference the [Context Brain](../../../../../../.agents/) or reach out to the Frontend PDP team.
