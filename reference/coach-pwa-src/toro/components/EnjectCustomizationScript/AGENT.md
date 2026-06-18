# Product Customization & Monogramming Feature Guide

**Owner:** [@tapestry-engineering]  
**Last Updated:** 2025-01-XX  
**Related ADRs:** [ADR-004 - Jotai State Management]

## 1. Overview

The Product Customization & Monogramming feature enables customers to personalize Coach products by adding custom embellishments (patterns, colors, hardware) and monogramming (initials, placement). The system integrates a third-party customization widget that allows users to create, preview, and save customized product configurations.

**Purpose:** Provide a seamless customization experience that allows users to visualize and purchase personalized products while maintaining proper state management, analytics tracking, and integration with the e-commerce flow.

**Scope:**
- Dynamic injection of third-party customization widget script
- Recipe data management (customization configurations)
- Customized variant display in color swatches
- Editing existing customizations with pre-populated widget data
- Creating additional customizations via "Customize Another" button
- State persistence across page loads via localStorage
- Integration with product variation selection
- Analytics event tracking for customization funnel
- Support for both legacy (prop-based) and atom-based (newer) PDP templates

**What this feature does NOT cover:**
- Payment processing for customized products (handled by cart/checkout)
- Inventory management for customized variants (handled by SFCC)
- Customization widget UI/UX (provided by third-party vendor)
- Product eligibility determination (handled by SFCC API)

## 2. Foundational Decisions

- **Third-Party Widget Integration:** Uses external `CustomizerWidget` library loaded dynamically via script injection. The widget handles all UI interactions and communicates back via callbacks.
- **Dual Architecture Support:** Maintains compatibility with both legacy prop-drilling architecture (`ProductMainSection`) and newer atom-based architecture (Jotai atoms in `pdp.atom.ts`).
- **Recipe-Based System:** Customizations are stored as "recipes" - complete configuration objects containing template selections, colors, monogram details, and preview images.
- **localStorage Persistence:** Customization recipes are persisted to localStorage to survive page reloads and enable restoration of user customizations.
- **Base Product Color Bridge:** Customized swatches maintain a `baseProductColor` property that links back to the original color variant, enabling proper variant matching and inventory checks.

## 3. Core Principles & Patterns

### Principle 1: Lazy Script Loading

The customization widget script is only loaded when the user initiates customization. This prevents unnecessary network requests and improves initial page load performance.

**Implementation:**
- Script URL comes from environment variable `CUSTOMIZER_SCRIPT_URL`
- Script is injected into `<head>` only when user clicks "Customize It" or "Add Monogram"
- Script is cached after first load (`window.CustomizerWidget` check)

### Principle 2: Recipe-to-Swatch Transformation

Customization recipes (from API) are transformed into swatch-compatible objects that can be displayed alongside regular color swatches. This transformation preserves original product data while adding customization-specific properties.

**Key Properties:**
- `id`: Recipe ID (unique identifier for the customization)
- `baseProductId`: Original variant ID
- `baseProductColor`: Original color ID (for variant matching)
- `isCustomized` / `isMonogrammed`: Flags for UI rendering
- `media.thumbnail.src`: Custom preview image
- `price`: Customized product price

### Principle 3: Dual ID System for Variant Matching

Customized swatches use a dual ID system to bridge between customization and product variants:

- **Display ID (`id`)**: Recipe ID used for selection and display
- **Matching ID (`baseProductColor`)**: Original color ID used for variant/group lookups

This allows the system to:
- Display customized previews in swatches
- Match to correct product variants for inventory/pricing
- Link back to original color when needed

### Principle 4: State Management Evolution

The feature supports two architectural patterns:

**Legacy (Prop-Based):**
- State managed in `ProductMainSection` via `useState`
- Props drilled through `ProductVariationControls` → `ProductColorControls`
- Manual merging of `customizerVariants` with `colors` in components

**Atom-Based (Newer Templates):**
- State managed in global Jotai atoms (`customizerVariantsAtom`, `customizerRecipesAtom`)
- Derived atoms automatically merge and compute (`displayedColorsAtom`)
- Components access state directly via hooks, no prop drilling

### Principle 5: localStorage Structure

Customization recipes are stored in localStorage with the following structure:

