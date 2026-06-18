import type {
  ProductReachVariants,
  SapiBadgeData,
  SapiImageGroup,
  SapiMasterInfo,
  SapiPromotionCallout,
  SfccHitType,
} from 'toro/types/productTypes/apiProductTypes'
import type { NormalizedMedia, NormalizedPromoData } from 'toro/types/productTypes/normalizers'
import type { ListingProduct } from 'toro/types/productTypes/listingProduct'

export type Strict<T> = T & Record<Exclude<string, keyof T>, never>
export type EmptyObject = Record<string, never>

export interface BreadcrumbItem {
  absUrl?: string
  alternateH1Tag?: string
  categoryID?: string
  htmlValue?: string
  url?: string
  id?: string
  name?: string
}

export interface VariationAttributeValue {
  value: string
  name: string
  orderable?: boolean
}

export interface VariationAttribute {
  id: string
  name: string
  values: VariationAttributeValue[]
  value?: string
}

export interface PromotionDataShape {
  Pricing?: PricingInfo[]
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  bestseller?: boolean
}

export interface MarketingConfigItem {
  type: string
  contentId: string
}

export type NewMegaPDPGroupData = {
  default?: {
    vgs: Array<{
      id: string
      url: string
    }>
  }
}

export interface VariantGroupData {
  firstVariant?: string
  offers?: {
    priceValidUntil: string
    availability: string
  }
  id?: string
  productID?: string
  color?: string
  masterId?: string
  imageGroups?: {
    images: {
      src: string
      title: string
      alt: string
    }[]
    viewType: string
  }[]
  canonicals?: Record<string, string | undefined>
  variationAttributes?: VariationAttribute[]
  variantsAssigned?: string[]
  orderable?: boolean
  badgeData?: SapiBadgeData
  customAttributes?: CustomAttributes
  promotionalCallouts?: SapiPromotionCallout[]
  pricingInfo?: PricingInfo[]
  sourceCodeBadge?: MarketingConfig | string | null
  sourceCodeMessage?: MarketingConfig | string | null
  bestSellerCheck?: boolean
  promoPDP?: NormalizedPromoData | NormalizedPromoData[] | null
  validFrom?: string
  validTo?: string
  hitType?: string
  materialName?: string
  styleGroup?: string
  collageImage?: string
  isAlmostGone?: boolean
}

export interface MaterialInfo {
  materialName: string
  firstURL: string
}

export type MegaPDPTab = {
  name: string
  url?: string
  tabId?: string
}

export type NewMegaPDPTabsData = Array<{
  tabId: string
  tabs: MegaPDPTab[]
  selectedTab: { name: string }
}>

export interface PricingValue {
  value: number
  currency: string
  formatted: string
  decimalPrice: string | number
}

export interface PricingInfo {
  sales?: PricingValue
  list?: PricingValue | null
  promotionalPrice?: PricingValue | null
  markdownDiscPercent?: number | string | null
  promotionDiscPercent?: number | string | null
  discountPercentage?: number | string | null
  currentPrice?: number | null
  type?: string
  min?: {
    sales: PricingValue
    list: PricingValue
    promotionalPrice: null
    discountPercentage: number | string
  }
  max?: {
    sales: PricingValue
    list: PricingValue
    promotionalPrice: null
    discountPercentage: number | string
  }
  maxDiscount?: number | string | { maxDiscount: number | string; isDiscountSame: boolean }
  viewType?: string
  listPriceCaption?: string
}

export interface MediaImage {
  src: string
  alt?: string
  title?: string
}

export interface MediaVideo {
  src: string
  type: 'video'
  position: number
  poster: MediaImage
  index?: number
}

export type MediaItem = MediaImage | MediaVideo

export interface MediaThumbnail extends MediaImage {
  title?: string
}

export interface InventoryInfo {
  id?: string
  ats: number
  preorderable: boolean
  backorderable?: boolean
  orderable: boolean
  allocationResetDate?: string | null
  inStockDate?: string | null
  perpetual?: boolean
  stockLevel?: number
}

export interface ProductVariant {
  id?: string
  offers?: {
    priceValidUntil: string
    availability: string
  }
  productId?: string
  prices?: PricingInfo[]
  masterId?: string
  variationValues?: {
    color?: string
    size?: string
    width?: string
  }
  badgeData?: SapiBadgeData
  customAttributes?: CustomAttributes
  promotionalCallouts?: SapiPromotionCallout[]
  displayBopisCTA?: boolean
  UPC?: string
  inventory?: InventoryInfo
  pricingInfo?: PricingInfo[]
  orderable?: boolean
  sourceCodeBadge?: MarketingConfig | string | null
  sourceCodeMessage?: MarketingConfig | string | null
  bestSellerCheck?: boolean
  promoPDP?: NormalizedPromoData | NormalizedPromoData[] | null
  promoPLP?: NormalizedPromoData | NormalizedPromoData[] | null
  validFrom?: string
  validTo?: string
  hitType?: string
  url?: string
  writeReviewSectionData?: WriteReviewSectionData
  tabbedContentModule1?: ContentAsset
  tabbedContentModule2?: ContentAsset
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: MarketingConfig | null
  variationAttributes?: VariationAttribute[]
}

