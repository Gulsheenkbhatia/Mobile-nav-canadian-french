import React from 'react'
import { CustomRenderOptions, render, act } from 'test-utils/react'
import { useAtom } from 'jotai'
import MobileMenu from 'toro/components/header/MobileMenu/index'
import usePreference from 'toro/hooks/usePreference_new'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import userEvent from '@testing-library/user-event'
import useViewportType from 'toro/hooks/useViewportType'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  isSearchInDrawerActiveAtom,
  recommendedSearchesAtom,
  suggestedItemsAtom,
  isSearchSuggestionsChunkLoadedAtom,
  setIsSearchSuggestionsChunkLoadedAtom,
  isSearchV2EnabledAtom,
} from 'store/search.atom'
import { addIconsAtom } from 'store/icons.atom'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import menuDataAtom, { activeMobileMenuItemsAtom } from 'store/menu-data.atom'

jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/usePreference_new')
jest.mock('jotai/utils')
const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
jest.mock('jotai', () => {
  const originalModule = jest.requireActual('jotai')
  return {
    ...originalModule,
    useAtom: jest.fn(),
  }
})
jest.mock('toro/hooks/usePageType', () => jest.fn(() => ({ isPDP: false, isPLP: true })))
jest.mock('toro/hooks/useReInitMenuItems', () => jest.fn())
jest.mock('toro/helpers/toggleBodyScroll')

jest.mock('toro/components/header/MobileMenuDrawerContent', () => () => (
  <div>MobileMenuDrawerContent</div>
))
jest.mock('toro/hooks/useSearchState', () => jest.fn(() => jest.fn()))
jest.mock('toro/components/header/MobileMenuTabs', () => () => <div>MobileMenuTabs</div>)
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({ push }),
  }
})

const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>

const mockedUseViewportType = jest.mocked(useViewportType)
mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))

const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const defaultPreferenceMock = {
  xgenPreferences: { searchV2Features: { NavSearchRedesign: false, SearchOverlayRedesign: false } },
  navFlyoutStylings: { enableNewNavMenu: true },
  generalConfiguration: { enableNewGlobalHeader: true },
  coachtopia: { coachtopiaRootCategory: '' },
  oneCoach: { oneCoachTabConfig: {} },
  oneSite: { enableOneSite: false },
  certonaConfiguration: { certonaSubDomain: '' },
  einsteinRecommendation: {
    isEinsteinRecomEnabled: false,
    isEinsteinRecomEnabledSearchSuggestion: false,
    recommendorsList: {},
  },
}
mockedUsePreference.mockImplementation(() => defaultPreferenceMock)

mockIntersectionObserver()

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: { appData: {} },
    SessionContext: {},
  },
}
beforeAll(() => {
  global.requestIdleCallback = (cb) => setTimeout(cb, 1)
  global.cancelIdleCallback = (id) => clearTimeout(id)
})

const renderComponent = async (props = {}) => {
  let result
  await act(async () => {
    result = render(<MobileMenu {...props} />, renderOptions)
  })
  return result
}

describe('MobileMenu Component', () => {
  let setIsMobileMenuVisibleMock: jest.Mock
  let mockAddIconIds: jest.Mock
  beforeEach(() => {
    setIsMobileMenuVisibleMock = jest.fn()
    mockAddIconIds = jest.fn()
    ;(useAtom as jest.Mock).mockReturnValue([true, setIsMobileMenuVisibleMock])

    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isSearchInDrawerActiveAtom:
          return false
        case recommendedSearchesAtom:
          return []
        case suggestedItemsAtom:
          return []
        case isSearchSuggestionsChunkLoadedAtom:
          return false
        case xgenFeaturesAtom:
          return { search: false }
        case activeMobileMenuItemsAtom:
          return { t1: null, t2: null }
        case menuDataAtom:
          return { topCategories: [] }
        case isSearchV2EnabledAtom:
          return false
        default:
          return undefined
      }
    })

    mockedUseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case addIconsAtom:
          return mockAddIconIds
        case setIsSearchSuggestionsChunkLoadedAtom:
          return jest.fn()
        default:
          return jest.fn()
      }
    })
  })

  it('should render the MobileMenu component', async () => {
    const { getByTestId } = await renderComponent()
    expect(getByTestId('cm_icon_search')).toBeVisible()
    expect(getByTestId('m_btn_hamburger_close_x')).toBeVisible()
  })

  it('should handle closing the menu', async () => {
    const user = userEvent.setup()
    const { getByTestId } = await renderComponent()
    const closeButton = getByTestId('m_btn_hamburger_close_x')
    await user.click(closeButton)
    expect(setIsMobileMenuVisibleMock).toHaveBeenCalledWith(false)
  })

  it('should render MobileMenuDrawerContent when enableNewNavMenu is false', async () => {
    mockedUsePreference.mockImplementation(() => ({
      ...defaultPreferenceMock,
      navFlyoutStylings: { enableNewNavMenu: false },
    }))
    const { getByText } = await renderComponent()
    expect(getByText('MobileMenuDrawerContent')).toBeVisible()
  })

  it('should not render when isMobileMenuVisible is false', async () => {
    ;(useAtom as jest.Mock).mockReturnValue([false, setIsMobileMenuVisibleMock])
    await renderComponent()
    expect(toggleBodyScroll).toHaveBeenCalledWith(true)
  })

  it('should set Slide when enableNewGlobalHeader is false', async () => {
    mockedUsePreference.mockImplementation(() => ({
      ...defaultPreferenceMock,
      navFlyoutStylings: { enableNewNavMenu: false },
      generalConfiguration: { enableNewGlobalHeader: false },
    }))
    await renderComponent()

    const slide = document.querySelector('.chakra-slide.default') as HTMLElement
    expect(slide).toHaveStyle('transform: translateX(-100%) translateY(0px) translateZ(0)')
  })

  it('should render the MobileMenu with tabs for oneSite', async () => {
    mockedUsePreference.mockImplementation(() => ({
      ...defaultPreferenceMock,
      generalConfiguration: { enableNewGlobalHeader: false },
      oneSite: { enableOneSite: true },
    }))
    // Mock useAtom to return isSearchActive = false so MobileMenuTabs renders
    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === isSearchInDrawerActiveAtom) {
        return [false, jest.fn()]
      }
      return [true, setIsMobileMenuVisibleMock]
    })
    const { getByTestId, getByText } = await renderComponent()
    expect(getByText('MobileMenuTabs')).toBeVisible()
    expect(getByTestId('cm_icon_search')).toBeVisible()
  })

  it('should hide MobileMenuTabs when search is active', async () => {
    mockedUsePreference.mockImplementation(() => ({
      ...defaultPreferenceMock,
      generalConfiguration: { enableNewGlobalHeader: false },
      oneSite: { enableOneSite: true },
    }))
    // Mock useAtom to return isSearchActive = true so MobileMenuTabs is hidden
    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === isSearchInDrawerActiveAtom) {
        return [true, jest.fn()]
      }
      return [true, setIsMobileMenuVisibleMock]
    })
    const { queryByText } = await renderComponent()
    expect(queryByText('MobileMenuTabs')).not.toBeInTheDocument()
  })
})