```javascript
{
  "masterId-123": [
    {
      id: "recipe-456",
      result: {
        recipe: { id: "recipe-456", location: "..." },
        monogram: { monogramInitials: "ABC", ... },
        productId: "variant-id-789"
      }
    }
  ]
}
```

This structure enables:
- Per-product customization storage
- Multiple customizations per product
- Recipe restoration on page load

## 4. Architecture Overview

### 4.1. Component Hierarchy

```
EnjectCustomizationScript (Core orchestrator)
├── CustomizeAndMonogramV6 (Widget-style UI for mobile)
├── ProductVariationControls (Legacy: receives props)
│   └── ProductColorControls
│       └── ProductImagesContainer
│           └── CustomizeRemovalModal
└── [Atom-based components access atoms directly]
```

### 4.2. Data Flow: Customization Creation

1. User clicks "Customize It" → Widget script injected/loaded if needed
2. Widget opens → User completes customization
3. Recipe data fetched from API and transformed to swatch format
4. Updated in state (`customizerVariantsAtom`) and localStorage
5. Swatches re-render with new customized preview

### 4.3. Data Flow: Recipe Restoration

1. On page load/product change → Recipes read from localStorage
2. For each stored recipe: Fetch full recipe data from API and transform to swatch format
3. Updated in `customizerVariantsAtom` → Swatches display restored customizations

### 4.4. Data Flow: Editing Existing Customization

1. User selects customized swatch → Button changes to "Edit This Item", "Customize Another" appears
2. User clicks "Edit This Item" → Widget opens with saved recipe pre-populated via `initial` config
3. User modifies customization → Recipe updated (replaces existing in state and localStorage)
4. Swatches re-render with updated customization

### 4.5. Data Flow: Creating Additional Customization

1. User selects customized swatch → Clicks "Customize Another"
2. Widget opens for new customization → User creates new customization
3. New recipe added (prepended to state, appended to localStorage array)
4. Swatches re-render with both customizations visible

### 4.6. Data Flow: Removal

1. User clicks "x" on customized swatch → Confirmation modal opens
2. User confirms → Removed from state (`customizerVariantsAtom`) and localStorage
3. Selected color updates to next available → Swatches re-render without removed customization

## 5. Key Components

### 5.1. EnjectCustomizationScript

**Location:** `src/toro/components/EnjectCustomizationScript/index.js`

**Purpose:** Core orchestrator that manages script injection, widget initialization, recipe transformation, and state updates.

**Key Responsibilities:**
- Script injection and widget initialization
- Recipe data transformation (`getConstructedData`, `setRecipeToSwatch`)
- Recipe persistence and restoration
- Dynamic button labeling based on customization state
- Editing existing customizations (pre-populates widget with saved recipe)
- Creating additional customizations via "Customize Another" flow
- Analytics event tracking
- Integration with both legacy and atom-based architectures

**Key Methods:**
- `onCustomizerClickHandler()`: Initiates customization flow
- `CustomizerWidgetClickHandler()`: Configures and launches widget (handles both edit and create modes)
- `onDone()`: Handles completion callback from widget
- `getCTALabel()`: Returns appropriate button label based on customization state ("Customize It" vs "Edit This Item")
- `getConstructedData()`: Transforms recipe data into swatch format
- `fetchRecipesByID()`: Restores saved recipes from localStorage
- `fetchProductStatus()`: Checks if product variant can be customized

**Edit Functionality:**
When a user selects a customized swatch:
- The primary button label changes from "Customize It" to "Edit This Item" (or "Edit Monogram")
- An additional "Customize Another" button appears
- Clicking "Edit This Item" opens the widget with the existing recipe pre-populated via the `initial` config parameter
- Clicking "Customize Another" creates a new customization while preserving the existing one
- The widget's `initial` parameter contains the saved recipe data (recipe ID, location, monogram details) to restore the previous customization state

**Props (Legacy Mode):**
```javascript
{
  customizerVariants,        // Array of customized swatches
  setCustomizerVariants,     // State setter
  recipes,                   // Array of recipe configs
  setRecipes,               // Recipe state setter
  selectedColor,            // Currently selected color
  setSelectedColor,         // Color selection setter
  // ... other props
}
```