export interface SearchProductVariation {
  firstVariant?: string
  color: string
  name: string
  productID: string
  productId: string
  orderable: boolean
  displayifOOS: boolean
  url: string
  variationValues: {
    color: string
  }
  media: {
    full: MediaThumbnail[]
    thumbnails: MediaThumbnail[]
    thumbnail: MediaThumbnail
  }
  prices: {
    tieredPrices: Array<{ price: number; quantity: number }>
    currentPrice: number | null
    regularPrice: number
    priceRange: null
    discount: number
  }
  variantsAssigned: string[]
  marketingBadgeConf: MarketingConfig | null
  marketingMessageConf: MarketingConfig | null
  VariationId?: string
  IsOnSale?: boolean
}

export interface Color {
  id?: string
  name?: string
  value?: string
  text?: string
  vgId?: string
  isCustomized?: boolean
  isMonogrammed?: boolean
  masterId?: string
  url?: string
  image?: MediaImage
  orderable?: boolean
  media?: NormalizedMedia
  displayIfOOS?: boolean
  sizes?: Size[] | null
  widths?: Width[]
  materialName?: string
  styleGroup?: string
}

export interface DefaultColorInfo extends Color {
  color?: string
}

export interface Size {
  id?: string
  name?: string
  value?: string
  orderable?: boolean
  text?: string
  image?: MediaImage
}

export interface Width {
  id: string
  text: string
  orderable?: boolean
  masterId?: string
  value?: string
}

export interface CustomAttributes {
  c_IsMegaPDPEligible?: boolean
  c_aIMetaDataAttributes?: string
  c_aIMetaDataSynonyms?: string
  c_additionalMaterials?: string
  c_avgRatingEmplifi?: string
  c_bagSize?: string
  c_benefitsModule?: string
  c_bundlePrice?: number
  c_closerLookHeader?: string
  c_closerLookText?: string
  c_color?: string
  c_compatibility?: string
  c_customFitSize?: string
  c_customFitWidth?: string
  c_department?: string
  c_displayIfOOS?: boolean
  c_editorsNoteDescription?: string
  c_eligibleForDropShip?: boolean
  c_eligibleForGiftMessaging?: boolean
  c_eligibleForGiftWrapping?: boolean
  c_emplifiVPC?: string
  c_enableColorAdaptive?: boolean
  c_enablePdp4Template?: boolean
  c_enablePdp7Template?: boolean
  c_enableSaleMarketingBadge?: boolean
  c_enableSaleMarketingMessage?: boolean
  c_envImpacts?: string
  c_filterByDiscount?: number
  c_filterCategory?: string
  c_gender?: string
  c_handleDetail?: string
  c_height?: string
  c_hideComparablePriceValue?: boolean
  c_hideDiscountRate?: boolean
  c_hideReview?: boolean
  c_hideTabs?: boolean
  c_inStockCustomText?: string
  c_includedProducts?: string
  c_inventoryThreshold?: number
  c_isBestSeller?: boolean
  c_isCoachtopia?: boolean
  c_isCustomizable?: boolean
  c_isDiscontinued?: boolean
  c_isDiscontinuedForSearch?: boolean
  c_isEarlyAccess?: boolean
  c_isEmployeeSale?: boolean
  c_isFinalSale?: boolean
  c_isGiftCardProduct?: boolean
  c_isGiftWrapEligible?: boolean
  c_isMemberExclusive?: boolean
  c_isMonogrammable?: boolean
  c_isNew?: boolean
  c_isNotifyMeAvailable?: boolean
  c_isOnClearance?: boolean
  c_isOnPurposeEnabled?: boolean
  c_isOnSale?: boolean
  c_isOutlet?: boolean
  c_length?: string
  c_material?: string
  c_maxOrderableQuantity?: number
  c_maxSalePercent?: number
  c_megaPDPStyleGroup?: string
  c_pdp6AccordionContent1?: string
  c_pdp6AccordionContent2?: string
  c_pdp6AccordionContent3?: string
  c_productLifeCycle?: string
  c_productReach?: ProductReachVariants
  c_productVertical?: string
  c_revCountEmplifi?: string
  c_size?: string
  c_soldOutBadge?: string
  c_soldOutCustomText?: string
  c_width?: string
  c_widthVal?: string
  instockText?: string
  [key: string]: any
}

