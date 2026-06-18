import { DetailedProduct } from 'toro/types/productTypes'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import { CustomRenderOptions } from 'test-utils/react'
import useRecommendations from 'toro/hooks/useRecommendations'
import { RecommendationVendors } from 'toro/lib/vendorProductsAdapter/recommendations/configurations'
import { ProductItem } from 'toro/types'
import { Color, PricingInfo, VariantGroupData } from 'toro/types/productTypes/common'

export const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

export const defaultPreference = {
  recommendations: { disabledSchemes: [] },
  certonaConfiguration: {
    certonaATBConfigs: {
      product5_rr: true,
    },
  },
  compareConfigs: {
    featureVisibility: {
      desktop: true,
    },
  },
  storefrontConfigs: {
    displayOosSwatch: false,
  },
}

export const useCertonaSchemeMockReturn = {
  explanation: 'product5_rr',
  experience_id: 'test_experience_id',
  scheme: 'product5_rr',
  items: [
    {
      ID: '111',
      name: 'Original 111',
      detailURL: '/p/111',
      price: { currency: '$', saleprice: 80, fullprice: 100 },
    },
    {
      ID: '222',
      name: 'Original 222',
      detailURL: '/p/222',
      price: { currency: '$', fullprice: 200 },
    },
    {
      ID: '333',
      name: 'Original 333',
      detailURL: '/p/333',
      price: { currency: '€', saleprice: 70, fullprice: 90 },
      image: 'certona-img-333.jpg',
    },
  ],
} as CertonaScheme

export const mockFetchRecommendations = jest.fn().mockResolvedValue({
  items: [
    { id: '111', name: 'XGen Product 1' },
    { id: '222', name: 'XGen Product 2' },
  ],
})

export const mockRecommendationsMockReturnItems: Partial<ProductItem>[] = [
  { id: '111', name: 'Product 111' },
  { id: '222', name: 'Product 222' },
  { id: '333', name: 'Product 333' },
]

export const useRecommendationsMockReturn: Partial<ReturnType<typeof useRecommendations>> = {
  fetchRecommendations: mockFetchRecommendations,
  data: {
    vendor: RecommendationVendors.XGEN,
    strategyId: 'test_strategy_id',
    containerId: 'test_container_id',
    containerDisplayName: 'Test title',
    items: mockRecommendationsMockReturnItems as ProductItem[],
  },
}

export const mockSelectedColor: Partial<Color> = {
  id: 'color-001',
  text: 'color',
  image: {
    src: 'color.jpg',
    title: 'Color',
    alt: 'Color Swatch',
  },
  vgId: 'test-vg-id',
  masterId: 'test-master-id',
}

export const mockPricingInfo: Array<Partial<PricingInfo>> = [
  {
    sales: {
      value: 80,
      currency: 'USD',
      formatted: '$80',
      decimalPrice: '80.00',
    },
    list: {
      value: 100,
      currency: 'USD',
      formatted: '$100',
      decimalPrice: '100.00',
    },
  },
]

export const mockVariationGroup: Array<Partial<VariantGroupData>> = [
  {
    id: 'var-123',
    masterId: 'test-master-id',
    offers: {
      availability: 'in_stock',
      priceValidUntil: 'in_stock',
    },
    color: 'color-001',
    variationAttributes: [
      {
        id: 'color-001',
        name: 'Color',
        values: [
          {
            name: 'Gold/Khaki/Black',
            value: 'IMCBI',
            orderable: true,
          },
        ],
      },
    ],
    pricingInfo: mockPricingInfo as PricingInfo[],
  },
]

export const mockProductData: Partial<DetailedProduct> & { compareAttributesConfig?: unknown } = {
  id: 'prod-001',
  name: 'Product Name',
  sizes: ['S', 'M'],
  masterId: 'test-master-id',
  selectedColor: mockSelectedColor as Color,
  variationGroup: mockVariationGroup as VariantGroupData[],
  // Hook returns null when compareAttributesConfig is empty, so keep a non-empty config.
  compareAttributesConfig: {
    measurementSpecs: ['length'],
  },
}

// Mock compare products data returned from fetchCompareProductsData
// Certona items has img not image field to test normalization properly
export const mockCompireProducts: Array<Partial<ProductItem & { img: string }>> = [
  { id: '111', name: 'Compare 111', img: 'cmp-111.jpg' },
  { id: '222', name: 'Compare 222', img: 'cmp-222.jpg' },
  { id: '333', name: 'Compare 333', img: 'cmp-333.jpg' },
]

export const mockSelectedColorImage = {
  src: 'color.jpg',
}

export const mockSelectedMediaImage = {
  src: 'media.jpg',
}