**Atom Usage (Newer Templates):**
- Reads: `customizerVariantsAtom`, `customizerRecipesAtom`, `selectedColorAtom`
- Writes: Updates atoms via setters passed from parent or direct atom updates

### 5.2. CustomizeAndMonogramV6

**Location:** `src/toro/components/product/mobile/CustomizeAndMonogram/CustomizeAndMonogramV6.tsx`

**Purpose:** Widget-style UI component that displays a promotional card with customization call-to-action.

**Usage:**
- Rendered when `type="widget"` is passed to `EnjectCustomizationScript`
- Used in PDP v6 template (`TemplateName.pdpv6`) on mobile
- Provides visual call-to-action card with customizable text, image, and CTA button

### 5.3. CustomizeRemovalModal

**Location:** `src/toro/components/product/CustomizeRemovalModal/index.js`

**Purpose:** Confirmation modal for removing customizations. Handles cleanup of state, localStorage, and analytics tracking.

**Key Methods:**
- `onYesClick()`: Removes customization from all storage locations
- `onLeave()`: Tracks analytics and removes customization
- `onBack()`: Tracks analytics and closes modal

### 5.4. ProductVariationControls (Legacy)

**Location:** `src/toro/components/product/ProductVariationControls/index.js`

**Purpose:** Manages product variation selection (color, size, width). Merges customized variants with regular colors for display.

**Customization Integration:**
- Receives `customizerVariants` and `setCustomizerVariants` as props
- Merges with regular `colors` in `newSwatchArr` useMemo
- Passes merged array to `ProductColorControls`

**Key Logic:**
```javascript
const newSwatchArr = useMemo(
  () => [
    ...Object.values(
      customizerVariants.reduce((acc, cur) => Object.assign(acc, { [cur?.id]: cur }), {})
    ),
    ...Object.values(colors.reduce((acc, cur) => Object.assign(acc, { [cur?.vgId]: cur }), {})),
  ],
  [customizerVariants, colors]
)
```

### 5.5. ProductColorControls

**Location:** `src/toro/components/product/ProductVariationControls/ProductColorControls.js`

**Purpose:** Renders color swatches. Handles display of both regular and customized swatches.

**Customization Features:**
- Displays customized swatches with custom preview images
- Shows removal button ("x") for customized items
- Integrates with `ProductImagesContainer` for removal flow

### 5.6. ProductImagesContainer

**Location:** `src/toro/components/product/ProductVariationControls/ProductImagesContainer.js`

**Purpose:** Container for image-based color swatches. Manages removal modal state and handles removal callbacks.

**Key Responsibilities:**
- Renders `ProductColorItem` components
- Manages `CustomizeRemovalModal` visibility
- Handles removal analytics tracking

## 6. Atoms & State Management

### 6.1. Core Customization Atoms

**Location:** `src/store/pdp.atom.ts`

#### customizerVariantsAtom

```typescript
export const customizerVariantsAtom = atom([])
```

**Purpose:** Stores array of customized color swatch objects. Each object represents a customization that should appear in the color swatch selector.

**Structure:**
```typescript
Array<{
  id: string                    // Recipe ID (unique)
  masterId: string             // Product master ID
  baseProductId: string        // Original variant ID
  baseProductColor: string     // Original color ID (for matching)
  isCustomized: boolean        // Customization flag
  isMonogrammed: boolean       // Monogram flag
  text: string                 // Display text
  media: {                     // Custom preview images
    thumbnail: { src: string }
    full: Array<{ src: string }>
  }
  price: string                // Customized price
  standardPrice: string        // Original price
  embellishment: {             // Customization metadata
    embellish_type: string
    embellish_pattern: string
  }
  monogram: {                   // Monogram details
    monogramInitials: string
    monogramPlacementCode: string
    // ...
  }
}>
```

**Usage:**
- Updated by `EnjectCustomizationScript` when recipes are created/restored
- Read by `displayedColorsAtom` for merging
- Read by components for rendering customized swatches

#### customizerRecipesAtom

```typescript
export const customizerRecipesAtom = atom([])
```

**Purpose:** Stores array of complete recipe configurations. Used for editing existing customizations and recipe management.

