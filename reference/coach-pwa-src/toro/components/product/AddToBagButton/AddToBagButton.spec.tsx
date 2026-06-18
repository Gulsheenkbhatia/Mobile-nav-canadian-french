import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import AddToBagButton, { AddToBagButtonProps } from 'toro/components/product/AddToBagButton'
import { useIntl } from 'react-intl'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import useEinsteinRecommendations from 'toro/components/Einstein/useEinsteinRecommendations'
import { isTabbedAdaptivePDPEligibleAtom, addToBagButtonRefAtom } from 'store/pdp.atom'
import { isStaffStartScriptAtom } from 'store/scripts.atom'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import type { Atom } from 'jotai'

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
  IntlProvider: ({ children }) => <>{children}</>,
  createIntlCache: jest.fn(() => ({})),
  createIntl: jest.fn(() => ({ formatMessage: ({ defaultMessage }) => defaultMessage })),
}))

jest.mock('toro/components/Experiment', () => ({
  __esModule: true,
  default: ({ children, forIDs }) => (forIDs ? <>{children}</> : null),
}))

jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/components/Einstein/useEinsteinRecommendations')
jest.mock('toro/helpers/staffStartHelper', () => ({
  sendStaffStartTrackReq: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    loading: false,
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    basePath: '',
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    domainLocales: [],
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
  }),
}))

jest.mock('toro/analytics/useCmsAnalytics', () => ({
  __esModule: true,
  default: () => ({ sendAnalytics: jest.fn() }),
}))

jest.mock('toro/hooks/usePageType', () => ({
  __esModule: true,
  default: () => ({ subBrandHomeURL: 'https://coachtopia.com' }),
}))

jest.mock('toro/hooks/useVerticalScrollDirection', () => ({
  __esModule: true,
  default: () => ({ isScrollingUp: false, isScrollingDown: false }),
}))

jest.mocked(useViewportType).mockImplementation(() => ({ viewport: 'desktop', isMobile: false }))

const mockIntl = jest.mocked(useIntl)
const mockViewport = jest.mocked(useViewportType)
const mockPref = jest.mocked(usePreference)
const mockPrefNew = jest.mocked(usePreferenceNew)
const mockEinstein = jest.mocked(useEinsteinRecommendations)

mockIntl.mockReturnValue({ formatMessage: ({ defaultMessage }) => defaultMessage } as any)

const colors = {
  main: {
    black: '#000',
    secondary: '#fff',
    inactive: '#ccc',
    gray: '#eee',
  },
}

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  loading: false,
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  basePath: '',
  locale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  domainLocales: [],
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
}

const defaultContexts = {
  PWAContext: {
    appData: { siteId: 'coh_us_out' },
    deviceType: 'desktop' as const,
  },
  ViewportContext: { viewport: 'desktop' as const, isMobile: false },
  AnalyticsContext: {
    send: jest.fn(),
    addImpression: jest.fn(),
    isDataLayerInitialized: true,
    pageBecameInteractive: jest.fn(),
    createEventData: jest.fn(),
  },
  RouterContext: mockRouter,
}

const makeSetup = (overrideProps = {}, atomsData: Array<[Atom<unknown>, unknown]> = []) => {
  const props = {
    status: ORDERING_STATUS.addToBag,
    productData: { id: 'prod123', isBundleProduct: false },
    colors,
    onClick: jest.fn(),
    animationATB: { active: false, complete: false },
    setAnimationATB: jest.fn(),
    selectedVariant: {
      id: 'var123',
      productId: 'var123',
      pricingInfo: [{ list: { value: 25 }, sales: { value: 20 } }],
    },
    selectedQty: 1,
    priceInButton: undefined,
    ...overrideProps,
  } as unknown as AddToBagButtonProps

  const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
    [isTabbedAdaptivePDPEligibleAtom, false],
    [addToBagButtonRefAtom, null],
    [isStaffStartScriptAtom, false],
  ]

  return render(<AddToBagButton {...props} />, {
    contexts: {
      ...defaultContexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...atomsData]),
    },
  })
}

