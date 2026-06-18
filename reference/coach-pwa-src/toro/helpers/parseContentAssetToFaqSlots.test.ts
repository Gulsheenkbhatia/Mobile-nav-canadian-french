import { ContentAsset } from 'toro/types/productTypes'
import parseContentAssetsToFaqSlots from 'toro/helpers/parseContentAssetsToFaqSlots'

jest.mock('toro/lib/cheerio', () => require('cheerio'))

export function createContentAssetWithMarkup(markup: string): ContentAsset {
  return {
    _type: '',
    id: '',
    online: { default: true },
    metaData: {},
    other_info: {},
    status: '',
    error_message: '',
    c_body: {
      default: {
        markup,
      },
    },
  } as ContentAsset
}

function createContentAssetWithLocaleMarkup(localeMarkup: Record<string, string>): ContentAsset {
  const c_body: Record<string, { markup: string }> = {}
  Object.entries(localeMarkup).forEach(([locale, markup]) => {
    c_body[locale] = { markup }
  })
  return {
    _type: '',
    id: '',
    online: { default: true },
    metaData: {},
    other_info: {},
    status: '',
    error_message: '',
    c_body,
  } as ContentAsset
}

export const mockContentAssets: ContentAsset[] = [
  createContentAssetWithMarkup(
    '<div><div data-faq="question">Question 1</div><div data-faq="answer">Answer 1</div></div>'
  ),
  createContentAssetWithMarkup(
    '<div><div data-faq="question">Question 2</div><div data-faq="answer">Answer 2</div></div>'
  ),
  createContentAssetWithMarkup(
    '<div><div data-faq="question">Question 3</div><div data-faq="answer">Answer 3</div></div>'
  ),
  createContentAssetWithMarkup(
    '<div><div data-faq="question">Question 4</div><div data-faq="answer">Answer 4</div></div>'
  ),
  createContentAssetWithMarkup(
    '<div><div data-faq="question">Question 5</div><div data-faq="answer">Answer 5</div></div>'
  ),
]

