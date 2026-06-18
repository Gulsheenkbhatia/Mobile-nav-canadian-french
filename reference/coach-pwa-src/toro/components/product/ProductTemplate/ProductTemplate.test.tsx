import { render, screen, act } from 'test-utils/react'
import ProductTemplate from './index'
import useViewportType from 'toro/hooks/useViewportType'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { TemplateName } from 'toro/constants/templates'
import { isQuickViewAtom, isTabbedAdaptivePDPEligibleAtom, productDataAtom } from 'store/pdp.atom'
import { addToBagButtonOnEventAtom } from 'store/global.atom'
import { experimentsAtom } from 'store/experiments.atom'
import { waitFor } from '@testing-library/react'
import useAnalytics from 'toro/analytics/useAnalytics'
import BASE_TEMPLATE_CONFIG from 'toro/helpers/templating/baseConfig'

jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePdpAnalytics', () => jest.fn())

jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    pathname: '/products/test-product',
    query: {},
    asPath: '/products/test-product',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  })),
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/products/test-product'),
  useSearchParams: jest.fn(() => ({
    get: (key: string) => {
      if (key === 'utm_medium') return 'paid_social'
      return null
    },
  })),
}))

jest.mock('toro/components/MainContainer', () => ({ children, className, w, maxWidth, sx }) => (
  <div
    data-qa="main-container"
    className={className}
    data-w={w}
    data-max-width={maxWidth}
    style={sx ? sx : undefined}
  >
    {children}
  </div>
))

jest.mock('toro/components/Hidden', () => ({ children, onMobile, onNonMobile, w }) => (
  <div
    data-qa="hidden"
    data-on-mobile={onMobile !== undefined ? 'true' : undefined}
    data-on-non-mobile={onNonMobile !== undefined ? 'true' : undefined}
    data-w={w}
  >
    {children}
  </div>
))

jest.mock(
  'toro/components/Box',
  () =>
    ({ children, className, marginTop, backgroundColor, pb }) =>
      (
        <div
          data-qa="box"
          className={className}
          data-margin-top={marginTop}
          data-background-color={backgroundColor}
          data-pb={pb}
        >
          {children}
        </div>
      )
)

jest.mock('toro/components/Grid', () => ({ children, templateColumns }) => (
  <div data-qa="grid" data-template-columns={templateColumns}>
    {children}
  </div>
))

jest.mock('toro/components/product/ProductMainSection/AdditionalDetails2', () => () => (
  <div data-qa="additional-details-v2">AdditionalDetails V2</div>
))

jest.mock('toro/components/product/ProductMainSection/AdditionalDetailsV3', () => () => (
  <div data-qa="additional-details-v3">AdditionalDetails V3</div>
))

jest.mock('toro/components/product/ProductMainSection/ProductMainSectionDesktop', () => () => (
  <div data-qa="product-main-section-desktop">ProductMainSectionDesktop</div>
))

jest.mock('toro/components/Experiment', () => {
  return function Experiment({
    children,
    forIDs,
    notForIDs,
    forDesktop,
    forMobile,
    alwaysOnForDesktop,
    alwaysOnForMobile,
  }: any) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useExperiment = require('toro/hooks/useExperiment').default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const useViewportType = require('toro/hooks/useViewportType').default

    const isUsingWhitelist = !!forIDs
    const ids = isUsingWhitelist ? forIDs : notForIDs
    const isExperimentEnabled = useExperiment(ids)
    const viewportType = useViewportType()
    const isDesktop = viewportType?.isDesktop
    const isMobile = viewportType?.isMobile

    const shouldAlwaysRenderChildren =
      (isDesktop && alwaysOnForDesktop) || (isMobile && alwaysOnForMobile)

    const canRenderChildrenForExperiment =
      (isUsingWhitelist && isExperimentEnabled) || (!isUsingWhitelist && !isExperimentEnabled)

    const canRenderChildrenForViewport =
      (forDesktop && isDesktop) || (forMobile && isMobile) || (!forDesktop && !forMobile)

    const canRenderChildren =
      shouldAlwaysRenderChildren || (canRenderChildrenForExperiment && canRenderChildrenForViewport)

    if (!canRenderChildren) {
      return null
    }

    return (
      <div
        data-qa="experiment"
        data-for-ids={forIDs}
        data-not-for-ids={notForIDs}
        data-for-mobile={forMobile ? 'true' : undefined}
        data-for-desktop={forDesktop ? 'true' : undefined}
        data-always-on-for-desktop={alwaysOnForDesktop ? 'true' : undefined}
        data-always-on-for-mobile={alwaysOnForMobile ? 'true' : undefined}
      >
        {children}
      </div>
    )
  }
})

