import { render, fireEvent, waitFor } from 'test-utils/react'
import React from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import TabbedAdaptivePDPUpper from 'toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPUpper'
import useScrollToImageCarousel from 'toro/hooks/useScrollToImageCarousel'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import {
  isQuickViewAtom,
  isProductFullyOOSAtom,
  isTabbedAdaptiveDynamicAssetInViewportAtom,
  metaProductsAtom,
  productDataAtom,
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveScrolledAtom,
  isPdpV4ATFFullPricingAtom,
  isShowingShippingAndReturnsModal,
} from 'store/pdp.atom'
import { experimentsAtom } from 'store/experiments.atom'
import { preferencesAtom } from 'store/preferences.atom'
import certonaSchemesAtom from 'store/certona-schemes.atoms'
import TabbedPDPProps from 'test-utils/TabbedPDP.mock'
import type { Atom } from 'jotai'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

const dynamicAssetConfig = {
  dynamicAsset: {
    dynamicAssetType: 'image',
    dynamicAssetSrc: 'test-image-src',
  },
}

const productData = {
  id: 'test-id',
  masterId: 'test-master-id',
  name: 'Test Product',
  defaultVariant: { id: 'variant-1' },
  selectedColor: { image: { src: 'image-src.jpg' } },
  promoPDP: { promoCallOut: [] },
  custom: {},
  reviewsData: { results: [] },
}

const certonaScheme = [{ scheme: 'product5_rr', items: [{ id: 'item1' }, { id: 'item2' }] }]

const preferences = { affirm: {}, badging: {}, afterPay: {}, paidy: {}, Klarna_Payments: {} }

const customRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      session: {},
    },
    BadgesContext: {
      actions: {
        getBadgeTypesByArea: jest.fn().mockReturnValue({}),
        getContentByBadgeType: jest.fn().mockReturnValue({}),
        getContentSlotBySlotId: jest.fn().mockReturnValue({}),
      },
    },
    ProductMainSectionBreakpointContext: {
      addToBagButtonProps: { productData: {} },
      isAddToCartDrawerEnabled: false,
      isBundleVariant: false,
      isDiscontinued: false,
      headerBadges: {},
      maxQuantityError: false,
      carouselProps: {
        productData: {
          id: 'test-id',
        },
      },
      isGuestUser: true,
      membershipExclusiveProduct: false,
      allLevelsProductsData: {
        product: {
          name: 'Product Name',
          productId: 'product123',
          sku: 'sku123',
          description: 'Product Description',
          categories: ['Category > Subcategory'],
          price: {
            value: 100,
            currency: 'USD',
          },
          originalPrice: {
            value: 120,
            currency: 'USD',
          },
          url: 'https://coach.com/product',
          images: [
            { src: 'https://coach.com/image1.jpg' },
            { src: 'https://coach.com/image2.jpg' },
          ],
          groupId: 'group123',
        },
      },
      variationControlsProps: {
        selectedVariantData: {
          price: 100,
          availability: 'In Stock',
        },
      },
      isProductFullyOOS: true,
      variationTangibleeProps: {},
      isOutlet: false,
      selectedVariantData: {
        price: 100,
        availability: 'In Stock',
      },
      tangibleeWidgetProps: {
        onHeroImage: true,
        isVisible: true,
      },
      cart: [],
      wishlists: [],
      klarnaDetails: [],
      onPurposeProps: [],
      currentVariationGroupId: 'CH107-BLK',
      adaptiveCarouselAltMedia: {},
      variationMessagesProps: {},
    },
  },
}

window.scrollTo = jest.fn()

const defaultProps = {
  tabbedPDPLower: TabbedPDPProps,
}