**Structure:**
```typescript
Array<{
  recipe: {
    id: string
    location: string
  }
  productId: string
  monogram: object
  // ... full recipe data from API
}>
```

**Usage:**
- Updated when recipes are fetched from API
- Used to pre-populate widget when editing
- Persisted to localStorage separately from variants

#### customizerDataAtom

```typescript
export const customizerDataAtom = atom({})
```

**Purpose:** Stores parent-level customization eligibility flags. Indicates if the product master can be customized/monogrammed.

**Structure:**
```typescript
{
  canCustomize: boolean
  canMonogram: boolean
  canCustomizeParent: boolean
  canMonogramParent: boolean
}
```

**Usage:**
- Set by `EnjectCustomizationScript` after fetching product status
- Used to determine if customization UI should be shown
- Read by components to enable/disable customization features

#### productCustomStateAtom

```typescript
export const productCustomStateAtom = atom({})
```

**Purpose:** Stores per-variant customization eligibility. Maps variant IDs to their customization capabilities.

**Structure:**
```typescript
{
  [variantId: string]: {
    canCustomize: boolean
    canMonogram: boolean
  }
}
```

**Usage:**
- Updated when variant selection changes
- Used to determine if current variant can be customized
- Enables dynamic enable/disable of customization buttons

### 6.2. Derived Atoms

#### displayedColorsAtom

**Purpose:** Automatically merges customized variants with regular colors for display. Handles MegaPDP filtering and deduplication.

**Logic:**
1. Gets base color array from product data (with MegaPDP filtering if applicable)
2. Merges `customizerVariantsAtom` with regular colors
3. Deduplicates: customized variants by `id`, regular colors by `vgId`
4. Returns merged array with customized variants appearing first

**Key Features:**
- Customized variants appear first in the array
- Automatic deduplication prevents duplicates
- Automatic recomputation when dependencies change
- Handles MegaPDP material/tab filtering before merging

**Usage:**
- Consumed by color swatch components in newer templates
- Replaces manual merging in legacy components
- Ensures consistent color array across all consumers

#### selectedColorAtom

**Purpose:** Stores currently selected color swatch. Can be either regular color or customized variant.

**Default Value:** Falls back to `productData.selectedColor` or `productData.defaultColor`

**Setter Logic:**
1. Merges `customizerVariantsAtom` with regular `colors` from product data
2. Determines if current selection is customized (`isCustomized` or `isMonogrammed`)
3. For customized colors: matches by `masterId` + `id` (recipe ID)
4. For regular colors: matches by `masterId` + (`baseProductColor` or `id`)
5. Sets the found color to atom

**Key Features:**
- Handles both regular and customized color selection
- Uses dual ID matching for customized colors (recipe ID for selection, baseProductColor for variant matching)
- Automatically finds color from merged array

#### isCustomizedProductAtom

**Purpose:** Derived flag indicating if currently selected color is customized. Used for feature gating and conditional logic.

**Logic:** Checks `selectedColorAtom` for `isCustomized` or `isMonogrammed` flags

**Usage:**
- Feature gating (e.g., disable "Find in Store" for customized products)
- Conditional rendering
- Analytics tracking

### 6.3. Variant Matching with Customized Colors

**Key Pattern:** Identifying Customized Colors for Variant Matching

When working with customized colors, the system uses a dual ID approach:

1. **Check if color is customized:** `selectedColor?.isCustomized || selectedColor?.isMonogrammed`
2. **Resolve color ID for matching:**
   - If customized: use `selectedColor.baseProductColor` (original color ID)
   - If regular: use `selectedColor.id` (color ID)

**Why:** Product variants and variant groups are keyed by original color IDs, not recipe IDs. The `baseProductColor` property bridges the gap between customized swatches (which have recipe IDs) and product data (which uses color IDs).

**Applied in:**
- `isMatchedVariant()` helper: Matches variants to selected color using resolved color ID
- `selectedVariantGroupAtom`: Finds variant group using resolved color ID
- `setSelectedColorAtom`: Uses different matching logic for customized vs regular colors

## 7. Preferences & Environment Variables

### 7.1. Site Preferences

**Location:** `src/toro/site-preferences.ts`

**Preference Group:** `Customizer`

**Available Preferences:**

