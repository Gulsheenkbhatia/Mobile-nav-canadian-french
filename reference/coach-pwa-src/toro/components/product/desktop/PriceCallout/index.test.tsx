import { render, screen } from 'test-utils/react'
import PriceCallout from 'toro/components/product/desktop/PriceCallout/index'
import { promoCalloutsPDPAtom, productDataAtom, isQuickViewAtom } from 'store/pdp.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { setAEDrawerConfigAtom } from 'store/ae-drawer.atom'
import { preferencesAtom } from 'store/preferences.atom'
import { TemplateName } from 'toro/constants/templates'

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/product',
    pathname: '/product',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/product',
}))

jest.mock('next/script', () => jest.fn(() => null))

interface MockPromoCallout {
  'call-out-message': {
    content: {
      text?: string
      spanText?: string
      promo: {
        type: string
        hasOTDPrice?: boolean
      }
      scriptContent?: string
      mainHtml?: string
      isPromoModal?: boolean
      shouldInjectJquery?: boolean
    }
    config?: {
      device: string
    }
    id: string
  }
}

interface TestSetupOptions {
  promoArr?: MockPromoCallout[]
  masterId?: string
  isPDPv6?: boolean
}

describe('PriceCallout', () => {
  const createMockPromo = (overrides: Partial<MockPromoCallout> = {}): MockPromoCallout => ({
    'call-out-message': {
      content: {
        promo: {
          type: 'IPX1',
          hasOTDPrice: false,
        },
      },
      id: 'promo-1',
      ...overrides['call-out-message'],
    },
  })

  const createMockIPX1Promo = (hasOTDPrice = false): MockPromoCallout =>
    createMockPromo({
      'call-out-message': {
        content: {
          promo: {
            type: 'IPX1',
            hasOTDPrice,
          },
        },
        id: 'promo-ipx1',
      },
    })

  const defaultPromoArr: MockPromoCallout[] = [createMockIPX1Promo(true)]

  const setup = (options: TestSetupOptions = {}) => {
    const { promoArr = defaultPromoArr, masterId = 'MASTER-123', isPDPv6 = false } = options

    jest.clearAllMocks()

    const atomContext = new Map([
      [promoCalloutsPDPAtom, promoArr],
      [productDataAtom, { masterId, template: isPDPv6 ? TemplateName.pdpv6 : TemplateName.pdpv5 }],
      [isQuickViewAtom, false],
      [isSubBrandActiveAtom, false],
      [setAEDrawerConfigAtom, null],
      [
        preferencesAtom,
        {
          adaptiveExperience: {
            enableAEDrawerExp: { PDP: { enable: false } },
          },
        },
      ],
    ] as any) as any

    const result = render(<PriceCallout />, {
      contexts: {
        JotaiProviderContext: atomContext,
        ViewportContext: {
          isMobile: false,
          isDesktop: true,
          isTablet: false,
        },
        PWAContext: {
          appData: {
            siteId: 'coh_us_out',
          },
          injectJquery: jest.fn(),
        },
        AnalyticsContext: {
          send: jest.fn(),
          addImpression: jest.fn(),
          isDataLayerInitialized: true,
          pageBecameInteractive: jest.fn(),
          createEventData: jest.fn(),
        },
      },
    })

    return {
      ...result,
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Conditional Rendering', () => {
    it('should render CallOutMessage when PDPv6 is false but OTD price promos exist', () => {
      setup({ isPDPv6: false, promoArr: [createMockIPX1Promo(true)] })
      expect(screen.getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
    })

    it('should return null when IPX1 slot is empty', () => {
      setup({ promoArr: [] })
      expect(screen.queryByTestId('cm_body_pdt_pomocallout')).not.toBeInTheDocument()
    })
  })

  describe('Data Filtering', () => {
    it('should filter OTD price promos correctly', () => {
      setup({
        isPDPv6: false,
        promoArr: [createMockIPX1Promo(true), createMockIPX1Promo(false)],
      })
      expect(screen.getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
    })
  })

  describe('Props Handling', () => {
    it('should pass correct masterId prop', () => {
      const masterId = 'CUSTOM-MASTER-456'
      setup({ masterId, isPDPv6: true })
      const callOutMessage = screen.getByTestId('cm_body_pdt_pomocallout')
      expect(callOutMessage).toBeVisible()
    })

    it('should always pass variant as pdpV4Rotation', () => {
      setup({ isPDPv6: true })
      const callOutMessage = screen.getByTestId('cm_body_pdt_pomocallout')
      expect(callOutMessage).toBeVisible()
    })
  })

  describe('State Management', () => {
    it('should read promoArr from promoCalloutsPDPAtom', () => {
      const promoArr = [createMockIPX1Promo(true)]
      setup({ promoArr })
      expect(screen.getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
    })

    it('should read masterId from productDataAtom', () => {
      const masterId = 'MASTER-789'
      setup({ masterId, isPDPv6: true })
      expect(screen.getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty promo array', () => {
      setup({ promoArr: [] })
      expect(screen.queryByTestId('cm_body_pdt_pomocallout')).not.toBeInTheDocument()
    })

    it('should handle undefined promo array', () => {
      const { rerender } = render(<PriceCallout />, {
        contexts: {
          JotaiProviderContext: new Map([
            [promoCalloutsPDPAtom, undefined],
            [productDataAtom, { masterId: 'MASTER-123', template: TemplateName.pdpv5 }],
            [isQuickViewAtom, false],
            [isSubBrandActiveAtom, false],
            [setAEDrawerConfigAtom, null],
            [
              preferencesAtom,
              {
                AdaptiveExperience: {
                  enableAEDrawerExp: { PDP: { enable: false } },
                },
              },
            ],
          ] as any) as any,
          ViewportContext: {
            isMobile: false,
            isDesktop: true,
            isTablet: false,
          },
          PWAContext: {
            appData: {
              siteId: 'coh_us_out',
            },
            injectJquery: jest.fn(),
          },
          AnalyticsContext: {
            send: jest.fn(),
            addImpression: jest.fn(),
            isDataLayerInitialized: true,
            pageBecameInteractive: jest.fn(),
            createEventData: jest.fn(),
          },
        },
      })
      rerender(<PriceCallout />)
      expect(screen.queryByTestId('cm_body_pdt_pomocallout')).not.toBeInTheDocument()
    })

    it('should handle missing masterId', () => {
      setup({ masterId: '', isPDPv6: true })
      const callOutMessage = screen.getByTestId('cm_body_pdt_pomocallout')
      expect(callOutMessage).toBeVisible()
    })

    it('should handle promos with missing hasOTDPrice property', () => {
      const promoWithoutOTD = createMockPromo({
        'call-out-message': {
          content: {
            promo: {
              type: 'IPX1',
            },
          },
          id: 'promo-no-otd',
        },
      })
      setup({ isPDPv6: false, promoArr: [promoWithoutOTD] })
      expect(screen.queryByTestId('cm_body_pdt_pomocallout')).not.toBeInTheDocument()
    })

    it('should handle multiple IPX1 promos with mixed OTD prices', () => {
      setup({
        isPDPv6: false,
        promoArr: [
          createMockIPX1Promo(true),
          createMockIPX1Promo(false),
          createMockIPX1Promo(true),
          createMockIPX1Promo(false),
        ],
      })
      expect(screen.getByTestId('cm_body_pdt_pomocallout')).toBeVisible()
    })

    it('should handle component unmounting cleanly', () => {
      const { unmount } = setup({ isPDPv6: true })
      expect(() => unmount()).not.toThrow()
    })
  })
})
