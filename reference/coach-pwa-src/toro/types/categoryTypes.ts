type ParentCategoryTree = {
  cgid: string
  name: string
}

type InlinePromoTileJson = {
  slot: number
  position: number
  type: number
  promoTileUp: number
}

type FlyoutContent = {
  href: string
  pictureHtml: string
  styles?: string | null
}

export default interface Category {
  cgid: string
  name: string
  searchName?: string
  url: string
  isEnableFitReviewLink: boolean
  isSaleCategory: boolean
  isSourceCodedSaleCategory: boolean
  showDesktopTier3Image: boolean
  showMobileTier3Image: boolean
  calloutinfo: string
  navFlyoutImage: string
  navFlyoutCategoryStyle: string
  inlinePromoTileJson: InlinePromoTileJson[]
  scheduledCustomerGroups: string[]
  navFlyoutContentId: string
  navImageUrl: string
  threadUpCategory: boolean
  threadUpContentID: string
  thredUpFlag: boolean
  parentCategoryId: string
  parentCategoryTree: ParentCategoryTree[]
  subCategories: string[]
  flyoutContent: FlyoutContent
  alternativeCategoryId: string
  enableVisuallySimilar: boolean
  isOutlet?: boolean
  isCoachtopiaSubCategory?: boolean
  isCoachtopiaRootCategory?: boolean
  navFlyoutCatStyleMob?: string
  bgColorForSubNavHP?: string
  catNameColorForSubNavHP?: string
  isOutletSubCategory?: boolean
  plpCatRecommendations?: {
    placement: string
    position: number
    categories: string[]
  }
  disableRVRecommendations?: boolean
  defaultRVRecommendationsClosed?: boolean
  wyngFilterUUID?: string
  parentWyngFilterUUID?: string
}