jest.mock('toro/components/product/Tangiblee/TangibleeAnalytics', () => () => (
  <div data-qa="tangiblee-analytics">TangibleeAnalytics</div>
))

jest.mock('toro/components/product/ProductMainSection/ProductMainSectionMobile', () => () => (
  <div data-qa="product-main-section-mobile">ProductMainSectionMobile</div>
))

jest.mock('toro/components/product/ProductMainSection/ProductMainSectionMobileV3', () => () => (
  <div data-qa="product-main-section-mobile-v3">ProductMainSectionMobileV3</div>
))

jest.mock('toro/components/product/TabbedAdaptivePDP', () => () => (
  <div data-qa="tabbed-adaptive-pdp">TabbedAdaptivePDP</div>
))

const mockUseTemplate = jest.fn()
jest.mock('toro/hooks/useTemplate', () => {
  return (templates: any) => mockUseTemplate(templates)
})

const mockTemplate = jest.fn()
jest.mock('toro/components/Template', () => {
  return ({ forIDs, notForIDs, children }: any) => {
    const result = mockTemplate({ forIDs, notForIDs })
    return result ? <>{children}</> : null
  }
})

jest.mock('toro/components/TemplateThemeProvider', () => ({ children, id, theme }) => (
  <div data-qa="template-theme-provider" data-id={id}>
    {children}
  </div>
))

jest.mock('toro/components/product/desktop/ProductCarouselWithZoomModal', () => () => (
  <div data-qa="product-carousel-with-zoom-modal">ProductCarouselWithZoomModal</div>
))

jest.mock('toro/components/product/desktop/StickyBar', () => () => (
  <div data-qa="sticky-bar">StickyBar</div>
))

jest.mock('toro/components/product/desktop/CloserLookArea', () => () => (
  <div data-qa="closer-look-area">CloserLookArea</div>
))

jest.mock('toro/components/product/desktop/ProductRecommendationsWrapper', () => {
  const RecommenderPosition = {
    RECENTLY_VIEWED: 'recently-viewed',
  }
  const RecentlyViewedProducts = () => (
    <div data-qa="recently-viewed-products">RecentlyViewedProducts</div>
  )
  return {
    __esModule: true,
    default: RecentlyViewedProducts,
    RecommenderPosition,
  }
})

jest.mock('toro/components/RecommendationsContainer', () => () => (
  <div data-qa="recommendations-container">RecommendationsContainer</div>
))

jest.mock('toro/components/LLMRecommendations', () => () => (
  <div data-qa="llm-recommendations">LLMRecommendations</div>
))

jest.mock('toro/components/Certona/Recommendation/BaseCertonaContainer', () => ({
  CertonaRecommendation: () => <div data-qa="certona-recommendation">CertonaRecommendation</div>,
}))

jest.mock('toro/components/UGC/UGCContainer', () => () => (
  <div data-qa="ugc-container">UGCContainer</div>
))

jest.mock('toro/components/product/desktop/UGC/UGCContainer', () => () => (
  <div data-qa="ugc-container">UGCContainer</div>
))

jest.mock('toro/components/product/desktop/ProductDetails', () => () => (
  <div data-qa="product-details">ProductDetails</div>
))

jest.mock('toro/components/product/desktop/RatingsAndReviewsSection', () => () => (
  <div data-qa="ratings-and-reviews-section">RatingsAndReviewsSection</div>
))

jest.mock('toro/components/product/desktop/BreadcrumbDesktopWrapper', () => () => (
  <div data-qa="breadcrumb-desktop-wrapper">BreadcrumbDesktopWrapper</div>
))

jest.mock('toro/components/BreadcrumbPage', () => () => (
  <div data-qa="breadcrumb-page">BreadcrumbPage</div>
))

