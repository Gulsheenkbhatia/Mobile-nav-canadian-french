import { render, CustomRenderOptions, fireEvent } from 'test-utils/react'
import HeaderDesktop from 'toro/components/header/Header/desktop/index'
import useViewportType from 'toro/hooks/useViewportType'
import usePageType from 'toro/hooks/usePageType'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  bannerHeightAtom,
  isHeaderHeightAtom,
  isHeadroomActiveAtom,
  isHeaderHiddenAtom,
  setIsTransparentHeaderAtom,
} from 'store/headroom.atom'
import { exposedSearchStatusAtom } from 'store/search.atom'
import { miniCartOpenReasonAtom, isSWOutletAtom, isOneCoachTabbedAtom } from 'store/global.atom'
import {
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveDynamicAssetInViewportAtom,
} from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import useTemplate from 'toro/hooks/useTemplate'

const mockSuccessToast = jest.fn()
const setBannerHeightMock = jest.fn()
const setHeaderHeightMock = jest.fn()
const setIsHeaderHiddenMock = jest.fn()
const mockCookiesRemove = jest.fn()
const mockCookiesGet = jest.fn()
const setIsTransparentHeaderMock = jest.fn()

jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePageType')
jest.mock('toro/hooks/useHeaderPositionPref')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useVerticalScrollDirection')
jest.mock('toro/hooks/useToast', () => () => mockSuccessToast)
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
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
jest.mock('hooks/useGlobalSlotAtomData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    scripts: ['<script data-qa="promoScript">console.log("promo")</script>'],
    modalContent: '<div data-qa="promoModalContent">Modal Content</div>',
    popupContent: '<div data-qa="promoPopupContent">Popup Content</div>',
  })),
}))

const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
const mockedUseHeaderPositionPref = useHeaderPositionPref as jest.MockedFn<
  typeof useHeaderPositionPref
>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockeduseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
jest.mock('toro/hooks/useExperiment', () => jest.fn())
const mockUseExperiment = useExperiment as jest.Mock
const mockedUseVerticalScrollDirection = useVerticalScrollDirection as jest.MockedFn<
  typeof useVerticalScrollDirection
>
const mockUseRouter = useRouter as jest.Mock
jest.mock('toro/hooks/useTemplate', () => jest.fn())
const mockUseTemplate = useTemplate as jest.Mock

// Mock components
jest.mock('toro/components/header/HeaderMainContent', () => () => (
  <div data-qa="header-main-content">Header Main Content</div>
))
jest.mock('toro/components/header/DesktopNavigation', () => () => (
  <nav data-qa="desktop-navigation">Desktop Navigation</nav>
))
jest.mock('toro/components/header/PromoBanner', () => () => (
  <div data-qa="promo-banner">Promo Banner</div>
))
jest.mock('toro/components/MainContainer', () => ({ children }: any) => <div>{children}</div>)
jest.mock('toro/components/header/EStockroomBanner', () => () => (
  <div data-qa="estockroom-banner">EStockRoom Banner</div>
))
jest.mock('toro/components/SitePreview', () => () => <div data-qa="site-preview">Site Preview</div>)
jest.mock('toro/components/header/Tabs', () => () => <div data-qa="headerTabs">HeaderTabs</div>)
jest.mock('toro/components/header/MiniCart/MiniCartPopover.container', () => () => (
  <div data-qa="mini-cart-popover">Mini Cart Pop Over</div>
))
jest.mock('toro/components/header/Tabs', () => () => <div data-qa="header-tabs" />)
jest.mock('toro/cms/components/ContentSlot', () => ({ Component, content }: any) => (
  <Component {...content} />
))
jest.mock('toro/components/thredUp/ThreadUpModal', () => () => <div data-qa="threadup-modal" />)
jest.mock('toro/components/DesktopCollapsibleRVCarousel', () => () => (
  <div data-qa="desktop-collapsible-rv-carousel" />
))

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        locale: 'en-US',
        isSitePreviewEnabled: true,
        header: {
          menuData: {},
          flyoutContent: {},
        },
        siteId: 'coh_us_rt',
        brand: 'coach',
      },
    },
  },
}

