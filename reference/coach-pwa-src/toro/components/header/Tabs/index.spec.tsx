import usePageType from 'toro/hooks/usePageType'
import HeaderTabs from 'toro/components/header/Tabs'
import { render } from 'test-utils/react'
import useViewportType from 'toro/hooks/useViewportType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import {
  oneCoachTabHeaderRedirectHandler,
  getTabIndexByClickEvent,
} from 'toro/helpers/oneCoachTabbedHeader'

const mockedRouterPush = jest.fn()
const mockedAnalyticsSend = jest.fn()
const mockedUsePageType = jest.mocked(usePageType)
const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseUpdateAtom = jest.mocked(useUpdateAtom)
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
const mockedGetTabIndexByClickEvent = getTabIndexByClickEvent as jest.MockedFn<
  typeof getTabIndexByClickEvent
>
const mockedOneCoachTabHeaderRedirectHandler = oneCoachTabHeaderRedirectHandler as jest.MockedFn<
  typeof oneCoachTabHeaderRedirectHandler
>

// Mock hooks and components
jest.mock('jotai/utils')
jest.mock('toro/hooks/usePageType')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/helpers/oneCoachTabbedHeader')
jest.mock('toro/hooks/useProductImageHeight', () => jest.fn(() => 250))
jest.mock('toro/hooks/usePreference', () => jest.fn(() => ({ value: '/shop/coachtopia' })))
jest.mock('toro/analytics/useAnalytics', () => jest.fn(() => ({ send: mockedAnalyticsSend })))
jest.mock('toro/hooks/useOneCoachTabConfig', () =>
  jest.fn(() => ({
    configuredTabColors: {},
    utmLink: '/utmlink',
  }))
)
jest.mock('next/router', () => {
  const actual = jest.requireActual('next/router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockedRouterPush,
    }),
  }
})

// Mock SVG components
jest.mock('@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg', () => () => (
  <svg>
    <g clip-path="url(#primary-black_svg__a)" fill="#000001"></g>
    <clipPath id="primary-black_svg__a"></clipPath>
  </svg>
))

interface WindowWithScrollListener extends Window {
  scrollListener: {
    add: jest.Mock
  }
}

declare const window: WindowWithScrollListener

const getPageType = (overrides = {}) => ({
  isPDP: false,
  isPLP: false,
  isSRP: false,
  isHP: false,
  isRetailHP: false,
  isOutletHP: false,
  isSubHP: false,
  isContentPage: false,
  isProductPassport: false,
  ...overrides,
})

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        brand: 'coach',
        subBrand: 'coachtopia',
        isSubBrandActive: false,
        localeInPath: 'en',
      },
    },
  },
}

const makeSetup = (customRenderOptions = renderOptions) =>
  render(<HeaderTabs />, customRenderOptions)

