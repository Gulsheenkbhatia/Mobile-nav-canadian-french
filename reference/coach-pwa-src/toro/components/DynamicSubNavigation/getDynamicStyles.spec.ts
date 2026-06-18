import {
  getDynamicStyles,
  type DynamicStyleConfigItem,
  type ResolvedDynamicStyles,
} from './getDynamicStyles'
import { ONE_SITE_BRAND_TABS } from 'toro/lib/oneSite/config'

// Input mocks
const mockRetailStyles: DynamicStyleConfigItem = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
  color: '#000001',
}

const mockOutletStyles: DynamicStyleConfigItem = {
  enable: true,
  fontFamily: 'Arial',
  textDecoration: 'none',
  backgroundColor: '#EFEFEF',
  color: '#222222',
}

const mockSubbrandStyles: DynamicStyleConfigItem = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'none',
  backgroundColor: '#F4E3FB',
  color: '#000001',
}

const mockBrandStyles: DynamicStyleConfigItem = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
  color: '#000001',
}

// Expected results
const expectedBrand: ResolvedDynamicStyles = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
  color: '#000001',
}

const expectedRetail: ResolvedDynamicStyles = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
  color: '#000001',
}

const expectedOutlet: ResolvedDynamicStyles = {
  enable: true,
  fontFamily: 'Arial',
  textDecoration: 'none',
  backgroundColor: '#EFEFEF',
  color: '#222222',
}

const expectedSubbrand: ResolvedDynamicStyles = {
  enable: true,
  fontFamily: 'HelveticaNeue73ExtendedBold',
  textDecoration: 'none',
  backgroundColor: '#F4E3FB',
  color: '#000001',
}

const expectedDefault: ResolvedDynamicStyles = {
  enable: false,
  backgroundColor: 'transparent',
  fontFamily: undefined,
  textDecoration: undefined,
  color: undefined,
}

describe('getDynamicStyles', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  describe('Legacy config format (brand/subbrand)', () => {
    const legacyConfig = {
      brand: mockBrandStyles,
      subbrand: mockSubbrandStyles,
    }

    it('should return brand styles when subbrand is not active', () => {
      const result = getDynamicStyles({
        config: legacyConfig,
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result).toEqual(expectedBrand)
    })

    it('should return subbrand styles when subbrand is active', () => {
      const result = getDynamicStyles({
        config: legacyConfig,
        isSubBrandActive: true,
        oneSiteActiveTab: undefined,
      })

      expect(result).toEqual(expectedSubbrand)
    })
  })

  describe('OneSite config format (retail/outlet/subbrand)', () => {
    const oneSiteConfig = {
      retail: mockRetailStyles,
      outlet: mockOutletStyles,
      subbrand: mockSubbrandStyles,
    }

    it('should return retail styles when oneSiteActiveTab is retail', () => {
      const result = getDynamicStyles({
        config: oneSiteConfig,
        isSubBrandActive: false,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.COACH,
      })

      expect(result).toEqual(expectedRetail)
    })

    it('should return outlet styles when oneSiteActiveTab is outlet', () => {
      const result = getDynamicStyles({
        config: oneSiteConfig,
        isSubBrandActive: false,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.OUTLET,
      })

      expect(result).toEqual(expectedOutlet)
    })

    it('should return subbrand styles when subbrand is active (regardless of oneSiteActiveTab)', () => {
      const result = getDynamicStyles({
        config: oneSiteConfig,
        isSubBrandActive: true,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.COACH,
      })

      expect(result).toEqual(expectedSubbrand)
    })

    it('should prioritize subbrand over outlet when subbrand is active', () => {
      const result = getDynamicStyles({
        config: oneSiteConfig,
        isSubBrandActive: true,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.OUTLET,
      })

      expect(result).toEqual(expectedSubbrand)
    })
  })

  describe('Fallback from OneSite to legacy format', () => {
    const mixedConfig = {
      brand: mockBrandStyles,
      subbrand: mockSubbrandStyles,
    }

    it('should fallback to brand when retail key is missing', () => {
      const result = getDynamicStyles({
        config: mixedConfig,
        isSubBrandActive: false,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.COACH,
      })

      expect(result).toEqual(expectedBrand)
    })

    it('should fallback to brand when outlet key is missing', () => {
      const result = getDynamicStyles({
        config: mixedConfig,
        isSubBrandActive: false,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.OUTLET,
      })

      expect(result).toEqual(expectedBrand)
    })
  })

  describe('Invalid config handling', () => {
    it.each([
      ['null', null, 'Received: null'],
      ['undefined', undefined, 'Received: undefined'],
      ['empty object', {}, 'Config is empty'],
    ])('should return defaults and log error for %s config', (_, config, expectedLog) => {
      const result = getDynamicStyles({
        config,
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result).toEqual(expectedDefault)
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining(expectedLog))
    })

    it.each([
      ['string', 'invalid'],
      ['array', [{ brand: mockBrandStyles }]],
      ['number', 42],
    ])('should return defaults and log error for %s config', (_, config) => {
      const result = getDynamicStyles({
        // @ts-expect-error - testing invalid runtime input
        config,
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result).toEqual(expectedDefault)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('Unexpected keys warning', () => {
    it('should log warning for unexpected keys', () => {
      getDynamicStyles({
        // @ts-expect-error - testing unexpected keys at runtime
        config: { katespade: mockBrandStyles },
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('unexpected keys'))
    })

    it('should not log warning for valid keys only', () => {
      getDynamicStyles({
        config: { brand: mockBrandStyles, subbrand: mockSubbrandStyles },
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('Partial config handling', () => {
    it('should use defaults for missing properties', () => {
      const result = getDynamicStyles({
        config: { brand: { color: '#000' } },
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result.enable).toBe(false)
      expect(result.backgroundColor).toBe('transparent')
      expect(result.color).toBe('#000')
    })
  })

  describe('Missing style key handling', () => {
    it('should return defaults when both requested key and brand are missing', () => {
      const result = getDynamicStyles({
        config: { retail: mockRetailStyles },
        isSubBrandActive: false,
        oneSiteActiveTab: ONE_SITE_BRAND_TABS.OUTLET,
      })

      expect(result).toEqual(expectedDefault)
    })

    it('should fallback to brand when subbrand key is missing', () => {
      const result = getDynamicStyles({
        config: { brand: mockBrandStyles },
        isSubBrandActive: true,
        oneSiteActiveTab: undefined,
      })

      expect(result).toEqual(expectedBrand)
    })
  })

  describe('Edge cases', () => {
    it('should handle enable: false correctly', () => {
      const result = getDynamicStyles({
        config: { brand: { enable: false, backgroundColor: '#FFF' } },
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result.enable).toBe(false)
      expect(result.backgroundColor).toBe('#FFF')
    })

    it('should handle empty string values', () => {
      const result = getDynamicStyles({
        config: { brand: { enable: true, backgroundColor: '', color: '' } },
        isSubBrandActive: false,
        oneSiteActiveTab: undefined,
      })

      expect(result.backgroundColor).toBe('')
      expect(result.color).toBe('')
    })
  })
})
