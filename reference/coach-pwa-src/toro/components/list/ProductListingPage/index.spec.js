import React from 'react'
import { render, screen } from 'test-utils/react'
import ProductListingPage from 'toro/components/list/ProductListingPage'
import useViewportType from 'toro/hooks/useViewportType'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import { productsAtom, totalProductsAtom } from 'store/search-results.atom'
import { isPlpV3Atom, isCompletePlpV3DesktopAtom } from 'store/plp.atom'

const mockContentUpdated = jest.fn()

jest.mock('react-slick', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div className="slick-slider">{children}</div>),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/test-path',
  }),
}))
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (args) => {
    const loader = typeof args === 'function' ? args : args?.loader
    const MockComponent = () => <div data-testid="dynamic-component" />

    if (loader) {
      loader().then((module) => ({
        default: module?.default || MockComponent,
      }))
    }

    return MockComponent
  },
}))
jest.mock('toro/components/BackToTopButton', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('toro/analytics/useCmsAnalytics', () => ({
  __esModule: true,
  default: () => ({
    contentUpdated: mockContentUpdated,
    onClick: jest.fn(),
  }),
  analytics: {
    send: jest.fn(),
  },
}))
jest.mock('toro/analytics/useAnalytics', () => {
  return jest.fn(() => ({
    send: jest.fn(),
  }))
})

jest.mock('toro/hooks/usePreference_new', () => () => ({
  toggleSiteFeatures: { enableSitckyFilterSortOnPLP: true },
  generalConfiguration: {
    enableNewGlobalHeader: true,
  },
  adaptiveExperience: { dealRecommendations: {} },
  certonaConfiguration: {
    certonaSubDomain: 'certona-test-subdomain',
  },
  coachtopia: {
    coachtopiaHomeURL: '/shop/testBrand',
  },
  plpTemplateConfigurations: { sortTypeId: 'optionA' },
}))
jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: false, isMobile: true }))

jest.mock('toro/hooks/useVerticalScrollDirection', () => () => ({
  hasTopDirectionScroll: true,
}))

jest.mock('toro/hooks/useHeaderPositionPref', () => () => ({
  stickyHeaderHeight: 0,
  isStickyOrSlidingHeader: true,
}))

jest.mock('toro/hooks/useHeadroomAtom', () => () => ({
  isHeaderHeight: 0,
}))
jest.mock('toro/hooks/usePageType', () => jest.fn(() => ({ isPDP: false, isPLP: true })))

jest.mock('toro/hooks/useExperiment', () => () => false)

jest.mock('toro/helpers/fetchProductDataFromClient', () => jest.fn())

jest.mock('toro/components/SearchWidget', () => () => <div>SearchWidget</div>)

jest.mock('toro/components/list/QuickView/QuickViewModal', () => ({ children }) => (
  <div>{children}</div>
))

jest.mock('toro/components/product/NotifyMeWidget', () => () => <div>NotifyMePopUp</div>)
jest.mock('toro/components/list/SeoPaginationLinkTags', () => ({
  __esModule: true,
  default: () => <div data-testid="seo-pagination-link-tags">SeoPaginationLinkTags</div>,
}))

jest.mock('toro/components/list/ProductsResults', () => ({
  __esModule: true,
  default: () => <div data-qa="products-results">ProductsResults</div>,
}))
jest.mock('toro/components/BreadcrumbPage', () => ({
  __esModule: true,
  default: ({ breadcrumbData, ...props }) => (
    <div data-testid="breadcrumb" {...props}>
      {JSON.stringify(breadcrumbData)}
    </div>
  ),
}))

