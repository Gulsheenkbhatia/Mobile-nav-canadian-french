import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import isPlainObject from 'lodash/isPlainObject'
import { RollUpProperty, Topic } from 'toro/components/product/RatingsAndReviews/ReviewsList/types'

export const POWER_REVIEWS_SEPARATORS = {
  values: '||',
  filter: ',',
  keyValue: ':',
}

export const EMPLIFI_REVIEWS_SEPARATORS = {
  values: ',',
  filter: ' ',
}

export enum VOTE_TYPE {
  helpful = 'helpful',
  unhelpful = 'unhelpful',
}

interface DimensionItem {
  id: number
  label: string
  code: string
  count: number
}

interface Dimension {
  id: number
  label: string
  values?: DimensionItem[]
  count?: number
  displayLabel?: string
  code?: string
  type?: number
  dimensionId?: number
  dimensionLabel?: string
  value?: string | null
}
interface Media {
  photo: EmplifiPhoto[]
}

interface CatalogItem {
  sku: string
  title: string
  url: string
  category: string
  reviewCount: number
  ratingCount: number
  averageRating: number
  ratingBreakdown: {
    [key: string]: number
  }
  active: boolean
  attributes: any[]
}

interface User {
  nickName: string | null
  firstName: string
  lastName: string
  emailAddress: string | null
  externalId: string | null
  city: string | null
  state: string
  country: string
  ageRange: number | string
  badge: any | null
  shopperProfiles: Array<{ code: string }>
}

interface Review {
  id: number
  locale: string
  rating: number
  title: string
  text: string
  textLength: number
  csFlag: boolean
  inappropriateFlag: boolean
  reviewedFlag: boolean
  autoModerated: boolean
  published: boolean
  incentivized: boolean
  upVotes: number
  downVotes: number
  orderId: any
  dimensions: Dimension[]
  responses: any[]
  tags: any[]
  media: Media
  user: User
  reviewedDate: string
  purchaseDate: any
  dateCreated: string
  customData: any[]
  incentiveType: any
  campaign: any
  deviceFingerprint: any
  catalogItems: CatalogItem[]
}

type EmplifiFilters = {
  dimensions?: Dimension[]
  topics?: Topic[]
  rating?: Array<{ value: number; count: number; filter: string }>
  photos?: Array<{ value: string; count: number; filter: string }>
  videos?: Array<{ value: string; count: number; filter: string }>
  userSettings?: {
    shopperProfiles?: ShopperProfile[]
  }
}

export type EmplifiResponse = {
  reviews?: Review[]
  offset?: number
  limit?: number
  total?: number
  filters?: EmplifiFilters
}

interface UserShopperProfile {
  id: number
  code: string
}

interface ShopperProfileValue {
  id: number
  label: string
  code: string
}

interface ShopperProfile {
  name: string
  label: string
  values: ShopperProfileValue[]
}

interface ProfileProperty {
  key: string
  label: string
  value: string[]
}

enum HistogramDimensions {
  size = 'Rate Size',
  width = 'Rate Width',
}
const ShopperProfiles = {
  ageRange: 'age',
  'Size Purchased': 'sizeordered',
  'Usual Size': 'usualsize',
}
const DimensionCodes = {
  RecommendToFriend: ['REF0', 'REF1'],
  RateWidth: ['WFIT', 'WIDE', 'NAR'],
  RateSize: ['FIT', 'SMALL', 'LARGE'],
}

const parseAiReviewSummary = (ugcSummary: Record<string, any>): string => {
  const aiReviewSummary = get(ugcSummary, 'aiReviewSummary', '')
  if (!aiReviewSummary) return ''
  if (isPlainObject(aiReviewSummary)) {
    return get(aiReviewSummary, 'text', '')
  }
  try {
    const parsed = JSON.parse(aiReviewSummary)
    return get(parsed, 'text', '')
  } catch {
    return aiReviewSummary
  }
}

export const normalizeEmplifiUgcSummary = (
  ugcSummary: Record<string, any>,
  dimensions?: Dimension[]
) => ({
  average_rating: get(ugcSummary, 'averageRating', 0),
  review_count: get(ugcSummary, 'reviews', 0),
  properties: (dimensions || get(ugcSummary, 'dimensions', [])).map(normalizeEmplifiDimension),
  rating_histogram: Object.values(get(ugcSummary, 'ratingBreakdown', {})),
  rating_count: get(ugcSummary, 'ratings', 0),
  shopperProfiles: get(ugcSummary, 'userSettings.shopperProfiles', []),
  ai_review_summary: parseAiReviewSummary(ugcSummary),
  topics: get(ugcSummary, 'topics', []),
})

