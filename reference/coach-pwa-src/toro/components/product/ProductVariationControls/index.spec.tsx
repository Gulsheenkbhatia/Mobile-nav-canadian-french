import { render, CustomRenderOptions } from 'test-utils/react'
import {
  selectionChangedAtom,
  priceGroupAtom,
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  isTabbedAdaptivePDPEligibleAtom,
} from 'store/pdp.atom'
import ProductVariationControls from 'toro/components/product/ProductVariationControls/index'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useAtom } from 'jotai'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ProductSizeControls from 'toro/components/product/ProductVariationControls/ProductSizeControls'
import ProductColorControls from 'toro/components/product/ProductVariationControls/ProductColorControls'
import { productData, selectedColor, defaultProps } from 'test-utils/ProductVariationControlsMock'

jest.mock('jotai/utils')
jest.mock('jotai')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useNeutralSizingData')
jest.mock('toro/hooks/useExperiment', () => jest.fn())
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
jest.mock('store/pdp.atom', () => ({
  __esModule: true,
  alterCtaToShowAtom: {},
  priceGroupAtom: {},
  isMegaPDPEligibleAtom: {},
  isNewMegaPDPEligibleAtom: {},
  isTabbedAdaptivePDPEligibleAtom: {},
}))

const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseNeutralSizingData = useNeutralSizingData as jest.Mock

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: { locale: 'en-US' },
    },
  },
}

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<ProductVariationControls {...combinedProps} />, renderOptions)
}

jest.mock('toro/components/product/ProductVariationControls/ProductSizeControls', () => ({
  __esModule: true,
  default: jest.fn((props: any) => {
    return (
      <div data-qa="product-size-controls">
        <button
          onClick={() =>
            props.onChange({
              id: 'size-004',
              value: 'size-004-alt',
              text: {
                US: 'L',
                CA: 'CA L',
                default: 'Large',
              },
            })
          }
          data-testid="mock-size-control-button"
        >
          Product Size Controls
        </button>
      </div>
    )
  }),
}))
jest.mock('toro/components/product/ProductVariationControls/ProductColorControls', () => ({
  __esModule: true,
  default: jest.fn((props: any) => {
    return (
      <div data-qa="product-color-controls">
        <button
          onClick={() =>
            props.onChange({
              id: 'size-004',
              value: 'size-004-alt',
              isMonogrammed: true,
              text: {
                US: 'L',
                CA: 'CA L',
                default: 'Large',
              },
            })
          }
          data-testid="mock-color-control-button"
        >
          Product Color Controls
        </button>
      </div>
    )
  }),
}))
jest.mock('toro/components/product/SizeGuideButton', () => () => (
  <div data-qa="size-guide-button">
    <button>Size Guide</button>
  </div>
))
jest.mock('toro/components/product/ProductVariationControls/ProductTypeControls', () => () => (
  <div data-qa="product-type-controls">Product Type Controls</div>
))
jest.mock('toro/components/product/ProductVariationControls/ProductMaterialControls', () => () => (
  <div data-qa="product-material-controls">Product Material Controls</div>
))
jest.mock('toro/components/product/ProductVariationControls/NewMegaPDP/TabControls', () => () => (
  <div data-qa="tab-controls">Tab Controls</div>
))
jest.mock('toro/components/product/TruefitWidget', () => () => (
  <div data-qa="true-fit-widget">True Fit Widget</div>
))
jest.mock('toro/components/product/ProductVariationControls/FitReviewText', () => () => (
  <div data-qa="fit-review-text">Fit Review Text</div>
))
jest.mock('toro/components/product/VariationMessages', () => () => (
  <div data-qa="variation-messages">Variation Messages</div>
))

const MockProductSizeControls = ProductSizeControls as jest.MockedFunction<
  typeof ProductSizeControls
>
const MockProductColorControls = ProductColorControls as jest.MockedFunction<
  typeof ProductColorControls
>
const mockSendAnalytics = jest.fn()
const setSelectionChangedMock = jest.fn()
const setFullscreenLoadingMock = jest.fn()
const setSelectedTabsDataMock = jest.fn()