jest.mock('toro/components/product/mobile/BreadcrumbsMobileWrapper', () => () => (
  <div data-qa="breadcrumbs-mobile-wrapper">BreadcrumbsMobileWrapper</div>
))

jest.mock('toro/components/product/mobile/SocialRecommendations', () => ({
  SocialRecommendations: () => <div data-qa="social-recommendations">SocialRecommendations</div>,
}))

jest.mock('toro/components/product/desktop/ContentSlider', () => {
  const CONTENT_AREAS = {
    CONTENT_AREA_ONE: 'content-area-one',
    CONTENT_AREA_TWO: 'content-area-two',
    CONTENT_AREA_THREE: 'content-area-three',
  }
  const ContentSlider = ({ contentArea }) => (
    <div data-qa="content-slider" data-content-area={contentArea}>
      ContentSlider
    </div>
  )
  return {
    __esModule: true,
    default: ContentSlider,
    CONTENT_AREAS,
  }
})

jest.mock('toro/components/product/RecommendedProductSection', () => () => (
  <div data-qa="recommended-product-section">RecommendedProductSection</div>
))

jest.mock('toro/components/product/desktop/EnvironmentImpactCarouselWrapper', () => () => (
  <div data-qa="environment-impact-carousel-wrapper">EnvironmentImpactCarouselWrapper</div>
))

jest.mock('toro/components/product/desktop/v5_1/MainStageArea', () => () => (
  <div data-qa="main-stage-area">MainStageArea</div>
))

jest.mock('toro/components/product/desktop/v5_1/RecentlyViewedContainer', () => () => (
  <div data-qa="recently-viewed-container">RecentlyViewedContainer</div>
))

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
  <div data-qa="mobile-product-details">Mobile ProductDetails</div>
))

jest.mock('toro/components/product/mobile/AddToBagArea/AddToBagAreaWrapper', () => () => (
  <div data-qa="add-to-bag-area-wrapper">AddToBagAreaWrapper</div>
))

jest.mock('toro/components/product/mobile/FindInStore', () => () => (
  <div data-qa="find-in-store">FindInStore</div>
))

jest.mock('toro/components/product/mobile/FreeShippingAndReturns', () => () => (
  <div data-qa="free-shipping-and-returns">FreeShippingAndReturns</div>
))

jest.mock('toro/components/product/mobile/ProductHighlights', () => () => (
  <div data-qa="product-highlights">ProductHighlights</div>
))

jest.mock('toro/components/product/desktop/PDPColorSwatches', () => () => (
  <div data-qa="pdp-color-swatches">PDPColorSwatches</div>
))

jest.mock('toro/components/product/desktop/StickyBar/SizeSelector', () => () => (
  <div data-qa="size-selector">SizeSelector</div>
))

jest.mock('toro/components/product/mobile/ExpandableProductDetails/ExpandableAccordions', () => ({
  ProductAccordions: () => <div data-qa="expandable-product-details">ExpandableProductDetails</div>,
}))

jest.mock('toro/components/product/mobile/SearchExpose', () => () => (
  <div data-qa="search-expose">SearchExpose</div>
))

jest.mock('toro/components/product/PromoCallout', () => () => (
  <div data-qa="promo-callout">PromoCallout</div>
))

jest.mock('toro/components/product/mobile/CustomizeAndMonogram', () => () => (
  <div data-qa="customize-and-monogram">CustomizeAndMonogram</div>
))

jest.mock('toro/components/product/mobile/PromoRotationBanner', () => () => (
  <div data-qa="promo-rotation-banner">PromoRotationBanner</div>
))

jest.mock('toro/components/product/mobile/RotationPayInInstallments', () => () => (
  <div data-qa="rotation-pay-in-installments">RotationPayInInstallments</div>
))

jest.mock('toro/components/product/mobile/PayInInstallments', () => () => (
  <div data-qa="pay-in-installments">PayInInstallments</div>
))

jest.mock('toro/components/product/mobile/CompareToolsSection', () => () => (
  <div data-qa="compare-tools-section">CompareToolsSection</div>
))

jest.mock('toro/components/product/mobile/FeaturedContent', () => () => (
  <div data-qa="featured-content">FeaturedContent</div>
))

