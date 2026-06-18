import {
  fetchEmplifiReviews,
  fetchEmplifiReviewsApi,
  fetchEmplifiSummaryApi,
  voteEmplifiReview,
} from 'toro/helpers/fetchEmplifiReviews'
import { API_VOTE_EMPLIFI_REVIEW } from 'toro/constants/Urls'
import { VOTE_TYPE } from 'toro/helpers/emplifiNormalizers'
import { PROPERTIES_MOCK, REVIEWS_MOCK, UGC_SUMMARY_MOCK } from 'test-utils/emplifiMocks'

describe('src/toro/helpers/fetchEmplifiReviews.ts', () => {
  it('fetchEmplifiReviewsApi', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => REVIEWS_MOCK,
      })
    )
    const params = {
      locale: 'en_US',
      sku: '123',
      filterBy: 'filter by',
      filter: 'emplifi filter',
      search: 'search',
      sortBy: 'sort by',
      from: 5,
      pagesize: 13,
      defaultSortOrder: 'HighestRating',
      pageSizeAllReviewsModal: 5,
    }
    const result = await fetchEmplifiReviewsApi('https://emplifi.com/', 'key', params)
    // checks makeEmplifiRequest
    expect(global.fetch).toHaveBeenCalledWith(
      'https://emplifi.com/reviews?filter=emplifi+filter&limit=13&offset=5&sku=123&includeRelated=true&publishedOnly=true&includeRatingOnlyReviews=false&includeFilters=true',
      {
        headers: {
          Authorization: 'Bearer key',
        },
      }
    )
    expect(result).toEqual({
      reviewData: REVIEWS_MOCK,
      reviewFilters: {
        filterBy: 'filter by',
        pagesize: 13,
        search: 'search',
        sortBy: 'sort by',
      },
    })
  })
  it('fetchEmplifiSummaryApi', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => UGC_SUMMARY_MOCK,
      })
    )
    const result = await fetchEmplifiSummaryApi('https://emplifi.com/', 'key', '123')
    // checks makeEmplifiRequest
    expect(global.fetch).toHaveBeenCalledWith('https://emplifi.com/products/ugc_summary?sku=123', {
      headers: {
        Authorization: 'Bearer key',
      },
    })
    expect(result).toEqual(UGC_SUMMARY_MOCK[0])
  })
  it.each([VOTE_TYPE.helpful, VOTE_TYPE.unhelpful])('voteEmplifiReview', async (type) => {
    global.fetch = jest.fn(() =>
      Promise.resolve<any>({
        json: () => ({
          result: 'SUCCESS',
        }),
      })
    )
    const result = await voteEmplifiReview('123', type)
    const path = type === VOTE_TYPE.helpful ? 'voteup' : 'votedown'
    expect(global.fetch).toHaveBeenCalledWith(
      `/api${API_VOTE_EMPLIFI_REVIEW}?type=${path}&reviewId=123`,
      {
        method: 'POST',
      }
    )
    expect(result).toEqual({ result: 'SUCCESS' })
  })
  it('fetchEmplifiReviews with empty sku', async () => {
    global.fetch = jest.fn(() => Promise.resolve<any>({}))
    const result = await fetchEmplifiReviews('', PROPERTIES_MOCK as any)
    expect(result).toEqual({})
  })
})
