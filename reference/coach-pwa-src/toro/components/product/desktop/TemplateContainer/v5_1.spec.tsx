import 'regenerator-runtime/runtime'
import { render, waitFor } from 'test-utils/react'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import TemplateContainer from './v5_1'
import {
  productDataAtom,
  isQuickViewAtom,
  isNewMegaPDPEligibleAtom,
  customizerVariantsAtom,
} from 'store/pdp.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import certonaSchemesAtom from 'store/certona-schemes.atoms'
import { isSubBrandActiveAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'
import withCorrId from 'helpers/traceability'

mockIntersectionObserver()

jest.mock('helpers/traceability', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('toro/components/UGC/useUGCPreferenceByPageType', () => ({
  __esModule: true,
  default: () => ({
    isEnable: true,
    loading: false,
    showImages: [{ id: 'image1' }, { id: 'image2' }],
    UGCItemCount: 2,
  }),
}))
jest.mock('toro/hooks/useRatingsAndReviews', () => ({
  __esModule: true,
  default: () => ({
    average_rating: 1,
    setRatingsFilter: jest.fn(),
    setPrevReviewsFilter: jest.fn(),
    setRatingsFilterModal: jest.fn(),
    setAtomReviews: jest.fn(),
    setLoading: jest.fn(),
  }),
}))
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/analytics/useAnalytics')

jest.mock('toro/components/Lazy', () => ({
  __esModule: true,
  default: ({ children }) => children,
}))
jest.mock('toro/components/passport/EnvironmentImpactCarousel/CarouselDesktop', () =>
  jest.fn(() => <div data-qa="pdpv5_1_carousel_desktop">Carousel Desktop</div>)
)
jest.mock('toro/components/product/mobile/FindInStore', () => () => (
  <div data-qa="find-in-store">FindInStore</div>
))
jest.mock('toro/components/product/AccessorizeIt', () =>
  jest.fn(() => <div data-qa="pdpv5_1_accessorize_it">AccessorizeIt</div>)
)

jest.mock('next/router', () => ({
  Router: { events: { on: jest.fn(), off: jest.fn() } },
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    isReady: true,
  }),
}))

const mockWithCorrIdResponse = {
  inventory: {
    inventoryInfo: {
      preorderable: false,
      orderable: true,
      backorderable: false,
    },
    inventoryListID: 'test-list-id',
    status: 'SUCCESS',
    variantInventoryData: [
      {
        id: 'variant-1',
        preorderable: false,
        orderable: true,
        backorderable: false,
      },
    ],
    variationGroupInventoryData: [
      {
        id: 'test-color-1',
        preorderable: false,
        orderable: true,
        backorderable: false,
      },
    ],
  },
}

const mockedWithCorrId = jest.mocked(withCorrId)
mockedWithCorrId.mockReturnValue(
  jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockWithCorrIdResponse),
  })
)

const mockTangiblee = jest.fn().mockImplementation((action) => {
  if (action === 'isModalOpened') return true
  return undefined
})

const mockSendAnalytics = jest.fn()
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>

const defaultPreference = {
  generalConfiguration: {
    enableNewGlobalHeader: true,
    siteIdentifier: 'US',
  },
  fullBleed: {
    dynamicAssetConfig: {
      dynamicAsset: {
        dynamicAssetType: 'image',
        dynamicAssetSrc: 'test-image-src',
      },
    },
  },
  toggleSiteFeatures: {
    stickyOrSlidingHeader: 'sticky',
    enableMaxQtyRestriction: false,
    hideQuantityDropdown: false,
  },
  pdpPreferences: {
    imageType1to1AspectRatio: '',
  },
  powerReviews: {
    enableEmplifi: true,
  },
  priceSitePreferences: {
    isComparablePriceValue: false,
  },
  salePreferences: {
    enablePdpSwatchSuppression: false,
  },
  storefrontConfigs: {
    displayOosSwatch: false,
  },
  certonaConfiguration: {
    certonaSubDomain: '',
  },
  giftWrapping: { enableGiftWrappingAndMsg: false },
  cartCheckoutSettings: { defaultMaxOrderQuantity: 10 },
  badging: { finalSaleDiscountPercentage: 15 },
  affirm: {
    AffirmOnline: false,
    AffirmProductMessage: false,
  },
  klarnaPayments: {
    enableKlarna: false,
  },
  afterPay: {
    enableAfterPay: false,
  },
  closerLookAttributes: { closerLookImageSuffix: '_CL' },
  brandProdAttributes: {
    isEnableContentOne: true,
    pdpContentAreaOne: 'preference_1',
    isEnableContentTwo: true,
    pdpContentAreaTwo: 'preference_2',
    isEnableContentThree: true,
    pdpContentAreaThree: 'preference_3',
  },
  wyng: { wyngExternalIDType: 'masterId' },
  recommendations: {
    hideRecommendations: false,
    hideRecommendationPrice: true,
    disableRecommendationOnPages: [],
    hideRecentlyViewedOnPages: [],
  },
  einsteinRecommendation: {
    isEinsteinRecomEnabled: true,
    isEinsteinRecomEnabledPDP: false,
    recommendorsList: [],
  },
  certona: { certonaEnabled: true },
  coachtopia: { coachtopiaHomeURL: '/' },
  tangiblee: {
    enableStrategicTangiblee: false,
  },
  navFlyoutStylings: {
    chooseNavTheme: 'lightThemeNAV',
  },
  pixleeUgc: { enablePixleeUGC: false },
  compareConfigs: { featureVisibility: { desktop: true } },
  sceneSeven: {
    placeholderAssetName: '',
  },
  adaptiveExperience: {
    enableLookBook: {
      brand: true,
      subbrand: true,
      imageAssets: ['a91'],
      imageAssets_c: ['v1_p2'],
      imageAssets_d: ['v2_p3'],
      departments: ['D01', 'D02', 'D03', 'D04'],
    },
  },
}

