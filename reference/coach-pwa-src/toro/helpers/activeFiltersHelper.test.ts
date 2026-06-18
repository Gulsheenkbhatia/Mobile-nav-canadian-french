import {
  getActiveFilters,
  getFilterDisplayName,
  getActiveFiltersQAAttributes,
} from './activeFiltersHelper'
import { REFINEMENT_TYPE } from './refinements'

describe('activeFiltersHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getActiveFilters', () => {
    it('should return empty array when filters array is empty', () => {
      const filters = []
      const refinements = [
        {
          id: 'color',
          name: 'Color',
          type: 'attribute',
          options: [
            { refvalue: 'red', selectable: true, hitCount: 5, swatchID: '', displayName: 'Red' },
            { refvalue: 'blue', selectable: true, hitCount: 3, swatchID: '', displayName: 'Blue' },
          ],
        },
      ]

      const result = getActiveFilters(filters, refinements)
      expect(result).toEqual([])
    })

    it('should return empty array when refinements array is empty', () => {
      const filters = [{ id: 'color', values: ['red', 'blue'] }]
      const refinements = []

      const result = getActiveFilters(filters, refinements)
      expect(result).toEqual([])
    })

    it("should skip filters that don't have matching refinements", () => {
      const filters = [
        { id: 'color', values: ['red'] },
        { id: 'nonexistent', values: ['value'] },
      ]
      const refinements = [
        {
          id: 'color',
          name: 'Color',
          type: 'attribute',
          options: [
            { refvalue: 'red', selectable: true, hitCount: 5, swatchID: '', displayName: 'Red' },
          ],
        },
      ]

      const result = getActiveFilters(filters, refinements)
      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('color')
      expect(result[0].refvalue).toBe('red')
    })

    it("should skip filter options that don't exist in refinement options", () => {
      const filters = [{ id: 'color', values: ['red', 'nonexistent'] }]
      const refinements = [
        {
          id: 'color',
          name: 'Color',
          type: 'attribute',
          options: [
            { refvalue: 'red', selectable: true, hitCount: 5, swatchID: '', displayName: 'Red' },
          ],
        },
      ]

      const result = getActiveFilters(filters, refinements)
      expect(result).toHaveLength(1)
      expect(result[0].refvalue).toBe('red')
    })

    it('should return active filters with enriched data from refinements', () => {
      const filters = [{ id: 'color', values: ['red'] }]
      const refinements = [
        {
          id: 'color',
          name: 'Color',
          type: 'attribute',
          options: [
            {
              refvalue: 'red',
              selectable: true,
              hitCount: 5,
              swatchID: 'red-swatch',
              displayName: 'Crimson Red',
            },
          ],
        },
      ]

      const result = getActiveFilters(filters, refinements)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        refvalue: 'red',
        selectable: true,
        hitCount: 5,
        swatchID: 'red-swatch',
        displayName: 'Crimson Red',
        type: 'color',
        id: 'color',
        name: 'Color',
      })
    })

    it('should handle multiple filters with multiple values', () => {
      const filters = [
        { id: 'color', values: ['red', 'blue'] },
        { id: 'size', values: ['M', 'L'] },
      ]
      const refinements = [
        {
          id: 'color',
          name: 'Color',
          type: 'attribute',
          options: [
            { refvalue: 'red', selectable: true, hitCount: 5, swatchID: '', displayName: 'Red' },
            { refvalue: 'blue', selectable: true, hitCount: 3, swatchID: '', displayName: 'Blue' },
          ],
        },
        {
          id: 'size',
          name: 'Size',
          type: 'attribute',
          options: [
            { refvalue: 'M', selectable: true, hitCount: 8, swatchID: '', displayName: 'Medium' },
            { refvalue: 'L', selectable: true, hitCount: 6, swatchID: '', displayName: 'Large' },
          ],
        },
      ]

      const result = getActiveFilters(filters, refinements)
      expect(result).toHaveLength(4)

      const colorFilters = result.filter((f) => f.type === 'color')
      const sizeFilters = result.filter((f) => f.type === 'size')

      expect(colorFilters).toHaveLength(2)
      expect(sizeFilters).toHaveLength(2)
      expect(colorFilters.map((f) => f.refvalue)).toEqual(['red', 'blue'])
      expect(sizeFilters.map((f) => f.refvalue)).toEqual(['M', 'L'])
    })

    it('should add price filter when both pmin and pmax are present', () => {
      const filters = [
        { id: 'pmin', values: ['100'] },
        { id: 'pmax', values: ['500'] },
      ]
      const refinements = []

      const result = getActiveFilters(filters, refinements)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: REFINEMENT_TYPE.PRICE,
        type: REFINEMENT_TYPE.PRICE,
        refvalue: '100-500',
        name: 'PRICE',
      })
    })

    it('should not add price filter when only pmin is present and refinements are empty', () => {
      const filters = [{ id: 'pmin', values: ['100'] }]
      const refinements = []

      const result = getActiveFilters(filters, refinements)
      expect(result).toEqual([])
    })

    it('should not add price filter when only pmax is present', () => {
      const filters = [{ id: 'pmax', values: ['500'] }]
      const refinements = []

      const result = getActiveFilters(filters, refinements)
      expect(result).toEqual([])
    })
  })

  describe('getFilterDisplayName', () => {
    const mockFormatMessage = jest.fn()
    const mockCurrencyOptions = {
      currency: 'USD',
      currencyDisplay: 'symbol',
      style: 'currency',
    }

    beforeEach(() => {
      mockFormatMessage.mockReset()
    })

    it('should format price range with currency for price type filters', () => {
      const activeFilter = {
        type: REFINEMENT_TYPE.PRICE,
        refvalue: '100-500',
        displayName: '',
        id: 'price',
        name: 'PRICE',
        hitCount: 10,
        selectable: true,
        swatchID: '',
      }

      const result = getFilterDisplayName(activeFilter, mockCurrencyOptions, mockFormatMessage)

      expect(result).toBe('$100 - $500')
    })

    it('should handle price formatting with different currencies', () => {
      const activeFilter = {
        type: REFINEMENT_TYPE.PRICE,
        refvalue: '100-500',
        displayName: '',
        id: 'price',
        name: 'PRICE',
        hitCount: 10,
        selectable: true,
        swatchID: '',
      }

      const euroCurrencyOptions = {
        currency: 'EUR',
        currencyDisplay: 'symbol',
        style: 'currency',
        locale: 'de-DE',
      }

      const result = getFilterDisplayName(activeFilter, euroCurrencyOptions, mockFormatMessage)

      expect(result).toBe('100\u00A0€ - 500\u00A0€')
    })

    it("should format size filter with localized 'Size' text", () => {
      mockFormatMessage.mockReturnValue('Size')

      const activeFilter = {
        type: 'size',
        refvalue: 'M',
        displayName: 'Medium',
        id: 'size',
        name: 'Size',
        hitCount: 5,
        selectable: true,
        swatchID: '',
      }

      const result = getFilterDisplayName(activeFilter, mockCurrencyOptions, mockFormatMessage)

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'pdp.product.sizeText',
        defaultMessage: 'Size',
      })
      expect(result).toBe('Size M')
    })

    it('should return displayName when available for non-price, non-size filters', () => {
      const activeFilter = {
        type: 'color',
        refvalue: 'red',
        displayName: 'Crimson Red',
        id: 'color',
        name: 'Color',
        hitCount: 8,
        selectable: true,
        swatchID: '',
      }

      const result = getFilterDisplayName(activeFilter, mockCurrencyOptions, mockFormatMessage)

      expect(result).toBe('Crimson Red')
    })

    it('should return refvalue when displayName is not available', () => {
      const activeFilter = {
        type: 'material',
        refvalue: 'leather',
        displayName: '',
        id: 'material',
        name: 'Material',
        hitCount: 12,
        selectable: true,
        swatchID: '',
      }

      const result = getFilterDisplayName(activeFilter, mockCurrencyOptions, mockFormatMessage)

      expect(result).toBe('leather')
    })

    it('should handle numeric refvalues', () => {
      const activeFilter = {
        type: 'rating',
        refvalue: '4',
        displayName: '',
        id: 'rating',
        name: 'Rating',
        hitCount: 15,
        selectable: true,
        swatchID: '',
      }

      const result = getFilterDisplayName(activeFilter, mockCurrencyOptions, mockFormatMessage)

      expect(result).toBe('4')
    })
  })

  describe('getActiveFiltersQAAttributes', () => {
    it('should return correct QA attributes for desktop viewport', () => {
      const result = getActiveFiltersQAAttributes('d')

      expect(result).toEqual({
        appliedFilterSection: 'd_plpfltr_sctn_aplyd_fltr',
        appliedFilterClearAll: 'm_plpfltr_link_clearall',
        appliedFilterlabelLink: 'm_plpfltr_link_aplyd_fltr_label',
        appliedFilterLabel: 'd_plpfltr_txt_aplyd_fltr_label',
        appliedFilterLabelRemove: 'd_plpfltr_icon_aplyd_fltr_label_rmv',
        appliedFilterCategory: 'd_plpfltr_link_aplyd_fltr',
      })
    })

    it('should return correct QA attributes for mobile viewport', () => {
      const result = getActiveFiltersQAAttributes('m')

      expect(result).toEqual({
        appliedFilterSection: 'm_plpfltr_sctn_aplyd_fltr',
        appliedFilterClearAll: 'm_plpfltr_link_clearall',
        appliedFilterlabelLink: 'm_plpfltr_link_aplyd_fltr_label',
        appliedFilterLabel: 'm_plpfltr_txt_aplyd_fltr_label',
        appliedFilterLabelRemove: 'm_plpfltr_icon_aplyd_fltr_label_rmv',
        appliedFilterCategory: 'm_plpfltr_link_aplyd_fltr',
      })
    })

    it('should handle different viewport types consistently', () => {
      const desktopResult = getActiveFiltersQAAttributes('d')
      const mobileResult = getActiveFiltersQAAttributes('m')

      expect(desktopResult.appliedFilterClearAll).toBe(mobileResult.appliedFilterClearAll)
      expect(desktopResult.appliedFilterlabelLink).toBe(mobileResult.appliedFilterlabelLink)

      expect(desktopResult.appliedFilterSection).not.toBe(mobileResult.appliedFilterSection)
      expect(desktopResult.appliedFilterLabel).not.toBe(mobileResult.appliedFilterLabel)
      expect(desktopResult.appliedFilterLabelRemove).not.toBe(mobileResult.appliedFilterLabelRemove)
      expect(desktopResult.appliedFilterCategory).not.toBe(mobileResult.appliedFilterCategory)
    })
  })
})
