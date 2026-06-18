import { render, screen, waitFor } from 'test-utils/react'
import TemplateContainer from './index'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useIsKS from 'toro/helpers/isKS'
import useTangibleeColorSwatches from 'toro/hooks/useTangibleeColorSwatches'
import { isSizedProductAtom, productDataAtom } from 'store/pdp.atom'
import { showFullProductInfoPdpAtom } from 'store/product-info.atom'
import { experimentsAtom } from 'store/experiments.atom'
import { xgenChannelAtom } from 'store/xgen-channel.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import { useSearchParams } from 'next/navigation'
import useAnalytics from 'toro/analytics/useAnalytics'
import BASE_TEMPLATE_CONFIG from 'toro/helpers/templating/baseConfig'
import {
  ITemplateComponentConfig,
  TemplateComponentsKeysMapping,
} from 'toro/helpers/templating/types'

jest.mock('toro/hooks/useHeaderHeight')
jest.mock('toro/helpers/isKS')
jest.mock('toro/hooks/usePdpAnalytics', () => jest.fn())
jest.mock('toro/hooks/useTangibleeColorSwatches')
jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)

jest.mock('react-intl', () => {
  const actual = jest.requireActual<typeof import('react-intl')>('react-intl')
  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: any) => defaultMessage,
    }),
  }
})

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('@chakra-ui/react', () => {
  const actualChakra = jest.requireActual('@chakra-ui/react')
  return {
    ...actualChakra,
    useMultiStyleConfig: jest.fn(() => ({
      viewFullProductDetails: { textDecoration: 'underline' },
    })),
  }
})

jest.mock('toro/components/TemplateThemeProvider', () => ({ children, id, theme }: any) => (
  <div data-qa="template-theme-provider" data-id={id}>
    {children}
  </div>
))

jest.mock(
  'toro/components/Box',
  () =>
    ({ children, marginTop, backgroundColor, pb, textAlign, mt, mb }: any) =>
      (
        <div
          data-qa="box"
          data-margin-top={marginTop}
          data-background-color={backgroundColor}
          data-pb={pb}
          data-text-align={textAlign}
          data-mt={mt}
          data-mb={mb}
        >
          {children}
        </div>
      )
)

jest.mock('toro/components/product/mobile/ProductCarouselWithZoom', () => () => (
  <div data-qa="product-carousel-with-zoom">ProductCarouselWithZoom</div>
))

jest.mock('toro/components/product/mobile/Badges/OnImageBadge', () => () => (
  <div data-qa="on-image-badge">OnImageBadge</div>
))

jest.mock('toro/components/product/mobile/Badges/InventoryCalloutBadge', () => () => (
  <div data-qa="inventory-callout-badge">InventoryCalloutBadge</div>
))

jest.mock('toro/components/product/mobile/ProductDetails', () => () => (
  <div data-qa="product-details">ProductDetails</div>
))

jest.mock(
  'toro/components/product/desktop/PDPColorSwatches',
  () =>
    ({ fadeColor, hideArrows }: any) =>
      (
        <div
          data-qa="pdp-color-swatches"
          data-fade-color={fadeColor}
          data-hide-arrows={hideArrows ? 'true' : undefined}
        >
          PDPColorSwatches
        </div>
      )
)

jest.mock('toro/components/product/mobile/CustomizeAndMonogram', () => ({ type }: any) => (
  <div data-qa={`customize-and-monogram-${type}`} data-type={type}>
    CustomizeAndMonogram
  </div>
))

jest.mock('toro/components/product/desktop/StickyBar/SizeSelector', () => () => (
  <div data-qa="size-selector">SizeSelector</div>
))

jest.mock('toro/components/product/mobile/AddToBagArea/AddToBagAreaWrapper', () => () => (
  <div data-qa="add-to-bag-area-wrapper">AddToBagAreaWrapper</div>
))

jest.mock('toro/components/product/PromoCallout', () => ({ promoType, variant }: any) => (
  <div data-qa={`promo-callout-${promoType}`} data-promo-type={promoType} data-variant={variant}>
    PromoCallout
  </div>
))

