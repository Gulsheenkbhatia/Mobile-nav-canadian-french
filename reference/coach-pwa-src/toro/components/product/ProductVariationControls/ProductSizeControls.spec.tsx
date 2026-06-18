import { render, CustomRenderOptions } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductSizeControls from 'toro/components/product/ProductVariationControls/ProductSizeControls'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useTheme from 'toro/hooks/useTheme'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import {
  countryTabIndexAtom,
  selectedSizeAtom,
  setSelectedSizeAtom,
  userInteractedAtom,
} from 'store/pdp.atom'

jest.mock('jotai')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/hooks/useTheme')
jest.mock('store/pdp.atom', () => ({
  __esModule: true,
  alterCtaToShowAtom: {},
  countryTabIndexAtom: {},
  userInteractedAtom: {},
}))

const mockedUseTheme = useTheme as jest.Mock
const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFn<typeof useMultiStyleConfig>
const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>

jest.mock('toro/components/product/ProductVariationControls/AlignedControlsContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-qa="aligned_controls_container">{children}</div>
  ),
}))
jest.mock('toro/components/product/ProductVariationControls/ProductSizeControl', () => ({
  __esModule: true,
  default: ({ onClick }: { onClick: () => void }) => (
    <div data-qa="product_size_control" onClick={onClick}>
      Product Size Control
    </div>
  ),
}))
jest.mock('toro/components/product/ProductVariationControls/ProductVariationLabel', () => ({
  __esModule: true,
  default: ({ onTabChange }: { onTabChange: () => void }) => (
    <div data-qa="product_variation_label" onClick={() => onTabChange()}>
      Product Variation Label
    </div>
  ),
}))
jest.mock('toro/components/product/SizeGuideButton', () => () => (
  <div data-qa="size_guide_button">Size Guide Button</div>
))
jest.mock('toro/components/Experiment', () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
))

const onChangeMock = jest.fn()
const setShowSizeGuidePopUpMock = jest.fn()
const setFullScreenLoadingMock = jest.fn()
const setUserInteractedMock = jest.fn()
const sendAnalyticsMock = jest.fn()

const mockUseMultiStyleConfigElements = {
  sizeVariantsWrapper: {},
  sizeControlsHeader: {},
}

const defaultProps = {
  label: 'Size',
  customFitNote: {},
  items: [
    {
      keyAttrDisplayValue: 'M',
      productURL: '/product/123',
      recommendedProductID: 'prod-1',
      availability: true,
      id: 'm',
    },
  ],
  selectedItem: { id: 'm' },
  availableItems: ['m'],
  showErrorIfEmpty: false,
  maxItemsInRow: 4,
  onChange: onChangeMock,
  isSticky: false,
  isQuickView: false,
  rangeValue: 1,
  productId: 'product-123',
  gender: 'men',
  isVariationTypeControls: false,
  masterId: 'prod-1',
  variantDataList: [[{ id: 'prod-1', name: 'Variant C' }], [{ id: 'prod-999', name: 'Variant D' }]],
  isBundleVariant: false,
  variantType: 'size',
  isNeutralSizingApplicable: false,
  neutralSizingCountryTypes: ['US'],
  isNewMegaPDPEligible: false,
  setShowSizeGuidePopUp: setShowSizeGuidePopUpMock,
  sizeGuideContent: {},
  showSizeGuide: true,
  variant: '',
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
  return render(<ProductSizeControls {...combinedProps} />, renderOptions)
}

describe('ProductSizeControls', () => {
  beforeEach(() => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: false }))
    mockedUseTheme.mockReturnValue({ space: { xs: '4px', s: '8px' } })
    mockedUseAnalytics.mockImplementation(() => ({
      send: sendAnalyticsMock,
    }))
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    mockedUseAtom.mockImplementation((atom) => {
      if (atom === setFullscreenLoadingAtom) {
        return [null, setFullScreenLoadingMock]
      }
      if (atom == userInteractedAtom) {
        return [null, setUserInteractedMock]
      }
      return [null, jest.fn()]
    })
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case countryTabIndexAtom:
          return 0
        case selectedSizeAtom:
          return undefined
        default:
          return undefined
      }
    })
    mockedUseUpdateAtom.mockImplementation((atom) => {
      if (atom === setSelectedSizeAtom) {
        return jest.fn()
      }
      return jest.fn()
    })
  })

  it('should render the component without crashing with default props', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('product_variation_label')).toBeVisible()
    expect(getByTestId('aligned_controls_container')).toBeVisible()
  })

  it('should render the component without crashing when isVariationTypeControls is true', () => {
    const { getByTestId } = makeSetup({ isVariationTypeControls: true })
    expect(getByTestId('product_variation_label')).toBeVisible()
    expect(getByTestId('aligned_controls_container')).toBeVisible()
  })

  it('should call setUserInteracted, setFullScreenLoading when user clicks on the link and isVariationTypeControls is true', async () => {
    const user = userEvent.setup()
    const { container } = makeSetup({ isVariationTypeControls: true, masterId: 'prod-2' })
    const target = container.querySelector('a')
    await user.click(target)
    expect(setUserInteractedMock).toHaveBeenCalledWith(true)
    expect(setFullScreenLoadingMock).toHaveBeenCalledWith(true)
  })

  it('should call onChange when user clicks on product size control and isVariationTypeControls is true', async () => {
    const user = userEvent.setup()
    const { getByTestId } = makeSetup({ isVariationTypeControls: true, masterId: 'prod-2' })
    const target = getByTestId('product_size_control')
    await user.click(target)
    expect(onChangeMock).toHaveBeenCalledWith(defaultProps.items[0])
  })

  it('should call onSizesTabChange and analytics.send when user clicks on product variation label', async () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const user = userEvent.setup()
    const { getByTestId } = makeSetup({
      masterId: undefined,
      isBundleVariant: true,
      showErrorIfEmpty: true,
    })
    const target = getByTestId('product_variation_label')
    await user.click(target)
    expect(sendAnalyticsMock).toHaveBeenCalled()
  })

  it('should return null when items array is empty', () => {
    const { queryByTestId } = makeSetup({ items: [] })
    expect(queryByTestId('product_variation_label')).not.toBeInTheDocument()
  })

  it('should render the component properly when isSticky is true', () => {
    const { getByTestId } = makeSetup({ isSticky: true })
    expect(getByTestId('product_variation_label')).toBeVisible()
  })

  it('should render the component properly when isSticky is true and viewport is mobile view', () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const { getByTestId } = makeSetup({ isSticky: true })
    expect(getByTestId('product_variation_label')).toBeVisible()
  })

  it('should render the component without crashing when isNewMegaPDPEligible is true and viewport is mobile view', () => {
    mockedUseViewportType.mockImplementation(() => ({ isMobile: true }))
    const { getByTestId } = makeSetup({ isNewMegaPDPEligible: true })
    expect(getByTestId('product_variation_label')).toBeVisible()
    expect(getByTestId('aligned_controls_container')).toBeVisible()
  })

  it('should render the component without crashing when variant is extendedAdaptiveTabbedPDP', () => {
    const { getByTestId } = makeSetup({ variant: 'extendedAdaptiveTabbedPDP' })
    expect(getByTestId('product_variation_label')).toBeVisible()
    expect(getByTestId('aligned_controls_container')).toBeVisible()
  })

  it('should render the component without crashing when items id matches with selectedItem value', () => {
    const { getByTestId } = makeSetup({ selectedItem: { value: 'm' } })
    expect(getByTestId('product_variation_label')).toBeVisible()
    expect(getByTestId('aligned_controls_container')).toBeVisible()
  })
})