| Preference ID | Type | Purpose |
|--------------|------|---------|
| `CustomizerEnabled` | boolean | Master toggle for customization feature |
| `CustomizerMonogrammingEnabled` | boolean | Toggle for monogramming feature |
| `CustomizerApiKey` | string | API key for customization widget authentication |
| `CustomizerAddonHangtags` | object | Configuration for addon hangtags |
| `CustomizerHideTags` | object | Configuration for hiding tags |
| `customizerTextConfigs` | object | Text and image configuration for widget UI |

**Feature Gating:**
The feature is enabled when either `CustomizerEnabled` or `CustomizerMonogrammingEnabled` is true.

### 7.2. Environment Variables

**Location:** `src/toro/helpers/getEnvVariables.js`

| Variable | Purpose | Example |
|----------|---------|---------|
| `CUSTOMIZER_SCRIPT_URL` | URL to third-party customization widget script | `https://vendor.com/widget.js` |

**Access:**
- Available via `PWAContext.appData.customizerScriptUrl`
- Set during build/deployment
- Required for widget functionality

## 8. API Endpoints

### 8.1. SFCC Customizer Endpoints

**Base URL:** Constructed via `getDemandwareUrl()` helper

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `Customizer-ProductData` | Fetch product data for widget | GET |
| `Customizer-FormatPrice` | Format pricing for display | GET |
| `Customizer-RecipeData` | Fetch complete recipe configuration | GET |
| `/api/get-customizer-product-status` | Check if variant can be customized | GET |

**Recipe Data Endpoint:**
```javascript
const customizerRecipeDataEndpoint = getDemandwareUrl(`Customizer-RecipeData`)
// Usage: `${customizerRecipeDataEndpoint}?product=${masterId}&recipe=${recipeId}`
```

**Product Status Endpoint:**
```javascript
const customizerProductStatusEndpoint = API_CUSTOMIZER_PRODUCT_STATUS
// Location: src/pages/api/get-customizer-product-status.js
// Usage: `${customizerProductStatusEndpoint}?product=${productVariantId}`
```

**Response Structure (Recipe Data):**
```javascript
{
  recipe: {
    id: string
    location: string
    views: Array<{
      code: string  // "Product", "Monogram", "MonogramHangtag"
      previewJpg: string
      previewPng: string
    }>
    custom: {
      'template-name': string
      'template-track-as': string
      'flow-type': string
      monogram: string  // JSON string
    }
  }
  productId: string
  price: string
  standardPrice: string
  color: string
  products: Array<{
    product: {
      color: string
    }
  }>
}
```

## 9. localStorage Structure

### 9.1. Storage Keys

| Key | Purpose | Structure |
|-----|---------|-----------|
| `customProducts` | Stores customization recipes by masterId | `{ [masterId]: Array<RecipeData> }` |
| `settedRecipes` | Tracks which recipes have been processed | `{ [recipeId]: boolean }` |

### 9.2. customProducts Structure

```javascript
{
  "masterId-123": [
    {
      id: "recipe-456",
      result: {
        recipe: {
          id: "recipe-456",
          location: "path/to/recipe.json"
        },
        monogram: {
          monogramInitials: "ABC",
          monogramPlacementCode: "Exterior Front",
          sku: "variant-id-789"
        },
        productId: "variant-id-789"
      }
    }
  ],
  "masterId-456": [
    // ... more recipes
  ]
}
```

### 9.3. Storage Helpers

**Location:** `src/toro/helpers/customizationStorage.js`

**Methods:**
- `setRecipeDataInStorage(result, productId, masterId, isCustomize, prevRecipeId)`: Saves recipe to localStorage
- `getRecipeDataFromStorage()`: Retrieves all stored recipes
- `setItem(key, value)`: Generic localStorage setter

**Storage Logic:**
- New customizations: Appended to array for masterId
- Editing customizations: Replaced in array by prevRecipeId
- Removal: Filtered from array

## 10. Analytics Integration

### 10.1. Event Types

**Category:** `customization`

**Events:**

| Event Action | Event Label | When Fired |
|-------------|-------------|------------|
| `customization start` | `customization start` | User opens customization widget |
| `customization in progress` | `edit` | User edits existing customization |
| `customization completed` | `customization complete` | User saves customization |
| `customization cancel` | `yes leave this site` | User cancels customization |
| `customization cancel` | `customization close click` | User clicks "x" on customized swatch |

