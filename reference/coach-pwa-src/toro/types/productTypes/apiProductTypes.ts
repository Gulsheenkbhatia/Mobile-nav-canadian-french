import type { ContentAssetSlotConfig } from 'toro/types/contentAsset'
import type {
  PricingInfo,
  InventoryInfo,
  Color,
  MaterialInfo,
  NewMegaPDPGroupData,
  NewMegaPDPTabsData,
  MarketingConfig,
  MarketingConfigItem,
  CustomAttributes,
  FirstRepresentedProduct,
  ProductVariant,
  VariantGroupData,
  VariationAttribute,
} from 'toro/types/productTypes/common'
import type { ListingProduct } from 'toro/types/productTypes/listingProduct'
import type { ContentEntity } from 'toro/helpers/thinkPlp'
import type { BadgingContentSlot } from 'toro/analytics/clients/helpers/getBadgeSlotContent'
import type { PriceFilter } from 'toro/components/ExposedFilters/helpers'
import type { ITemplateComponentConfig } from 'toro/helpers/templating/types'
import type { MenuData } from 'store/menu-data.atom'

export type ProductHitType = 'master' | 'variation_group' | 'product' | 'set'
export type SfccHitType = 'product' | 'master' | 'variation_group' | 'set' | 'bundle' | 'variant'
export type ProductReachVariants = 'retail' | 'outlet' | 'multi'

export interface SapiProductData {
  id: string
  name: string
  url: string
  productName?: string
  brand?: string
  hitType?: ProductHitType
  masterId?: string
  productId?: string
  c_productEnglishName?: string
  c_productLifeCycle?: string
  c_isCoachtopia?: boolean
  c_isOutlet?: boolean
  material?: string
  isNewMegaPDP?: boolean
  isOnPurposeEnabled?: boolean
  bundlePrice?: number
  bundlePromoCallout?: string
  prices?: PricingInfo | PricingInfo[] | RawApiPrices
  validTo?: string
  custom?: CustomAttributes
  customAttributes?: CustomAttributes
  pickedProps?: {
    validFrom?: string
  }
  firstVariant?: string
  defaultColor?: Color
  isNewArrival?: boolean
  isAiDriven?: boolean
  isTopRated?: boolean
  variationGroupData?: RawApiVariationGroupData