const mockAnalytyticsSend = jest.fn()
jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (args) => {
    const loader = typeof args === 'function' ? args : args?.loader
    const MockComponent = () => <div />
    if (loader) {
      loader().then((module) => ({
        default: module?.default || MockComponent,
      }))
    }
    return MockComponent
  },
}))
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/components/UGC/useUGCPreferenceByPageType', () => jest.fn(() => ({})))
jest.mock('toro/hooks/useScrollToImageCarousel', () => jest.fn())
jest.mock('toro/hooks/useCertonaScheme', () => jest.fn())
jest.mock('toro/hooks/useExperiment', () => jest.fn(() => false))
jest.mock('toro/hooks/useAffirmEligibility', () => jest.fn(() => false))
jest.mock('toro/hooks/usePreference_new', () =>
  jest.fn(() => ({
    recommendations: {
      disableRecommendationOnPages: ['PDP'],
      hideRecommendationPrice: false,
      hideRecommendations: false,
      hideRecentlyViewedOnPages: [],
    },
    trueFit: { enableTrueFit: false },
    tangiblee: {
      TANGIBLEE_CTA_ON_HERO_IMAGE: false,
    },
    certonaConfiguration: {
      certonaSubDomain: 'certona-test-subdomain',
    },
    pdpPreferences: {
      enableProductSKU: false,
    },
    adyen: {
      AdyenAssociatedPaymentsEnabled: false,
    },
    powerReviews: {
      enableEmplifi: false,
    },
    toggleSiteFeatures: {
      stickyOrSlidingHeader: 'sticky',
    },
    coachtopia: {
      coachtopiaHomeURL: '/shop/testBrand',
    },
    generalConfiguration: {
      enableNewGlobalHeader: true,
    },
    fullBleed: {
      fullBleedColorLightness: 0,
      dynamicAssetConfig,
    },
    sfraUnifiedFeatureCartridge: {
      sfraEnableFindInStoreV4: true,
    },
    adaptiveExperience: {
      enableEnhancedYMALLander: true,
    },
    einsteinRecommendation: {
      einstineSlideConfig: {},
      isEinsteinRecomEnabled: false,
    },
    paidy: {
      paidy_enabled: false,
      show_paidy_pdp: false,
    },
    klarnaPayments: {
      enableKlarna: false,
    },
    priceSitePreferences: {
      isComparablePriceValue: true,
    },
    afterPay: {
      enableAfterpay: false,
    },
    wyng: {
      wyngExternalIDType: 'masterId',
    },
    affirm: {
      AffirmOnline: false,
      AffirmProductMessage: false,
    },
    staffStartPreferences: {
      merchantId: 'test-merchant-id',
    },
    storefrontConfigs: {
      headerScrollingUpTo: 140,
    },
  }))
)
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))

jest.mock('toro/lib/xgen/client', () => {
  return jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    search: jest.fn(),
    getSortOptions: jest.fn(),
  }))
})

mockIntersectionObserver()

jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})

jest.mock('next/router', () => {
  return {
    Router: {
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    useRouter: () => ({
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }),
  }
})

const mockUseScrollToImageCarousel = useScrollToImageCarousel as jest.Mock

const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
  [certonaSchemesAtom, certonaScheme],
  [xgenFeaturesAtom, { recommendations: false }],
  [isQuickViewAtom, false],
  [productDataAtom, productData],
  [isTabbedAdaptivePDPEligibleAtom, false],
  [isTabbedAdaptiveScrolledAtom, false],
  [isPdpV4ATFFullPricingAtom, false],
  [isShowingShippingAndReturnsModal, false],
  [experimentsAtom, ''],
  [preferencesAtom, preferences],
]

const makeSetup = ({ atomsData }: { atomsData: Array<[Atom<unknown>, unknown]> }) => {
  return render(<TabbedAdaptivePDPUpper {...defaultProps} />, {
    ...customRenderOptions,
    contexts: {
      ...customRenderOptions.contexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...atomsData]),
    },
  })
}

describe('TabbedAdaptivePDPUpper', () => {
  beforeEach(() => {
    mockUseScrollToImageCarousel.mockReturnValue(jest.fn())
  })

  it('should render the main container with the right id', () => {
    const { container } = makeSetup({
      atomsData: [[metaProductsAtom, { enabled: false, productIds: undefined }]],
    })

    expect(container.querySelector('#tabbed-adaptive-pdp')).toBeVisible()
  })

  it('should trigger route change handling', async () => {
    const mockScrollToImageCarousel = jest.fn()
    mockUseScrollToImageCarousel.mockReturnValue(mockScrollToImageCarousel)
    makeSetup({
      atomsData: [[metaProductsAtom, { enabled: false, productIds: undefined }]],
    })

    fireEvent.scroll(window, { target: { scrollY: 0 } })
    await waitFor(() => {
      expect(mockScrollToImageCarousel).toHaveBeenCalled()
    })
  })

  it('should render OutOfStockPDPBottom when product is fully out of stock', async () => {
    const { container } = makeSetup({
      atomsData: [
        [isProductFullyOOSAtom, true],
        [isTabbedAdaptiveDynamicAssetInViewportAtom, false],
        [metaProductsAtom, { enabled: false, isMetaTest: false }],
      ],
    })

    await waitFor(() => {
      expect(container.querySelector('#recommendations-section')).toBeInTheDocument()
    })
  })

  it('should render TabbedAdaptivePDPLower when product is in stock', async () => {
    const { container } = makeSetup({
      atomsData: [
        [isProductFullyOOSAtom, false],
        [metaProductsAtom, { enabled: false, isMetaTest: false }],
      ],
    })

    await waitFor(() => {
      expect(container.querySelector('#TabbedAdaptivePDPLower')).toBeVisible()
    })
  })
})