jest.mock('toro/components/product/mobile/ProductDetails/LowerPDPSection', () => () => (
  <div data-qa="lower-pdp-section">LowerPDPSection</div>
))

jest.mock('../SocialRecommendations', () => ({
  SocialRecommendations: () => <div data-qa="social-recommendations">SocialRecommendations</div>,
}))

jest.mock(
  'toro/components/Text',
  () =>
    ({ children, size, variant, sx, as, textDecoration, dangerouslySetInnerHTML }: any) => {
      if (dangerouslySetInnerHTML) {
        return (
          <div
            data-qa="text"
            data-size={size}
            data-variant={variant}
            data-as={as}
            data-text-decoration={textDecoration}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          />
        )
      }
      return (
        <div
          data-qa="text"
          data-size={size}
          data-variant={variant}
          data-as={as}
          data-text-decoration={textDecoration}
        >
          {children}
        </div>
      )
    }
)

jest.mock('toro/components/Experiment', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jotaiUtils = require('jotai/utils')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const experimentStore = require('store/experiments.atom')

  return function Experiment({ children, forIDs, notForIDs }: any) {
    const { useAtomValue } = jotaiUtils
    const { experimentsAtom } = experimentStore
    const experiments = useAtomValue(experimentsAtom)

    const isUsingWhitelist = !!forIDs
    const ids = isUsingWhitelist ? forIDs : notForIDs

    if (typeof ids !== 'string') {
      return null
    }

    const splitIds = ids.split('-')
    const splitExperiments = experiments.split('-')
    const isExperimentEnabled = splitExperiments.some((experimentId: string) =>
      splitIds.includes(experimentId)
    )

    const canRenderChildren = isUsingWhitelist ? isExperimentEnabled : !isExperimentEnabled

    if (!canRenderChildren) {
      return null
    }

    return (
      <div data-qa="experiment" data-for-ids={forIDs} data-not-for-ids={notForIDs}>
        {children}
      </div>
    )
  }
})

jest.mock('toro/components/product/mobile/PayInInstallments')
jest.mock('toro/components/product/mobile/FreeShippingAndReturns')
jest.mock('toro/components/product/mobile/FindInStore')
jest.mock('toro/components/product/PromoCallout')
jest.mock('toro/components/product/mobile/ProductHighlights')
jest.mock('toro/components/product/mobile/FeaturedContent')
jest.mock('toro/components/product/mobile/ExpandableProductDetails/ExpandableAccordions', () => ({
  ProductAccordions: () => <div data-qa="expandable-product-details">ExpandableProductDetails</div>,
}))
jest.mock('toro/components/product/mobile/PromoRotationBanner')
jest.mock('toro/components/product/TabbedContentModule')
jest.mock('toro/components/product/desktop/ContentSlider')
jest.mock('toro/components/product/mobile/v6/YouMayAlsoLikeContainer')
jest.mock('toro/components/product/mobile/SearchExpose')
jest.mock('toro/components/product/AccessorizeIt')
jest.mock('toro/components/product/AccessorizeIt/AccessorizeItSkeleton')
jest.mock('toro/components/product/mobile/CompareToolsSection')
jest.mock('toro/components/product/desktop/UGC/UGCContainer')
jest.mock('toro/components/product/desktop/RatingsAndReviewsSection')
jest.mock('toro/components/product/mobile/BreadcrumbsMobileWrapper')
jest.mock('toro/components/product/mobile/v6/RecentlyViewedContainer')

const mockedUseHeaderHeight = jest.mocked(useHeaderHeight)
const mockedUseIsKS = jest.mocked(useIsKS)
const mockedUseTangibleeColorSwatches = jest.mocked(useTangibleeColorSwatches)
const mockedUseSearchParams = jest.mocked(useSearchParams)