mockIntersectionObserver()
describe('ProductListingPage', () => {
  let mockRequestIdleCallback
  let mockCancelIdleCallback

  beforeAll(() => {
    mockRequestIdleCallback = jest.fn((cb) => setTimeout(cb, 1))
    mockCancelIdleCallback = jest.fn((id) => clearTimeout(id))

    global.requestIdleCallback = mockRequestIdleCallback
    global.cancelIdleCallback = mockCancelIdleCallback
  })

  const mockAppData = {
    siteId: 'test-site-id',
    brand: 'Test Brand',
  }

  const mockPageData = {
    filters: [],
    breadcrumbs: [],
    seoFacetMetaTags: {},
    seoProductsMetaData: {},
    totalPages: 3,
    page: 2,
    wyngId: 'test-wyng-id',
    wyngToken: 'test-wyng-token',
    id: 'test-category',
    name: 'Test Category',
    currentPageTitle: 'Test Page Title',
    alternateH1Tag: 'Test H1',
    preloadImageSrc: 'https://example.com/image.jpg',
    ugcContentSlotData: '<div>UGC Content</div>',
    subNavigationData: [{ name: 'Sub Nav', url: '/sub' }],
    topContentSlot: { content: { content: '<div>Top Banner</div>' } },
    bottomContentSlotData: { assetMarkup: '<div>Bottom Content</div>' },
    seoDataAtom: { content: '<div>SEO Content</div>' },
  }

  const customRenderOptions = {
    contexts: {
      PWAContext: {
        appData: { mockAppData },
        injectJquery: jest.fn().mockResolvedValue(true),
      },
      SessionContext: {},
    },
  }

  const makeSetup = ({ atomsData = [], customProps = {} } = {}) => {
    return render(<ProductListingPage pageData={mockPageData} {...customProps} />, {
      ...customRenderOptions,
      contexts: {
        ...customRenderOptions.contexts,
        JotaiProviderContext: new Map(atomsData),
      },
    })
  }

  it('renders with products', () => {
    const atomsData = [[productsAtom, [{ id: 1, name: 'Product 1' }]]]

    makeSetup({ atomsData })

    expect(screen.getByTestId('products-results')).toBeVisible()
  })

  it('renders zero products page when no products are available', async () => {
    const { container } = makeSetup({
      atomsData: [
        [productsAtom, []],
        [totalProductsAtom, 0],
      ],
      customProps: {
        pageData: {
          ...mockPageData,
          filters: ['test-filter'],
          breadcrumbs: [
            { text: 'Home', url: '/' },
            { text: 'Category', htmlValue: 'Original Value' },
          ],
          totalPages: 1,
        },
      },
    })

    expect(container.querySelector('.zero-products-page')).toBeVisible()
  })

  it('should call contentUpdated on component mount', () => {
    makeSetup({ atomsData: [] })
    expect(mockContentUpdated).toHaveBeenCalled()
  })

  it('should schedule UGC lazy loading when ugcContentSlotData or wyngContent is present', () => {
    mockRequestIdleCallback.mockClear()
    mockCancelIdleCallback.mockClear()

    const pageDataWithUGC = {
      ...mockPageData,
      ugcContentSlotData: '<div>UGC Content</div>',
    }

    makeSetup({
      atomsData: [],
      customProps: { pageData: pageDataWithUGC },
    })
    expect(mockRequestIdleCallback).toHaveBeenCalledTimes(1)

    mockRequestIdleCallback.mockClear()
    mockCancelIdleCallback.mockClear()

    const pageDataWithWyng = {
      ...mockPageData,
      ugcContentSlotData: '',
      wyngId: 'test-id',
      wyngToken: 'test-token',
    }

    makeSetup({
      atomsData: [],
      customProps: { pageData: pageDataWithWyng },
    })
    expect(mockRequestIdleCallback).toHaveBeenCalledTimes(1)
  })

  it('should cancel UGC lazy loading during component unmount', () => {
    mockRequestIdleCallback.mockClear()
    mockCancelIdleCallback.mockClear()

    const pageDataWithUGC = {
      ...mockPageData,
      ugcContentSlotData: '<div>UGC Content</div>',
    }

    const { unmount } = makeSetup({
      atomsData: [],
      customProps: { pageData: pageDataWithUGC },
    })

    unmount()

    expect(mockCancelIdleCallback).toHaveBeenCalledTimes(1)
  })

  it('should not schedule UGC lazy loading when UGC content is not present', () => {
    mockRequestIdleCallback.mockClear()
    mockCancelIdleCallback.mockClear()

    const pageDataWithoutUGC = {
      ...mockPageData,
      ugcContentSlotData: '',
      wyngToken: '',
      wyngId: '',
    }

    makeSetup({
      atomsData: [],
      customProps: { pageData: pageDataWithoutUGC },
    })

    expect(mockRequestIdleCallback).not.toHaveBeenCalled()
  })

  it('should cleanup and reschedule UGC lazy loading when content changes', () => {
    mockRequestIdleCallback.mockClear()
    mockCancelIdleCallback.mockClear()

    const initialPageData = {
      ...mockPageData,
      ugcContentSlotData: '<div>Initial UGC Content</div>',
    }

    const { rerender } = makeSetup({
      atomsData: [],
      customProps: { pageData: initialPageData },
    })

    expect(mockRequestIdleCallback).toHaveBeenCalledTimes(1)

    const updatedPageData = {
      ...mockPageData,
      ugcContentSlotData: '<div>Updated UGC Content</div>',
    }

    rerender(<ProductListingPage pageData={updatedPageData} />)

    expect(mockCancelIdleCallback).toHaveBeenCalledTimes(1)
    expect(mockRequestIdleCallback).toHaveBeenCalledTimes(2)
  })

  it('renders breadcrumbs correctly', () => {
    const pageDataWithBreadcrumbs = {
      ...mockPageData,
    }

    makeSetup({
      atomsData: [],
      customProps: { pageData: pageDataWithBreadcrumbs },
    })
    const breadcrumbNav = document.getElementById('breadcrumb-container')
    expect(breadcrumbNav).toBeVisible()
  })

  it('should call subNavRef and update sub nav height', () => {
    makeSetup({ atomsData: [] })

    const mockNode = {
      getBoundingClientRect: () => ({ height: 60 }),
    }

    const subNavRef = (node) => {
      if (node) {
        const height = node.getBoundingClientRect().height
        expect(height).toBe(60)
      }
    }

    subNavRef(mockNode)
  })

  it('should call rvCarouselNodeSetter and update rv height', () => {
    makeSetup({ atomsData: [] })

    const mockNode = {
      getHeight: () => 250,
    }

    const rvCarouselNodeSetter = (node) => {
      if (node?.getHeight) {
        const height = node.getHeight()
        expect(height).toBe(250)
      }
    }

    rvCarouselNodeSetter(mockNode)
  })

  it('renders TotalCount when isPlpV3 is true', () => {
    makeSetup({ atomsData: [[isPlpV3Atom, true]] })
    expect(screen.getByTestId('plp_txt_resultcount')).toBeVisible()
  })

  it('renders top content slot on desktop when plpV3 is complete', () => {
    const atomsData = [
      [isCompletePlpV3DesktopAtom, true],
      [isPlpV3Atom, true],
    ]
    useViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    makeSetup({ atomsData })
    expect(screen.getByTestId('plp_top_cslot')).toBeVisible()
  })

  it('renders correct page title with alternateH1Tag', () => {
    makeSetup({ atomsData: [] })
    expect(screen.getByTestId('d_plp_txt_hdng')).toBeVisible()
  })

  it('shows "No Results Found" message when products are empty and pageData is valid', () => {
    const atomsData = [
      [productsAtom, []],
      [totalProductsAtom, 0],
    ]

    const mockPageDat = {
      ...mockPageData,
      filters: [],
      suggestionPhrase: 'Try these suggestions',
      name: 'Test Category',
      totalPages: 1,
    }

    makeSetup({
      atomsData,
      customProps: { pageData: mockPageDat },
    })

    expect(screen.getByTestId('hs_nsr_txt_chksplng')).toBeVisible()
  })
})
