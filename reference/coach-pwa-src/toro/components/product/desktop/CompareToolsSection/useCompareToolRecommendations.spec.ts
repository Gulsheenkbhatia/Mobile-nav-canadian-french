import { Atom } from 'jotai'
import { renderHook, waitFor } from 'test-utils/react'
import useCompareToolRecommendations, {
  getPriceValue,
  normalizeCertonaProductsData,
  normalizeCurrentCertonaProductData,
} from './useCompareToolRecommendations'
import usePreference from 'toro/hooks/usePreference_new'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import useRecommendations from 'toro/hooks/useRecommendations'
import useVariantGroupData from 'toro/hooks/useVariantGroupData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import { fetchCompareProductsData } from 'toro/lib/vendorProductsAdapter/features/ProductCompareTool/utils/fetchCompareProductsData'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { productDataAtom } from 'store/pdp.atom'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import { normaliseComparedProductsData } from 'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normaliseComparedProductsData'
import { normalizeCurrentProductData } from 'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normalizeCurrentProductData'
import {
  renderOptions,
  defaultPreference,
  useCertonaSchemeMockReturn,
  mockFetchRecommendations,
  useRecommendationsMockReturn,
  mockVariationGroup,
  mockProductData,
  mockCompireProducts,
  mockSelectedColorImage,
  mockSelectedMediaImage,
} from './useCompareToolRecommendations.mock'
import { experimentsAtom } from 'store/experiments.atom'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useCertonaScheme')
jest.mock('toro/analytics/useRecommAnalytics')
jest.mock('toro/hooks/useRecommendations')
jest.mock('toro/hooks/useVariantGroupData')
jest.mock('toro/hooks/useSelectedVariantData')
jest.mock('toro/hooks/useSelectedColorData')
jest.mock(
  'toro/lib/vendorProductsAdapter/features/ProductCompareTool/utils/fetchCompareProductsData'
)
jest.mock(
  'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normaliseComparedProductsData',
  () => ({
    normaliseComparedProductsData: jest.fn(),
  })
)
jest.mock(
  'lib/vendorProductsAdapter/features/ProductCompareTool/utils/normalizeCurrentProductData',
  () => ({
    normalizeCurrentProductData: jest.fn(),
  })
)

const makeSetup = (customAtoms: Array<[Atom<unknown>, unknown]> = []) => {
  return renderHook(() => useCompareToolRecommendations(), {
    contexts: {
      ...renderOptions.contexts,
      JotaiProviderContext: new Map([
        [experimentsAtom, 'abtest3667_a-abtest3667_b'],
        ...customAtoms,
      ]),
    },
  })
}

