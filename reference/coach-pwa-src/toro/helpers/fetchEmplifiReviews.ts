import get from 'lodash/get'
import {
  convertRatingFilterToEmplifiFilterDimension,
  getSortString,
  VOTE_TYPE,
} from 'toro/helpers/emplifiNormalizers'
import getAPIURL from 'helpers/getAPIURL'
import { API_GET_EMPLIFI_REVIEWS, API_VOTE_EMPLIFI_REVIEW } from 'toro/constants/Urls'
import { RollUpProperty } from 'toro/components/product/RatingsAndReviews/ReviewsList/types'
import fetch from 'helpers/fetch'
import serialize from 'toro/helpers/serialize'
import getQueryString from 'toro/helpers/getQueryString'
import { fetchFromServerSide } from 'helpers/fetchFromServerSide'
import { responseLogger } from 'helpers/logger'

type FetchEmplifiReviewsOptions = {
  sku: string
  filterBy?: string
  filter?: string
  search?: string
  sortBy?: string
  from?: number
  pagesize?: string | number
  defaultSortOrder?: string
  pageSizeAllReviewsModal?: string | number
  enablePhotoGallery?: boolean
}

type ReviewFilters = {
  filterBy: string
  search: string
  sortBy: string
  pagesize?: string | number
}

type EmplifiReviewsApiResponse = {
  reviewData: any
  reviewFilters: ReviewFilters
}

/**
 * Used for request from front-end
 * Retrieves Emplifi reviews for a product, applying specified filters and sorting options
 */
export const fetchEmplifiReviews = async (
  upc: string,
  properties: RollUpProperty[],
  params?: any,
  signal?: AbortSignal
): Promise<Record<string, any>> => {
  if (!upc) {
    return {}
  }
  const filter = convertRatingFilterToEmplifiFilterDimension(properties, params?.filterBy || '')
  const qs = getQueryString({
    sortBy: params?.sortBy,
    search: params?.search,
    filterBy: params?.filterBy,
    from: params?.from,
    pagesize: params?.pagesize,
    sku: upc,
    filter: filter,
    locale: params?.locale,
  })
  return await fetch(getAPIURL(`${API_GET_EMPLIFI_REVIEWS}?${qs}`), {
    signal,
  }).then((res) => res.json())
}

/**
 * Submits a vote (either helpful or unhelpful) for a specific Emplifi review.
 */
export const voteEmplifiReview = async (
  reviewId: string,
  voteType: VOTE_TYPE
): Promise<Record<string, any>> => {
  if (!reviewId) {
    return {}
  }
  try {
    const path = voteType === VOTE_TYPE.helpful ? 'voteup' : 'votedown'
    const url = getAPIURL(
      `${API_VOTE_EMPLIFI_REVIEW}?type=${path}&reviewId=${encodeURIComponent(reviewId)}`
    )
    const res = await fetch(url, { method: 'POST' })
    responseLogger(res)
    return await res.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error('voteEmplifiReview error:', error.message)
    } else {
      console.error('voteEmplifiReview error:', error)
    }
    return {}
  }
}

/**
 *Fetches Emplifi reviews data directly from the API
 */
export const fetchEmplifiReviewsApi = async (
  baseUrl: string,
  apiKey: string,
  {
    sku,
    filterBy = '',
    filter = '',
    search = '',
    sortBy = '',
    from = 0,
    pagesize,
    defaultSortOrder,
    pageSizeAllReviewsModal,
    enablePhotoGallery = false,
  }: Partial<FetchEmplifiReviewsOptions> = {}
): Promise<EmplifiReviewsApiResponse> => {
  const sort = getSortString(sortBy || defaultSortOrder)
  const reviewFilters = {
    filterBy: filterBy,
    search: search,
    sortBy: sortBy || defaultSortOrder,
    pagesize: pagesize || pageSizeAllReviewsModal,
  }
  const qs = getQueryString({
    filter: filter,
    limit: reviewFilters.pagesize,
    offset: from,
    sku: sku,
    sort: sort,
    includeRelated: true,
    publishedOnly: true,
    includeRatingOnlyReviews: false,
    includeFilters: true,
  })
  const reviewData = await makeEmplifiRequest(baseUrl, apiKey, 'reviews', qs)
  return { reviewData, reviewFilters }
}

/**
 * Fetches Emplifi summary data for a specific product from the API
 */
export const fetchEmplifiSummaryApi = async (
  baseUrl: string,
  apiKey: string,
  sku: string
): Promise<Record<string, any>> => {
  const qs = new URLSearchParams({ sku }).toString()
  const response = await makeEmplifiRequest(baseUrl, apiKey, 'products/ugc_summary', qs)

  return get(response, '0', {})
}

/**
 * Fetches Emplifi photos for a specific product from the API
 */
export const fetchEmplifiReviewsWithPhotosApi = async (
  baseUrl: string,
  apiKey: string,
  sku: string,
  limit: number = 20
): Promise<Record<string, any>[]> => {
  const qs = new URLSearchParams({
    sku,
    limit: String(limit),
    filter: 'photos(true)',
    includeRelated: 'true',
    publishedOnly: 'true',
    includeRatingOnlyReviews: 'false',
  }).toString()
  const response = await makeEmplifiRequest(baseUrl, apiKey, 'reviews', qs)
  return response
}

/**
 * Common Emplifi request function
 */
const makeEmplifiRequest = async (
  baseUrl: string,
  apiKey: string,
  path: string,
  urlSearchParams: string
) => {
  const response = await fetch(`${baseUrl}${path}?${urlSearchParams}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  responseLogger(response)
  try {
    return await response.json()
  } catch (error) {
    console.error('Failed to parse JSON response:', error)
    return {}
  }
}

/**
 * Used for request from back-end to call get-reviews api
 * Common request of Emplfii reviews and summary data
 */
export const fetchEmplifiProductReviews = async (
  req,
  sku,
  { pagesize = 10 } = {}
): Promise<Record<string, any>> => {
  return await fetchFromServerSide(
    req,
    '/api' +
      API_GET_EMPLIFI_REVIEWS +
      serialize({
        filterBy: '',
        search: '',
        sortBy: '',
        sku,
        pagesize,
      })
  ).then(async (res) => {
    try {
      responseLogger(res)
      return await res.json()
    } catch (error) {
      console.error('Failed to parse JSON response:', error)
      return {}
    }
  })
}
