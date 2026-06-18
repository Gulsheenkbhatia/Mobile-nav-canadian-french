import { render, screen, waitFor, fireEvent } from 'test-utils/react'
import { useAtomValue, useUpdateAtom, useHydrateAtoms } from 'jotai/utils'
import AfterpayWidget from './AfterpayWidget'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import { Provider as JotaiProvider } from 'jotai'
import { appLoadingAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

jest.mock('jotai/utils')
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
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})
jest.mock('toro/hooks/usePreference_new', () => jest.fn())
jest.mock('toro/hooks/useViewportType', () => jest.fn())
jest.mock('toro/hooks/useExperiment', () => jest.fn())

describe('AfterpayWidget', () => {
  const mockSetAfterpayScriptLoaded = jest.fn()
  const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
  const mockUseUpdateAtom = useUpdateAtom as jest.Mock
  const mockUsePreference = usePreference as jest.Mock
  const mockUseViewportType = useViewportType as jest.Mock
  const mockUseExperiment = useExperiment as jest.Mock

  beforeEach(() => {
    mockedUseAtomValue.mockImplementation(() => false)
    mockUseUpdateAtom.mockReturnValue(mockSetAfterpayScriptLoaded)

    mockUsePreference.mockReturnValue({
      afterPay: {
        apJavaScript: 'http://test-script-url',
        enableAfterpay: true,
        afterPayMPID: 'test-mpid',
      },
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    })

    mockUseViewportType.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    })

    mockUseExperiment.mockReturnValue(true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const HydrateAtomsWrapper = ({ children, atomValues }) => {
    useHydrateAtoms(atomValues)
    return children
  }

  const renderComponent = ({
    apploading = false,
    breakpointContext = {},
    variant = 'test-variant',
  }: {
    apploading?: boolean
    breakpointContext?: any
    variant?: string
  } = {}) => {
    const atomValues = [[appLoadingAtom, apploading]]

    return render(
      <JotaiProvider>
        <HydrateAtomsWrapper atomValues={atomValues}>
          <ProductMainSectionBreakpointContext.Provider value={breakpointContext}>
            <AfterpayWidget variant={variant} />
          </ProductMainSectionBreakpointContext.Provider>
        </HydrateAtomsWrapper>
      </JotaiProvider>
    )
  }

  it('should render AfterpayWidget when conditions are met', async () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '100' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    expect(screen.getByTestId('After_Pay')).toBeVisible()
  })

  it('should not render AfterpayWidget when apploading is true', () => {
    renderComponent({ apploading: true })
    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should not render AfterpayWidget when price is out of range', () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '5000' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should not render AfterpayWidget when ordering status is preorder or backorder', () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '100' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.preorder,
      },
    })

    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should not render AfterpayWidget when enableAfterpay is false', () => {
    mockUsePreference.mockReturnValue({
      afterPay: {
        apJavaScript: 'http://test-script-url',
        enableAfterpay: false,
        afterPayMPID: 'test-mpid',
      },
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    })

    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '100' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should handle script load success', async () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '100' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    const script = screen.getByTestId('afterpay-script')

    fireEvent.load(script)

    await waitFor(() => expect(mockSetAfterpayScriptLoaded).toHaveBeenCalledWith(true))
  })

  it('should not render AfterpayWidget when price is missing', () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: undefined } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should not render AfterpayWidget when price is "N/A"', () => {
    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: 'N/A' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })

    expect(screen.queryByTestId('After_Pay')).toBeNull()
  })

  it('should render AfterpayWidget with data-logo-type="lockup" when isMobile and isPDPV5Enabled are false', () => {
    mockUseViewportType.mockReturnValue({
      isMobile: false,
      isDesktop: true,
    })

    mockUseExperiment.mockReturnValue(false)

    renderComponent({
      apploading: false,
      breakpointContext: {
        selectedVariant: { pricingInfo: [{ sales: { value: '100' } }] },
        cart: { currency: 'USD' },
        orderingStatus: ORDERING_STATUS.available,
      },
    })
    expect(screen.getByTestId('After_Pay').querySelector('afterpay-placement')).toHaveAttribute(
      'data-logo-type',
      'lockup'
    )
  })
})