describe('useCompareToolRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(usePreference).mockReturnValue(defaultPreference)
    jest.mocked(useCertonaScheme).mockReturnValue(useCertonaSchemeMockReturn)
    jest
      .mocked(useRecommendations)
      .mockReturnValue(useRecommendationsMockReturn as ReturnType<typeof useRecommendations>)
    jest.mocked(normaliseComparedProductsData).mockReturnValue([
      {
        id: '111',
        name: 'Compare 111',
        variationGroupId: '111',
        variationId: '111',
        isSized: false,
      },
      {
        id: '222',
        name: 'Compare 222',
        variationGroupId: '222',
        variationId: '222',
        isSized: false,
      },
    ] as any)
    jest.mocked(normalizeCurrentProductData).mockReturnValue({
      id: mockProductData.id,
      name: mockProductData.name,
      variationGroupId: mockVariationGroup[0].id,
      variationId: mockVariationGroup[0].id,
      isSized: true,
    } as any)
    jest
      .mocked(useVariantGroupData)
      .mockReturnValue([mockVariationGroup[0].id, mockVariationGroup[0].pricingInfo?.[0]])
    jest.mocked(useSelectedVariantData).mockReturnValue(mockVariationGroup[0].id)
    jest
      .mocked(useSelectedColorData)
      .mockReturnValue([mockSelectedMediaImage, mockSelectedMediaImage, null])
    jest.mocked(useRecommAnalytics).mockReturnValue({
      addImpression: jest.fn(),
      selectRecommItem: jest.fn(),
      addToWishlistRecommItem: jest.fn(),
      removeFromWishlistRecommItem: jest.fn(),
    })
    jest.mocked(fetchCompareProductsData).mockResolvedValue(mockCompireProducts as any)
  })

  describe('getPriceValue', () => {
    it.each([
      {
        testName: 'should return sales.formatted when sales.value exists',
        sales: { value: 80, formatted: '$80' },
        price: undefined,
        expected: '$80',
      },
      {
        testName: 'should return list.formatted when only list.value exists',
        sales: undefined,
        price: { value: 100, formatted: '$100' },
        expected: '$100',
      },
      {
        testName: 'should return empty string when neither sales nor list have values',
        sales: undefined,
        price: undefined,
        expected: '',
      },
      {
        testName: 'should prioritize sales over list when both exist',
        sales: { value: 80, formatted: '$80' },
        price: { value: 100, formatted: '$100' },
        expected: '$80',
      },
    ])('$testName correctly', async ({ sales, price, expected }) => {
      const result = getPriceValue(sales, price)
      expect(result).toBe(expected)
    })
  })

  describe('normalizeCertonaProductsData', () => {
    it('should merge and normalize Certona items', () => {
      const result = normalizeCertonaProductsData(
        useCertonaSchemeMockReturn.items,
        mockCompireProducts,
        true
      )

      expect(result).toHaveLength(3)

      const expectedItems = [
        {
          ID: '111',
          name: 'Compare 111',
          image: 'cmp-111.jpg',
          url: '/p/111',
          price: { value: '$80' },
          displayAtb: true,
          // merged unused fields
          id: '111',
          img: 'cmp-111.jpg',
          detailURL: '/p/111',
        },
        {
          ID: '222',
          name: 'Compare 222',
          image: 'cmp-222.jpg',
          url: '/p/222',
          price: { value: '$200' },
          displayAtb: true,
          // merged unused fields
          id: '222',
          img: 'cmp-222.jpg',
          detailURL: '/p/222',
        },
        {
          ID: '333',
          name: 'Compare 333',
          image: 'cmp-333.jpg',
          url: '/p/333',
          price: { value: '€70' },
          displayAtb: true,
          // merged unused fields
          id: '333',
          img: 'cmp-333.jpg',
          detailURL: '/p/333',
        },
      ]

      expect(result).toEqual(expectedItems)
    })

    it('should return empty array for empty certonaItems', () => {
      const res = normalizeCertonaProductsData([], [], true)
      expect(res).toEqual([])
    })
  })

  describe('normalizeCurrentCertonaProductData', () => {
    it('should normalize current product', () => {
      const result = normalizeCurrentCertonaProductData({
        productData: mockProductData,
        selectedVariantOrVG: mockVariationGroup[0],
        selectedColorImage: mockSelectedColorImage,
        selectedMediaImage: mockSelectedMediaImage,
        displayAtb: true,
      })

      const expectedItem = {
        ...mockProductData,
        ID: 'prod-001',
        VariationIdV2: 'var-123',
        name: 'Product Name',
        price: { value: '$80' },
        colorSwatch: mockSelectedColorImage,
        image: mockSelectedMediaImage,
        SizeFlag: true,
        displayAtb: true,
      }

      expect(result).toEqual(expectedItem)
    })
  })

  describe('Main functionality', () => {
    it('should return null when featureVisibility not enabled', async () => {
      jest.mocked(usePreference).mockReturnValue({
        ...defaultPreference,
        compareConfigs: { featureVisibility: { desktop: false } },
      })

      const { result } = makeSetup([
        [xgenFeaturesAtom, { recommendations: true }],
        [productDataAtom, mockProductData],
      ])

      expect(result.current).toBeNull()
    })

    it('should return null when experiment flag is false', () => {
      const { result } = makeSetup([
        [xgenFeaturesAtom, { recommendations: true }],
        [productDataAtom, mockProductData],
        [experimentsAtom, ''],
      ])

      expect(result.current).toBeNull()
    })

    it('should use XGen when recommendations preference enabled', async () => {
      const { result } = makeSetup([
        [productDataAtom, mockProductData],
        [xgenFeaturesAtom, { recommendations: true }],
      ])

      expect(mockFetchRecommendations).toHaveBeenCalledWith(mockVariationGroup[0].id)
      await waitFor(() => {
        expect(fetchCompareProductsData).toHaveBeenCalledWith(
          ['111', '222'],
          mockProductData.compareAttributesConfig,
          defaultPreference.storefrontConfigs.displayOosSwatch
        )
      })
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).not.toBeNull()
      expect(result.current.recommenderInfo).toEqual({
        title: 'Test title',
        displayAtb: false,
        vendor: RecommendationVendors.XGEN,
        scheme: 'test_container_id',
        experienceId: 'test_strategy_id',
      })
    })

    it('should use Certona when XGen recommendations preference disabled', async () => {
      const { result } = makeSetup([
        [productDataAtom, mockProductData],
        [xgenFeaturesAtom, { recommendations: false }],
      ])

      expect(fetchCompareProductsData).toHaveBeenCalledWith(
        ['111', '222', '333'],
        mockProductData.compareAttributesConfig,
        defaultPreference.storefrontConfigs.displayOosSwatch
      )
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).not.toBeNull()
      expect(result.current.recommenderInfo).toEqual({
        title: 'product5_rr',
        displayAtb: true,
        vendor: 'certona',
        scheme: 'product5_rr',
        experienceId: 'test_experience_id',
      })
    })

    it('should use Certona when XGen in disabledSchemas', async () => {
      jest.mocked(usePreference).mockReturnValue({
        ...defaultPreference,
        recommendations: { disabledSchemes: ['sm_el_pdp5'] },
      })

      const { result } = makeSetup([
        [productDataAtom, mockProductData],
        [xgenFeaturesAtom, { recommendations: true }],
      ])

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current).not.toBeNull()
      expect(result.current.recommenderInfo.vendor).toBe('certona')
    })

    it('should return null when not enough products to compare', async () => {
      jest.mocked(mockFetchRecommendations).mockReturnValue({
        items: [{ id: '111' }],
      })

      const { result } = makeSetup([
        [productDataAtom, mockProductData],
        [xgenFeaturesAtom, { recommendations: true }],
      ])

      await waitFor(() => {
        expect(result.current).toBeNull()
      })
    })
  })
})
