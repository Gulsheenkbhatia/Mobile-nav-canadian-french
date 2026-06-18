import { render } from 'test-utils/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import MobileHeader from 'toro/components/header/Header/mobile/index'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'

const mockSuccessToast = jest.fn()
const mockCookiesRemove = jest.fn()
const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseUpdateAtom = jest.mocked(useUpdateAtom)
const mockedUsePreference = jest.mocked(usePreference)
const mockedUseViewportType = jest.mocked(useViewportType)
const mockedUseHeaderPositionPref = jest.mocked(useHeaderPositionPref)
const mockedUseVerticalScrollDirection = jest.mocked(useVerticalScrollDirection)

const getViewPortType = (overrides = {}) => ({
  isMobile: true,
  isDesktop: false,
  isTablet: false,
  ...overrides,
})

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
jest.mock('jotai/utils')
jest.mock('store/pdp.atom')
jest.mock('store/global.atom')
jest.mock('store/search.atom')
jest.mock('store/headroom.atom')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useHeaderPositionPref')
jest.mock('toro/hooks/useVerticalScrollDirection')
jest.mock('toro/hooks/useExperiment', () => () => false)
jest.mock('toro/hooks/useProductImageHeight', () => () => 350)
jest.mock('toro/hooks/useToast', () => () => mockSuccessToast)
jest.mock('toro/hooks/usePageType', () => () => ({ isProductPassport: false, isHP: true }))
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('toro/constants/experiments', () => ({
  EXPERIMENTS: {},
}))
jest.mock('toro/hocs/withFeatureFlag', () => ({
  __esModule: true,
  default: (Component) => Component,
}))
jest.mock('hooks/useGlobalSlotAtomData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    scripts: ['<script data-qa="promoScript">console.log("promo")</script>'],
    modalContent: '<div data-qa="promoModalContent">Modal Content</div>',
    popupContent: '<div data-qa="promoPopupContent">Popup Content</div>',
  })),
}))
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (...props) => {
    const dynamicModule = jest.requireActual('next/dynamic')
    const dynamicActualComp = dynamicModule.default
    const RequiredComponent = dynamicActualComp(props[0])
    return RequiredComponent
  },
}))

// Components Mocks
jest.mock('toro/components/header/Tabs', () => () => <div data-qa="headerTabs">HeaderTabs</div>)
jest.mock('toro/components/header/PromoBanner', () => () => <div data-qa="promo">Promo banner</div>)
jest.mock('toro/cms/components/ContentSlot', () => () => (
  <div data-qa="contentslot">Content Slot</div>
))
jest.mock('toro/components/header/MobileMenu', () => () => (
  <div data-qa="mobileMenu">MobileMenu</div>
))
jest.mock('toro/components/thredUp/ThreadUpModal', () => () => (
  <div data-qa="threadUpModal">ThreadUpModal</div>
))
jest.mock('toro/components/header/EStockroomBanner', () => () => (
  <div data-qa="eStock">EStockroomBanner</div>
))
jest.mock('toro/components/header/MobileNavigation', () => () => (
  <div data-qa="mobileNavigation">MobileNavigation</div>
))
jest.mock('toro/components/header/HeaderMainContent', () => () => (
  <div data-qa="headermaincontent">HeaderMainContent</div>
))
jest.mock('toro/components/header/MobileMenuPlainLinks', () => () => (
  <div data-qa="mobilePlainLinks">MobileMenuPlainLinks</div>
))
jest.mock('toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPUpper', () => ({
  PARALLAX_THRESHOLD: 250,
}))
jest.mock('toro/components/header/MobilePromoBannerNotch/MobilePromoBannerNotch', () => () => (
  <div data-qa="mobilePromoBannerNotch">MobilePromoBannerNotch</div>
))

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        isTabHeaderVisible: true,
        isSitePreviewEnabled: true,
        isReducedHeaderAndFooter: false,
      },
    },
  },
}

const makeSetup = () => {
  const component = <MobileHeader />
  return render(component, renderOptions)
}

describe('Mobile Header', () => {
  beforeEach(() => {
    Cookies.get = jest.fn()
    Cookies.remove = mockCookiesRemove
    useRouter.mockReturnValue({ pathname: '/products' })
    mockedUseAtomValue.mockReturnValue(0)
    mockedUseUpdateAtom.mockReturnValue(jest.fn())
    mockedUseViewportType.mockReturnValue(getViewPortType())
    mockedUseVerticalScrollDirection.mockReturnValue({
      hasTopDirectionScroll: false,
      showBanner: true,
      scrollPosition: 0,
      isOnTop: true,
    })
    window.scrollListener = {
      add: jest.fn((callback) => {
        callback()
        return jest.fn()
      }),
    }
    mockedUsePreference.mockImplementation(() => {
      return {
        storefrontConfigs: { transparentHeader: false },
        generalConfiguration: {
          enableNewGlobalHeader: false,
          enableExposedSearchHeader: true,
        },
      }
    })
    mockedUseHeaderPositionPref.mockReturnValue({
      isSlidingNavHeader: true,
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crash and render header component', async () => {
    const { getByTestId } = makeSetup()

    expect(getByTestId('headermaincontent')).toBeVisible()
  })

  it('should render mobile navigation components correctly', async () => {
    const { getByTestId } = makeSetup()

    expect(getByTestId('mobileMenu')).toBeVisible()
    expect(getByTestId('mobilePlainLinks')).toBeVisible()
  })

  it('should render threadup modal and promo banner modal content', async () => {
    const { getByTestId } = makeSetup()

    expect(getByTestId('threadUpModal')).toBeVisible()
    expect(getByTestId('promoModalContent')).toBeVisible()
  })

  it('should inject promo banner scripts', async () => {
    const { getByTestId } = makeSetup()

    expect(getByTestId('promoScript')).toBeInTheDocument()
  })

  it('should render header tabs', async () => {
    mockedUseViewportType.mockReturnValue(getViewPortType({ isMobile: false }))
    const { getByTestId } = makeSetup()

    expect(getByTestId('headerTabs')).toBeVisible()
  })

  it('should call successToast and Cookies.remove when the cookie exists', async () => {
    const toastMsg = 'banner-toast-message'
    Cookies.get = jest.fn().mockReturnValue(toastMsg)
    makeSetup()

    expect(mockCookiesRemove).toHaveBeenCalledWith('cc-vst')
    expect(mockSuccessToast).toHaveBeenCalledWith({ description: toastMsg })
  })

  it('should add transparent header class', async () => {
    mockedUsePreference.mockImplementation(() => {
      return {
        storefrontConfigs: { transparentHeader: true },
        generalConfiguration: {
          enableNewGlobalHeader: true,
          enableExposedSearchHeader: false,
        },
      }
    })
    useRouter.mockReturnValue({ pathname: '/' })
    const { getByTestId } = makeSetup()

    expect(getByTestId('hdr_container_section')).toHaveClass('transparentHeader')
  })

  it('should add headerV2FadeIn class', async () => {
    mockedUsePreference.mockImplementation(() => {
      return {
        storefrontConfigs: { transparentHeader: true },
        generalConfiguration: {
          enableNewGlobalHeader: true,
          enableExposedSearchHeader: false,
        },
      }
    })
    useRouter.mockReturnValue({ pathname: '/' })
    mockedUseVerticalScrollDirection.mockReturnValue({
      hasTopDirectionScroll: true,
      showBanner: true,
      scrollPosition: 10,
      isOnTop: true,
    })
    const { getByTestId } = makeSetup()

    expect(getByTestId('hdr_container_section')).toHaveClass('headerV2FadeIn')
  })
})