export interface MarketingConfig {
  [key: string]: string
}

export interface PromoTextItem {
  promoType?: string
  promoName?: string
  promoCallout?: string
  promotionId?: string
}

export interface OrderableAttributes {
  color?: boolean
  size?: boolean
  width?: boolean
}

export interface FirstRepresentedProduct {
  ID?: string
  imageGroups?: SapiImageGroup[]
  inventory?: InventoryInfo[]
  master?: SapiMasterInfo
  name?: string
  type?: SfccHitType
  validFrom?: string
  variationAttributes?: VariationAttribute[]
  displayIfOOS?: boolean | null
  hideComparablePriceValue?: boolean
  hideDiscountRate?: boolean
  hideReview?: boolean
  inventoryThreshold?: number
  isBestSeller?: boolean
  isEarlyAccess?: boolean
  isEmployeeSale?: boolean
  isFinalSale?: boolean
  isMemberExclusive?: boolean
  isMonogrammable?: boolean
  isOnSale?: boolean
  badgeData?: SapiBadgeData
  color?: string
  maxSalePercent?: number
  UPC?: string
  productPromotions?: ProductPromotionsEntity[]
  inStockCustomText?: string | null
  isCustomizable?: boolean
  soldOutCustomText?: string | null
  isNotifyMeAvailable?: boolean
  isNew?: boolean
  maxOrderableQuantity?: number
  productVideo?: ProductVideoData
  productVertical?: string
  productReach?: ProductReachVariants | null
  isOnClearance?: boolean
  isBestseller?: boolean
}

export interface ProductPromotionsEntity {
  calloutMsg: string
  promotionId: string
}

export interface ProductVideoData {
  Product: {
    [key: string]: {
      Position?: number
      [videoKey: string]: string | number | undefined
    }
  }
}

export interface ProductListingResponse {
  id: string
  pageTitle: string
  currentPageTitle: string
  currentPageDescription: string
  alternateH1Tag: string
  total: number
  page: number
  breadcrumbs: BreadcrumbItem[]
  totalPages: number
  products: ListingProduct[]
  srule: string
  defaultSort: string
  sortOptions: SortOption[]
  filters: Filter[]
  refinements: Refinement[]
  suggestionPhrase: string
  preloadImageSrc?: string
  pageSize: number
  enableVisuallySimilar: boolean
}

export interface MonogramPlacement {
  id: string
  name: string
  code: string
  available: boolean
}

export interface MonogramColor {
  id: string
  name: string
  value: string
  hexCode?: string
}

export interface MonogramSymbol {
  id: string
  name: string
  unicode: string
  font?: string
}

export interface CustomizationOption {
  id: string
  name: string
  type: string
  available: boolean
  price?: number
}

export interface ColorwayPlacements {
  placements: MonogramPlacement[]
}

export interface MonogramData {
  colors: Record<string, MonogramColor>
  addonColors: Record<string, MonogramColor>
  symbols: Record<string, MonogramSymbol>
  colorways: {
    blk: ColorwayPlacements
    mpl: ColorwayPlacements
    rwd: ColorwayPlacements
  }
}

export interface CustomizerData {
  canMonogram: boolean
  canMonogramParent: boolean
  canCustomize: boolean
  canCustomizeParent: boolean
  customize: Record<string, CustomizationOption>
  monogram: MonogramData
  generated: string
  __mccEvents: Array<Record<string, unknown>>
}

export interface ContentAssetMetaData {
  title?: string
  name?: string
  description?: string
  [key: string]: unknown
}

export interface ContentAssetOtherInfo {
  liveStreamingUrl?: string
  c_materialImagePath?: { default: string }
  c_sustainableContentMaterial?: { default: string }
  [key: string]: unknown
}

export interface ContentAsset {
  _type: string
  id: string
  online: {
    default: boolean
  }
  c_body: {
    [locale: string]: {
      markup: string
    }
  }
  metaData: ContentAssetMetaData
  other_info: ContentAssetOtherInfo
  status: string
  error_message: string
}

export interface WriteReviewSectionData {
  title?: string
  body?: string
  imageSrc?: string
}

export interface FAQItemWithContent {
  title: string
  html: string
  text: string
}

export interface Option {
  refvalue: string
  selectable: boolean
  hitCount: number
  swatchID: string
  displayName?: string
}

export interface OptionWithURL extends Option {
  href: string
  isSelected: boolean
}

export interface Refinement {
  name: string
  type: string
  id: string
  options: Option[] | string[] | number[]
}

export interface Filter {
  id: string
  values: string[]
}

export interface SortOption {
  id: string
  name: string
  code: string
  isDefault?: boolean
}
