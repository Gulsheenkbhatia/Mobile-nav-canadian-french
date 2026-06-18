import React from 'react'
import { render, screen } from '@testing-library/react'
import { atom, Provider } from 'jotai'
import { useAtomValue } from 'jotai/utils'

const mockProductsAtom = atom([])
const mockPreferencesAtom = atom({})
const mockExperimentsAtom = atom('')
const mockPageTypeShorthandAtom = atom('PLP')
const mockOneSiteActiveBrandAtom = atom(undefined as string | undefined)
const mockEnableVisuallySimilarFromCategoryAtom = atom(false)
const mockViewedProductsAtom = atom([] as string[])

jest.mock('store/search-results.atom', () => ({
  productsAtom: mockProductsAtom,
}))
jest.mock('store/preferences.atom', () => ({
  preferencesAtom: mockPreferencesAtom,
}))
jest.mock('store/experiments.atom', () => ({
  experimentsAtom: mockExperimentsAtom,
}))
jest.mock('store/navigation.atom', () => ({
  pageTypeShorthandAtom: mockPageTypeShorthandAtom,
}))
jest.mock('store/menu-data.atom', () => ({
  oneSiteActiveBrandAtom: mockOneSiteActiveBrandAtom,
}))
jest.mock('store/plp.atom', () => ({
  enableVisuallySimilarFromCategoryAtom: mockEnableVisuallySimilarFromCategoryAtom,
}))
jest.mock('store/viewed-products.atom', () => ({
  viewedProductsAtom: mockViewedProductsAtom,
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { visuallySimilarAttributeMapAtom } = require('store/visually-similar.atom')

function AtomReader() {
  const map = useAtomValue(visuallySimilarAttributeMapAtom) as Map<string, string>
  return <div data-testid="result">{JSON.stringify(Array.from(map.entries()))}</div>
}

const createMockProduct = (variationGroupOverrides = {}) => ({
  variationGroup: [
    {
      productID: 'test-product-1',
      retailVisuallySimilarPIDs: 'retail-pid1,retail-pid2',
      outletVisuallySimilarPIDs: 'outlet-pid1,outlet-pid2',
      visuallySimilarPIDs: 'unified-pid1,unified-pid2',
      visuallySimilar: 'legacy-pid1,legacy-pid2',
      ...variationGroupOverrides,
    },
  ],
})

const plpEnabledPreferences = {
  ToggleSiteFeatures: {
    enableVisuallySimilar: {
      PLP: { enable: true },
    },
  },
}

const VIEW_SIMILAR_LLM_PLP_KEY = 'abtest3902_a'
const VISUALLY_SIMILAR_CROSS_CHANNEL_KEY = 'abtest4872_a'

const renderAtom = (initialValues: [any, any][]) =>
  render(
    <Provider initialValues={initialValues}>
      <AtomReader />
    </Provider>
  )

const getResult = (): [string, string][] => JSON.parse(screen.getByTestId('result').textContent)

const baseInitialValues = (overrides: Record<string, any> = {}): [any, any][] => [
  [mockProductsAtom, overrides.products ?? [createMockProduct()]],
  [mockPreferencesAtom, overrides.preferences ?? plpEnabledPreferences],
  [mockExperimentsAtom, overrides.experiments ?? VIEW_SIMILAR_LLM_PLP_KEY],
  [mockPageTypeShorthandAtom, overrides.pageType ?? 'PLP'],
  [mockOneSiteActiveBrandAtom, overrides.activeBrand ?? undefined],
  [mockEnableVisuallySimilarFromCategoryAtom, overrides.enabledForCategory ?? true],
  [mockViewedProductsAtom, overrides.viewedProducts ?? ['test-product-1']],
]

describe('visuallySimilarAttributeMapAtom', () => {
  describe('Control — experiment inactive', () => {
    it('uses retailVisuallySimilarPIDs when activeBrand is coach', () => {
      renderAtom(baseInitialValues({ activeBrand: 'coach' }))
      expect(getResult()).toEqual([['test-product-1', 'retail-pid1,retail-pid2']])
    })

    it('uses outletVisuallySimilarPIDs when activeBrand is outlet', () => {
      renderAtom(baseInitialValues({ activeBrand: 'outlet' }))
      expect(getResult()).toEqual([['test-product-1', 'outlet-pid1,outlet-pid2']])
    })

    it('falls back to visuallySimilar when activeBrand is undefined', () => {
      renderAtom(baseInitialValues({ activeBrand: undefined }))
      expect(getResult()).toEqual([['test-product-1', 'legacy-pid1,legacy-pid2']])
    })
  })

  describe('Variant — VISUALLY_SIMILAR_CROSS_CHANNEL experiment active', () => {
    const experimentsWithCrossChannel = `${VIEW_SIMILAR_LLM_PLP_KEY}-${VISUALLY_SIMILAR_CROSS_CHANNEL_KEY}`

    it('uses visuallySimilar on coach tab', () => {
      renderAtom(
        baseInitialValues({ activeBrand: 'coach', experiments: experimentsWithCrossChannel })
      )
      expect(getResult()).toEqual([['test-product-1', 'legacy-pid1,legacy-pid2']])
    })

    it('uses visuallySimilar on outlet tab', () => {
      renderAtom(
        baseInitialValues({ activeBrand: 'outlet', experiments: experimentsWithCrossChannel })
      )
      expect(getResult()).toEqual([['test-product-1', 'legacy-pid1,legacy-pid2']])
    })

    it('uses visuallySimilar when activeBrand is undefined', () => {
      renderAtom(
        baseInitialValues({ activeBrand: undefined, experiments: experimentsWithCrossChannel })
      )
      expect(getResult()).toEqual([['test-product-1', 'legacy-pid1,legacy-pid2']])
    })
  })

  describe('edge cases', () => {
    it('returns empty map when preference is disabled', () => {
      renderAtom(
        baseInitialValues({
          preferences: {
            ToggleSiteFeatures: { enableVisuallySimilar: { PLP: { enable: false } } },
          },
        })
      )
      expect(getResult()).toEqual([])
    })

    it('excludes products without the required attribute', () => {
      const productWithoutField = {
        variationGroup: [
          {
            productID: 'no-vs-product',
            // no visuallySimilar* fields
          },
        ],
      }
      renderAtom(
        baseInitialValues({
          products: [productWithoutField],
          activeBrand: 'coach',
        })
      )
      expect(getResult()).toEqual([])
    })
  })
})