describe('parseContentAssetsToFaqSlots', () => {
  describe('Happy Path', () => {
    it('should return FAQItemWithContent array with correct title, html, and text', () => {
      const assets = [
        createContentAssetWithMarkup(
          '<div><div data-faq="question">What is this?</div><div data-faq="answer"><p>This is the answer</p></div></div>'
        ),
      ]

      const result = parseContentAssetsToFaqSlots(assets, 'en-US')

      expect(result).toHaveLength(1)
      expect(result?.[0]).toEqual({
        title: 'What is this?',
        html: '<p>This is the answer</p>',
        text: 'This is the answer',
      })
    })

    it('should return multiple items in order and parse mockContentAssets correctly', () => {
      const result = parseContentAssetsToFaqSlots(mockContentAssets, 'default')

      expect(result).toHaveLength(5)
      result?.forEach((item, index) => {
        expect(item.title).toBe(`Question ${index + 1}`)
        expect(item.text).toBe(`Answer ${index + 1}`)
      })
    })
  })

  describe('Locale Handling', () => {
    it('should use locale-specific markup when available, fallback to default otherwise', () => {
      const assetWithLocale = createContentAssetWithLocaleMarkup({
        'fr-CA':
          '<div><div data-faq="question">Question FR</div><div data-faq="answer">Réponse FR</div></div>',
        default:
          '<div><div data-faq="question">Default Q</div><div data-faq="answer">Default A</div></div>',
      })
      const assetDefaultOnly = createContentAssetWithLocaleMarkup({
        default:
          '<div><div data-faq="question">Default Only</div><div data-faq="answer">Default A</div></div>',
      })

      const resultFr = parseContentAssetsToFaqSlots([assetWithLocale], 'fr-CA')
      expect(resultFr?.[0]?.title).toBe('Question FR')

      const resultMissing = parseContentAssetsToFaqSlots([assetDefaultOnly], 'de-DE')
      expect(resultMissing?.[0]?.title).toBe('Default Only')
    })
  })

  describe('Empty/Missing Data', () => {
    it('should return undefined for empty array', () => {
      expect(parseContentAssetsToFaqSlots([], 'en-US')).toBeUndefined()
    })

    it('should return undefined when markup is missing, empty, or null', () => {
      const missingBody = { _type: '', id: '', online: { default: true } } as ContentAsset
      const emptyMarkup = createContentAssetWithMarkup('')
      const nullMarkup = createContentAssetWithMarkup(null as unknown as string)
      const emptyLocales = createContentAssetWithLocaleMarkup({})

      expect(parseContentAssetsToFaqSlots([missingBody], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([emptyMarkup], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([nullMarkup], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([emptyLocales], 'en-US')).toBeUndefined()
    })
  })

  describe('Malformed HTML Markup', () => {
    it('should filter out assets with missing or empty question/answer selectors', () => {
      const noQuestion = createContentAssetWithMarkup(
        '<div><div data-faq="answer">Answer only</div></div>'
      )
      const noAnswer = createContentAssetWithMarkup(
        '<div><div data-faq="question">Question only</div></div>'
      )
      const emptyQuestion = createContentAssetWithMarkup(
        '<div><div data-faq="question">   </div><div data-faq="answer">Answer</div></div>'
      )
      const emptyAnswer = createContentAssetWithMarkup(
        '<div><div data-faq="question">Question</div><div data-faq="answer"></div></div>'
      )
      const noSelectors = createContentAssetWithMarkup('<div><p>Random content</p></div>')

      expect(parseContentAssetsToFaqSlots([noQuestion], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([noAnswer], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([emptyQuestion], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([emptyAnswer], 'en-US')).toBeUndefined()
      expect(parseContentAssetsToFaqSlots([noSelectors], 'en-US')).toBeUndefined()
    })

    it('should handle malformed HTML gracefully and whitespace-only answer as truthy', () => {
      const malformed = createContentAssetWithMarkup(
        '<div><div data-faq="question">Malformed<div data-faq="answer">Answer</div>'
      )
      const whitespaceAnswer = createContentAssetWithMarkup(
        '<div><div data-faq="question">Question</div><div data-faq="answer">   </div></div>'
      )

      expect(parseContentAssetsToFaqSlots([malformed], 'en-US')).toBeDefined()

      const wsResult = parseContentAssetsToFaqSlots([whitespaceAnswer], 'en-US')
      expect(wsResult).toHaveLength(1)
      expect(wsResult?.[0]?.text).toBe('')
    })
  })

  describe('Mixed Valid/Invalid Assets', () => {
    it('should return only valid items preserving order, undefined when all invalid', () => {
      const valid1 = createContentAssetWithMarkup(
        '<div><div data-faq="question">First</div><div data-faq="answer">A1</div></div>'
      )
      const invalid = createContentAssetWithMarkup('<div>Invalid</div>')
      const valid2 = createContentAssetWithMarkup(
        '<div><div data-faq="question">Second</div><div data-faq="answer">A2</div></div>'
      )

      const mixed = parseContentAssetsToFaqSlots([valid1, invalid, valid2], 'en-US')
      expect(mixed).toHaveLength(2)
      expect(mixed?.[0]?.title).toBe('First')
      expect(mixed?.[1]?.title).toBe('Second')

      const allInvalid = parseContentAssetsToFaqSlots(
        [invalid, createContentAssetWithMarkup('')],
        'en-US'
      )
      expect(allInvalid).toBeUndefined()
    })
  })

  describe('HTML Content Integrity', () => {
    it('should strip tags for text, preserve HTML, and trim whitespace', () => {
      const asset = createContentAssetWithMarkup(
        '<div><div data-faq="question">  Padded Q  </div><div data-faq="answer"><p>Para <strong>bold</strong></p></div></div>'
      )

      const result = parseContentAssetsToFaqSlots([asset], 'en-US')

      expect(result?.[0]?.title).toBe('Padded Q')
      expect(result?.[0]?.html).toBe('<p>Para <strong>bold</strong></p>')
      expect(result?.[0]?.text).toBe('Para bold')
    })

    it('should handle nested HTML and special characters correctly', () => {
      const nested = createContentAssetWithMarkup(
        '<div><div data-faq="question">Q</div><div data-faq="answer"><ul><li>Item 1</li><li>Item 2</li></ul></div></div>'
      )
      const special = createContentAssetWithMarkup(
        '<div><div data-faq="question">What\'s the price?</div><div data-faq="answer">&lt;$100 &amp; free</div></div>'
      )

      const nestedResult = parseContentAssetsToFaqSlots([nested], 'en-US')
      expect(nestedResult?.[0]?.html).toBe('<ul><li>Item 1</li><li>Item 2</li></ul>')
      expect(nestedResult?.[0]?.text).toBe('Item 1Item 2')

      const specialResult = parseContentAssetsToFaqSlots([special], 'en-US')
      expect(specialResult?.[0]?.title).toBe("What's the price?")
      expect(specialResult?.[0]?.text).toBe('<$100 & free')
    })
  })
})
