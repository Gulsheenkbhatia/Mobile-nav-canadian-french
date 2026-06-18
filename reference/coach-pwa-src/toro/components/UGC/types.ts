export type UGCPageType = 'home' | 'plp' | 'pdp' | 'social-gallery'

export interface UGCMediaUrls {
  medium_image?: string
  square_medium_image?: string
}

export interface UGCMedia {
  mediatype?: string
  media_urls?: UGCMediaUrls
}

export interface UGCPlatformData {
  social_platform_original_url?: string
}

export interface UGCAuthor {
  profile?: {
    username?: string
  }
}

export interface UGCItemContent {
  text?: string
  media?: UGCMedia
  platform_data?: UGCPlatformData
  author?: UGCAuthor
}

export interface UGCActivateUnit {
  id: string
  name: string
  image_url: string
  click_through_url: string
  external_id: string
}

export interface UGCItem {
  id: string
  content?: UGCItemContent
  activate_units?: UGCActivateUnit[]
}

export interface WyngPreferences {
  isEnable: boolean
  apiUrl: string
  loading: boolean
  gridLoading: boolean
  showImages: UGCItem[]
  fetchNext: () => void
  UGCItemCount: number
  isEnableViewGalleryCTA: boolean
  hasNext?: boolean
  displayShowMore: boolean
}