  imageGroups?: SapiImageGroup[]
  variationGroup?: VariantGroupData[]
  variant?: SapiVariant[]
  firstRepresentedProduct?: FirstRepresentedProduct
  defaultVariant?: {
    ID?: string
    id?: string
    orderable?: boolean
    isMerchDefaultVar?: boolean
  }
  master?: {
    ID?: string
    masterId?: string
    defaultVariantID?: string
    defaultVariantGroupID?: string
    customAttributes?: Record<string, string | number | boolean>
    marketingBadgeConf?: MarketingConfig | null
    marketingMessageConf?: MarketingConfig | null
    sourceCodeBadge?: ContentAssetSlotConfig[]
    sourceCodeMessage?: ContentAssetSlotConfig[]
    validFrom?: string
    validTo?: string
    hitType?: ProductHitType
  }
  badgeData?: SapiBadgeData & {
    soldOutBadge?: string
  }
  megaPDPEligibleOptions?: {
    isMegaPDPEligible?: boolean
    isNewMegaPDPEligible?: boolean
  }
  colors?: Color[]
  set?: {
    customAttributes?: Record<string, string | number | boolean>
  }
  groupedColors?: Partial<Record<string, Color[]>>
  materialList?: MaterialInfo[]
  preSelectMaterial?: MaterialInfo
  newMegaPDPGroupData?: NewMegaPDPGroupData
  newMegaPDPTabsData?: NewMegaPDPTabsData
  selectedTabsData?: {
    tabId: string
    name: string
  }[]
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: MarketingConfig | null
  product: {
    name?: string
    brand?: string
    currency?: string
    validFrom?: string
    isNewMegaPDP?: boolean
    c_isMegaPDPEligible?: boolean
    c_enablePdp4Template?: boolean
    c_enablePdp7Template?: boolean
    c_enableColorAdaptive?: boolean
    c_hideTabs?: boolean
    c_department?: string
    c_filterCategory?: string
    c_productLifeCycle?: string
    c_isHideReview?: boolean
    c_avgRatingEmplifi?: number
    c_revCountEmplifi?: number
    c_isCoachtopia?: boolean
    c_isOutlet?: boolean
    material?: string
    isOnPurposeEnabled?: boolean
    bundlePrice?: number
    badgeData?: {
      soldOutBadge?: string
    }
    productType?: {
      bundle?: boolean
      set?: boolean
    }
    video?: {
      url?: string
    }
    variationAttributes?: VariationAttribute[]
    variationGroups?: Array<{
      color?: string
      isOnSale?: boolean
      variantPrice?: SapiVariantPrice[]
      badgeData?: {
        bestSeller?: {
          bestseller?: boolean
        }
      }
      hideComparablePriceValue?: boolean
      c_inventoryThreshold?: number
    }>
    firstReceivedProduct?: {
      ID?: string
      color?: string
      type?: string
      UPC?: string
      inventory?: InventoryInfo
      master?: {
        masterId?: string
      }
      productVertical?: string
      productReach?: string
      inStockCustomText?: string
      isCustomizable?: boolean
      soldOutCustomText?: string
      isNotifyMeAvailable?: boolean
      displayIfOOS?: boolean
      hideComparablePriceValue?: boolean
      inventoryThreshold?: number
      isBestseller?: boolean
      isFinalSale?: boolean
      isMonogrammable?: boolean
      maxSalePercent?: number
      isNew?: boolean
      maxOrderableQuantity?: number
      isOnClearance?: boolean
      badgeData?: {
        soldOutBadge?: string
        marketingBadge?: string | boolean
        marketingBadgeJson?: MarketingConfigItem[]
        enableSaleMarketingBadge?: boolean
        saleMarketingBadgeJson?: MarketingConfigItem[]
        marketingMessage?: string | boolean
        marketingMessageJson?: MarketingConfigItem[]
        enableSaleMarketingMessage?: boolean
        saleMarketingMessageJson?: MarketingConfigItem[]
      }
      productPromotions?: Array<{
        promoCallOutdefault?: string
        id?: string
      }>
    }
    defaultVariant?: {
      ID?: string
      price?: SapiVariantPrice[]
    }
    prices?: PricingInfo
  }
  promotion?: {
    bestseller?: boolean
    masterInfo?: Record<string, unknown>
    Pricing?: Array<{
      sales?: {
        value?: number
      }
      list?: {
        value?: number
      }
      discountPercentage?: number
    }>
  }
  hideDiscountedRate?: boolean
  hideComparablePriceValue?: boolean
  cleanStateDisplayDiscountPercentage?: boolean
  fallbackHideDiscountRate?: boolean
  fallbackHideComparableValue?: boolean
  inventory?: InventoryInfo
  inventoryThreshold?: number
  isMemberExclusive?: boolean
  validFrom?: string
  currency?: string
  c_isOnSale?: boolean
  c_ProductSetbadgingData?: {
    soldOutBadge?: {
      soldOutCallOutMessage?: string
    }
  }
  redirectUrl?: string
  isFPC: boolean
  isSPC: boolean
}

export interface SapiImage {
  src: string
  alt?: string
  title?: string
}

export interface SapiImageGroup {
  viewType: string
  images: SapiImage[]
}

export interface SapiVariantPriceValue {
  value?: number
  currency?: string
  formatted?: string
}

export interface SapiVariantPrice {
  sales?: SapiVariantPriceValue
  list?: SapiVariantPriceValue | null
}

export interface SapiMasterInfo {
  masterId?: string
}

export interface SapiBadgeData {
  marketingBadge?: string | boolean
  marketingBadgeJson?: MarketingConfigItem[]
  marketingMessage?: string | boolean
  marketingMessageJson?: MarketingConfigItem[]
  enableSaleMarketingBadge?: boolean
  saleMarketingBadgeJson?: MarketingConfigItem[]
  enableSaleMarketingMessage?: boolean
  saleMarketingMessageJson?: MarketingConfigItem[]
}