export const normalizeEmplifiResponse = (
  data: EmplifiResponse,
  rollup?: Record<string, any>,
  hideLastNameOnReviews?: boolean
) => {
  const { offset, limit, total, reviews = [], filters } = data || {}
  const shopperProfiles = get(rollup, 'shopperProfiles', [])
  const normalizedReviews = reviews?.map((review) =>
    normalizeEmplifiReview(review, shopperProfiles, hideLastNameOnReviews)
  )

  const rollupWithTopics = rollup
    ? {
        ...rollup,
        topics: get(filters, 'topics', []),
      }
    : undefined

  return {
    results: [
      {
        rollup: rollupWithTopics,
        reviews: normalizedReviews,
      },
    ],
    paging: {
      current_page_number: offset / limit + 1,
      total_results: total || 0,
      pages_total: total / limit,
      next_page_url: total > offset + limit,
      page_size: limit,
    },
  }
}

const getReviewerNickName = (review: Review, hideLastNameOnReviews?: boolean) => {
  const nickname = get(review, 'user.nickName')
  if (nickname) {
    return nickname
  }

  const firstName = get(review, 'user.firstName') || ''
  const lastName = get(review, 'user.lastName') || ''

  // If hideLastNameOnReviews toggle is enabled: hide last name
  if (hideLastNameOnReviews) {
    return firstName || null
  }

  // For other locales: show first name with last initial
  const lastNameInitial = lastName ? lastName?.substring(0, 1) + '.' : ''

  return Boolean(firstName) || Boolean(lastName) ? `${firstName} ${lastNameInitial}`.trim() : null
}

const normalizeEmplifiReview = (
  review: Review,
  shopperProfiles: ShopperProfile[] = [],
  hideLastNameOnReviews?: boolean
) => {
  const bottom_line = get(review, 'dimensions').find((dimensions) =>
    DimensionCodes.RecommendToFriend.includes(dimensions.code)
  )
  return {
    ugc_id: review.id,
    review_id: review.id,
    details: {
      comments: review.text,
      headline: review.title,
      nickname: getReviewerNickName(review, hideLastNameOnReviews),
      created_date: review.dateCreated,
      properties: normalizeEmplifiReviewDimension(review, shopperProfiles),
      bottom_line: get(bottom_line, 'label', ''),
      incentivized: get(review, 'incentivized', false),
    },
    metrics: {
      rating: review.rating,
      helpful_votes: review.upVotes,
      not_helpful_votes: review.downVotes,
    },
    badges: {
      // is_staff_reviewer ???
    },
    media: review.media?.photo.map((photo) => ({
      type: 'image',
      caption: photo.caption,
      uri: photo.originalUrl,
      id: photo.id,
    })),
  }
}

const normalizeEmplifiReviewDimension = (
  review: Review,
  summaryProfiles: ShopperProfile[] = []
) => {
  const shopperProfiles = findAssociatedProfiles(
    summaryProfiles,
    get(review, 'user.shopperProfiles', [])
  )

  const dimensions: Dimension[] = get(review, 'dimensions', [])
  const groupedDimensions = groupBy(dimensions, 'dimensionLabel')
  const properties = Object.entries(groupedDimensions).map(([key, values]) => {
    return {
      key,
      label: key,
      value: values.map((value) => get(value, 'label')),
    }
  })
  return [...properties, ...shopperProfiles]
}

const findAssociatedProfiles = (
  summaryProfiles: ShopperProfile[],
  shopperProfiles: UserShopperProfile[]
) => {
  // Create a lookup table for the values in ugcSummary
  const lookupTable = new Map<string, ProfileProperty>()

  summaryProfiles.forEach((profile) => {
    profile?.values?.forEach((value) => {
      const profileKey = Object.keys(ShopperProfiles).find((key) => profile?.name?.includes(key))
      if (profileKey) {
        lookupTable.set(value?.code, {
          key: ShopperProfiles[profileKey],
          label: profile?.label,
          value: [value?.label],
        })
      }
    })
  })

  const associatedProfiles: ProfileProperty[] = []

  shopperProfiles.forEach((reviewProfile) => {
    if (lookupTable.has(reviewProfile?.code)) {
      const profile = lookupTable.get(reviewProfile.code)
      if (profile) {
        associatedProfiles.push(profile)
      }
    }
  })

  return associatedProfiles
}

export const normalizeEmplifiDimension = (dimension: Dimension) => {
  switch (dimension.label) {
    case HistogramDimensions.size: {
      return {
        key: 'sizing',
        name: HistogramDimensions.size,
        display_type: 'histogram',
        display_values: dimension?.values?.map((item) => item.label),
        values: dimension.values,
        id: dimension.id,
      }
    }
    case HistogramDimensions.width: {
      return {
        key: 'width',
        name: HistogramDimensions.width,
        display_type: 'histogram',
        display_values: dimension?.values?.map((item) => item.label),
        values: dimension.values,
        id: dimension.id,
      }
    }
    default: {
      return {
        key: dimension.label,
        values: dimension?.values?.filter((value) => value.count > 0),
        id: dimension.id,
      }
    }
  }
}