jest.mock('toro/components/product/AccessorizeIt', () => () => (
  <div data-qa="accessorize-it">AccessorizeIt</div>
))

jest.mock('toro/components/product/AccessorizeIt/AccessorizeItSkeleton', () => () => (
  <div data-qa="accessorize-it-skeleton">AccessorizeItSkeleton</div>
))

jest.mock('toro/components/product/desktop/CompareToolsSection', () => () => (
  <div data-qa="compare-tools-section">CompareToolsSection</div>
))

jest.mock('toro/hooks/useHeaderHeight', () => () => 60)
jest.mock('toro/helpers/isKS', () => () => false)

const mockedUseViewportType = jest.mocked(useViewportType)

const createAtomContexts = ({
  templates = { mobile: TemplateName.default, desktop: TemplateName.default },
  isQuickView = false,
  isTabbedAdaptivePDPEligible = false,
  addToBagButton = null as any,
  experiments = '',
} = {}): any => {
  return new Map([
    [productDataAtom, { templates, templateConfig: BASE_TEMPLATE_CONFIG }],
    [isQuickViewAtom, isQuickView],
    [isTabbedAdaptivePDPEligibleAtom, isTabbedAdaptivePDPEligible],
    [addToBagButtonOnEventAtom, addToBagButton],
    [experimentsAtom, experiments],
  ] as any)
}

const mockProps = {
  selectedVariantOrVG: { id: 'test-variant' },
  styles: {
    pdpMainContainerWrapper: { padding: '20px' },
    pdpMainContent: { margin: '10px' },
  },
  quickViewStyles: {
    pdpMainContainerWrapper: { padding: '10px' },
    pdpMainContent: { margin: '5px' },
  },
  tabbedAdaptiveLowerProps: { testProp: 'value' },
  additionalDetailsProps: { detailProp: 'detailValue' },
}