const makeSetup = () => {
  return render(<HeaderDesktop />, renderOptions)
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('HeaderDesktop Component', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      pathname: '/product',
      asPath: '/',
      push: jest.fn(),
    })
    Cookies.get = mockCookiesGet
    Cookies.remove = mockCookiesRemove
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    mockedUsePageType.mockImplementation(() => ({
      isPDP: false,
      isHP: true,
      isSRP: false,
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: true,
      isContentPage: false,
    }))
    mockedUseHeaderPositionPref.mockImplementation(() => ({
      isStaticHeader: true,
      isStickyHeader: true,
      isTransparentStickyHeader: true,
      isSlidingNavHeader: true,
      isSlidingCarouselHeader: true,
      isTransparentSlidingHeader: false,
      isStickyOrSlidingHeader: true,
      stickyHeaderHeight: 0,
    }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case bannerHeightAtom:
          return 0
        case isHeadroomActiveAtom:
          return true
        case isHeaderHiddenAtom:
          return true
        case exposedSearchStatusAtom:
          return true
        case miniCartOpenReasonAtom:
          return true
        case isSWOutletAtom:
          return false
        case isOneCoachTabbedAtom:
          return true
        case isTabbedAdaptivePDPEligibleAtom:
          return true
        case isTabbedAdaptiveDynamicAssetInViewportAtom:
          return false
        default:
          return undefined
      }
    })
    mockeduseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case bannerHeightAtom:
          return setBannerHeightMock
        case isHeaderHeightAtom:
          return setHeaderHeightMock
        case isHeaderHiddenAtom:
          return setIsHeaderHiddenMock
        case setIsTransparentHeaderAtom:
          return setIsTransparentHeaderMock
        default:
          return undefined
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      storefrontConfigs: { transparentHeader: true },
      generalConfiguration: { enableNewGlobalHeader: true, enableExposedSearchHeader: true },
    }))
    mockUseExperiment.mockReturnValue(true)
    mockedUseVerticalScrollDirection.mockImplementation(() => ({
      hasTopDirectionScroll: true,
      showBanner: true,
      scrollPosition: 10,
      isOnTop: true,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render header main content and navigation by default', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
    expect(getByTestId('desktop-navigation')).toBeVisible()
  })

  it('should render the component properly when enableNewGlobalHeader is true', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should render the component properly when variant is null', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should render header main content with proper styles in mobile view', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
    expect(getByTestId('desktop-navigation')).toBeVisible()
  })

  it('should render SitePreview Tool properly when isSitePreviewEnabled is true', async () => {
    const { findByTestId } = makeSetup()
    const target = await findByTestId('site-preview')
    expect(target).toBeVisible()
  })

  it('should show EStockroom banner always', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('estockroom-banner')).toBeVisible()
  })

  it('should render headerBannerPopUp when headerBannerPopUpContent is available', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('promoPopupContent')).toBeVisible()
  })

  it('should render promo script when available', async () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('promoScript')).toBeInTheDocument()
  })

  it('should render mini cart popover', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('mini-cart-popover')).toBeVisible()
  })

  it('should render mini cart popover when static header is true', () => {
    mockedUseHeaderPositionPref.mockImplementationOnce(() => ({
      ...mockedUseHeaderPositionPref(),
      isStaticHeader: false,
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('mini-cart-popover')).toBeVisible()
  })

  it('should add class transparentHeader headerV2FadeIn headerPageInnerContainer for header main component', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptiveDynamicAssetInViewportAtom) {
        return true
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('hdr_container_section')).toHaveClass(
      'transparentHeader headerV2FadeIn headerPageInnerContainer'
    )
  })

  it('should add class transparentHeader headerPageInnerContainer for header main component', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    mockedUseVerticalScrollDirection.mockImplementationOnce(() => ({
      ...mockedUseVerticalScrollDirection(),
      scrollPosition: 0,
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('hdr_container_section')).toHaveClass(
      'transparentHeader headerPageInnerContainer'
    )
  })

  it('should add class transparentHeader headerV2FadeIn withBackdrop headerPageInnerContainer for header main component', () => {
    mockUseTemplate.mockReturnValue(true)
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('hdr_container_section')).toHaveClass(
      'transparentHeader headerV2FadeIn withBackdrop headerPageInnerContainer'
    )
  })

  it('should render the component properly when pdpv3 is disabled and tabbed adaptive pdp is eligible', () => {
    mockUseExperiment.mockReturnValue(false)
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should render the component properly when headroom is not disabled', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    mockedUseHeaderPositionPref.mockImplementation(() => ({
      isStaticHeader: false,
      isStickyHeader: false,
      isTransparentStickyHeader: true,
      isSlidingNavHeader: false,
      isSlidingCarouselHeader: false,
      isTransparentSlidingHeader: false,
      isStickyOrSlidingHeader: true,
      stickyHeaderHeight: 0,
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should toggle the classname for header container section when mouse enters and leaves the header container component', async () => {
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    const { user, getByTestId } = makeSetup()
    const parent = getByTestId('hdr_container_section')
    const target = parent.firstElementChild
    await user.hover(target)
    expect(getByTestId('hdr_container_section')).toHaveClass('headerPageInnerContainer')
    expect(getByTestId('hdr_container_section')).not.toHaveClass(
      'transparentHeader headerPageInnerContainer'
    )
    await user.unhover(target)
    expect(getByTestId('hdr_container_section')).toHaveClass(
      'transparentHeader headerPageInnerContainer'
    )
  })

  it('should render desktop navigation and unhides the header when on PDP with transparent sticky header and header is hidden', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('desktop-navigation')).toBeVisible()
    expect(setIsHeaderHiddenMock).toHaveBeenCalled()
  })

  it('should update the class name from headerPageInnerContainer to transparentHeader headerPageInnerContainer when user scroll past the main header', async () => {
    mockUseRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: jest.fn(),
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableNewGlobalHeader: false,
      },
    }))
    mockedUseHeaderPositionPref.mockImplementationOnce(() => ({
      ...mockedUseHeaderPositionPref(),
      isStaticHeader: true,
    }))
    const { user, getByTestId } = makeSetup()
    const parent = getByTestId('hdr_container_section')
    const target = parent.firstElementChild
    await user.hover(target)
    expect(getByTestId('hdr_container_section')).toHaveClass('headerPageInnerContainer')
    expect(getByTestId('hdr_container_section')).not.toHaveClass(
      'transparentHeader headerPageInnerContainer'
    )
    await user.click(target)

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)
    expect(getByTestId('hdr_container_section')).toHaveClass(
      'transparentHeader headerPageInnerContainer'
    )
  })

  it('should render header main content properly when exposedSearchHeader is not enabled', () => {
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      generalConfiguration: {
        ...original.generalConfiguration,
        enableExposedSearchHeader: false,
      },
    }))
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should render header main content properly when exposedSearchStatusAtom is not active', () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === exposedSearchStatusAtom) {
        return false
      }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { getByTestId } = makeSetup()
    expect(getByTestId('header-main-content')).toBeVisible()
  })

  it('should remove cookie and show toast if cc-vst exists', () => {
    mockCookiesGet.mockReturnValue('banner message')
    makeSetup()
    expect(mockSuccessToast).toHaveBeenCalledWith({ description: 'banner message' })
    expect(mockCookiesRemove).toHaveBeenCalledWith('cc-vst')
  })

  it('should render ThreadUpModal', () => {
    const { getByTestId } = makeSetup()
    expect(getByTestId('threadup-modal')).toBeVisible()
  })
})