describe('ProductVariationControls', () => {
  let mockTangiblee: jest.Mock
  beforeEach(() => {
    mockTangiblee = jest.fn((arg) => {
      if (arg === 'isModalOpened') return true
      return undefined
    })
    ;(window as any).tangiblee = mockTangiblee
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isMegaPDPEligibleAtom:
          return false
        case isNewMegaPDPEligibleAtom:
          return false
        case isTabbedAdaptivePDPEligibleAtom:
          return false
        case priceGroupAtom:
          return {
            salePrice: '$198',
          }
        default:
          return null
      }
    })
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true }))
    mockedUseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case selectionChangedAtom:
          return setSelectionChangedMock
        case setFullscreenLoadingAtom:
          return setFullscreenLoadingMock
        default:
          return null
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      trueFit: { enableTrueFit: true, truefitClientID: '', trueFitApiUrl: '' },
    }))

    mockedUseAtom.mockReturnValue([
      [{ name: 'shoulderBag' }, { name: 'tabby' }],
      setSelectedTabsDataMock,
    ])
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseExperiment.mockImplementation((experiment) => {
      if (experiment === EXPERIMENTS.PDP_V4_1) return false
      if (experiment === EXPERIMENTS.PDP_V4_2) return false
    })
    mockedUseNeutralSizingData.mockReturnValue({
      isNeutralSizingEnabled: true,
      neutralSizingCountryTypes: ['UK', 'US', 'EU'],
      selectedNeutralSizingCountry: 'UK',
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
    delete (window as any).tangiblee
  })

  it('should render the component properly without crashing', () => {
    const { getAllByTestId } = makeSetup()
    const target = getAllByTestId('product-size-controls')[0]
    expect(target).toBeVisible()
  })

  it('should render product material controls without crashing', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('product-material-controls')).toBeVisible()
  })

  it('should render tab controls without crashing', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isNewMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('tab-controls')[0]).toBeVisible()
  })

  it('should render true fit widget without crashing', async () => {
    const selectedVariantData = {
      customAttributes: {
        c_trueFitCtaEnabled: true,
      },
      id: 'KL986 Y8F  7.5 B',
    }
    const { findByTestId } = makeSetup({ selectedVariantData })
    expect(await findByTestId('true-fit-widget')).toBeVisible()
  })

  it('should render fit review text without crashing', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('fit-review-text')).toBeVisible()
  })

  it('should render product color controls without crashing', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return true
      }
      if (atom === isNewMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component without crashing and hide extended colors', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return true
      }
      if (atom === isNewMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getAllByTestId, getByTestId } = makeSetup({ hideExtendedColors: true })
    expect(getAllByTestId('product-size-controls')[0]).toBeVisible()
    expect(getByTestId('product-color-controls')).not.toBeVisible()
  })

  it('should render the component properly and trigger onSizeChange function when user changes the size by clicking', () => {
    makeSetup()
    const mockProps = MockProductSizeControls.mock.calls[0][0]
    const value = {
      id: 'size-004',
      value: 'size-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onSizeClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: undefined,
      eventLocation: 'product',
      swatchType: 'UK size',
      swatchValue: { CA: 'CA L', US: 'L', default: 'Large' },
      swatchVariant: '',
    })
  })

  it('should render the component properly and trigger onSizeChange function when widths in default porps is null and user changes the size by clicking', () => {
    const updatedProductData = {
      ...productData,
      widths: null,
    }
    makeSetup({
      productData: updatedProductData,
    })
    const mockProps = MockProductSizeControls.mock.calls[0][0]
    const value = {
      id: 'size-004',
      value: 'size-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onSizeClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: undefined,
      eventLocation: 'product',
      swatchType: 'UK size',
      swatchValue: { CA: 'CA L', US: 'L', default: 'Large' },
      swatchVariant: '',
    })
  })

  it('should render the component properly and trigger onSizeChange function when selectedWidth is present in default props and user changes the size by clicking', () => {
    makeSetup({ selectedWidth: { id: '123' } })
    const mockProps = MockProductSizeControls.mock.calls[0][0]
    const value = {
      id: 'size-004',
      value: 'size-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onSizeClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalledWith('swatchInteraction', {
      eventAction: 'swatch click',
      eventLabel: undefined,
      eventLocation: 'product',
      swatchType: 'UK size',
      swatchValue: { CA: 'CA L', US: 'L', default: 'Large' },
      swatchVariant: '',
    })
  })

  it('should render variation messages without crashing', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup({ hideError: false })
    expect(getByTestId('variation-messages')).toBeVisible()
  })

  it('should render the component properly when custom attributes and masterId is available in productData', () => {
    const { getAllByTestId } = makeSetup({
      selectedVG: {},
      isBundleProduct: true,
    })
    expect(getAllByTestId('product-size-controls')[0]).toBeVisible()
  })

  it('should render the component properly when selectedMaterial is empty', () => {
    const { getAllByTestId } = makeSetup({ selectedMaterial: {} })
    expect(getAllByTestId('product-size-controls')[0]).toBeVisible()
  })

  it('should render the component properly when variant is taken from variationGroupData', () => {
    const updatedProductData = {
      ...productData,
      masterProductData: undefined,
    }
    const { getAllByTestId } = makeSetup({
      productData: updatedProductData,
      variationGroupData: { variants: 'extendedAdaptiveTabbedPDP' },
    })
    expect(getAllByTestId('product-size-controls')[0]).toBeVisible()
  })

  it('should render the component properly and trigger onWidthChange function when user changes the width by clicking', () => {
    makeSetup()
    const mockProps = MockProductSizeControls.mock.calls[1][0]
    const value = {
      id: 'width-004',
      value: 'width-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onWidthClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('should render the component properly and trigger onWidthChange function when isQuickView is true', () => {
    makeSetup({ isQuickView: true })
    const mockProps = MockProductSizeControls.mock.calls[1][0]
    const value = {
      id: 'width-004',
      value: 'width-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onWidthClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('should render the component properly when isServerSide is true', () => {
    const updatedProductData = {
      ...productData,
      isServerSide: true,
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component properly when isServerSide is true and selectedColor is empty', () => {
    const updatedProductData = {
      ...productData,
      isServerSide: true,
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
      selectedColor: undefined,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component properly when default color is not oderable', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const updatedColors = [
      {
        id: 'red',
        masterId: 'master123',
        name: 'Red',
        orderable: false,
        displayIfOOS: false,
      },
      {
        id: 'blue',
        masterId: 'master123',
        name: 'Blue',
        orderable: true,
        displayIfOOS: false,
      },
    ]
    const updatedProductData = {
      ...productData,
      colors: updatedColors,
    }
    const updatedSelectedColor = {
      ...selectedColor,
      id: null,
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
      selectedColor: updatedSelectedColor,
    })
    expect(getByTestId('product-material-controls')).toBeVisible()
  })

  it('should render the component properly when default color is out of stock', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const updatedColors = [
      {
        id: 'red',
        masterId: 'master123',
        name: 'Red',
        orderable: false,
        displayIfOOS: false,
      },
      {
        id: 'blue',
        masterId: 'master123',
        name: 'Blue',
        orderable: false,
        displayIfOOS: true,
      },
    ]
    const updatedProductData = {
      ...productData,
      colors: updatedColors,
    }
    const updatedSelectedColor = {
      ...selectedColor,
      id: null,
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
      selectedColor: updatedSelectedColor,
    })
    expect(getByTestId('product-material-controls')).toBeVisible()
  })

  it('should render the component properly when out of stock swatch is visible', () => {
    const updatedProductData = {
      ...productData,
      defaultVariant: {
        variationValues: {},
      },
    }
    const { getByTestId } = makeSetup({
      showOosSwatch: true,
      productData: updatedProductData,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component properly when mega pdp is eligible', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const updatedColors = [
      {
        id: 'red',
        masterId: 'master123',
        name: 'Red',
        orderable: false,
        displayIfOOS: true,
      },
    ]
    const updatedProductData = {
      ...productData,
      colors: updatedColors,
      defaultVariant: {
        variationValues: {},
      },
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
    })
    expect(getByTestId('product-material-controls')).toBeVisible()
  })

  it('should render the component properly when mega pdp is not eligible and show out of stock swatch is disabled', () => {
    const updatedColors = [
      {
        id: 'red',
        masterId: 'master123',
        name: 'Red',
        orderable: true,
        displayIfOOS: false,
      },
    ]
    const updatedProductData = {
      ...productData,
      colors: updatedColors,
      defaultVariant: {
        variationValues: {},
      },
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component when selected color has base product Id', () => {
    const updatedSelectedColor = {
      ...selectedColor,
      baseProductId: 'baseId123',
    }
    const { getByTestId } = makeSetup({
      selectedColor: updatedSelectedColor,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component when customized base product id is available', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isMegaPDPEligibleAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const updatedProductData = {
      ...productData,
      variant: [
        {
          variationValues: {
            color: 'baseId123',
          },
        },
      ],
    }
    const updatedSelectedColor = {
      ...selectedColor,
      isCustomized: true,
      baseProductId: 'baseId123',
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
      selectedColor: updatedSelectedColor,
    })
    expect(getByTestId('product-material-controls')).toBeVisible()
  })

  it('should render the component when selected color id is unavailable', () => {
    const updatedSelectedColor = {
      ...selectedColor,
      id: null,
    }
    const { getByTestId } = makeSetup({
      selectedColor: updatedSelectedColor,
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
  })

  it('should render the component properly and trigger onColorChange function when user changes the color', () => {
    makeSetup()
    const mockProps = MockProductColorControls.mock.calls[0][0]
    const value = {
      id: 'width-004',
      value: 'width-004-alt',
      text: {
        US: 'L',
        CA: 'CA L',
        default: 'Large',
      },
    }
    mockProps.onChange(value)
    expect(defaultProps.onUserClick).toHaveBeenCalled()
    expect(defaultProps.onColorClick).toHaveBeenCalled()
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('should call tangiblee with productSilentUpdate and renderd the component properly', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product-color-controls')).toBeVisible()
    expect(mockTangiblee).toHaveBeenCalledTimes(2)
    expect(mockTangiblee).toHaveBeenCalledWith('isModalOpened')
    expect(mockTangiblee).toHaveBeenCalledWith('productSilentUpdate', {
      currency: '$',
      discountedPrice: undefined,
      inStock: true,
      price: '198',
      sku: 'kl986_962',
      variations: [],
    })
  })

  it('should render the component properly and call setSelectedWidth with true', () => {
    const { getByTestId } = makeSetup({ preSelectedWidth: true })
    expect(getByTestId('product-color-controls')).toBeVisible()
    expect(defaultProps.setSelectedWidth).toHaveBeenCalledWith(true)
  })

  it('should render the component properly and call setSelectedWidth when productData does not content variant in productType', () => {
    const updatedProductData = {
      ...productData,
      widths: [{ id: 'wide', label: 'Wide' }],
      sizes: [{ id: 'M', label: 'Medium' }],
      defaultVariant: {
        variationValues: {
          size: 'M',
          width: 'wide',
        },
      },
      productType: {
        variant: null,
      },
    }
    const { getByTestId } = makeSetup({
      productData: updatedProductData,
      newSelectedVariant: { id: 'v123' },
    })
    expect(getByTestId('product-color-controls')).toBeVisible()
    expect(defaultProps.setSelectedWidth).toHaveBeenCalledWith({ id: 'wide', label: 'Wide' })
  })

  it('should render the component properly and call setSelectedColor when selectedColor orderable is false', () => {
    const updatedSelectedColor = {
      orderable: false,
    }
    const { getByTestId } = makeSetup({ selectedColor: updatedSelectedColor })
    expect(getByTestId('product-color-controls')).toBeVisible()
    expect(defaultProps.setSelectedColor).toHaveBeenCalled()
  })
})
