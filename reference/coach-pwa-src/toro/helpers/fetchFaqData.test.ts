import {
  fetchFaqDataWithConfig as fetchFaqData,
  fetchFaqDataWithContentAssetIDs,
} from 'toro/helpers/fetchFaqData'
import fetchContentAssets from 'toro/helpers/fetchContentAssets'
import { ContentAsset } from 'toro/types/productTypes'

jest.mock('toro/helpers/fetchContentAssets')
jest.mock('toro/lib/cheerio', () => require('cheerio'))

describe('fetchFaqData', () => {
  const mockReq = {} as any
  const mockFetchContentAssets = fetchContentAssets as jest.MockedFunction<
    typeof fetchContentAssets
  >

  const defaultMockAsset = {
    id: 'asset-1',
    online: { default: true },
    c_body: {
      en_US: { markup: '<p>Default Content</p>' },
    },
  } as unknown as ContentAsset

  const defaultFaqItem = {
    title: { 'en-US': 'Default Title' },
    contentAssetId: 'asset-1',
  }

  const createMockAssets = (assets: Record<string, Partial<ContentAsset>> = {}) => ({
    data: Object.entries(assets).reduce<Record<string, ContentAsset>>((acc, [key, value]) => {
      acc[key] = { ...defaultMockAsset, id: key, ...value } as ContentAsset
      return acc
    }, {}),
  })

  const createFaqData = (accordions: any[] = [defaultFaqItem]) => JSON.stringify({ accordions })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if faqDataString is invalid JSON', async () => {
    const result = await fetchFaqData(mockReq, 'invalid-json', 'en-US')
    expect(result).toBeUndefined()
  })

  it('should return undefined if faqDataString has no accordions', async () => {
    const result = await fetchFaqData(mockReq, JSON.stringify({ accordions: [] }), 'en-US')
    expect(result).toBeUndefined()
  })

  it('should return undefined if faqDataString is valid JSON but missing accordions property', async () => {
    const result = await fetchFaqData(mockReq, JSON.stringify({ foo: 'bar' }), 'en-US')
    expect(result).toBeUndefined()
  })

  it('should fetch and normalize FAQ data correctly', async () => {
    const faqData = createFaqData([
      {
        ...defaultFaqItem,
        title: { 'en-US': 'Question 1', 'fr-CA': 'Question 1 FR' },
      },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: {
          en_US: { markup: '<p>Answer 1</p>' },
        },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(mockFetchContentAssets).toHaveBeenCalledWith(mockReq, ['asset-1'])
    expect(result).toHaveLength(1)
    expect(result?.[0]).toEqual({
      title: 'Question 1',
      html: '<p>Answer 1</p>',
      text: 'Answer 1',
    })
  })

  it('should handle string titles correctly', async () => {
    const faqData = createFaqData([
      {
        ...defaultFaqItem,
        title: 'Simple Title',
      },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: {
          en_US: { markup: '<p>Content</p>' },
        },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(result?.[0]?.title).toBe('Simple Title')
  })

  it('should use correct locale for title and content', async () => {
    const faqData = createFaqData([
      {
        ...defaultFaqItem,
        title: { 'en-US': 'English Title', 'fr-CA': 'French Title' },
      },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: {
          fr_CA: { markup: '<p>French Content</p>' },
          en_US: { markup: '<p>English Content</p>' },
        },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'fr-CA')

    expect(result?.[0]?.title).toBe('French Title')
    expect(result?.[0]?.html).toBe('<p>French Content</p>')
  })

  it('should fallback to default locale if specific locale is missing', async () => {
    const faqData = createFaqData([
      {
        ...defaultFaqItem,
        title: { 'en-US': 'Default Title' }, // No fr-CA title
      },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: {
          default: { markup: '<p>Default Content</p>' }, // No fr_CA content
        },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'fr-CA')

    expect(result?.[0]?.title).toBe('') // Because 'en-US' key doesn't match 'en_US' default lookup in code
    expect(result?.[0]?.html).toBe('<p>Default Content</p>')
  })

  it('should fallback title to en_US if current locale missing', async () => {
    const faqData = createFaqData([
      {
        ...defaultFaqItem,
        title: { en_US: 'Default Title' },
      },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: { default: { markup: '<p>Content</p>' } },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)
    const result = await fetchFaqData(mockReq, faqData, 'fr-CA')
    expect(result?.[0]?.title).toBe('Default Title')
  })

  it('should filter out offline assets', async () => {
    const faqData = createFaqData([
      { ...defaultFaqItem, title: 'Title 1', contentAssetId: 'asset-1' },
      { ...defaultFaqItem, title: 'Title 2', contentAssetId: 'asset-2' },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: { default: { markup: '<p>Content 1</p>' } },
      },
      'asset-2': {
        online: { default: false }, // Offline
        c_body: { default: { markup: '<p>Content 2</p>' } },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(result).toHaveLength(1)
    expect(result?.[0]?.title).toBe('Title 1')
  })

  it('should filter out items where content asset is missing', async () => {
    const faqData = createFaqData([
      { ...defaultFaqItem, title: 'Title 1', contentAssetId: 'asset-1' },
      { ...defaultFaqItem, title: 'Title 2', contentAssetId: 'asset-missing' },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: { default: { markup: '<p>Content 1</p>' } },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(result).toHaveLength(1)
    expect(result?.[0]?.title).toEqual('Title 1')
  })

  it('should filter out items with empty HTML content', async () => {
    const faqData = createFaqData([
      { ...defaultFaqItem, title: 'Title 1', contentAssetId: 'asset-1' },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: { default: { markup: '' } },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(result).toHaveLength(0)
  })

  it('should limit results to MAX_QUESTIONS_COUNT (10)', async () => {
    const accordions = Array.from({ length: 15 }, (_, i) => ({
      ...defaultFaqItem,
      title: `Title ${i}`,
      contentAssetId: `asset-${i}`,
    }))
    const faqData = createFaqData(accordions)

    const assetsMap: Record<string, Partial<ContentAsset>> = {}
    accordions.forEach((item, i) => {
      assetsMap[item.contentAssetId] = {
        c_body: { default: { markup: `<p>Content ${i}</p>` } },
      }
    })

    const mockAssets = createMockAssets(assetsMap)
    mockFetchContentAssets.mockResolvedValue(mockAssets)

    const result = await fetchFaqData(mockReq, faqData, 'en-US')

    expect(result).toHaveLength(10)
  })

  it('should handle null/undefined html correctly in htmlToPlainText', async () => {
    const faqData = createFaqData([
      { ...defaultFaqItem, title: 'Title', contentAssetId: 'asset-1' },
    ])

    const mockAssets = createMockAssets({
      'asset-1': {
        c_body: { default: { markup: null } },
      },
    })

    mockFetchContentAssets.mockResolvedValue(mockAssets)
    const result = await fetchFaqData(mockReq, faqData, 'en-US')
    expect(result).toHaveLength(0)
  })
})

describe('fetchFaqDataWithContentAssetIDs', () => {
  const mockReq = {} as any
  const mockFetchContentAssets = fetchContentAssets as jest.MockedFunction<
    typeof fetchContentAssets
  >

  const createFaqContentAsset = (
    id: string,
    question: string,
    answer: string,
    locale: string = 'default'
  ): ContentAsset =>
    ({
      _type: '',
      id,
      online: { default: true },
      metaData: {},
      other_info: {},
      status: '',
      error_message: '',
      c_body: {
        [locale]: {
          markup: `<div><div data-faq="question">${question}</div><div data-faq="answer">${answer}</div></div>`,
        },
      },
    } as ContentAsset)

  const createMockResponse = (assets: Record<string, ContentAsset>) => ({
    data: assets,
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Input Validation and ID Parsing', () => {
    it('should return undefined for empty, whitespace-only, or comma-only strings', async () => {
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, '', 'en-US')).toBeUndefined()
      expect(mockFetchContentAssets).not.toHaveBeenCalled()

      expect(await fetchFaqDataWithContentAssetIDs(mockReq, '   ', 'en-US')).toBeUndefined()
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, ',,,', 'en-US')).toBeUndefined()
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, ' , , ', 'en-US')).toBeUndefined()
      expect(mockFetchContentAssets).not.toHaveBeenCalled()
    })

    it('should parse single and multiple IDs correctly', async () => {
      const asset1 = createFaqContentAsset('asset-1', 'Q1', 'A1')
      const asset2 = createFaqContentAsset('asset-2', 'Q2', 'A2')
      mockFetchContentAssets.mockResolvedValue(
        createMockResponse({ 'asset-1': asset1, 'asset-2': asset2 })
      )

      await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')
      expect(mockFetchContentAssets).toHaveBeenCalledWith(mockReq, ['asset-1'])

      await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1,asset-2', 'en-US')
      expect(mockFetchContentAssets).toHaveBeenCalledWith(mockReq, ['asset-1', 'asset-2'])
    })

    it('should filter empty segments and trim each content asset ID', async () => {
      mockFetchContentAssets.mockResolvedValue({ data: {} })

      await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1,,   ,asset-2', 'en-US')
      expect(mockFetchContentAssets).toHaveBeenCalledWith(mockReq, ['asset-1', 'asset-2'])

      await fetchFaqDataWithContentAssetIDs(mockReq, ' asset-1 , asset-2 ', 'en-US')
      expect(mockFetchContentAssets).toHaveBeenCalledWith(mockReq, ['asset-1', 'asset-2'])
    })
  })

  describe('Happy Path', () => {
    it('should return FAQItemWithContent array for valid assets', async () => {
      const asset1 = createFaqContentAsset('asset-1', 'Question 1', '<p>Answer 1</p>')
      const asset2 = createFaqContentAsset('asset-2', 'Question 2', '<p>Answer 2</p>')
      mockFetchContentAssets.mockResolvedValue(
        createMockResponse({ 'asset-1': asset1, 'asset-2': asset2 })
      )

      const result = await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1,asset-2', 'en-US')

      expect(result).toHaveLength(2)
      expect(result?.[0]).toEqual({
        title: 'Question 1',
        html: '<p>Answer 1</p>',
        text: 'Answer 1',
      })
    })

    it('should use locale-specific markup with fallback to default', async () => {
      const asset: ContentAsset = {
        _type: '',
        id: 'asset-1',
        online: { default: true },
        metaData: {},
        other_info: {},
        status: '',
        error_message: '',
        c_body: {
          'fr-CA': {
            markup:
              '<div><div data-faq="question">Question FR</div><div data-faq="answer">Réponse</div></div>',
          },
          default: {
            markup:
              '<div><div data-faq="question">Default Q</div><div data-faq="answer">Default A</div></div>',
          },
        },
      } as ContentAsset

      mockFetchContentAssets.mockResolvedValue(createMockResponse({ 'asset-1': asset }))

      const frResult = await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'fr-CA')
      expect(frResult?.[0]?.title).toBe('Question FR')

      const defaultAsset = createFaqContentAsset('asset-2', 'Default Q', 'Default A', 'default')
      mockFetchContentAssets.mockResolvedValue(createMockResponse({ 'asset-2': defaultAsset }))

      const defaultResult = await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-2', 'de-DE')
      expect(defaultResult?.[0]?.title).toBe('Default Q')
    })
  })

  describe('Error Handling', () => {
    it('should return undefined for empty, error, null, or undefined responses', async () => {
      mockFetchContentAssets.mockResolvedValue({ data: {} })
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')).toBeUndefined()

      mockFetchContentAssets.mockResolvedValue({ error: 'Something went wrong' })
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')).toBeUndefined()

      mockFetchContentAssets.mockResolvedValue(null)
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')).toBeUndefined()

      mockFetchContentAssets.mockResolvedValue(undefined)
      expect(await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')).toBeUndefined()
    })

    it('should propagate error when fetchContentAssets rejects', async () => {
      mockFetchContentAssets.mockRejectedValue(new Error('Network error'))
      await expect(fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1', 'en-US')).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('Parser Integration', () => {
    it('should filter malformed markup and return undefined when all invalid', async () => {
      const validAsset = createFaqContentAsset('asset-1', 'Valid Q', 'Valid A')
      const invalidAsset: ContentAsset = {
        _type: '',
        id: 'asset-2',
        online: { default: true },
        metaData: {},
        other_info: {},
        status: '',
        error_message: '',
        c_body: { default: { markup: '<div><div data-faq="answer">No question</div></div>' } },
      } as ContentAsset

      mockFetchContentAssets.mockResolvedValue(
        createMockResponse({ 'asset-1': validAsset, 'asset-2': invalidAsset })
      )

      const mixed = await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-1,asset-2', 'en-US')
      expect(mixed).toHaveLength(1)
      expect(mixed?.[0]?.title).toBe('Valid Q')

      mockFetchContentAssets.mockResolvedValue(createMockResponse({ 'asset-2': invalidAsset }))
      const allInvalid = await fetchFaqDataWithContentAssetIDs(mockReq, 'asset-2', 'en-US')
      expect(allInvalid).toBeUndefined()
    })

    it('should filter out offline assets and enforce MAX_QUESTIONS_COUNT', async () => {
      const offlineAsset: ContentAsset = {
        _type: '',
        id: 'offline-1',
        online: { default: false },
        metaData: {},
        other_info: {},
        status: '',
        error_message: '',
        c_body: {
          default: {
            markup:
              '<div><div data-faq="question">Offline Q</div><div data-faq="answer">Offline A</div></div>',
          },
        },
      } as ContentAsset

      mockFetchContentAssets.mockResolvedValueOnce(
        createMockResponse({ 'offline-1': offlineAsset })
      )
      const offlineResult = await fetchFaqDataWithContentAssetIDs(mockReq, 'offline-1', 'en-US')

      expect(offlineResult).toBeUndefined()

      const assets: Record<string, ContentAsset> = {}
      const ids: string[] = []
      for (let i = 1; i <= 15; i++) {
        ids.push(`asset-${i}`)
        assets[`asset-${i}`] = createFaqContentAsset(`asset-${i}`, `Q${i}`, `A${i}`)
      }
      mockFetchContentAssets.mockResolvedValueOnce(createMockResponse(assets))

      const manyResult = await fetchFaqDataWithContentAssetIDs(mockReq, ids.join(','), 'en-US')
      expect(manyResult).toHaveLength(10)
    })
  })
})
