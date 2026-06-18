import {
  convertRatingFilterToEmplifiFilterDimension,
  normalizeEmplifiDimension,
  normalizeEmplifiUgcSummary,
  normalizeEmplifiResponse,
} from 'toro/helpers/emplifiNormalizers'
import { PROPERTIES_MOCK, REVIEWS_MOCK, UGC_SUMMARY_MOCK } from 'test-utils/emplifiMocks'

describe('src/toro/helpers/emplifiNormalizers.ts', () => {
  it('normalizeEmplifiUgcSummary', async () => {
    const result = normalizeEmplifiUgcSummary({
      ...UGC_SUMMARY_MOCK[0],
      dimensions: [UGC_SUMMARY_MOCK[0].dimensions[0]],
    })
    expect(result.average_rating).toEqual(3)
    expect(result.review_count).toEqual(115)
    expect(result.rating_histogram).toEqual([22, 23, 23, 24, 23])
    expect(result.rating_count).toEqual(115)
    expect(result.shopperProfiles).toEqual(UGC_SUMMARY_MOCK[0].userSettings.shopperProfiles)
    expect(result.properties).toEqual([
      {
        id: 9,
        key: 'Best Uses',
        values: [
          { code: 'BEST1', count: 1, id: 34, label: 'Work', sortOrder: 0 },
          { code: 'BEST2', count: 1, id: 35, label: 'School', sortOrder: 1 },
          { code: 'BEST3', count: 2, id: 36, label: 'Travel', sortOrder: 2 },
        ],
      },
    ])
    expect(result.ai_review_summary).toEqual(
      'Reviewers praise the quality and style of this product. Many find it comfortable for everyday use.'
    )
  })

  it('normalizeEmplifiUgcSummary returns empty string when aiReviewSummary is missing', async () => {
    const summaryWithoutAi = { ...UGC_SUMMARY_MOCK[0] }
    delete summaryWithoutAi.aiReviewSummary
    const result = normalizeEmplifiUgcSummary(summaryWithoutAi)
    expect(result.ai_review_summary).toEqual('')
  })

  it('normalizeEmplifiUgcSummary returns raw string when aiReviewSummary is not valid JSON', async () => {
    const summaryWithInvalidJson = {
      ...UGC_SUMMARY_MOCK[0],
      aiReviewSummary: 'Plain text summary without JSON wrapper',
    }
    const result = normalizeEmplifiUgcSummary(summaryWithInvalidJson)
    expect(result.ai_review_summary).toEqual('Plain text summary without JSON wrapper')
  })
  it('normalizeEmplifiDimension sizing', async () => {
    const result = normalizeEmplifiDimension(UGC_SUMMARY_MOCK[0].dimensions[3])
    expect(result).toEqual({
      key: 'sizing',
      name: 'Rate Size',
      display_type: 'histogram',
      display_values: ['Runs small', 'Perfect fit', 'Runs large'],
      values: [
        {
          id: 25,
          code: 'FIT',
          sortOrder: 0,
          label: 'Runs small',
          count: 0,
        },
        {
          id: 26,
          code: 'SMALL',
          sortOrder: 1,
          label: 'Perfect fit',
          count: 0,
        },
        {
          id: 27,
          code: 'LARGE',
          sortOrder: 2,
          label: 'Runs large',
          count: 0,
        },
      ],
      id: 6,
    })
  })
  it('normalizeEmplifiDimension width', async () => {
    const result = normalizeEmplifiDimension(UGC_SUMMARY_MOCK[0].dimensions[4])
    expect(result).toEqual({
      key: 'width',
      name: 'Rate Width',
      display_type: 'histogram',
      display_values: ['Runs narrow', 'Perfect fit', 'Runs wide'],
      values: [
        {
          id: 28,
          code: 'WFIT',
          sortOrder: 0,
          label: 'Runs narrow',
          count: 22,
        },
        {
          id: 29,
          code: 'WIDE',
          sortOrder: 1,
          label: 'Perfect fit',
          count: 52,
        },
        {
          id: 30,
          code: 'NAR',
          sortOrder: 2,
          label: 'Runs wide',
          count: 41,
        },
      ],
      id: 7,
    })
  })
  it('normalizeEmplifiResponse', async () => {
    const result = normalizeEmplifiResponse(REVIEWS_MOCK)
    expect(result).toEqual({
      results: [
        {
          rollup: undefined,
          reviews: [
            {
              ugc_id: 12,
              review_id: 12,
              details: {
                comments: 'Test Review 2',
                headline: '',
                nickname: 'Test U.',
                created_date: '2024-05-06T07:28:48-04:00',
                properties: [
                  {
                    key: 'Would you recommend it to a friend?',
                    label: 'Would you recommend it to a friend?',
                    value: ['Yes, I would recommend it.'],
                  },
                  { key: 'Rate Size', label: 'Rate Size', value: ['Runs small'] },
                  { key: 'Rate Width', label: 'Rate Width', value: ['Perfect fit'] },
                  {
                    key: 'Comfort',
                    label: 'Comfort',
                    value: ['Moderately comfortable'],
                  },
                  { key: 'Best Uses', label: 'Best Uses', value: ['Work'] },
                  {
                    key: 'Product Standouts',
                    label: 'Product Standouts',
                    value: ['Comfortable'],
                  },
                ],
                bottom_line: 'Yes, I would recommend it.',
                incentivized: false,
              },
              metrics: { rating: 4, helpful_votes: 0, not_helpful_votes: 0 },
              badges: {},
              media: [],
            },
          ],
        },
      ],
      paging: {
        current_page_number: 1,
        total_results: 13,
        pages_total: 0.26,
        next_page_url: false,
        page_size: 50,
      },
    })
  })
  it('convertRatingFilterToEmplifiFilterDimension', async () => {
    const result = convertRatingFilterToEmplifiFilterDimension(
      PROPERTIES_MOCK as any,
      'Best Uses:Work||School||Travel,rating:3,Product Standouts:Comfortable||Functional'
    )
    expect(result).toEqual('dim(34,35,36,41,43) rating(3)')
  })
})
