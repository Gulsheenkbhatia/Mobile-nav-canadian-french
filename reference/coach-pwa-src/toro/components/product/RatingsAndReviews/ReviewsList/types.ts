import type { DetailedProduct } from 'toro/types/productTypes'
import { NormalizedPhotoReview } from 'toro/helpers/emplifiNormalizers'

type ReviewDetailsProperty = {
  key: string
  label: string
  type: string
  value: string[]
}

type ReviewDetails = {
  comments: string
  headline: string
  nickname: string
  properties: ReviewDetailsProperty[]
  merchant_response?: string
  product_name: string
  locale: string
  disclosure_code: string
  location: string
  created_date: number
  bottom_line: string
  incentivized: boolean
}

type ReviewBadge = {
  is_staff_reviewer: boolean
}

type ReviewMedia = {
  id: string
  uri: string
  helpful_votes: number
  not_helpful_votes: number
  type: string
}

type ReviewMetrics = {
  helpful_votes: number
  not_helpful_votes: number
  rating: number
}

export type TReview = {
  ugc_id: number
  review_id: number
  details: ReviewDetails
  badges: ReviewBadge
  media: ReviewMedia[]
  metrics: ReviewMetrics
}

export type RollUpPropertyValue = {
  label: string
  count: number
  // Emplifi only
  id?: number
}

export type RollUpProperty = {
  display_type: string
  key: string
  name: string
  type: string
  values: RollUpPropertyValue[]
  display_values: string[]
}

type ReviewMediaItem = {
  id: string
  review_id: number
  uri: string
  headline: string
  rating: number
  helpful_votes: number
  not_helpful_votes: number
  type: string
  nickname: string
  created_date: number
}

export type Topic = {
  value: string
  count: number
  filter: string
}

export type ReviewRollup = {
  properties: RollUpProperty[]
  rating_histogram: number[]
  review_count: number
  rating_count: number
  average_rating: number
  media: ReviewMediaItem[]
  name: string
  ai_review_summary?: string
  topics?: Topic[]
}

export type ReviewsPaging = {
  total_results: number
  pages_total: number
  page_size: number
  current_page_number: number
  next_page_url: string
}

type ReviewResult = {
  page_id: string
  rollup: ReviewRollup
  reviews: TReview[]
}

export type FetchParams = {
  search: string
  sortBy: string
  filterBy: string
  pagesize: string
  from?: string
}
export type ReviewData = {
  name: string
  paging: ReviewsPaging
  results: ReviewResult[]
  filters?: FetchParams
  photosWithReviews?: NormalizedPhotoReview[]
}

export interface ReviewListProps {
  isModalContent?: boolean
  isSiteParamsAvailable: boolean
  sizingRange: number
  widthRange: number
  siteId: string
  productId: string
  productData: DetailedProduct
  modelID: string
  reviewsData: ReviewData
  setSizingRange: React.Dispatch<React.SetStateAction<number>>
  setWidthRange: React.Dispatch<React.SetStateAction<number>>
  variant?: string
  isActive?: boolean
  isTabbedReview?: boolean
  ratingsAndReviewsData?: {
    [key: string]: any
  }
  hideWriteReviewCta?: boolean
}

export interface ReviewCTAProps {
  link?: string
  target: string
  prefetch?: boolean
  children: React.ReactNode
  disableEffects?: boolean
  [x: string]: any
}

export interface ReviewSkeletonProps {
  count?: number
  isHeaderContent?: boolean
}

export type TFetchReviews = {
  fetchParam: FetchParams
  isModal?: boolean
  isNextPage?: boolean
  signal?: AbortSignal | null
  setInitialReviewData?: boolean
}

export type RatingsFilter = {
  search: string
  sortBy: string
  filterBy: string
  ratingsFilterValue: string
}
