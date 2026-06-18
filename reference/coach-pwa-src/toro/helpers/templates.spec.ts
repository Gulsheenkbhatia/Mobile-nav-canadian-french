import {
  getPdpTemplateEligibility,
  getPdpTemplateMobile,
  getPdpTemplateDesktop,
  getPdpTemplates,
} from './templates'
import { isPlpV3PrefEnabled } from './plpTemplate'
import { TemplateName } from 'toro/constants/templates'
import { EXPERIMENTS } from 'toro/constants/experiments'
import isExperimentEnabled from 'toro/helpers/isExperimentEnabled'

// Mock the dependencies
jest.mock('toro/helpers/isExperimentEnabled')

const mockIsExperimentEnabled = jest.mocked(isExperimentEnabled)

describe('toro/helpers/templates.ts', () => {
  describe('getPdpTemplateEligibility()', () => {
    const pdpv7Preferences = {
      templateConfigs: {
        pdpv7: { enabled: true, eligibleCategories: ['bags', 'handbags'] },
      },
    }

    it('returns false when classification is empty or whitespace-only', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: '' },
          },
          pdpv7Preferences,
          TemplateName.pdpv7
        )
      ).toBe(false)

      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: '   \t' },
          },
          pdpv7Preferences,
          TemplateName.pdpv7
        )
      ).toBe(false)
    })

    it('returns false when classification is not a string', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: 123 },
          },
          pdpv7Preferences,
          TemplateName.pdpv7
        )
      ).toBe(false)
    })

    it('ignores non-string eligibleCategories entries without throwing', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: 'bags' },
          },
          {
            templateConfigs: {
              pdpv7: {
                enabled: true,
                eligibleCategories: ['bags', null, undefined, 1, {}, ''] as unknown as string[],
              },
            },
          },
          TemplateName.pdpv7
        )
      ).toBe(true)
    })

    it('returns false when every eligible category is empty after sanitization', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: 'bags' },
          },
          {
            templateConfigs: {
              pdpv7: { enabled: true, eligibleCategories: ['', '  ', null] as unknown as string[] },
            },
          },
          TemplateName.pdpv7
        )
      ).toBe(false)
    })

    it('returns true when sanitized classification matches substring rules', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: '  Bags ' },
          },
          pdpv7Preferences,
          TemplateName.pdpv7
        )
      ).toBe(true)
    })

    it('returns false when productData is null or undefined', () => {
      expect(getPdpTemplateEligibility(null, pdpv7Preferences, TemplateName.pdpv7)).toBe(false)
      expect(getPdpTemplateEligibility(undefined, pdpv7Preferences, TemplateName.pdpv7)).toBe(false)
    })

    it('returns false when eligibleCategories is not an array', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: true, c_classification: 'bags' },
          },
          {
            templateConfigs: {
              pdpv7: {
                enabled: true,
                eligibleCategories: 'bags' as unknown as string[],
              },
            },
          },
          TemplateName.pdpv7
        )
      ).toBe(false)
    })

    it('returns false when pdpv7 product flag is false even if classification matches', () => {
      expect(
        getPdpTemplateEligibility(
          {
            custom: { c_enablePdp7Template: false, c_classification: 'bags' },
          },
          {
            templateConfigs: { pdpv7: { enabled: true, eligibleCategories: ['bags'] } },
          },
          TemplateName.pdpv7
        )
      ).toBe(false)
    })

    it('does not require c_enablePdp7Template when templateName is not pdpv7', () => {
      expect(
        getPdpTemplateEligibility(
          { custom: { c_classification: 'bags' } },
          {
            templateConfigs: {
              otherPdp: { enabled: true, eligibleCategories: ['bags'] },
            },
          },
          'otherPdp'
        )
      ).toBe(true)
    })

    it('returns true when eligible category contains classification as substring (handbags / bags)', () => {
      expect(
        getPdpTemplateEligibility(
          { custom: { c_enablePdp7Template: true, c_classification: 'bags' } },
          {
            templateConfigs: { pdpv7: { enabled: true, eligibleCategories: ['handbags'] } },
          },
          TemplateName.pdpv7
        )
      ).toBe(true)
    })

    it('returns true when classification contains eligible category as substring (Other Shoes / shoes)', () => {
      expect(
        getPdpTemplateEligibility(
          { custom: { c_enablePdp7Template: true, c_classification: 'Other Shoes' } },
          {
            templateConfigs: {
              pdpv7: { enabled: true, eligibleCategories: ['shoes', 'handbags'] },
            },
          },
          TemplateName.pdpv7
        )
      ).toBe(true)
    })
  })

  describe('isPlpV3PrefEnabled()', () => {
    it('should return true when plpTemplate contains "PLPV3"', () => {
      expect(isPlpV3PrefEnabled('PLPV3')).toBe(true)
      expect(isPlpV3PrefEnabled('some-PLPV3-template')).toBe(true)
    })

    it('should return false when plpTemplate does not contain "PLPV3"', () => {
      expect(isPlpV3PrefEnabled('PLPV2')).toBe(false)
      expect(isPlpV3PrefEnabled('')).toBe(false)
    })

    it('should return undefined when plpTemplate is null or undefined', () => {
      expect(isPlpV3PrefEnabled(undefined)).toBe(undefined)
      expect(isPlpV3PrefEnabled(null)).toBe(undefined)
    })
  })

  describe('getPdpTemplateMobile()', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should return pdpv6 when not bundle and experiment enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplateMobile({
        req,
        isBundleProduct: false,
        productData: {},
      })

      expect(result).toBe(TemplateName.pdpv6)
    })

    it('should return default when product is a bundle', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplateMobile({
        req,
        isBundleProduct: true,
        productData: {},
      })

      expect(result).toBe(TemplateName.default)
    })

    it('should return default when experiment is disabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(false)

      const result = getPdpTemplateMobile({
        req,
        isBundleProduct: false,
        productData: {},
      })

      expect(result).toBe(TemplateName.default)
    })
  })

  describe('getPdpTemplateDesktop()', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should return pdpv5_1 when experiment enabled and product eligible', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockImplementation((req, exp) => {
        return exp === EXPERIMENTS.PDP_V5_1
      })

      const result = getPdpTemplateDesktop({
        req,
        productData: { isPdpV5Applicable: true },
      })

      expect(result).toBe(TemplateName.pdpv5_1)
      expect(mockIsExperimentEnabled).toHaveBeenCalledWith(req, EXPERIMENTS.PDP_V5_1)
    })

    it('should return pdpv5_0 when only V5 experiment enabled and product eligible', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockImplementation((req, exp) => {
        return exp === EXPERIMENTS.PDP_V5
      })

      const result = getPdpTemplateDesktop({
        req,
        productData: { isPdpV5Applicable: true },
      })

      expect(result).toBe(TemplateName.pdpv5_0)
    })

    it('should return V5.1 over V5.0 when both experiments enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplateDesktop({
        req,
        productData: { isPdpV5Applicable: true },
      })

      expect(result).toBe(TemplateName.pdpv5_1)
    })

    it('should return default when product not eligible', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplateDesktop({
        req,
        productData: { isPdpV5Applicable: false },
      })

      expect(result).toBe(TemplateName.default)
    })

    it('should return default when productData is missing or undefined', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      expect(
        getPdpTemplateDesktop({
          req,
          productData: {},
        })
      ).toBe(TemplateName.default)

      expect(
        getPdpTemplateDesktop({
          req,
          productData: undefined,
        })
      ).toBe(TemplateName.default)
    })

    it('should return default when no experiments enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(false)

      const result = getPdpTemplateDesktop({
        req,
        productData: { isPdpV5Applicable: true },
      })

      expect(result).toBe(TemplateName.default)
    })
  })

  describe('getPdpTemplates()', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should return both mobile and desktop templates when conditions met', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplates({
        req,
        productData: { isPdpV5Applicable: true },
        isBundleProduct: false,
      })

      expect(result).toEqual({
        mobile: TemplateName.pdpv6,
        desktop: TemplateName.pdpv5_1,
      })
    })

    it('should return default for mobile when bundle product', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplates({
        req,
        productData: { isPdpV5Applicable: true },
        isBundleProduct: true,
      })

      expect(result).toEqual({
        mobile: TemplateName.default,
        desktop: TemplateName.pdpv5_1,
      })
    })

    it('should return default when no experiments enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(false)

      const result = getPdpTemplates({
        req,
        productData: { isPdpV5Applicable: true },
        isBundleProduct: false,
      })

      expect(result).toEqual({
        mobile: TemplateName.default,
        desktop: TemplateName.default,
      })
    })

    it('should return V5.0 for desktop when only V5 experiment enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockImplementation((req, exp) => {
        return exp === EXPERIMENTS.PDP_V5
      })

      const result = getPdpTemplates({
        req,
        productData: { isPdpV5Applicable: true },
        isBundleProduct: false,
      })

      expect(result).toEqual({
        mobile: TemplateName.default,
        desktop: TemplateName.pdpv5_0,
      })
    })

    it('should return pdpv7 for both mobile and desktop when bags category, preference, product flag and experiment enabled', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockImplementation(
        (_req, exp) => exp === EXPERIMENTS.PDP_V7 || exp === EXPERIMENTS.PDP_V6
      )

      const result = getPdpTemplates({
        req,
        productData: {
          custom: {
            c_enablePdp7Template: true,
            c_classification: 'bags',
          },
        },
        isBundleProduct: false,
        preferences: {
          templateConfigs: { pdpv7: { enabled: true, eligibleCategories: ['bags'] } },
        },
      })

      expect(result).toEqual({
        mobile: TemplateName.pdpv7,
        desktop: TemplateName.pdpv7,
      })
    })

    it('should not return pdpv7 when custom.c_enablePdp7Template is false', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockImplementation(
        (_req, exp) => exp === EXPERIMENTS.PDP_V7 || exp === EXPERIMENTS.PDP_V6
      )

      const result = getPdpTemplates({
        req,
        productData: {
          item_category: 'bags',
          custom: { c_enablePdp7Template: false },
        },
        isBundleProduct: false,
        preferences: {
          templateConfigs: { pdpv7: { enabled: true, eligibleCategories: ['bags'] } },
        },
      })

      expect(result).toEqual({
        mobile: TemplateName.pdpv6,
        desktop: TemplateName.default,
      })
    })

    it('should not return pdpv7 when preference is disabled for bags category product', () => {
      const req = {} as any
      mockIsExperimentEnabled.mockReturnValue(true)

      const result = getPdpTemplates({
        req,
        productData: { item_category: 'bags' },
        isBundleProduct: false,
        preferences: {
          templateConfigs: { pdpv7: { enabled: false, eligibleCategories: ['bags'] } },
        },
      })

      expect(result).toEqual({
        mobile: TemplateName.pdpv6,
        desktop: TemplateName.default,
      })
    })
  })
})