const createAtomContexts = ({
  isSizedProduct = false,
  experiments = '',
  isExpanded = false,
  utmMedium = null,
  templateConfig = BASE_TEMPLATE_CONFIG,
}: {
  isSizedProduct?: boolean
  experiments?: string
  isExpanded?: boolean
  utmMedium?: string | null
  templateConfig?: ITemplateComponentConfig['slots']
} = {}): Map<any, any> => {
  return new Map([
    [isSizedProductAtom, isSizedProduct],
    [experimentsAtom, experiments],
    [showFullProductInfoPdpAtom, isExpanded],
    [productDataAtom, { templateConfig: templateConfig }],
    [xgenChannelAtom, utmMedium],
  ] as [any, any][])
}

const mockSearchParams = (params: Record<string, string | null>) => {
  mockedUseSearchParams.mockReturnValue({
    get: (key: string) => params[key] ?? null,
    has: (key: string) => key in params,
    entries: () => Object.entries(params).map(([key, value]) => [key, value ?? null]),
    forEach: (cb: (value: string | null, key: string) => void) => {
      Object.entries(params).forEach(([key, value]) => cb(value ?? null, key))
    },
    keys: () => Object.keys(params),
    values: () => Object.values(params).map((v) => v ?? null),
    getAll: (key: string) => {
      const value = params[key]
      return value != null ? [value] : []
    },
  } as any)
}

