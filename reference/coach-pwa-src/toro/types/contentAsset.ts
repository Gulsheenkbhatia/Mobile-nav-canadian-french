/**
 * Content Asset Type Definitions
 *
 * This file contains unified type definitions for content assets used throughout the application.
 * There are two distinct types:
 *
 * 1. FetchedContentAsset - Represents actual content asset data returned from the OCAPI/Headless-GetContent API
 * 2. ContentAssetSlotConfig - Represents slot configuration/scheduling metadata for marketing badges
 */

/**
 * Represents a content asset fetched from the OCAPI/Headless-GetContent API.
 * This is the structure returned by /api/get-content-assets endpoint.
 *
 * @property _type - Always 'content_asset' for this type
 * @property id - Unique identifier of the content asset
 * @property online - Object containing the online/enabled status
 * @property c_body - Object containing the markup content
 * @property metaData - Data attributes parsed from the content HTML
 * @property other_info - Additional content-specific information
 * @property status - HTTP-like status code (e.g., '200', '404')
 * @property error_message - Error message if the asset failed to load
 */
export interface FetchedContentAsset {
  _type: 'content_asset'
  id: string
  online: {
    default: boolean
  }
  c_body: {
    default: {
      markup: string
    }
  }
  metaData: Record<string, unknown>
  other_info: {
    liveStreamingUrl?: string
    c_materialImagePath?: { default: string }
    c_sustainableContentMaterial?: { default: string }
  }
  status: string
  error_message: string
}

/**
 * Represents content asset slot configuration/scheduling metadata.
 * Used for marketing badges, source code badges, and promo callouts to define
 * when and where content should be displayed.
 *
 * @property type - The page type where this config applies (e.g., 'pdp', 'plp')
 * @property contentId - The ID of the content slot to display
 * @property from_date - Start date for when the content should be active
 * @property to_date - End date for when the content should stop being active
 */
export interface ContentAssetSlotConfig {
  type: string
  contentId?: string // Optional: marketing content may have empty contentId
  from_date: string
  to_date: string
}

/**
 * Represents an error state for a content asset that failed to load
 */
export interface ContentAssetErrorState {
  id: string
  status: '404' | string
}

/**
 * Union type representing either a successfully fetched content asset or an error state
 */
export type ContentAssetOrError = FetchedContentAsset | ContentAssetErrorState

/**
 * State type for storing multiple fetched content assets indexed by their ID.
 * Values can be either a full FetchedContentAsset or a ContentAssetErrorState.
 */
export interface FetchedContentAssetsState {
  [assetId: string]: ContentAssetOrError
}
