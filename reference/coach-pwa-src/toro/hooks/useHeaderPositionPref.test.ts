import { PageTypeFlags } from 'toro/types'
import {
  getHeaderTypeFromPreferences,
  HeaderType,
  StickyOrSlidingHeaderPref,
} from './useHeaderPositionPref'

const createPageType = (overrides: Partial<PageTypeFlags> = {}): PageTypeFlags => ({
  isHP: false,
  isPLP: false,
  isPDP: false,
  isSRP: false,
  isContentPage: false,
  isProductPassport: false,
  isRetailHP: false,
  isSubHP: false,
  isOutletHP: false,
  ...overrides,
})

describe('getHeaderTypeFromPreferences', () => {
  describe('when preference is a string', () => {
    it('should return lowercased string preference', () => {
      const result = getHeaderTypeFromPreferences('Sticky Header', '', createPageType())

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should return transparent sticky header when preference matches', () => {
      const result = getHeaderTypeFromPreferences('Transparent Sticky Header', '', createPageType())

      expect(result).toBe(HeaderType.TRANSPARENT_STICKY)
    })
  })

  describe('when preference is an object', () => {
    it('should return PLP value when on PLP page', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        PLP: 'Sliding Header With Nav Anchoring',
        PDP: 'Transparent Sticky Header',
      }

      const result = getHeaderTypeFromPreferences(preference, '', createPageType({ isPLP: true }))

      expect(result).toBe(HeaderType.SLIDING_NAV)
    })

    it('should return PLP value when on SRP page', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        PLP: 'Sliding Header With Carousel Anchoring',
      }

      const result = getHeaderTypeFromPreferences(preference, '', createPageType({ isSRP: true }))

      expect(result).toBe(HeaderType.SLIDING_CAROUSEL)
    })

    it('should return PDP value when on PDP page', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        PDP: 'Transparent Sticky Header',
      }

      const result = getHeaderTypeFromPreferences(preference, '', createPageType({ isPDP: true }))

      expect(result).toBe(HeaderType.TRANSPARENT_STICKY)
    })

    it('should return HP value when on home page', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        PLP: 'Sliding Header With Nav Anchoring',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should fallback to HP value when specific page type key is missing', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
      }

      const result = getHeaderTypeFromPreferences(preference, '', createPageType({ isPDP: true }))

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should return STATIC when object has no matching keys', () => {
      const preference: StickyOrSlidingHeaderPref = {}

      const result = getHeaderTypeFromPreferences(preference, '', createPageType({ isPDP: true }))

      expect(result).toBe(HeaderType.STATIC)
    })
  })

  describe('when using legacy preference as fallback', () => {
    it('should use legacyPreference when preference is empty string', () => {
      const result = getHeaderTypeFromPreferences('', 'Sticky Header', createPageType())

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should use legacyPreference object when preference is falsy', () => {
      const legacyPreference: StickyOrSlidingHeaderPref = {
        HP: 'Transparent Sticky Header',
        PLP: 'Sliding Header With Nav Anchoring',
      }

      const result = getHeaderTypeFromPreferences(
        '',
        legacyPreference,
        createPageType({ isPLP: true })
      )

      expect(result).toBe(HeaderType.SLIDING_NAV)
    })
  })

  describe('when both preferences are falsy', () => {
    it('should return STATIC when both preferences are empty strings', () => {
      const result = getHeaderTypeFromPreferences('', '', createPageType())

      expect(result).toBe(HeaderType.STATIC)
    })
  })

  describe('TRANSPARENT_SLIDING header type', () => {
    it('should resolve transparent sliding header from string preference', () => {
      const result = getHeaderTypeFromPreferences(
        'Transparent Sliding Header',
        '',
        createPageType()
      )

      expect(result).toBe(HeaderType.TRANSPARENT_SLIDING)
    })
  })

  describe('brand-prefixed HP keys resolved via page type', () => {
    const brandPrefixedPreference: StickyOrSlidingHeaderPref = {
      retailHP: 'Sticky Header',
      outletHP: 'Transparent Sliding Header',
      coachtopiaHP: 'Sliding Header With Nav Anchoring',
      PLP: 'Sliding Header With Nav Anchoring',
      PDP: 'Transparent Sticky Header',
    }

    it('should resolve retailHP on retail homepage', () => {
      const result = getHeaderTypeFromPreferences(
        brandPrefixedPreference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should resolve outletHP on outlet homepage', () => {
      const result = getHeaderTypeFromPreferences(
        brandPrefixedPreference,
        '',
        createPageType({ isHP: true, isOutletHP: true })
      )

      expect(result).toBe(HeaderType.TRANSPARENT_SLIDING)
    })

    it('should resolve coachtopiaHP on coachtopia homepage', () => {
      const result = getHeaderTypeFromPreferences(
        brandPrefixedPreference,
        '',
        createPageType({ isHP: true, isSubHP: true })
      )

      expect(result).toBe(HeaderType.SLIDING_NAV)
    })

    it('should fall back to HP key when brand-prefixed key is missing for retail', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        outletHP: 'Transparent Sliding Header',
        PLP: 'Sliding Header With Nav Anchoring',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.STICKY)
    })

    it('should fall back to HP key when brand-prefixed key is missing for outlet', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sliding Header With Nav Anchoring',
        retailHP: 'Sticky Header',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isOutletHP: true })
      )

      expect(result).toBe(HeaderType.SLIDING_NAV)
    })

    it('should return STATIC when brand-prefixed key and HP key are both missing', () => {
      const preference: StickyOrSlidingHeaderPref = {
        outletHP: 'Transparent Sliding Header',
        PLP: 'Sliding Header With Nav Anchoring',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.STATIC)
    })

    it('should resolve PLP key on PLP page regardless of brand-prefixed HP keys', () => {
      const result = getHeaderTypeFromPreferences(
        brandPrefixedPreference,
        '',
        createPageType({ isPLP: true })
      )

      expect(result).toBe(HeaderType.SLIDING_NAV)
    })

    it('should resolve PDP key on PDP page regardless of brand-prefixed HP keys', () => {
      const result = getHeaderTypeFromPreferences(
        brandPrefixedPreference,
        '',
        createPageType({ isPDP: true })
      )

      expect(result).toBe(HeaderType.TRANSPARENT_STICKY)
    })

    it('should use retailHP when isRetailHP is true but neither isOutletHP nor isSubHP', () => {
      const preference: StickyOrSlidingHeaderPref = {
        retailHP: 'Transparent Sliding Header',
        outletHP: 'Sticky Header',
        coachtopiaHP: 'Sticky Header',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.TRANSPARENT_SLIDING)
    })
  })

  describe('non-One-Site environments with only HP key', () => {
    it('should resolve HP key on homepage when no brand-prefixed keys exist', () => {
      const preference: StickyOrSlidingHeaderPref = {
        HP: 'Sticky Header',
        PLP: 'Sliding Header With Nav Anchoring',
      }

      const result = getHeaderTypeFromPreferences(
        preference,
        '',
        createPageType({ isHP: true, isRetailHP: true })
      )

      expect(result).toBe(HeaderType.STICKY)
    })
  })
})