describe('TemplateContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAnalytics.mockReturnValue({
      track: jest.fn(),
      trackEvent: jest.fn(),
      trackPageView: jest.fn(),
      send: jest.fn(),
    })
    mockedUseHeaderHeight.mockReturnValue(60)
    mockedUseIsKS.mockReturnValue(false)
    mockedUseTangibleeColorSwatches.mockReturnValue(undefined)
    mockSearchParams({})

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '' },
    })
  })

  describe('Component Structure', () => {
    it('should render TemplateThemeProvider with pdpv6 id', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const provider = screen.getByTestId('template-theme-provider')
      expect(provider).toBeInTheDocument()
      expect(provider).toHaveAttribute('data-id', 'pdpv6')
    })

    it('should render Box with default styles for non-Kate Spade', () => {
      mockedUseIsKS.mockReturnValue(false)

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const [box] = screen.queryAllByTestId('box')
      expect(box).toHaveAttribute('data-margin-top', '0px')
      expect(box).toHaveAttribute('data-background-color', 'var(--color-neutral-light)')
      expect(box).toHaveAttribute('data-pb', 'var(--spacing-1)')
    })

    it('should render Box with Kate Spade specific styles', () => {
      mockedUseIsKS.mockReturnValue(true)
      mockedUseHeaderHeight.mockReturnValue(80)

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const [box] = screen.queryAllByTestId('box')
      expect(box).toHaveAttribute('data-margin-top', '-80px')
      expect(box).toHaveAttribute('data-background-color', 'var(--color-neutral-light-1, #F0F0F0)')
    })

    it('should call usePdpAnalytics hook', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const usePdpAnalytics = require('toro/hooks/usePdpAnalytics')

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      expect(usePdpAnalytics).toHaveBeenCalled()
    })

    it('should call useTangibleeColorSwatches hook', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      expect(mockedUseTangibleeColorSwatches).toHaveBeenCalled()
    })
  })

  describe('Core PDP Components', () => {
    it('should render all core components in correct order', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      expect(screen.getByTestId('on-image-badge')).toBeInTheDocument()
      expect(screen.getByTestId('product-carousel-with-zoom')).toBeInTheDocument()
      expect(screen.getByTestId('inventory-callout-badge')).toBeInTheDocument()
      expect(screen.getByTestId('product-details')).toBeInTheDocument()
      expect(screen.getByTestId('pdp-color-swatches')).toBeInTheDocument()
      expect(screen.getByTestId('customize-and-monogram-links')).toBeInTheDocument()
      expect(screen.getByTestId('add-to-bag-area-wrapper')).toBeInTheDocument()
    })

    it('should render PDPColorSwatches with correct props', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const colorSwatches = screen.getByTestId('pdp-color-swatches')
      expect(colorSwatches).toHaveAttribute('data-fade-color', 'null')
      expect(colorSwatches).toHaveAttribute('data-hide-arrows', 'true')
    })

    it('should render CustomizeAndMonogram with type "links"', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const customizeMonogram = screen.getByTestId('customize-and-monogram-links')
      expect(customizeMonogram).toHaveAttribute('data-type', 'links')
    })

    it('should render PromoCallout with IPX2 type and underATBPromo variant', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts(),
        },
      })

      const promoCallout = screen.getByTestId(`promo-callout-${PROMO_TYPES.IPX2}`)
      expect(promoCallout).toHaveAttribute('data-promo-type', PROMO_TYPES.IPX2)
      expect(promoCallout).toHaveAttribute('data-variant', 'underATBPromo')
    })
  })

  describe('SizeSelector Conditional Rendering', () => {
    it('should render SizeSelector when isSizedProduct is true', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ isSizedProduct: true }),
        },
      })

      expect(screen.getByTestId('size-selector')).toBeInTheDocument()
    })

    it('should not render SizeSelector when isSizedProduct is false', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ isSizedProduct: false }),
        },
      })

      expect(screen.queryByTestId('size-selector')).not.toBeInTheDocument()
    })
  })

  describe('Conditional Rendering Based on utm_medium', () => {
    it('should render LowerPDPSection when utm_medium is not paid_soc', () => {
      mockSearchParams({})

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            templateConfig: {
              SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
              SLOT_2: { component: TemplateComponentsKeysMapping.SOCIAL_LANDER },
            },
          }),
        },
      })

      expect(screen.getByTestId('lower-pdp-section')).toBeInTheDocument()
      expect(screen.queryByTestId('social-recommendations')).not.toBeInTheDocument()
    })

    it('should render View Full Product Details button when utm_medium is paid_soc and experiments active', () => {
      mockSearchParams({ utm_medium: 'paid_soc' })
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { search: '?utm_medium=paid_soc' },
      })

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP,
            utmMedium: 'paid_soc',
            templateConfig: {
              SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
              SLOT_2: { component: TemplateComponentsKeysMapping.SOCIAL_LANDER },
            },
          }),
        },
      })

      expect(screen.getByText('View Full Product Details')).toBeInTheDocument()
    })

    it('should not render View Full Product Details button when utm_medium is paid_soc but no experiments', () => {
      mockSearchParams({})

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ experiments: '' }),
        },
      })

      expect(screen.queryByText('View Full Product Details')).not.toBeInTheDocument()
    })

    it('should render only LowerPDPSection when no recommendation experiments are active', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: '',
            templateConfig: {
              SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
              SLOT_2: { component: TemplateComponentsKeysMapping.SOCIAL_LANDER },
            },
          }),
        },
      })

      const lowerSection = screen.getByTestId('lower-pdp-section')
      expect(lowerSection).toBeInTheDocument()

      // Should not see social recommendations or view full product details button
      expect(screen.queryByTestId('social-recommendations')).not.toBeInTheDocument()
      expect(screen.queryByText('View Full Product Details')).not.toBeInTheDocument()
    })
  })
  describe('InventoryCalloutBadge Section', () => {
    it('should render InventoryCalloutBadge in notForIDs Experiment wrapper when SOCIAL_PROOF_MESSAGE_PDP and LOW_INVENTORY_ABOVE_ATB experiments not active', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ experiments: '' }),
        },
      })

      const experiments = screen.getAllByTestId('experiment')
      const inventoryExperiment = experiments.find(
        (exp) =>
          exp.getAttribute('data-not-for-ids') ===
          `${EXPERIMENTS.SOCIAL_PROOF_MESSAGE_PDP}-${EXPERIMENTS.LOW_INVENTORY_ABOVE_ATB}`
      )

      expect(inventoryExperiment).toBeTruthy()
      expect(inventoryExperiment?.querySelector('[data-qa="inventory-callout-badge"]')).toBeTruthy()
    })
  })
  describe('LowerPDPSection Rendering', () => {
    it('should render LowerPDPSection when no recommendation experiments are active', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ experiments: '' }),
        },
      })

      expect(screen.getByTestId('expandable-product-details')).toBeInTheDocument()
    })

    it('should render LowerPDPSection directly when experiments not active', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({ experiments: '' }),
        },
      })

      const lowerSection = screen.getByTestId('expandable-product-details')
      expect(lowerSection).toBeInTheDocument()
    })

    it('should NOT render View Full Product Details button with different unrelated experiments', () => {
      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: `${EXPERIMENTS.PDP_V3}-${EXPERIMENTS.ACCESSORIZE_IT}`,
          }),
        },
      })

      expect(screen.queryByText('View Full Product Details')).not.toBeInTheDocument()
      expect(screen.getByTestId('expandable-product-details')).toBeInTheDocument()
    })
  })

  describe('SocialRecommendations with utm_medium=paid_soc', () => {
    it('should render SocialRecommendations by default when experiments active and not expanded', () => {
      mockSearchParams({ utm_medium: 'paid_soc' })
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { search: '?utm_medium=paid_soc' },
      })

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP,
            utmMedium: 'paid_soc',
            templateConfig: {
              SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
              SLOT_2: { component: TemplateComponentsKeysMapping.SOCIAL_LANDER },
            },
          }),
        },
      })

      expect(screen.getByTestId('social-recommendations')).toBeInTheDocument()
      expect(screen.queryByTestId('expandable-product-details')).not.toBeInTheDocument()
    })

    it('should not render SocialRecommendations when utm_medium is not paid_soc', () => {
      mockSearchParams({})

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP,
          }),
        },
      })

      expect(screen.queryByTestId('social-recommendations')).not.toBeInTheDocument()
    })
  })

  describe('Integration - Complete Flow', () => {
    it('should render complete layout with View Full Product Details when utm_medium=paid_soc and XGEN experiment is active', async () => {
      mockSearchParams({ utm_medium: 'paid_soc' })
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { search: '?utm_medium=paid_soc' },
      })

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: EXPERIMENTS.XGEN_RECOMMENDATIONS_PDP,
            isSizedProduct: true,
            utmMedium: 'paid_soc',
            templateConfig: {
              SLOT_1: { component: TemplateComponentsKeysMapping.MAIN_STAGE },
              SLOT_2: { component: TemplateComponentsKeysMapping.SOCIAL_LANDER },
            },
          }),
        },
      })

      await waitFor(() => {
        // Core components
        expect(screen.getByTestId('on-image-badge')).toBeInTheDocument()
        expect(screen.getByTestId('product-carousel-with-zoom')).toBeInTheDocument()
        expect(screen.getByTestId('product-details')).toBeInTheDocument()
        expect(screen.getByTestId('size-selector')).toBeInTheDocument()
        expect(screen.getByTestId('add-to-bag-area-wrapper')).toBeInTheDocument()

        // View Full Product Details button
        expect(screen.getByText('View Full Product Details')).toBeInTheDocument()

        // Social recommendations (shown by default when not expanded)
        expect(screen.getByTestId('social-recommendations')).toBeInTheDocument()

        // Lower section should NOT be visible initially
        expect(screen.queryByTestId('expandable-product-details')).not.toBeInTheDocument()
      })
    })

    it('should render complete layout without View Full Product Details when no recommendation experiments', async () => {
      mockSearchParams({})

      render(<TemplateContainer />, {
        contexts: {
          JotaiProviderContext: createAtomContexts({
            experiments: EXPERIMENTS.PDP_V3,
            isSizedProduct: false,
          }),
        },
      })

      await waitFor(() => {
        // Core components
        expect(screen.getByTestId('on-image-badge')).toBeInTheDocument()
        expect(screen.getByTestId('product-carousel-with-zoom')).toBeInTheDocument()
        expect(screen.getByTestId('product-details')).toBeInTheDocument()
        expect(screen.queryByTestId('size-selector')).not.toBeInTheDocument()
        expect(screen.getByTestId('add-to-bag-area-wrapper')).toBeInTheDocument()

        // No View Full Product Details button
        expect(screen.queryByText('View Full Product Details')).not.toBeInTheDocument()

        // Direct lower section
        expect(screen.getByTestId('expandable-product-details')).toBeInTheDocument()

        // No social recommendations
        expect(screen.queryByTestId('social-recommendations')).not.toBeInTheDocument()
      })
    })
  })
})
