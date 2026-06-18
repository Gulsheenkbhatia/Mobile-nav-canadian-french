import { CustomRenderOptions, render, screen } from 'test-utils/react'
import CustomizeAndMonogram, { CustomizeAndMonogramProps } from '.'
import {
  productDataAtom,
  selectedColorAtom,
  customizerRecipesAtom,
  customizerVariantsAtom,
  isQuickViewAtom,
  productCustomStateAtom,
  customizerDataAtom,
  selectedVariantAtom,
} from 'store/pdp.atom'
import { preferencesAtom, PreferencesAtomType } from 'store/preferences.atom'
import { Color, DetailedProduct } from 'toro/types/productTypes'
import { Atom } from 'jotai'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useViewportType')
jest.mock('next/router', () => {
  const actual = jest.requireActual('next/router')

  return {
    ...actual,
    useRouter: jest.fn(() => ({
      query: {},
      push: jest.fn(),
    })),
  }
})

jest.mocked(useViewportType).mockReturnValue({
  isMobile: true,
  isDesktop: false,
})

const mockSelectedColorAtomValue: Color = {
  isCustomized: false,
  isMonogrammed: false,
  id: 'test-color-id',
  text: 'Test Color',
  image: {
    src: 'test-image.jpg',
    title: 'Test Image',
    alt: 'Test Alt',
  },
  orderable: true,
  media: {
    full: [],
    thumbnails: [],
    thumbnail: {
      src: 'test-thumb.jpg',
      title: 'Test Thumb',
      alt: 'Test Thumb Alt',
    },
  },
  url: '/test-color',
  sizes: [],
  widths: [],
  vgId: 'test-vg-id',
  masterId: 'test-master-id',
  materialName: 'Test Material',
  styleGroup: 'test-style',
  displayIfOOS: false,
}

const mockProductDataAtomValue: Partial<DetailedProduct> = {
  customizerData: {
    canMonogram: true,
    canMonogramParent: true,
    canCustomize: true,
    canCustomizeParent: true,
    customize: {},
    monogram: {
      colors: {},
      addonColors: {},
      symbols: {},
      colorways: {
        blk: { placements: [] },
        mpl: { placements: [] },
        rwd: { placements: [] },
      },
    },
    generated: 'test-generated',
    __mccEvents: [],
  },
  masterId: 'test-master-id',
  colors: [],
}

const mockPreferencesAtomValue: PreferencesAtomType = {
  Customizer: {
    CustomizerApiKey: { default: 'test-api-key' },
    CustomizerAddonHangtags: { default: true },
    CustomizerEnabled: { default: true },
    CustomizerMonogrammingEnabled: { default: true },
  },
}

const mockProductCustomState = {
  'test-variant-id': {
    canMonogram: true,
    canCustomize: true,
  },
}

const mockCustomizerDataAtomValue = {
  canMonogram: true,
  canMonogramParent: true,
  canCustomize: true,
  canCustomizeParent: true,
}

const mockSelectedVariantAtomValue = { productId: 'test-variant-id', colors: [] }

const atomValues: Array<[Atom<unknown>, unknown]> = [
  [selectedColorAtom, mockSelectedColorAtomValue],
  [productDataAtom, mockProductDataAtomValue],
  [preferencesAtom, mockPreferencesAtomValue],
  [customizerRecipesAtom, []],
  [customizerVariantsAtom, []],
  [isQuickViewAtom, false],
  [productCustomStateAtom, mockProductCustomState],
  [selectedVariantAtom, mockSelectedVariantAtomValue],
  [customizerDataAtom, mockCustomizerDataAtomValue],
]

const createAtomValues = (overrides: Array<[Atom<unknown>, unknown]> = []) => {
  return new Map([...atomValues, ...overrides])
}

const defaultProps: CustomizeAndMonogramProps = {
  type: 'widget',
}

const defaultOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: { customizerScriptUrl: '/custom-script' },
    },
    JotaiProviderContext: createAtomValues(),
  },
}

const setup = (
  props: Partial<CustomizeAndMonogramProps> = {},
  options: CustomRenderOptions = {}
) => {
  return render(<CustomizeAndMonogram {...defaultProps} {...props} />, {
    ...defaultOptions,
    ...options,
  })
}

describe('CustomizeAndMonogram', () => {
  it('should render correctly', async () => {
    const mockRecipeData = {
      id: 'recipe123',
      data: 'recipe data',
      recipe: { views: [{ code: 'Product' }], custom: {} },
      productId: '6789',
    }
    const mockFetchResponse = Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRecipeData),
    })

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockFetchResponse),
      } as Response)
    )
    setup()

    const customizeItContainer = await screen.findByTestId('customize_it_container')
    expect(customizeItContainer).toBeVisible()
  })

  it.each<{
    props: Partial<CustomizeAndMonogramProps>
    options?: CustomRenderOptions
    description: string
  }>([
    {
      props: defaultProps,
      options: {
        ...defaultOptions,
        contexts: {
          ...defaultOptions.contexts,
          JotaiProviderContext: createAtomValues([
            [selectedColorAtom, { ...mockSelectedColorAtomValue, isCustomized: true }],
            [
              productCustomStateAtom,
              {
                'test-variant-id': {
                  canMonogram: false,
                  canCustomize: false,
                },
              },
            ],
          ]),
        },
      },
      description: 'is customized and type is widget',
    },
    {
      props: { ...defaultProps, type: 'links' },
      description: 'not customized and type is links',
    },
  ])('should not be visible when $description', ({ props, options }) => {
    setup(props, options)

    const customizeItContainer = screen.queryByTestId('customize_it_container')
    expect(customizeItContainer).not.toBeInTheDocument()
  })
})