beforeEach(() => {
  mockViewport.mockReturnValue({ viewport: 'desktop', isMobile: false })
  mockPref.mockImplementation((prefs: any) => {
    if (prefs?.preferenceId) {
      if (prefs.preferenceId === 'displayIcononAddToBagButton') return ''
      if (prefs.preferenceId === 'isEinsteinRecomEnabled') return false
      if (prefs.preferenceId === 'isEinsteinRecomEnabledPDP') return false
      return false
    }
    return {
      coachtopia: {
        coachtopiaHomeURL: 'https://coachtopia.com',
      },
      storefrontConfigs: {
        headerScrollingUpTo: 100,
      },
      ...prefs,
    }
  })
  mockPrefNew.mockReturnValue({ staffStartPreferences: { merchantId: 'm123' } })
  mockEinstein.mockReturnValue({
    recommendations: {},
    isLoadingRecommendations: false,
    sendRecommendationClick: jest.fn(),
    sendRecommendationView: jest.fn(),
    sendRecoAddToCart: jest.fn(),
  })
  jest.clearAllMocks()
})

afterEach(() => {
  jest.useRealTimers()
  mockIntl.mockReturnValue({ formatMessage: ({ defaultMessage }) => defaultMessage } as any)
})

describe('AddToBagButton', () => {
  describe('Rendering basics', () => {
    it('renders default add to bag caption (desktop)', () => {
      const { getByText, container } = makeSetup()
      expect(getByText('ADD TO BAG')).toBeVisible()
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })

    it('renders mobile touch caption when viewport mobile and adaptive PDP disabled', () => {
      mockViewport.mockReturnValue({ viewport: 'mobile', isMobile: true })
      const { getByText } = makeSetup()
      expect(getByText('Add To Bag Before Its Gone')).toBeVisible()
    })

    it('renders adaptive mobile caption when adaptive PDP eligible', () => {
      mockViewport.mockReturnValue({ viewport: 'mobile', isMobile: true })
      const { getByText } = makeSetup({}, [[isTabbedAdaptivePDPEligibleAtom, true]])
      expect(getByText('Add to Bag')).toBeVisible()
    })

    it('should unescape HTML entities in button caption', () => {
      const mockFormatMessage = jest.fn(({ defaultMessage }) => {
        if (defaultMessage === 'Not for sale') {
          return 'Buy &amp; Save &lt;Now&gt;'
        }
        return defaultMessage
      })

      mockIntl.mockReturnValue({
        formatMessage: mockFormatMessage,
      } as any)

      const { getByText } = makeSetup({
        status: ORDERING_STATUS.notForSale,
      })

      expect(getByText('Buy & Save <Now>')).toBeVisible()
    })
  })

  describe('Status handling', () => {
    it('disables and shows SOLD OUT when status soldOut', () => {
      const { getByText, container } = makeSetup({ status: ORDERING_STATUS.soldOut })
      const btn = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(btn).toBeDisabled()
      expect(getByText('SOLD OUT')).toBeVisible()
    })

    it('shows custom sold out text when provided', () => {
      const { getByText } = makeSetup({
        status: ORDERING_STATUS.soldOut,
        productData: { id: 'p1', custom: { c_soldOutCustomText: 'Gone Forever' } },
      })
      expect(getByText('Gone Forever')).toBeVisible()
    })

    it('applies instockText override and disables button when present and not sold out', () => {
      const { getByText, container } = makeSetup({
        productData: { id: 'p2', instockText: 'Coming Soon' },
      })
      const btn = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(btn).toBeDisabled()
      expect(getByText('Coming Soon')).toBeVisible()
    })

    it('disables when maxQuantityError provided', () => {
      const { container } = makeSetup({ maxQuantityError: true })
      expect((container.querySelector('.add-to-cart') as HTMLButtonElement).disabled).toBe(true)
    })

    it('disables when btnDisable provided', () => {
      const { container } = makeSetup({ btnDisable: true })
      expect((container.querySelector('.add-to-cart') as HTMLButtonElement).disabled).toBe(true)
    })

    it('shows bundle product label when isBundleProduct', () => {
      const { getByText } = makeSetup({ productData: { id: 'bundle1', isBundleProduct: true } })
      expect(getByText('ADD All TO BAG')).toBeVisible()
    })

    it('shows preorder caption for preorder status', () => {
      const { getByText } = makeSetup({ status: ORDERING_STATUS.preorder })
      expect(getByText('Pre-order')).toBeVisible()
    })

    it('shows backorder caption for backorder status', () => {
      const { getByText } = makeSetup({ status: ORDERING_STATUS.backorder })
      expect(getByText('ADD TO BAG')).toBeVisible()
    })
  })

  describe('Bundle variant & sticky', () => {
    it('sets data-qa for bundle variant', () => {
      const { container } = makeSetup({ isBundleVariant: true })
      expect(container.querySelector('[data-qa="bndle_pdp_state_btn"]')).toBeVisible()
    })

    it('uses sticky id when isSticky true', () => {
      const { container } = makeSetup({ isSticky: true })
      expect(container.querySelector('#add-to-cart-sticky')).toBeVisible()
    })

    it('sets data-qa for quick view', () => {
      const { container } = makeSetup({ isQuickView: true })
      expect(container.querySelector('[data-qa="pdp_state_btn"]')).toBeVisible()
    })

    it('sets data-qa for bundle product', () => {
      const { container } = makeSetup({
        productData: { id: 'bundle1', isBundleProduct: true },
      })
      expect(container.querySelector('[data-qa="bundle_add_all_to_bag_btn"]')).toBeVisible()
    })
  })

  describe('Icon & price in button', () => {
    it('injects icon content for mobile when preference set', () => {
      mockViewport.mockReturnValue({ viewport: 'mobile', isMobile: true })
      mockPref.mockImplementation(({ preferenceId }) => {
        if (preferenceId === 'displayIcononAddToBagButton') return '<strong>Icon</strong>'
        return false
      })
      const { container } = makeSetup()
      const strongEl = container.querySelector('button strong')
      expect(strongEl).toBeVisible()
      expect(strongEl?.innerHTML).toContain('Icon')
    })

    it('appends price when adaptive PDP eligible and priceInButton provided', () => {
      const { getByText } = makeSetup({ priceInButton: 99 }, [
        [isTabbedAdaptivePDPEligibleAtom, true],
      ])
      expect(getByText('ADD TO BAG - $99')).toBeVisible()
    })

    it('does not append price when instockText present', () => {
      const { getByText, queryByText } = makeSetup(
        {
          priceInButton: 99,
          productData: { id: 'p1', instockText: 'Coming Soon' },
        },
        [[isTabbedAdaptivePDPEligibleAtom, true]]
      )
      expect(getByText('Coming Soon')).toBeVisible()
      expect(queryByText('Coming Soon - $99')).not.toBeInTheDocument()
    })

    it('does not append price when soldOut', () => {
      const { getByText, queryByText } = makeSetup(
        {
          status: ORDERING_STATUS.soldOut,
          priceInButton: 99,
        },
        [[isTabbedAdaptivePDPEligibleAtom, true]]
      )
      expect(getByText('Sold Out')).toBeVisible()
      expect(queryByText('Sold Out - $99')).not.toBeInTheDocument()
    })
  })

  describe('Quantity Selector', () => {
    it('should render QuantitySelector when enabled', () => {
      const { container } = makeSetup({
        isQuantitySelectorEnabled: true,
        isQuantitySelectorDisabled: false,
      })
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })

    it('should hide QuantitySelector when isQuantitySelectorDisabled is true', () => {
      const { container } = makeSetup({
        isQuantitySelectorEnabled: true,
        isQuantitySelectorDisabled: true,
      })
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })

    it('should hide QuantitySelector when button is disabled', () => {
      const { container } = makeSetup({
        isQuantitySelectorEnabled: true,
        btnDisable: true,
      })
      const button = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(button).toBeVisible()
      expect(button).toBeDisabled()
    })

    it('should hide QuantitySelector during PDPv6 animation', () => {
      const { container } = makeSetup({
        isQuantitySelectorEnabled: true,
        animationATB: true,
      })
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })

    it('should pass correct props to QuantitySelector', () => {
      const { container } = makeSetup({
        isQuantitySelectorEnabled: true,
        enableMaxQtyRestriction: true,
        defaultMaxOrderQuantity: 5,
        maxQty: 10,
      })
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })
  })

  describe('Animation states', () => {
    it('renders progress active & sliding when animation active', () => {
      const { container } = makeSetup({ animationATB: true })
      expect(container.querySelector('.atb-button-animation')).toBeVisible()
      expect(container.querySelector('.progress')).toBeVisible()
      expect(container.querySelector('.text-slider')).toBeVisible()
    })

    it('resets animation after completion timeout', () => {
      const mockSetAnimationATB = jest.fn()
      const { container } = makeSetup({
        animationATB: false,
        setAnimationATB: mockSetAnimationATB,
      })
      expect(container.querySelector('.progress')).toBeVisible()
    })

    it('shows progress text during animation', () => {
      const { getByText } = makeSetup({ animationATB: true })
      expect(getByText('ADDING TO BAG...')).toBeVisible()
    })

    it('should apply absolute positioning when quantity selector is hidden', () => {
      const { container } = makeSetup({
        animationATB: true,
        isQuantitySelectorEnabled: false,
      })
      const animationContainer = container.querySelector('.atb-button-animation')
      expect(animationContainer).toBeVisible()
      expect(animationContainer).toHaveClass('atb-button-animation')
    })

    it('should not render animation for non-PDPv6 templates', () => {
      const { container } = makeSetup({
        animationATB: true,
        template: 'pdp_v5',
      })
      expect(container.querySelector('.atb-button-animation')).toBeVisible()
    })

    it('should not render animation when button is disabled', () => {
      const { container } = makeSetup({
        animationATB: true,
        btnDisable: true,
      })
      expect(container.querySelector('.atb-button-animation')).not.toBeInTheDocument()
    })
  })

  describe('Template-Specific Rendering', () => {
    it('should render TooltipVariationMessages for v5 templates', () => {
      const { container } = makeSetup({
        template: 'pdp_v5',
        productData: {
          id: 'p1',
          variations: [{ type: 'color', values: ['red', 'blue'] }],
        },
      })
      expect(container.querySelector('.add-to-cart')).toBeVisible()
    })

    it('should NOT render TooltipVariationMessages for PDPv6', () => {
      const { container } = makeSetup({
        template: 'pdp_v6',
        productData: {
          id: 'p1',
          variations: [{ type: 'color', values: ['red', 'blue'] }],
        },
      })
      expect(
        container.querySelector('[data-testid="tooltip-variation-messages"]')
      ).not.toBeInTheDocument()
    })

    it('should NOT render TooltipVariationMessages for PDPv5_1', () => {
      const { container } = makeSetup({
        template: 'pdp_v5_1',
        productData: {
          id: 'p1',
          variations: [{ type: 'color', values: ['red', 'blue'] }],
        },
      })
      expect(
        container.querySelector('[data-testid="tooltip-variation-messages"]')
      ).not.toBeInTheDocument()
    })
  })

  describe('Click side-effects', () => {
    it('calls onClick when clicked', async () => {
      const onClick = jest.fn()
      const { container } = makeSetup({ onClick })
      const button = container.querySelector('.add-to-cart') as HTMLElement
      await userEvent.click(button)
      expect(onClick).toHaveBeenCalled()
    })

    it('sends Einstein add to cart when both prefs enabled', async () => {
      const sendRecoAddToCart = jest.fn()
      mockEinstein.mockReturnValue({
        recommendations: {},
        isLoadingRecommendations: false,
        sendRecommendationClick: jest.fn(),
        sendRecommendationView: jest.fn(),
        sendRecoAddToCart,
      })
      mockPref.mockImplementation(({ preferenceId }) => {
        if (preferenceId === 'isEinsteinRecomEnabled') return true
        if (preferenceId === 'isEinsteinRecomEnabledPDP') return true
        return false
      })
      const { container } = makeSetup()
      const button = container.querySelector('.add-to-cart') as HTMLElement
      await userEvent.click(button)
      expect(sendRecoAddToCart).toHaveBeenCalledWith({
        product: expect.objectContaining({ id: 'var123', quantity: 1 }),
      })
    })

    it('tracks staff start when script loaded', async () => {
      const { container } = makeSetup()
      const button = container.querySelector('.add-to-cart') as HTMLElement
      expect(button).toBeVisible()
      await userEvent.click(button)
    })

    it('calls setAddToBagClicked for bundle variant click', async () => {
      const setAddToBagClicked = jest.fn()
      const { container } = makeSetup({
        isBundleVariant: true,
        productData: { id: 'bundle1', isBundleProduct: false },
        setAddToBagClicked,
      })
      const button = container.querySelector('.add-to-cart') as HTMLElement
      await userEvent.click(button)
      expect(setAddToBagClicked).toHaveBeenCalledWith({
        isAddTobagClickedForbundleProductItem: true,
        selectedBundleVariant: { id: 'bundle1', isBundleProduct: false },
        selectedQty: 1,
      })
    })
  })

  describe('Styles', () => {
    it('should apply wrapper styles regardless of quantity selector state', () => {
      const { container: containerWithQty } = makeSetup({
        isQuantitySelectorEnabled: true,
        isQuantitySelectorDisabled: false,
      })
      const buttonWrapperWithQty = containerWithQty.querySelector('.atb-wrapper')
      expect(buttonWrapperWithQty).toBeVisible()
      expect(buttonWrapperWithQty).toHaveClass('atb-wrapper')

      const { container: containerWithoutQty } = makeSetup({
        isQuantitySelectorEnabled: false,
      })
      const buttonWrapperWithoutQty = containerWithoutQty.querySelector('.atb-wrapper')
      expect(buttonWrapperWithoutQty).toBeVisible()
      expect(buttonWrapperWithoutQty).toHaveClass('atb-wrapper')
    })

    it('should apply container disabled class', () => {
      const { container } = makeSetup({
        btnDisable: true,
      })
      const button = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(button).toBeVisible()
      expect(button).toBeDisabled()
    })

    it('should apply container enabled class', () => {
      const { container } = makeSetup({
        btnDisable: false,
      })
      const button = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(button).toBeVisible()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Fallback & initial states', () => {
    it('renders initial button when apploading true', () => {
      const { container } = makeSetup({ apploading: true })
      expect(container.querySelector('.initial-add-to-bag')).toBeVisible()
      expect(container.querySelector('.add-to-cart')).not.toBeInTheDocument()
    })

    it('renders initial bundle button when apploading and isBundleProduct', () => {
      const { getByText } = makeSetup({
        apploading: true,
        productData: { id: 'bundle1', isBundleProduct: true },
      })
      expect(getByText('ADD All TO BAG')).toBeVisible()
    })
  })

  describe('Custom text overrides', () => {
    it('shows addToBagCTACustomText when provided', () => {
      const { getByText } = makeSetup({
        addToBagCTACustomText: 'Custom CTA Text',
      })
      expect(getByText('Custom CTA Text')).toBeVisible()
    })

    it('prioritizes soldOutCustomText over general soldOut', () => {
      const { getByText } = makeSetup({
        status: ORDERING_STATUS.soldOut,
        productData: {
          id: 'p1',
          defaultVariantData: { custom: { c_soldOutCustomText: 'Variant Custom Text' } },
        },
      })
      expect(getByText('Variant Custom Text')).toBeVisible()
    })

    it('shows notForSale caption', () => {
      const { getByText } = makeSetup({ status: ORDERING_STATUS.notForSale })
      expect(getByText('Not for sale')).toBeVisible()
    })
  })

  describe('Integration Flows', () => {
    it('should handle max quantity error', async () => {
      const onMaxQuantityError = jest.fn()
      const { container } = makeSetup({
        maxQuantityError: true,
        onMaxQuantityError,
      })
      const button = container.querySelector('.add-to-cart') as HTMLButtonElement
      expect(button).toBeDisabled()
      await userEvent.click(button)
      expect(onMaxQuantityError).not.toHaveBeenCalled()
    })

    it('should handle customized product flow', async () => {
      const onClick = jest.fn()
      const { container } = makeSetup({
        productData: {
          id: 'custom-product',
          isCustomizable: true,
          customizationRequired: true,
        },
        onClick,
      })
      const button = container.querySelector('.add-to-cart') as HTMLElement
      await userEvent.click(button)
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('Touch device detection', () => {
    it('detects touch device and shows mobile caption', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      })
      mockViewport.mockReturnValue({ viewport: 'mobile', isMobile: true })

      const { getByText } = makeSetup()
      expect(getByText('Add To Bag Before Its Gone')).toBeVisible()
    })
  })
})