export interface SapiPromotionCallout {
  id?: string
  name?: string
  calloutMessageType?: string
  promoCallOut?: string
  promoCallOutdefault?: string
  promoCallOutMiniCart?: string
  promoCalloutPdpUpl: string
  promoCalloutPdpIpx1: string
  promoCalloutPdpIpx2: string
  promoCalloutPdpIpx3: string
  promoCalloutPdpRB: string
}

export interface PayloadDetails {
  filters?: {
    isFPC?: boolean
    isSPC?: boolean
  }
  forceFrpPricing?: boolean
  subBrandName?: string
  isSubBrand?: boolean
  isEnableRatingOnPLP?: boolean
  enableEmplifi?: boolean
  enableSwatches?: boolean
  enableOneSite?: boolean
  enableFallbackPricing?: boolean
  displayVideosInAltImage?: boolean
  imageSequenceIds?: string[]
  maxPromoCalloutsDisplayPLP?: number
  enableSwatchesOnVG?: boolean
  enableFallbackOosFrp?: boolean
  cleanStateDisplayDiscountPercentage?: boolean
  fallbackHideDiscountRate?: boolean
  fallbackHideComparableValue?: boolean
}

export type SapiVariant = ProductVariant

export interface SsfcApiMaster {
  ID?: string
  masterId?: string
  defaultVariantID?: string
  defaultVariantGroupID?: string
  customAttributes?: Record<string, string | number | boolean>
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: MarketingConfig | null
  sourceCodeBadge?: ContentAssetSlotConfig[]
  sourceCodeMessage?: ContentAssetSlotConfig[]
  validFrom?: string
  validTo?: string
  hitType?: ProductHitType
}

export interface SsfcApiVariant extends ProductVariant {
  id: string
  orderable: boolean
}

export interface SsfcApiSet {
  customAttributes?: CustomAttributes
  setProducts?: string[]
  promotionalCallouts?: SapiPromotionCallout[]
  [key: string]: unknown
}

export interface SsfcApiProductData {
  id: string
  name: string
  url: string
  hitType?: ProductHitType
  master?: SsfcApiMaster
  variant?: SsfcApiVariant[]
  variationGroup?: VariantGroupData[]
  set?: SsfcApiSet
  imageGroups?: SapiImageGroup[]
  inventory?: InventoryInfo
  isBundleProduct?: boolean
  category_id?: string
  canonicals?: {
    default?: string
  }
  defaultVariantGroup?: {
    offers?: {
      priceValidUntil: string
      availability: string
    }
  }
  megaPDPEligibleOptions?: {
    isMegaPDPEligible?: boolean
    isNewMegaPDPEligible?: boolean
  }
  newMegaPDPTabsData?: NewMegaPDPTabsData
  colors?: Color[]
  groupedColors?: Partial<Record<string, Color[]>>
  materialList?: MaterialInfo[]
  preSelectMaterial?: MaterialInfo
  newMegaPDPGroupData?: NewMegaPDPGroupData
  selectedTabsData?: Array<{
    tabId: string
    name: string
  }>
  validFrom?: string
  validTo?: string
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: MarketingConfig | null
}

export interface XgenApiVariation
  extends Pick<ProductVariant, 'id' | 'orderable' | 'inventory' | 'customAttributes'> {
  VariationId?: string
  availability?: string[]
  searchableIfUnavailable?: string[]
  price?: number
  sale_price?: number
  maxSalePercent?: number
  variations?: VariationAttribute[]
  additional_image_link?: string
  Image400Link?: string
  MarketingBadge?: string
  MarketingBadgeContent_Variation?: MarketingConfigItem[]
  MarketingMessage?: string
  MarketingMessageContent_Variation?: MarketingConfigItem[]
  IsOnSale?: boolean
  hideDiscountRate?: boolean
  hideComparablePriceValue?: boolean
}

export interface XgenApiPromotion {
  ID?: string
  name?: string
  promoRank?: number | null
  couponCodes?: string[]
  sourceCodes?: string[]
  promoEndDate?: string
  calloutMsgpdp?: string
  calloutMsgplp?: string
  customerGroups?: string[]
  promoStartDate?: string
  promotionPrice?: number | null
  promotionCallout?: string
}

