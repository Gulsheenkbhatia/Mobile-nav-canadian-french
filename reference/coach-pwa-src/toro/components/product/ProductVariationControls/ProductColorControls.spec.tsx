import { render, CustomRenderOptions } from 'test-utils/react'
import { useRouter } from 'next/router'
import ProductColorControls from 'toro/components/product/ProductVariationControls/ProductColorControls'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/components/Experiment', () => ({ children }) => (
  <div data-qa="experiment">{children}</div>
))
jest.mock('toro/components/product/ProductVariationControls/ProductVariationLabel', () => () => (
  <div data-qa="product_variation_label">Product Variation Label</div>
))
jest.mock('toro/components/product/ProductVariationControls/ProductImagesContainer', () => () => (
  <div data-qa="product_images_container">Product Images Container</div>
))
jest.mock('toro/components/product/ProductVariationControls/ProductColorControl', () => () => (
  <div data-qa="product_color_control">Product Color Control</div>
))
jest.mock('toro/components/StylesProvider', () => ({ children }) => (
  <div data-qa="styles_provider">{children}</div>
))
jest.mock('toro/components/product/TabbedAdaptivePDPSwatches', () => () => (
  <div data-qa="tabbed_adaptive_pdp_swatches">Tabbed Adaptive PDP Swatched</div>
))

jest.mock('jotai/utils')
jest.mock('next/router')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')

const mockUseRouter = useRouter as jest.Mock
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFn<typeof useMultiStyleConfig>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>

const mockUseMultiStyleConfigElements = {
  colorVariantsWrapper: () => {},
  colorVariantLabel: {},
  productImagesContainer: {},
}

const defaultProps = {
  items: [
    { id: '1', orderable: true, masterId: 'm1' },
    { id: '2', orderable: false, masterId: 'm2', displayIfOOS: true },
  ],
  productData: {
    variationGroup: [
      {
        id: 'vg1',
        variationAttributes: [{ type: 'color', values: ['1', '2'] }],
        images: [{ src: 'image1.jpg', alt: 'Red product' }],
        variationValues: { color: '1' },
      },
      {
        id: 'vg2',
        variationAttributes: [{ type: 'color', values: ['2'] }],
        images: [{ src: 'image2.jpg', alt: 'Blue product' }],
        variationValues: { color: '2' },
      },
    ],
    productType: { master: false },
    defaultColor: { id: '1', masterId: 'm1' },
    isServerSide: false,
    custom: { color: 'red' },
  },
  selectedItem: { id: '1', masterId: 'm1', text: 'Red' },
  showErrorIfEmpty: false,
  onChange: jest.fn(),
  isSticky: false,
  isQuickView: false,
  masterId: 'm1',
  setCustomizerVariants: jest.fn(),
  customizerVariants: [],
  setSelectedColor: jest.fn(),
  sourceCodeId: 'sc1',
  isMegaPDPEligible: false,
  isNewMegaPDPEligible: false,
  selectedMaterial: {},
  isDisplayOosSwatch: false,
  variant: '',
  defaultColor: { vgId: '1' },
  hslColor: '',
  isExtendedAdaptivePDP: false,
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}
const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ProductColorControls {...combinedProps} />, renderOptions)
}

describe('ProductColorControls', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    })
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isTabbedAdaptivePDPEligibleAtom:
          return false
        default:
          return null
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      sceneSeven: { enableThumbnailPdpSwatch: false },
      toggleSiteFeatures: {
        sourceCodeGroupAttributeMapping: {},
        subMaterialCalloutConfig: { enable: true, SubMaterialAttribute: 'color' },
      },
      salePreferences: { enablePdpSwatchSuppression: false },
    }))
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component without crashing with default props', () => {
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should render the component without crashing when viewport changes', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false }))
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should hide the component without crashing when isSticky is true', () => {
    const { getAllByTestId } = makeSetup({ isSticky: true })
    expect(getAllByTestId('product_variation_label')[0]).not.toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).not.toBeVisible()
  })

  it('should render the component properly when enableThumbnailPdpSwatch is true', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        sceneSeven: {
          ...originalPreferences.sceneSeven,
          enableThumbnailPdpSwatch: true,
        },
      }
    })
    const { getAllByTestId, getByTestId } = makeSetup()
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getByTestId('product_images_container')).toBeVisible()
  })

  it('should render the component properly when enableThumbnailPdpSwatch is true and new mega pdp is eligible', () => {
    const usePreferenceImplementation = mockedUsePreference.getMockImplementation()
    mockedUsePreference.mockImplementation(() => {
      const originalPreferences = usePreferenceImplementation ? usePreferenceImplementation() : {}
      return {
        ...originalPreferences,
        sceneSeven: {
          ...originalPreferences.sceneSeven,
          enableThumbnailPdpSwatch: true,
        },
      }
    })
    const { getAllByTestId, getByTestId } = makeSetup({ isNewMegaPDPEligible: true })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getByTestId('product_images_container')).toBeVisible()
  })

  it('should render the component without crashing when mega pdp is true, showErrorIfEmpty is true and isQuickView is also true', () => {
    const { getAllByTestId } = makeSetup({
      isMegaPDPEligible: true,
      showErrorIfEmpty: true,
      isQuickView: true,
    })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should render TabbedAdaptivePDPSwatches the when isTabbedAdaptivePDPEligible is true', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false }))
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('tabbed_adaptive_pdp_swatches')).toBeVisible()
  })

  it('should render the component properly when master of productType in productData is true', () => {
    const { getAllByTestId } = makeSetup({
      productData: { ...defaultProps.productData, productType: { master: true } },
    })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should render the component properly when isServerSide is true', () => {
    const { getAllByTestId } = makeSetup({
      productData: { ...defaultProps.productData, isServerSide: true },
    })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should render the component properly when frp is true', () => {
    mockUseRouter.mockReturnValue({
      query: { frp: 'product_id' },
      push: jest.fn(),
    })
    const frpItems = [
      { id: '1', text: 'Red', orderable: true, masterId: 'm1', vgId: 'vg1' },
      { id: '2', text: 'Blue', orderable: false, masterId: 'm1', vgId: 'vg2' },
    ]
    const { getAllByTestId } = makeSetup({
      items: frpItems,
      productData: {
        ...defaultProps.productData,
        isServerSide: true,
        variant: [
          {
            id: 'product_id',
            variationValues: { color: '2' },
            images: [{ src: 'image.jpg' }],
          },
        ],
        defaultVariantGroup: {
          variationAttributes: [
            {
              type: 'color',
              values: ['1'],
            },
          ],
        },
      },
    })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })

  it('should render the component with default preferences', () => {
    mockedUsePreference.mockImplementation(() => ({
      sceneSeven: { enableThumbnailPdpSwatch: undefined },
      toggleSiteFeatures: {
        sourceCodeGroupAttributeMapping: undefined,
        subMaterialCalloutConfig: undefined,
      },
      salePreferences: { enablePdpSwatchSuppression: undefined },
    }))
    const { getAllByTestId } = makeSetup({
      productData: { ...defaultProps.productData, custom: undefined },
    })
    expect(getAllByTestId('product_variation_label')[0]).toBeVisible()
    expect(getAllByTestId('product_color_control')[0]).toBeVisible()
  })
})
