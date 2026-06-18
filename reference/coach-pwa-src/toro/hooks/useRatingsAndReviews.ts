import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import { type Dispatch, type SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { pdpReviewsAtom, setReviewModalOpenedAtom } from 'store/pdp.atom'
import get from 'lodash/get'
import type {
  TReview,
  ReviewRollup,
  ReviewsPaging,
  RollUpProperty,
  RatingsFilter,
  FetchParams,
  ReviewData,
  Topic,
} from 'toro/components/product/RatingsAndReviews/ReviewsList/types'
import {
  computeIndicatorsValue,
  getCountsByKey,
} from 'toro/components/product/RatingsAndReviews/ReviewsList/helpers'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from './usePreference_new'
import { fetchEmplifiReviews } from 'toro/helpers/fetchEmplifiReviews'
import PWAContext from 'components/common/PWAContext'
import { DetailedProduct } from 'toro/types/productTypes'

const POWER_REVIEWS_SEPARATORS = {
  values: '||',
  filter: ',',
  keyValue: ':',
}

export enum FilterType {
  DEFAULT = 'default',
  WORD_CLOUD = 'word cloud',
  STAR_RATING = 'star rating',
}

type HandleChangeFilterParams = {
  key: string
  value: string
  isRating?: boolean
  filterType?: FilterType
}

type UseRatingsAndReviewsReturn = {
  average_rating: number
  customFitSize?: string
  customFitWidth?: string
  atomReviews: TReview[]
  isLoading: boolean
  reviews: TReview[]
  reviewPaging: ReviewsPaging
  ratingsFilter: RatingsFilter
  review_count: number
  properties: RollUpProperty[]
  ratings: number[]
  topics: Topic[]
  wcProperties: string[]
  modalReviews: TReview[]
  prevReviewsFilter: RatingsFilter
  ratingsFilterModal: RatingsFilter
  ai_review_summary?: string
  setRatingsFilterModal: Dispatch<SetStateAction<RatingsFilter>>
  setPrevReviewsFilter: Dispatch<SetStateAction<RatingsFilter>>
  setModalReviews: Dispatch<SetStateAction<TReview[]>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setReviewModalOpened: (isModalOpen: boolean) => void
  setAtomReviews: (update: SetStateAction<TReview[]>) => void
  setRatingsFilter: Dispatch<SetStateAction<RatingsFilter>>
  reviewEvent: () => void
  handleChangeFilter: (params: HandleChangeFilterParams) => void
  fetchReviewsByModelId: (
    ratingsFilter?: FetchParams,
    signal?: AbortSignal | null
  ) => Promise<{ reviews: TReview[]; rollup: ReviewRollup; paging: ReviewsPaging }>
  setReviews: Dispatch<SetStateAction<TReview[]>>
  setRollupData: Dispatch<SetStateAction<ReviewRollup>>
  setReviewPaging: Dispatch<SetStateAction<ReviewsPaging>>
}

type UseRatingsAndReviewsParams = {
  sizingRange: number
  widthRange: number
  modelID: string
  productData: DetailedProduct
  reviewsData: ReviewData
  setSizingRange: Dispatch<SetStateAction<number>>
  setWidthRange: Dispatch<SetStateAction<number>>
}

const defaultFilterValue: RatingsFilter = {
  search: '',
  sortBy: '',
  filterBy: '',
  ratingsFilterValue: '',
}

export default function useRatingsAndReviews({
  sizingRange,
  widthRange,
  modelID,
  productData,
  reviewsData,
  setSizingRange,
  setWidthRange,
}: UseRatingsAndReviewsParams): UseRatingsAndReviewsReturn {
  const setReviewModalOpened = useUpdateAtom(setReviewModalOpenedAtom)
  const [atomReviews, setAtomReviews] = useAtom(pdpReviewsAtom)
  const { appData } = useContext(PWAContext)

  const [isLoading, setLoading] = useState(false)
  const [reviews, setReviews] = useState<TReview[]>(get(reviewsData, 'results[0].reviews', []))
  const [modalReviews, setModalReviews] = useState<TReview[]>(
    get(reviewsData, 'results[0].reviews', [])
  )
  const [rollupData, setRollupData] = useState<ReviewRollup>(
    get(reviewsData, 'results[0].rollup', {})
  )
  const [reviewPaging, setReviewPaging] = useState<ReviewsPaging>(
    get(reviewsData, 'paging', {} as ReviewsPaging)
  )

  useEffect(() => {
    if (reviewsData) {
      setReviews(get(reviewsData, 'results[0].reviews', []))
      setRollupData(get(reviewsData, 'results[0].rollup', {}))
      setReviewPaging(get(reviewsData, 'paging', {} as ReviewsPaging))
    }
  }, [reviewsData])

  const [ratingsFilter, setRatingsFilter] = useState(defaultFilterValue)

  const [ratingsFilterModal, setRatingsFilterModal] = useState(defaultFilterValue)

  const [prevReviewsFilter, setPrevReviewsFilter] = useState(defaultFilterValue)

  const analytics = useAnalytics()

  const {
    c_customFitSize: customFitSize,
    c_customFitWidth: customFitWidth,
    c_department: department,
  } = productData?.custom || {}

  const {
    powerReviews: {
      enableEmplifi = false,
      enableWordCloudClickableTags = false,
      wordCloudProperties = [],
      wordCloudPropEmplifi = [],
      emplifiAiTopicsConfig = { enable: false, limit: 10 },
    },
  } = usePreference({
    powerReviews: [
      'enableEmplifi',
      'enableWordCloudClickableTags',
      'wordCloudProperties',
      'wordCloudPropEmplifi',
      'emplifiAiTopicsConfig',
    ],
  })

  const wcProperties = useMemo(() => {
    if (!enableWordCloudClickableTags) {
      return []
    }
    if (enableEmplifi) {
      return wordCloudPropEmplifi
    }
    return wordCloudProperties
  }, [wordCloudPropEmplifi, wordCloudProperties, enableWordCloudClickableTags])

  const {
    average_rating,
    review_count,
    properties = [],
    rating_histogram = [],
    rating_count,
    ai_review_summary,
    topics = [],
  } = rollupData

  const cachedTopics = useMemo(() => topics, [Boolean(topics.length)])

  const sizingRangeName = {
    'KS FOOTWEAR': 'ratesizemensrtwb',
    'KS APPAREL': 'ratesizemensrtwtjo',
    default: 'sizing',
  }
  const ratings = useMemo(() => {
    if (Array.isArray(rating_histogram) && rating_count !== 0) {
      return rating_histogram.map((rating) => Math.round((rating * 100) / rating_count)).reverse()
    }
    return []
  }, [rating_histogram, rating_count])

  const handleChangeFilter = ({
    key,
    value,
    isRating,
    filterType = FilterType.DEFAULT,
  }: HandleChangeFilterParams) => {
    const { filterBy } = ratingsFilter
    const filters = filterBy ? filterBy.split(POWER_REVIEWS_SEPARATORS.filter) : []
    const foundFilterIndex = filters.findIndex((filter) => filter.includes(key))
    let isRemove = false

    if (foundFilterIndex === -1) {
      filters.push(`${key}:${value}`)
    } else {
      const foundFilter = filters[foundFilterIndex]
      const [, existingValues] = foundFilter.split(POWER_REVIEWS_SEPARATORS.keyValue)
      const values = isRating ? [] : existingValues?.split(POWER_REVIEWS_SEPARATORS.values) || []

      if (isRating && existingValues.includes(value)) {
        isRemove = true
      } else if (values.includes(value)) {
        isRemove = true
        values.splice(values.indexOf(value), 1)
      } else {
        values.push(value)
      }

      const updatedFilter = values.length
        ? `${key}:${values.join(POWER_REVIEWS_SEPARATORS.values)}`
        : ''

      if (!updatedFilter) {
        filters.splice(foundFilterIndex, 1) // Remove the existing filter
      } else {
        filters.splice(foundFilterIndex, 1, updatedFilter) // Update the existing filter
      }
    }

    const newFilterBy = filters.join(POWER_REVIEWS_SEPARATORS.filter)

    // Analytics code
    let wordCloudValues = []
    let starRatingValues = []

    for (let pair of filters) {
      if (!pair.length) continue
      let [filterKey, filterValue] = pair.split(POWER_REVIEWS_SEPARATORS.keyValue)
      if (wcProperties.includes(filterKey) || filterKey === 'topic') {
        wordCloudValues.push(...filterValue.split(POWER_REVIEWS_SEPARATORS.values))
      } else {
        starRatingValues.push(...filterValue.split(POWER_REVIEWS_SEPARATORS.values))
      }
    }

    let currentFilters = ''
    if (wordCloudValues.length > 0) {
      currentFilters += `${FilterType.WORD_CLOUD}:${wordCloudValues.join(',')}`
    }
    if (starRatingValues.length > 0) {
      if (currentFilters.length > 0) {
        currentFilters += ','
      }
      currentFilters += `${FilterType.STAR_RATING}:${starRatingValues.join(',')}`
    }

    analytics.send('filter', {
      action: isRemove ? 'remove' : 'apply',
      eventLocation: 'product',
      filter: {
        name: value,
        category: filterType === FilterType.DEFAULT ? key : filterType,
      },
      currentFilters,
    })
    const eventAction = filterType === FilterType.DEFAULT ? 'filter by' : filterType
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: `${eventAction} click:${value}`,
      eventLabel: productData?.id || undefined,
    })
    let updatedRatingsFilter = { ...ratingsFilter }
    if (filterType === FilterType.STAR_RATING) {
      updatedRatingsFilter.ratingsFilterValue =
        foundFilterIndex === -1 ? `${key}:${value}` : filters[foundFilterIndex] || ''
    }
    setRatingsFilter({ ...updatedRatingsFilter, filterBy: newFilterBy })
  }

  const reviewEvent = () => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'write a review',
      eventLabel: productData?.id,
    })
  }

  const fetchReviewsProvider = (ratingsFilter, signal) => {
    const locale = get(appData, 'localeInPath', '')
    return fetchEmplifiReviews(productData?.UPC, properties, { ...ratingsFilter, locale }, signal)
  }
  const fetchReviewsByModelId = async (ratingsFilter = {} as FetchParams, signal = null) => {
    setLoading(true)
    const response = await fetchReviewsProvider(ratingsFilter, signal)
    setLoading(false)
    const reviews: TReview[] = get(response, 'results[0].reviews', []) || []
    const rollup: ReviewRollup = get(response, 'results[0].rollup', {}) || {}
    const paging: ReviewsPaging = get(response, 'paging', {}) || {}
    const { properties = [] } = rollup
    if (!sizingRange) {
      const sizing = getCountsByKey(
        properties,
        enableEmplifi
          ? sizingRangeName.default
          : sizingRangeName[department] || sizingRangeName.default
      )
      const sizingRangeValue = computeIndicatorsValue(sizing)
      !isNaN(sizingRangeValue) && setSizingRange(Math.round(sizingRangeValue))
    }

    if (!widthRange) {
      const width = getCountsByKey(properties, 'width')
      const widthRangeValue = computeIndicatorsValue(width)
      !isNaN(widthRangeValue) && setWidthRange(Math.round(widthRangeValue))
    }

    return {
      reviews,
      rollup,
      paging,
    }
  }
  return {
    average_rating,
    customFitSize,
    customFitWidth,
    atomReviews,
    isLoading,
    reviews,
    reviewPaging,
    ratingsFilter,
    review_count,
    properties,
    ratings,
    topics: emplifiAiTopicsConfig?.enable
      ? cachedTopics.slice(0, emplifiAiTopicsConfig?.limit || 10)
      : [],
    wcProperties,
    modalReviews,
    prevReviewsFilter,
    ratingsFilterModal,
    ai_review_summary,
    setRatingsFilterModal,
    setPrevReviewsFilter,
    setModalReviews,
    setLoading,
    setReviewModalOpened,
    setAtomReviews,
    setRatingsFilter,
    reviewEvent,
    handleChangeFilter,
    fetchReviewsByModelId,
    setReviews,
    setRollupData,
    setReviewPaging,
  }
}
