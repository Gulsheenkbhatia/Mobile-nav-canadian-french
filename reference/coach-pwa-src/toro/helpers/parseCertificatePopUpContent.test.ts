import parseCertificatePopUpContent from './parseCertificatePopUpContent'
import { FetchedContentAsset } from 'toro/types/contentAsset'

jest.mock('toro/lib/cheerio', () => require('cheerio'))

const mockHtml = `
  <h2>Certificate Title</h2>
  <picture data-iesrc="https://example.com/image.jpg"></picture>
  <p class="at-body-text">This is the body text</p>
  <a href="#">Learn More</a>
`

const mockHtmlMinimal = `
  <h2>Minimal Title</h2>
  <picture data-iesrc="https://example.com/minimal.jpg"></picture>
  <p class="at-body-text">Minimal body</p>
  <a href="#">Click</a>
`

function createMockContent(
  onlineConfig: Record<string, boolean>,
  bodyConfig: Record<string, { markup: string }>
): FetchedContentAsset {
  return {
    online: onlineConfig,
    c_body: bodyConfig,
  } as FetchedContentAsset
}

describe('parseCertificatePopUpContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Null/Undefined Content', () => {
    it('should return null when content is null', () => {
      const result = parseCertificatePopUpContent(null, 'en-US')

      expect(result).toBeNull()
    })

    it('should return null when content is undefined', () => {
      const result = parseCertificatePopUpContent(undefined, 'en-US')

      expect(result).toBeNull()
    })
  })

  describe('Online Status Checks', () => {
    it('should return null when isOnline is false for all locale variants', () => {
      const content = createMockContent(
        { 'en-US': false, en_US: false, default: false },
        { 'en-US': { markup: mockHtml } }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeNull()
    })

    it('should check exact locale match first (en-US)', () => {
      const content = createMockContent(
        { 'en-US': true, en_US: false, default: false },
        { 'en-US': { markup: mockHtml } }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).not.toBeNull()
      expect(result?.enabled).toBe(true)
    })

    it('should check underscore locale format (en_US) as fallback', () => {
      const content = createMockContent({ en_US: true }, { en_US: { markup: mockHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).not.toBeNull()
      expect(result?.enabled).toBe(true)
    })

    it('should check default locale as final fallback', () => {
      const content = createMockContent({ default: true }, { default: { markup: mockHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).not.toBeNull()
      expect(result?.enabled).toBe(true)
    })

    it('should return null when online is missing for locale and default', () => {
      const content = createMockContent({ 'fr-FR': true }, { 'en-US': { markup: mockHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeNull()
    })
  })

  describe('HTML Content Checks', () => {
    it('should return null when html markup is missing for all locale variants', () => {
      const content = createMockContent({ 'en-US': true }, {})

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeNull()
    })

    it('should use exact locale markup first', () => {
      const content = createMockContent(
        { 'en-US': true },
        {
          'en-US': {
            markup:
              '<h2>Exact Locale</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
          en_US: {
            markup:
              '<h2>Underscore Locale</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
          default: {
            markup:
              '<h2>Default</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
        }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('Exact Locale')
    })

    it('should use underscore locale markup as fallback', () => {
      const content = createMockContent(
        { en_US: true },
        {
          en_US: {
            markup:
              '<h2>Underscore Locale</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
          default: {
            markup:
              '<h2>Default</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
        }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('Underscore Locale')
    })

    it('should use default markup as final fallback', () => {
      const content = createMockContent(
        { default: true },
        {
          default: {
            markup:
              '<h2>Default Title</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
        }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('Default Title')
    })

    it('should return null when online is true but html is missing', () => {
      const content = createMockContent({ 'en-US': true }, { 'fr-FR': { markup: mockHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeNull()
    })
  })

  describe('HTML Parsing', () => {
    const validContent = createMockContent({ 'en-US': true }, { 'en-US': { markup: mockHtml } })

    it('should extract title from h2 element', () => {
      const result = parseCertificatePopUpContent(validContent, 'en-US')

      expect(result?.title).toBe('Certificate Title')
    })

    it('should extract image src from picture data-iesrc attribute', () => {
      const result = parseCertificatePopUpContent(validContent, 'en-US')

      expect(result?.image).toBe('https://example.com/image.jpg')
    })

    it('should extract body text from p.at-body-text element', () => {
      const result = parseCertificatePopUpContent(validContent, 'en-US')

      expect(result?.body).toBe('This is the body text')
    })

    it('should extract button text from a element', () => {
      const result = parseCertificatePopUpContent(validContent, 'en-US')

      expect(result?.button).toBe('Learn More')
    })

    it('should return enabled: true when content is valid', () => {
      const result = parseCertificatePopUpContent(validContent, 'en-US')

      expect(result?.enabled).toBe(true)
    })

    it('should handle empty HTML elements gracefully', () => {
      const emptyHtml = `
        <h2></h2>
        <picture></picture>
        <p class="at-body-text"></p>
        <a></a>
      `
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: emptyHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toEqual({
        enabled: true,
        title: '',
        image: undefined,
        body: '',
        button: '',
      })
    })

    it('should handle missing HTML elements gracefully', () => {
      const minimalHtml = '<div>No expected elements</div>'
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: minimalHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toEqual({
        enabled: true,
        title: '',
        image: undefined,
        body: '',
        button: '',
      })
    })

    it('should extract only text content, stripping nested HTML', () => {
      const nestedHtml = `
        <h2><span>Nested</span> Title</h2>
        <picture data-iesrc="img.jpg"></picture>
        <p class="at-body-text">Body with <strong>bold</strong> and <em>italic</em></p>
        <a href="#">Click <span>Here</span></a>
      `
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: nestedHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('Nested Title')
      expect(result?.body).toBe('Body with bold and italic')
      expect(result?.button).toBe('Click Here')
    })

    it('should handle special characters in content', () => {
      const specialHtml = `
        <h2>What&apos;s New?</h2>
        <picture data-iesrc="img.jpg?param=1&amp;other=2"></picture>
        <p class="at-body-text">Price &lt; $100 &amp; free shipping</p>
        <a href="#">Learn &gt; More</a>
      `
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: specialHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe("What's New?")
      expect(result?.image).toBe('img.jpg?param=1&other=2')
      expect(result?.body).toBe('Price < $100 & free shipping')
      expect(result?.button).toBe('Learn > More')
    })

    it('should handle whitespace-only content', () => {
      const whitespaceHtml = `
        <h2>   </h2>
        <picture data-iesrc="   "></picture>
        <p class="at-body-text">   </p>
        <a>   </a>
      `
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: whitespaceHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('   ')
      expect(result?.image).toBe('   ')
      expect(result?.body).toBe('   ')
      expect(result?.button).toBe('   ')
    })

    it('should extract first matching element when multiple exist', () => {
      const multipleElementsHtml = `
        <h2>First Title</h2>
        <h2>Second Title</h2>
        <picture data-iesrc="first.jpg"></picture>
        <picture data-iesrc="second.jpg"></picture>
        <p class="at-body-text">First paragraph</p>
        <p class="at-body-text">Second paragraph</p>
        <a>First link</a>
        <a>Second link</a>
      `
      const content = createMockContent(
        { 'en-US': true },
        { 'en-US': { markup: multipleElementsHtml } }
      )

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result?.title).toBe('First TitleSecond Title')
      expect(result?.image).toBe('first.jpg')
      expect(result?.body).toBe('First paragraphSecond paragraph')
      expect(result?.button).toBe('First linkSecond link')
    })
  })

  describe('Locale Format Variations', () => {
    it('should handle locale with underscore in original format (fr_CA)', () => {
      const content = createMockContent({ fr_CA: true }, { fr_CA: { markup: mockHtmlMinimal } })

      const result = parseCertificatePopUpContent(content, 'fr_CA')

      expect(result).not.toBeNull()
      expect(result?.title).toBe('Minimal Title')
    })

    it('should handle locale with hyphen converting to underscore (fr-CA -> fr_CA)', () => {
      const content = createMockContent({ fr_CA: true }, { fr_CA: { markup: mockHtmlMinimal } })

      const result = parseCertificatePopUpContent(content, 'fr-CA')

      expect(result).not.toBeNull()
    })

    it('should prioritize exact match over converted format', () => {
      const content = createMockContent(
        { 'fr-CA': true, fr_CA: false },
        {
          'fr-CA': {
            markup:
              '<h2>Hyphen Locale</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
          fr_CA: {
            markup:
              '<h2>Underscore Locale</h2><picture data-iesrc="img.jpg"></picture><p class="at-body-text">Body</p><a>Link</a>',
          },
        }
      )

      const result = parseCertificatePopUpContent(content, 'fr-CA')

      expect(result?.title).toBe('Hyphen Locale')
    })
  })

  describe('Edge Cases', () => {
    it('should return null when content has no online flags or body markup for locale', () => {
      const result = parseCertificatePopUpContent(
        { online: {}, c_body: {} } as FetchedContentAsset,
        'en-US'
      )

      expect(result).toBeNull()
    })

    it('should return null when markup exists but online is false for locale', () => {
      const content = createMockContent({ 'en-US': false }, { 'en-US': { markup: mockHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeNull()
    })

    it('should handle malformed HTML gracefully', () => {
      const malformedHtml = '<h2>Unclosed<picture data-iesrc="img.jpg"><p>Body<a>Link'
      const content = createMockContent({ 'en-US': true }, { 'en-US': { markup: malformedHtml } })

      const result = parseCertificatePopUpContent(content, 'en-US')

      expect(result).toBeDefined()
      expect(result?.enabled).toBe(true)
    })

    it('should handle empty string locale', () => {
      const content = createMockContent(
        { '': true, default: true },
        { '': { markup: mockHtml }, default: { markup: mockHtmlMinimal } }
      )

      const result = parseCertificatePopUpContent(content, '')

      expect(result).not.toBeNull()
    })
  })
})