const convertFilterByToEmplifiFilters = (filters: string[]) => {
  return filters
    .map((filter) => {
      const [key, values] = filter.split(POWER_REVIEWS_SEPARATORS.keyValue)
      const normalizedValues = values.replaceAll(
        POWER_REVIEWS_SEPARATORS.values,
        EMPLIFI_REVIEWS_SEPARATORS.values
      )
      return `${key}(${normalizedValues})`
    })
    .join(EMPLIFI_REVIEWS_SEPARATORS.filter)
}

export const convertRatingFilterToEmplifiFilterDimension = (
  properties: RollUpProperty[],
  filterBy: string
): string => {
  const filters = filterBy.split(POWER_REVIEWS_SEPARATORS.filter)
  const otherFilters: string[] = []
  const resultFilters: string[] = []
  const dimensions =
    Boolean(properties.length) && Boolean(filterBy.length)
      ? filters
          .reduce((acc, filter) => {
            const [filterByKey, filterByValues] = filter.split(POWER_REVIEWS_SEPARATORS.keyValue)
            const foundProperty = properties.find((p) => p.key === filterByKey)
            if (!foundProperty) {
              otherFilters.push(filter)
              return acc
            }
            const matchedPropertyValues = foundProperty.values.filter(
              (value) =>
                value.id &&
                filterByValues.split(POWER_REVIEWS_SEPARATORS.values).includes(value.label)
            )
            return [...acc, ...matchedPropertyValues.map((value) => value.id)]
          }, [])
          .join(EMPLIFI_REVIEWS_SEPARATORS.values)
      : ''
  if (dimensions.length > 0) {
    resultFilters.push(`dim(${dimensions})`)
  }
  const other = convertFilterByToEmplifiFilters(otherFilters)
  if (other.length > 0) {
    resultFilters.push(other)
  }
  return resultFilters.join(EMPLIFI_REVIEWS_SEPARATORS.filter)
}

/**
 * Used to get the auth key from the preference in case it's object or string
 */
export const getKeyByLocale = (pref: Record<string, any> | string, locale: string): string => {
  const value = get(pref, 'value', pref)
  if (typeof value === 'string') {
    return value
  } else if (isPlainObject(value)) {
    return get(value, locale, '')
  }
  return ''
}

/**
 * Mapper function to convert given values to sort strings
 * Default to 'dateCreated:desc' if value is not in sortMappings
 */
const sortMappings = {
  LowestRating: 'rating:asc',
  HighestRating: 'rating:desc',
  MostHelpful: 'upVotes:desc',
  Oldest: 'dateCreated:asc',
  Newest: 'dateCreated:desc',
}
export const getSortString = (value: string = 'HighestRating') => {
  return sortMappings[value]
}

interface EmplifiPhoto {
  id: number
  caption?: string
  normalUrl?: string
  thumbnailUrl?: string
  originalUrl?: string
  dateCreated?: string
  user?: {
    nickName?: string
    firstName?: string
    lastName?: string
  }
}

interface EmplifiReviewResponse {
  text: string
  dateCreated: string
  user: User
}
export interface NormalizedPhotoReview {
  id: number
  reviewId: number
  rating: number
  title: string
  text: string
  incentivized: boolean
  user: User
  reviewedDate: string
  responses: EmplifiReviewResponse[]
  upVotes: number
  downVotes: number
  photos: {
    id: number
    caption: string
    thumbnailUrl: string
    originalUrl: string
  }[]
  recommendToFriend: string | null
}

/**
 * Normalizes Emplifi reviews with photos response to a consistent format for the gallery modal
 * Preserves all review data including rating, title, text, user info, and all associated photos
 */
export const normalizeEmplifiReviewsWithPhotos = (
  response: EmplifiResponse
): NormalizedPhotoReview[] => {
  if (!response || !Array.isArray(response.reviews)) return []
  return response.reviews.map((review) => {
    // Find "Recommend to Friend" dimension
    const recommendDimension = review.dimensions?.find((dim) =>
      DimensionCodes.RecommendToFriend.includes(dim.code)
    )

    return {
      id: review.id,
      reviewId: review.id,
      rating: review.rating,
      title: review.title,
      text: review.text,
      incentivized: review.incentivized,
      user: review.user,
      reviewedDate: review.reviewedDate,
      responses: review.responses || [],
      upVotes: review.upVotes,
      downVotes: review.downVotes,
      photos: review.media.photo.map((photo) => ({
        id: photo.id,
        caption: photo.caption || '',
        thumbnailUrl: photo.thumbnailUrl || photo.normalUrl || photo.originalUrl || '',
        originalUrl: photo.originalUrl || photo.normalUrl || '',
      })),
      recommendToFriend: recommendDimension?.label || null,
    }
  })
}