const productData = {
  id: 'test-id',
  masterId: 'test-master-id',
  productId: 'test-id',
  name: 'Test Product',
  selectedVariantGroupId: 'test-vg-id',
  variants: [
    {
      id: 'variant-1',
      masterId: 'test-master-id',
      productId: 'variant-1',
      variationValues: { color: 'test-color-1' },
      orderable: true,
      customAttributes: {},
    },
  ],
  variationGroup: [
    {
      id: 'test-vg-id',
      productID: 'test-vg-id',
      masterId: 'test-master-id',
      color: 'test-color-1',
      variantsAssigned: ['variant-1'],
    },
  ],
  defaultColor: {
    vgId: 'test-vg-id',
  },
  defaultVariant: {
    id: 'variant-1',
  },
  selectedVariant: {
    id: 'variant-1',
  },
  selectedVariantData: {
    variationValues: {
      size: {
        id: 'size-1',
      },
    },
  },
  selectedColor: {
    id: 'test-color-1',
    masterId: 'test-master-id',
    media: {
      full: [{ src: 'https://example.com/image_CL', alt: 'Image 1 Closer Look' }],
    },
  },
  inventory: {
    preorderable: false,
    orderable: true,
    backorderable: false,
  },
  promoPDP: { promoCallOut: [] },
  reviewsData: { results: [] },
  pdpContentAreas: {
    'pdp-content-area-one-markup': {
      online: {
        default: true,
      },
      'data-qa': 'pdp-content-area-one',
    },
    'pdp-content-area-two-markup': {
      online: {
        default: true,
      },
      'data-qa': 'pdp-content-area-two',
    },
    'pdp-content-area-three-markup': {
      online: {
        default: true,
      },
      'data-qa': 'pdp-content-area-three',
    },
  },
  custom: {
    c_pdpContentAreaOne: 'custom_1',
    c_pdpContentAreaTwo: 'custom_2',
    c_pdpContentAreaThree: 'custom_3',
    c_closerLookHeader: 'Test Closer Look Header',
    c_closerLookText: 'This is a closer look text for testing purposes.',
    c_hideReview: false,
    c_envImpacts: [
      {
        title: 'Impact 1',
        value: 'Value 1',
        description: 'Description 1',
        icon: 'icon1.png',
        viewMoreUrl: '/impact1',
      },
    ],
  },
  tangibleeData: {
    'test-master-id test-color-1': true,
  },
  isProductExist: true,
  product: {
    productId: 'test-id',
    productName: 'Test Product',
    masterProductId: 'test-master-id',
  },
}

const badgeActions = {
  getBadgeTypesByArea: jest.fn().mockReturnValue({}),
  getContentByBadgeType: jest.fn().mockReturnValue({}),
  getContentSlotBySlotId: jest.fn().mockReturnValue({}),
}

const defaultRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
      },
    },
    ViewportContext: {
      viewport: 'desktop' as const,
      isDesktop: true,
      isMobile: false,
    },
    BadgesContext: {
      actions: badgeActions,
    },
    SessionContext: {
      actions: {
        fetchSession: jest.fn(),
        addToCart: jest.fn(),
      },
      session: {},
    },
    AnalyticsContext: {
      send: jest.fn(),
      addImpression: jest.fn(),
      isDataLayerInitialized: true,
      pageBecameInteractive: jest.fn(),
      createEventData: jest.fn(),
    },
  },
}

const certonaScheme = [
  {
    scheme: 'product2_rr',
    items: [
      { id: 'item1', ID: 'item1', detailURL: 'https://example.com/item1' },
      { id: 'item2', ID: 'item2', detailURL: 'https://example.com/item2' },
    ],
  },
]