describe('HeaderTabs Component', () => {
  let originalOpen = window.open
  let mockWindowOpen = jest.fn()
  let mockUpdateAtomFn = jest.fn()

  beforeEach(() => {
    window.open = mockWindowOpen
    mockedUseAtomValue.mockReturnValue(false)
    mockedUsePageType.mockReturnValue(getPageType())
    mockedUseUpdateAtom.mockReturnValue(mockUpdateAtomFn)
    mockedUseViewportType.mockReturnValue({ isMobile: true })
    mockedUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { enableCollapsiblePromoBar: true },
      generalConfiguration: { enableNewGlobalHeader: true },
      storefrontConfigs: { transparentHeader: false },
    })
    window.scrollListener = {
      add: jest.fn((callback) => {
        callback()
        return jest.fn()
      }),
    }
  })

  afterEach(() => {
    window.open = originalOpen
    jest.clearAllMocks()
  })

  it('should render brand and subbrand tabs without crashing', () => {
    const { getByTestId } = makeSetup()

    expect(getByTestId('one_tab_header')).toBeVisible()
    expect(getByTestId('hrd_tab_retail')).toBeVisible()
    expect(getByTestId('hrd_tab_coachtopia')).toBeVisible()
  })

  it('should change the page URL if coach tab is clicked', async () => {
    const { user, getByTestId } = makeSetup()
    const coachTab = getByTestId('hrd_tab_retail')

    await user.click(coachTab)
    expect(mockUpdateAtomFn).toHaveBeenCalledTimes(2)
    expect(mockedRouterPush).toHaveBeenCalledWith('/')
    expect(coachTab).toHaveClass('active')
  })

  it('should change the page URL if coachtopia tab is clicked', async () => {
    mockedUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { enableCollapsiblePromoBar: true },
      generalConfiguration: { enableNewGlobalHeader: false },
      storefrontConfigs: { transparentHeader: false },
    })
    const { user, getByTestId } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            brand: 'coach',
            subBrand: 'coachtopia',
            isSubBrandActive: true,
            localeInPath: 'en',
          },
        },
      },
    })
    const coachTopiaTab = getByTestId('hrd_tab_coachtopia')

    await user.click(coachTopiaTab)
    expect(mockUpdateAtomFn).toHaveBeenCalledTimes(2)
    expect(mockedRouterPush).toHaveBeenCalledWith('/en/shop/coachtopia')
    expect(coachTopiaTab).toHaveClass('active')
  })

  it('should render coach and coachoutlet tab with coach as a brand on mobile', async () => {
    mockedUseAtomValue.mockReturnValueOnce(true)
    mockedGetTabIndexByClickEvent.mockReturnValue(1)
    mockedUsePageType.mockReturnValue(getPageType({ isPDP: true }))

    const { user, getByTestId } = makeSetup()
    const coachTab = getByTestId('hrd_tab_retail')
    const coachOutletTab = getByTestId('hrd_tab_outlet')

    expect(coachTab).toBeVisible()
    expect(coachOutletTab).toBeVisible()
    expect(coachTab).toHaveClass('active')
    expect(coachTab).toHaveClass('oneCoachColorAdaptive')

    await user.click(coachOutletTab)
    expect(mockedAnalyticsSend).toHaveBeenCalledWith('navClick', {
      eventLocation: 'tabbed nav',
      text: 'coach outlet',
    })
    expect(mockedOneCoachTabHeaderRedirectHandler).toHaveBeenCalled()
  })

  it('should render coach and coachoutlet tab with coachoutlet as a brand on mobile', async () => {
    mockedUseAtomValue.mockReturnValueOnce(true)
    mockedGetTabIndexByClickEvent.mockReturnValue(0)
    mockedUsePageType.mockReturnValue(getPageType({ isPDP: true }))

    const { user, getByTestId } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            brand: 'coach-outlet',
            subBrand: 'coachtopia',
            isSubBrandActive: false,
            localeInPath: 'en',
          },
        },
      },
    })
    const coachTab = getByTestId('hrd_tab_retail')
    const coachOutletTab = getByTestId('hrd_tab_outlet')

    expect(coachTab).toBeVisible()
    expect(coachOutletTab).toBeVisible()
    expect(coachOutletTab).toHaveClass('active')
    expect(coachOutletTab).toHaveClass('oneCoachColorAdaptive')

    await user.click(coachTab)
    expect(mockedAnalyticsSend).toHaveBeenCalledWith('navClick', {
      eventLocation: 'tabbed nav',
      text: 'coach',
    })
    expect(mockedOneCoachTabHeaderRedirectHandler).toHaveBeenCalled()
  })

  it('should add desktop specific classes for coach and coachoutlet tabs', () => {
    mockedUseAtomValue.mockReturnValueOnce(true)
    mockedGetTabIndexByClickEvent.mockReturnValue(0)
    mockedUseViewportType.mockReturnValue({ isMobile: false })
    mockedUsePageType.mockReturnValue(getPageType({ isPDP: true }))

    mockedUsePreferenceNew.mockReturnValue({
      toggleSiteFeatures: { enableCollapsiblePromoBar: true },
      generalConfiguration: { enableNewGlobalHeader: false },
      storefrontConfigs: { transparentHeader: false },
    })

    const { getByTestId } = makeSetup()
    const coachTab = getByTestId('hrd_tab_retail')
    const coachOutletTab = getByTestId('hrd_tab_outlet')

    expect(coachTab).toHaveClass('one-coach-color-tab')
    expect(coachOutletTab).toHaveClass('one-coach-color-tab')
  })
})