### 10.2. Event Data Structure

```javascript
analytics.send('customization', {
  eventLocation: 'product' | 'PLP' | 'monogram',
  eventAction: string,
  eventLabel: string,
  customization_step: 'start' | 'edit' | 'complete' | 'cancel',
  customized_recipe_id: string,
  customized_item_parent_id: string,  // masterId
  customized_item_category: string,
  custom_color: string,               // Original color ID
  embellish_item_id: string,          // Variant ID
  embellish_type: string,             // Customization type
  embellish_pattern: string,          // Template name
  monogram_placement: string,         // Placement code
  monogram_details: string,           // Initials
})
```

### 10.3. Customize Interaction Events

**Category:** `customizeInteraction`

**Events:**

| Event Action | Event Label | When Fired |
|-------------|-------------|------------|
| `customization` | `add a customization` | User clicks "Customize It" |
| `monogram` | `add a free monogram` | User clicks "Add Monogram" |
| `customization` | `edit customization:{id}` | User edits customization |
| `monogram` | `edit item:{id}` | User edits monogram |
| `customization` | `customize another` | User clicks "Customize Another" |

## 11. Key Files & Directories

**Core Components:**
- `/src/toro/components/EnjectCustomizationScript/index.js` - Main orchestrator component
- `/src/toro/components/product/mobile/CustomizeAndMonogram/index.tsx` - Atom-based wrapper
- `/src/toro/components/product/CustomizeRemovalModal/index.js` - Removal confirmation modal
- `/src/toro/components/product/ProductVariationControls/index.js` - Legacy variation controls
- `/src/toro/components/product/ProductVariationControls/ProductColorControls.js` - Color swatch display
- `/src/toro/components/product/ProductVariationControls/ProductImagesContainer.js` - Image swatch container

**State Management:**
- `/src/store/pdp.atom.ts` - Customization atoms and derived atoms
- `/src/toro/helpers/customizationStorage.js` - localStorage helpers

**API Routes:**
- `/src/pages/api/get-customizer-product-status.js` - Product eligibility check

**Utilities:**
- `/src/helpers/getDemandwareUrl.js` - SFCC endpoint construction
- `/src/toro/helpers/fetchFromSfccApi.ts` - SFCC API client

**Preferences:**
- `/src/toro/site-preferences.ts` - Customizer preference definitions

**Environment:**
- `/src/toro/helpers/getEnvVariables.js` - Environment variable access

## 12. Testing Considerations

### 12.1. Unit Testing

**Test Files:**
- `/src/toro/components/EnjectCustomizationScript/EnjectCustomizationScript.spec.tsx`
- `/src/toro/components/product/mobile/CustomizeAndMonogram/index.test.tsx`

**Key Test Scenarios:**
- Script injection and widget initialization
- Recipe transformation logic
- State updates on completion
- Recipe restoration from localStorage
- Removal flow
- Analytics event tracking

### 12.2. Mocking Requirements

**Window Globals:**
```javascript
window.CustomizerWidget = {
  default: {
    createWidget: jest.fn()
  }
}
```

**Atoms:**
```javascript
const atomValues = [
  [customizerVariantsAtom, []],
  [customizerRecipesAtom, []],
  [selectedColorAtom, mockColor],
]
```

**localStorage:**
```javascript
localStorage.getItem = jest.fn(() => JSON.stringify(mockStorage))
localStorage.setItem = jest.fn()
```

## 13. Related Documentation

**ADRs:**
- @.agents/adrs/004-jotai-state-management.md - Jotai architecture decision

**Domain Guides:**
- @.agents/domains/site-preferences.md - Preference system
- @.agents/domains/analytics-integration.md - Analytics tracking

**Components:**
- `@src/toro/components/EnjectCustomizationScript/` - Main feature component
- `@src/store/pdp.atom.ts` - State management atoms

## 14. Questions or Improvements?

If you have questions about this feature or suggestions for improving this guide:
- Reach out to the domain owner: [@tapestry-engineering]
- Discuss in [your team channel]
- Submit a PR with your proposed changes