describe('ProductTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTemplate.mockReturnValue(false)
    mockTemplate.mockReturnValue(false)
  })

  describe('Desktop Template Rendering', () => {
    beforeEach(() => {
      mockedUseViewportType.mockReturnValue({
        isMobile: false,
        isDesktop: true,
        isTablet: false,
      })
    })

    describe('Default Desktop Template', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render ProductMainSectionDesktop with correct props', async () => {
        await act(async () => {
          render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(screen.getByTestId('product-main-section-desktop')).toBeVisible()
          expect(screen.getByText('ProductMainSectionDesktop')).toBeVisible()
        })
      })

      it('should verify Hidden component shows desktop content', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          const hiddenElements = result.getAllByTestId('hidden')
          expect(hiddenElements[0]).toHaveAttribute('data-on-mobile', 'true')
        })
      })

      it('should render MainContainer with proper styles', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          const mainContainer = result.getByTestId('main-container')
          expect(mainContainer).toBeVisible()
          expect(mainContainer).toHaveAttribute('data-w', '100%')
        })
      })
    })

    describe('PDP v5.0 Template', () => {
      beforeEach(() => {
        mockUseTemplate.mockImplementation((templates: any) => {
          if (templates.includes(TemplateName.pdpv5)) {
            return true
          }
          if (templates.includes(TemplateName.pdpv5_1)) {
            return false
          }
          return false
        })
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.pdpv5_0) ?? false
        })
      })

      it('should render PdpDesktopTemplateV5 with child components', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_0 },
              }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('template-theme-provider')).toBeVisible()
          expect(result.getByTestId('template-theme-provider')).toHaveAttribute('data-id', 'pdpv5')
          expect(result.getByTestId('product-carousel-with-zoom-modal')).toBeVisible()
          expect(result.getByTestId('product-details')).toBeVisible()
          expect(result.getByTestId('sticky-bar')).toBeVisible()
          expect(result.getByTestId('closer-look-area')).toBeVisible()
          expect(result.getByTestId('recommended-product-section')).toBeVisible()
          expect(result.getByTestId('ugc-container')).toBeVisible()
          expect(result.getByTestId('ratings-and-reviews-section')).toBeVisible()
          expect(result.getByTestId('recently-viewed-products')).toBeVisible()
          expect(result.getByTestId('breadcrumb-desktop-wrapper')).toBeVisible()
          expect(result.getByTestId('environment-impact-carousel-wrapper')).toBeVisible()
        })
      })

      it('should render ContentSlider components for all three content areas', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_0 },
              }),
            },
          })
        })

        await waitFor(() => {
          const contentSliders = result.getAllByTestId('content-slider')
          expect(contentSliders).toHaveLength(3)
          expect(contentSliders[0]).toHaveAttribute('data-content-area', 'content-area-one')
          expect(contentSliders[1]).toHaveAttribute('data-content-area', 'content-area-two')
          expect(contentSliders[2]).toHaveAttribute('data-content-area', 'content-area-three')
        })
      })
    })

    describe('PDP v5.1 Template', () => {
      beforeEach(() => {
        mockUseTemplate.mockImplementation((templates: any) => {
          if (templates.includes(TemplateName.pdpv5)) {
            return true
          }
          if (templates.includes(TemplateName.pdpv5_1)) {
            return true
          }
          return false
        })
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.pdpv5_1) ?? false
        })
      })

      it('should render PdpDesktopTemplateV5_1 and have className pdpv5_1 on MainContainer', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_1 },
              }),
            },
          })
        })

        await waitFor(() => {
          const mainContainer = result.getByTestId('main-container')
          expect(mainContainer).toHaveClass('pdpv5_1')
        })
      })

      it('should render PdpDesktopTemplateV5_1 with child components', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_1 },
              }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('template-theme-provider')).toBeVisible()
          expect(result.getByTestId('template-theme-provider')).toHaveAttribute(
            'data-id',
            'pdpv5_1'
          )
          expect(result.getByTestId('grid')).toBeVisible()
          expect(result.getByTestId('grid')).toHaveAttribute(
            'data-template-columns',
            'minmax(0, 1fr) 506px'
          )
          expect(result.getByTestId('product-carousel-with-zoom-modal')).toBeVisible()
          expect(result.getByTestId('main-stage-area')).toBeVisible()
          expect(result.getByTestId('product-details')).toBeVisible()
          expect(result.getByTestId('closer-look-area')).toBeVisible()
          expect(result.getByTestId('ugc-container')).toBeVisible()
          expect(result.getByTestId('compare-tools-section')).toBeVisible()
          expect(result.getByTestId('ratings-and-reviews-section')).toBeVisible()
          expect(result.getByTestId('recently-viewed-container')).toBeVisible()
          expect(result.getByTestId('breadcrumb-desktop-wrapper')).toBeVisible()
          expect(result.getByTestId('environment-impact-carousel-wrapper')).toBeVisible()
        })
      })

      it('should render ContentSlider components for all three content areas', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_1 },
              }),
            },
          })
        })

        await waitFor(() => {
          const contentSliders = result.getAllByTestId('content-slider')
          expect(contentSliders).toHaveLength(3)
          expect(contentSliders[0]).toHaveAttribute('data-content-area', 'content-area-one')
          expect(contentSliders[1]).toHaveAttribute('data-content-area', 'content-area-two')
          expect(contentSliders[2]).toHaveAttribute('data-content-area', 'content-area-three')
        })
      })
    })
  })

  describe('Mobile Template Rendering', () => {
    beforeEach(() => {
      jest.clearAllMocks()

      mockedUseViewportType.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        isTablet: false,
      })
    })

    describe('Default Mobile Template (Non-Tabbed)', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render ProductMainSectionMobile when PDP_V3 is disabled', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('product-main-section-mobile')).toBeVisible()
        })
      })

      it('should verify Hidden onNonMobile wrapper is used', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          const hiddenElements = result.getAllByTestId('hidden')
          const mobileHidden = hiddenElements.find(
            (el) => el.getAttribute('data-on-non-mobile') === 'true'
          )
          expect(mobileHidden).toBeTruthy()
        })
      })
    })

    describe('PDP v6 Mobile Template', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.pdpv6) ?? false
        })

        mockUseAnalytics.mockReturnValue({
          track: jest.fn(),
          trackEvent: jest.fn(),
          trackPageView: jest.fn(),
          send: jest.fn(),
        })
      })

      it('should render PdpMobileTemplate with child components', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.pdpv6, desktop: TemplateName.default },
              }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('template-theme-provider')).toBeVisible()
          expect(result.getByTestId('template-theme-provider')).toHaveAttribute('data-id', 'pdpv6')
          expect(result.getByTestId('on-image-badge')).toBeVisible()
          expect(result.getByTestId('product-carousel-with-zoom')).toBeVisible()
          expect(result.getByTestId('inventory-callout-badge')).toBeVisible()
          expect(result.getByTestId('mobile-product-details')).toBeVisible()
          expect(result.getByTestId('pdp-color-swatches')).toBeVisible()
          const customizeAndMonogram = result.getAllByTestId('customize-and-monogram')
          expect(customizeAndMonogram.length).toBeGreaterThanOrEqual(1)
          expect(result.getByTestId('add-to-bag-area-wrapper')).toBeVisible()
          expect(result.getByTestId('free-shipping-and-returns')).toBeVisible()
          expect(result.getByTestId('find-in-store')).toBeVisible()
          expect(result.getByTestId('product-highlights')).toBeVisible()
          expect(result.getByTestId('expandable-product-details')).toBeVisible()
          expect(result.getByTestId('recommended-product-section')).toBeVisible()
          expect(result.getByTestId('search-expose')).toBeVisible()
          expect(result.getByTestId('recently-viewed-products')).toBeVisible()
          expect(result.getByTestId('compare-tools-section')).toBeVisible()
          expect(result.getByTestId('ugc-container')).toBeVisible()
          expect(result.getByTestId('ratings-and-reviews-section')).toBeVisible()
        })
      })

      it('should render mobile template with Box wrapper', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.pdpv6, desktop: TemplateName.default },
              }),
            },
          })
        })

        await waitFor(() => {
          const boxes = result.getAllByTestId('box')
          const mobileBox = boxes.find((box) => box.hasAttribute('data-pb'))
          expect(mobileBox).toBeTruthy()
        })
      })

      it('should render ContentSlider components in mobile template', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                templates: { mobile: TemplateName.pdpv6, desktop: TemplateName.default },
              }),
            },
          })
        })

        await waitFor(() => {
          const contentSliders = result.getAllByTestId('content-slider')
          expect(contentSliders.length).toBeGreaterThanOrEqual(3)
        })
      })
    })

    describe('Mobile with PDP_V3 Experiment', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render ProductMainSectionMobileV3', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({ experiments: EXPERIMENTS.PDP_V3 }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('product-main-section-mobile-v3')).toBeVisible()
        })
      })

      it('should have className pdpv3 on Box wrapper', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({ experiments: EXPERIMENTS.PDP_V3 }),
            },
          })
        })

        await waitFor(() => {
          const boxes = result.getAllByTestId('box')
          const pdpv3Box = boxes.find((box) => box.classList.contains('pdpv3'))
          expect(pdpv3Box).toBeTruthy()
          expect(pdpv3Box).toHaveClass('pdpv3')
        })
      })

      it('should verify Experiment component shows correct variant', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({ experiments: EXPERIMENTS.PDP_V3 }),
            },
          })
        })

        await waitFor(() => {
          const experimentElements = result.getAllByTestId('experiment')
          const pdpv3Experiment = experimentElements.find(
            (el) => el.getAttribute('data-for-ids') === EXPERIMENTS.PDP_V3
          )
          expect(pdpv3Experiment).toBeTruthy()
        })
      })
    })

    describe('Mobile without PDP_V3 Experiment', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render legacy ProductMainSectionMobile', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('product-main-section-mobile')).toBeVisible()
        })
      })

      it('should verify Experiment notForIDs works correctly', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          const experimentElements = result.getAllByTestId('experiment')
          const notPdpv3Experiment = experimentElements.find(
            (el) => el.getAttribute('data-not-for-ids') === EXPERIMENTS.PDP_V3
          )
          expect(notPdpv3Experiment).toBeTruthy()
        })
      })
    })
  })

  describe('Tabbed Adaptive PDP', () => {
    beforeEach(() => {
      jest.clearAllMocks()

      mockedUseViewportType.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        isTablet: false,
      })
    })

    describe('Tabbed PDP Eligible Mobile', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render TabbedAdaptivePDP with tabbedPDPLower props', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({ isTabbedAdaptivePDPEligible: true }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('tabbed-adaptive-pdp')).toBeVisible()
        })
      })

      it('should NOT render AdditionalDetails sections', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({ isTabbedAdaptivePDPEligible: true }),
            },
          })
        })

        await waitFor(() => {
          expect(result.queryByTestId('additional-details-v2')).not.toBeInTheDocument()
          expect(result.queryByTestId('additional-details-v3')).not.toBeInTheDocument()
        })
      })
    })

    describe('Tabbed PDP Not Eligible', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render standard mobile sections with experiment-based routing', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('product-main-section-mobile')).toBeVisible()
          expect(result.queryByTestId('tabbed-adaptive-pdp')).not.toBeInTheDocument()
        })
      })

      it('should verify falls back to standard mobile experience', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('product-main-section-mobile')).toBeVisible()
        })
      })
    })
  })

  describe('Additional Details Sections', () => {
    beforeEach(() => {
      jest.clearAllMocks()

      mockedUseViewportType.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        isTablet: false,
      })
    })

    describe('AdditionalDetailsV3 for Mobile with Experiment', () => {
      beforeEach(() => {
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render AdditionalDetailsV3 with props', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                experiments: EXPERIMENTS.PDP_V3_BELOW_THE_FOLD,
              }),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('additional-details-v3')).toBeVisible()
        })
      })

      it('should verify Experiment forMobile flag works', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts({
                experiments: EXPERIMENTS.PDP_V3_BELOW_THE_FOLD,
              }),
            },
          })
        })

        await waitFor(() => {
          const experimentElements = result.getAllByTestId('experiment')
          const mobileExperiment = experimentElements.find(
            (el) =>
              el.getAttribute('data-for-ids') === EXPERIMENTS.PDP_V3_BELOW_THE_FOLD &&
              el.getAttribute('data-for-mobile') === 'true'
          )
          expect(mobileExperiment).toBeTruthy()
        })
      })
    })

    describe('AdditionalDetails for Desktop (Always On)', () => {
      beforeEach(() => {
        jest.clearAllMocks()

        mockedUseViewportType.mockReturnValue({
          isMobile: false,
          isDesktop: true,
          isTablet: false,
        })
        mockTemplate.mockImplementation(({ forIDs }: any) => {
          return forIDs?.includes(TemplateName.default) ?? false
        })
      })

      it('should render AdditionalDetails (V2) with alwaysOnForDesktop', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('additional-details-v2')).toBeVisible()
        })
      })

      it('should verify Desktop always gets AdditionalDetails regardless of experiment', async () => {
        let result: any
        await act(async () => {
          result = render(<ProductTemplate {...mockProps} />, {
            contexts: {
              JotaiProviderContext: createAtomContexts(),
            },
          })
        })

        await waitFor(() => {
          expect(result.getByTestId('additional-details-v2')).toBeVisible()

          const experimentElements = result.getAllByTestId('experiment')
          const desktopExperiment = experimentElements.find(
            (el) =>
              el.getAttribute('data-not-for-ids') === EXPERIMENTS.PDP_V3_BELOW_THE_FOLD &&
              el.getAttribute('data-always-on-for-desktop') === 'true'
          )
          expect(desktopExperiment).toBeTruthy()
        })
      })
    })
  })

  describe('Quick View Mode', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockTemplate.mockReturnValue(false)
    })

    it('should not render mobile sections in quick view', async () => {
      mockedUseViewportType.mockReturnValue({
        isMobile: true,
        isDesktop: false,
        isTablet: false,
      })

      let result: any
      await act(async () => {
        result = render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({ isQuickView: true }),
          },
        })
      })

      await waitFor(() => {
        expect(result.queryByTestId('product-main-section-mobile')).not.toBeInTheDocument()
        expect(result.queryByTestId('product-main-section-mobile-v3')).not.toBeInTheDocument()
      })
    })

    it('should not render AdditionalDetails in quick view', async () => {
      mockedUseViewportType.mockReturnValue({
        isMobile: false,
        isDesktop: true,
        isTablet: false,
      })

      let result: any
      await act(async () => {
        result = render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({ isQuickView: true }),
          },
        })
      })

      await waitFor(() => {
        expect(result.queryByTestId('additional-details-v2')).not.toBeInTheDocument()
        expect(result.queryByTestId('additional-details-v3')).not.toBeInTheDocument()
      })
    })

    it('should apply quick view styles', async () => {
      mockedUseViewportType.mockReturnValue({
        isMobile: false,
        isDesktop: true,
        isTablet: false,
      })

      let result: any
      await act(async () => {
        result = render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({ isQuickView: true }),
          },
        })
      })

      await waitFor(() => {
        const mainContainer = result.getByTestId('main-container')
        expect(mainContainer).toHaveAttribute('data-w', '100%')
      })
    })
  })

  describe('Common Elements', () => {
    beforeEach(() => {
      jest.clearAllMocks()

      mockedUseViewportType.mockReturnValue({
        isMobile: false,
        isDesktop: true,
        isTablet: false,
      })
      mockTemplate.mockImplementation(({ forIDs }: any) => {
        return forIDs?.includes(TemplateName.default) ?? false
      })
    })

    it('should always render TangibleeAnalytics', async () => {
      let result: any
      await act(async () => {
        result = render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts(),
          },
        })
      })

      await waitFor(() => {
        expect(result.getByTestId('tangiblee-analytics')).toBeVisible()
      })
    })

    it('should render addToBagButtonOnEvent when provided', async () => {
      const mockAddToBagButton = <button data-qa="add-to-bag-button">Add to Bag</button>

      let result: any
      await act(async () => {
        result = render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({ addToBagButton: mockAddToBagButton }),
          },
        })
      })

      await waitFor(() => {
        expect(result.getByTestId('add-to-bag-button')).toBeVisible()
      })
    })
  })

  describe('<MainContainer>', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockedUseViewportType.mockReturnValue({
        isMobile: false,
        isDesktop: true,
        isTablet: false,
      })
    })

    it('should apply overflowX: hidden and maxWidth=null for PDP v5.0 template', async () => {
      mockUseTemplate.mockImplementation((templates: any) => {
        if (templates.includes(TemplateName.pdpv5)) {
          return true
        }
        if (templates.includes(TemplateName.pdpv5_1)) {
          return false
        }
        return false
      })
      mockTemplate.mockImplementation(({ forIDs }: any) => {
        return forIDs?.includes(TemplateName.pdpv5_0) ?? false
      })

      await act(async () => {
        render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({
              templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_0 },
            }),
          },
        })
      })
      const mainContainer = screen.getByTestId('main-container')

      await waitFor(() => {
        expect(mainContainer).toHaveAttribute('data-w', '100%')
        expect(mainContainer).toHaveStyle({ overflowX: 'hidden' })
        expect(mainContainer.getAttribute('data-max-width')).toBeNull()
      })
    })

    it('should apply className="pdpv5_1" when using PDP v5.1 template', async () => {
      mockUseTemplate.mockImplementation((templates: any) => {
        if (templates.includes(TemplateName.pdpv5)) {
          return true
        }
        if (templates.includes(TemplateName.pdpv5_1)) {
          return true
        }
        return false
      })
      mockTemplate.mockImplementation(({ forIDs }: any) => {
        return forIDs?.includes(TemplateName.pdpv5_1) ?? false
      })

      await act(async () => {
        render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({
              templates: { mobile: TemplateName.default, desktop: TemplateName.pdpv5_1 },
            }),
          },
        })
      })
      const mainContainer = screen.getByTestId('main-container')

      await waitFor(() => {
        expect(mainContainer).toHaveClass('pdpv5_1')
      })
    })

    it('should not apply overflowX hidden, nor className for default template', async () => {
      mockTemplate.mockImplementation(({ forIDs }: any) => {
        return forIDs?.includes(TemplateName.default) ?? false
      })
      await act(async () => {
        render(<ProductTemplate {...mockProps} />, {
          contexts: {
            JotaiProviderContext: createAtomContexts({
              templates: { mobile: TemplateName.default, desktop: TemplateName.default },
            }),
          },
        })
      })
      const mainContainer = screen.getByTestId('main-container')

      await waitFor(() => {
        expect(mainContainer).not.toHaveStyle({ overflowX: 'hidden' })
        expect(mainContainer).not.toHaveClass('pdpv5_1')
      })
    })
  })
})