export interface XgenApiProductData {
  id?: string
  VariationId?: string
  isBundle?: boolean
  color?: string
  image_url?: string
  quantity?: number
  facets?: Array<{
    name: string
    values?: string[]
  }>
  variations?: XgenApiVariation[]
  promotions?: XgenApiPromotion[]
  variation_id?: string
  price?: number
}

export interface RawApiPrices {
  currentPrice: number
  discount: number
  regularPrice?: number
  isOnSale?: boolean
  tieredPrices?: TieredPricesEntity[] | null
  priceRange?: null
}

export interface RawApiVariationGroupData {
  inventory?: InventoryInfo
  marketingBadgeConf?: MarketingConfig | null
  marketingMessageConf?: Record<string, string> | null
  custom?: {
    c_hideComparablePriceValue?: boolean
  }
}

type BreadcrumbItem = {
  absUrl?: string
  alternateH1Tag?: string
  categoryID?: string
  htmlValue?: string
  url?: string
}

type SubNavigationItem = {
  id?: string
  name?: string
  url?: string
  children?: SubNavigationItem[]
}

export interface PlpApiData {
  pageType?: 'PLP' | 'CLP'
  isThinkPage?: boolean
  products?: ListingProduct[]
  id?: string
  total?: number
  wyngFilterUUID?: string
  pixleeAlbumID?: string
  seoContent?: ContentEntity
  seoFacetMetaTags?: Record<string, string | number | boolean>
  plpHreflangURL?: string
  isSPC?: boolean
  isFPC?: boolean
  contentInlinePromoAssetsSlotData?: BadgingContentSlot[]
  bottomSlots?: BadgingContentSlot[]
  ugcContentSlotData?: string | null
  currentPageTitle?: string
  c_metarobotTag?: string
  canonicalUrl?: string | null
  isCertonaTileEnabled?: boolean
  matchExperienceConfig?: Record<string, string | number | boolean>
  c_customHreflang?: string
  preloadImageSrc?: string
  enableAddToBag?: boolean
  subNavigationData?: {
    items?: SubNavigationItem[]
    breadcrumbs?: BreadcrumbItem[]
  }
  categoryImageSequence?: string
  enableFocusFilter?: boolean
  onModel?: Record<string, string | number | boolean>
  exposedPriceFilters?: PriceFilter[]
  thinkPageSwatchesDisabled?: boolean
  aiSeoSchema?: Array<Record<string, string | number | boolean>>
  disableRVRecommendations?: boolean
  defaultRVRecommendationsClosed?: boolean
  pageTemplate?: ITemplateComponentConfig
  showOnlySinglePrice?: boolean
  productTitleCharLimit?: number | null
  PLPTabColor?: string | null
  enableTransparentHeader?: boolean
  oosCategoryNameDisplay?: string
  alternateH1Tag?: string
  pageTitle?: string
  pageDescription?: string
  redirectUrl?: string
  seoProductsMetaData?: Record<string, string | number | boolean> | string
  oneSiteActiveBrand?: string
}

export interface PlpApiResponse {
  pageData: PlpApiData
  appData?: Record<string, unknown>
  menuData?: MenuData | MenuData[]
  badgingContentSlots?: BadgingContentSlot[]
}
export interface TieredPricesEntity {
  price: number
  pricebook: string
  quantity: number
}

export interface Content {
  text: string
  btnTxt: string
  spanText: string
  mainHtml: string
  styles?: null
}

export interface ContentPDP {
  text: string
  btnTxt: string
  spanText: string
  promoStyle: string
  mainHtml: string
  styles?: null
}

export interface VariationValues {
  color: string
  size?: string | null
}

export interface PromotionalCalloutsEntity {
  id: string
  name: string
  promoCallOut: string
  promoCallOutdefault: string
  promoCallOutPLP: string
  promoCallOutCart: string
  promoCallOutMiniCart: string
  contentAssetForCalloutModal: string
}
