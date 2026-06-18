type ReviewProperty = {
  key: string
  label: string
  value: string[]
}

type Review = {
  ugc_id: number
  review_id: number
  details: {
    comments: string
    headline: string
    nickname: string
    created_date: string
    properties: ReviewProperty[]
    bottom_line: 'Yes' | 'No'
  }
  metrics: Record<string, number>
  badges: any
  media: any[]
}

export type MediaImage = {
  src: string
  isDynamicAsset?: boolean
  alt?: string
  title?: string
  poster?: undefined
  position?: undefined
  type?: string
}

export type MediaVideo = {
  src: string
  type?: 'video'
  isDynamicAsset?: boolean
  poster?: string
  position?: number
  alt?: undefined
  title?: undefined
}

export type MediaItem = MediaImage | MediaVideo

export type MediaFromProps = {
  full?: MediaItem[]
  thumbnails?: MediaImage[]
  thumbnail?: MediaImage
}

export type AdaptiveProductCarouselMobileAltProps = {
  media: MediaFromProps
  canZoom: boolean
  hasZoomedImage: boolean
  onMediaClick: () => void
  initialIdx: number
  selectedVariant: any
  isScrolled: boolean
  onSwatchInteraction: (_1: string, _2: string, _3: number, _4?: boolean) => void
  brand: string
  selectedColor: string
  imageEditorialCopy?: any
  tangiblee: {
    skuId: string
    isVisible: boolean
    pageType: 'PDP'
    tangibleeData: Record<string, boolean>
    variantData: any
    productData: any
  }
  isSimilarOptionOnPDP: boolean
  reviewsData: Review[]
  setCarouselIndex
  isDynamicAssetPresent: boolean
  dynamicAssetImage: MediaImage
  isEnabledColorAdaptive: boolean
  productId: string
  reviewsAvgRating: number
  isTabbedAdaptivePDP?: boolean
}