const defaultAtomsData = [
  [productDataAtom, productData],
  [isQuickViewAtom, false],
  [isNewMegaPDPEligibleAtom, false],
  [customizerVariantsAtom, []],
  [xgenFeaturesAtom, { recommendations: false }],
  [isSubBrandActiveAtom, true],
  [certonaSchemesAtom, certonaScheme],
]

const makeSetup = (
  atomsData = [],
  customRenderOptions = {
    contexts: {},
  }
) => {
  return render(<TemplateContainer />, {
    ...defaultRenderOptions,
    ...customRenderOptions,
    contexts: {
      ...defaultRenderOptions.contexts,
      ...customRenderOptions.contexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...atomsData]),
    },
  })
}

describe('TemplateContainer v5_1', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(usePreference).mockReturnValue(defaultPreference)
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering & Structure', () => {
    it('All child components renders', async () => {
      const { container, getByTestId, getByRole } = makeSetup()

      // TemplateThemeProvider
      expect(container.querySelector('#pdpv5_1')).toBeVisible()
      // Grid Layout
      expect(getByTestId('pdpv5_1_grid')).toBeVisible()
      // ProductCarouselWithZoomModal - Product Image
      await waitFor(() => expect(getByTestId('pdp_btn_pdt_img')).toBeVisible())
      // MainStageArea - Product Price
      await waitFor(() => expect(getByTestId('cm_txt_pdt_price')).toBeVisible())
      // ProductDetails - ProductDetailsHeader
      expect(getByTestId('cm_pdp_btn_pdtls_card_hdr')).toBeVisible()
      // EnvironmentImpactCarouselWrapper
      expect(container.querySelector('#impact')).toBeVisible()
      // CloserLookArea
      expect(container.querySelector('#closerlook-section')).toBeVisible()
      // Wait for ContentAreaComponent sensorDelay
      await waitFor(() => expect(container.querySelector('#contentAreaOne')).toBeVisible())
      // ContentSlider - ContentAreaOne
      await waitFor(() => expect(container.querySelector('#contentAreaOne')).toBeVisible())
      // AccessorizeIt
      expect(getByTestId('pdpv5_1_accessorize_it')).toBeVisible()
      // ContentSlider - ContentAreaTwo
      expect(container.querySelector('#contentAreaTwo')).toBeVisible()
      // UGCContainer
      expect(container.querySelector('#social-section')).toBeVisible()
      // ContentSlider - ContentAreaThree
      expect(container.querySelector('#contentAreaThree')).toBeVisible()
      // RatingsAndReviewsSection
      expect(container.querySelector('#ratings-review-section')).toBeVisible()
      // RecentlyViewedContainer
      expect(getByTestId('certona-title')).toBeVisible()
      // BreadcrumbDesktopWrapper
      expect(getByRole('navigation', { name: 'breadcrumb' })).toBeVisible()
    })
  })

  describe('Hook Execution', () => {
    it('usePdpAnalytics() analytics.send called once per mount', async () => {
      const mockSend = jest.fn()

      jest.mocked(useAnalytics).mockReturnValue({
        send: mockSend,
        addImpression: jest.fn(),
        pageBecameInteractive: jest.fn(),
        createEventData: jest.fn(),
      })

      makeSetup()

      await waitFor(() => expect(mockSend).toHaveBeenCalledWith('viewItem', expect.any(Object)))
    })

    it('useTangibleeColorSwatches() updateTangiblee called once per mount', async () => {
      Object.defineProperty(window, 'tangiblee', {
        value: mockTangiblee,
        writable: true,
        configurable: true,
      })

      const { container } = makeSetup()

      await waitFor(() => expect(mockTangiblee).toHaveBeenCalledWith('isModalOpened'))

      await waitFor(() =>
        expect(mockTangiblee).toHaveBeenCalledWith('productSilentUpdate', expect.any(Object))
      )

      await waitFor(() => expect(container.querySelector('#pdpv5_1')).toBeVisible())
    })
  })

  describe('Grid Layout Section', () => {
    it('Grid layout with correct column configuration and style (minmax(0, 1fr) 506px)', async () => {
      const { getByTestId } = makeSetup()

      // Grid element
      const gridElement = getByTestId('pdpv5_1_grid')
      await waitFor(() => expect(gridElement).toBeVisible())
      expect(gridElement).toHaveStyle('grid-template-columns: minmax(0, 1fr) 506px')

      // Grid children
      const children = gridElement.children
      expect(children.length).toBe(2)

      // Left Column - ProductCarouselWithZoomModal
      const carouselImage = getByTestId('pdp_btn_pdt_img')
      const childOne = gridElement.children[0]
      await waitFor(() => expect(childOne).toContainElement(carouselImage))

      // Right Column - MainStageArea
      const mainStageProductPrice = getByTestId('cm_txt_pdt_price')
      const childTwo = gridElement.children[1]
      await waitFor(() => expect(childTwo).toContainElement(mainStageProductPrice))
    })
  })
})
