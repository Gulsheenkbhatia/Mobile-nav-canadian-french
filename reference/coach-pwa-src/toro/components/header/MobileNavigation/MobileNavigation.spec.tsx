import { render, screen } from 'test-utils/react'
import MobileNavigation from '.'
import { rawMenuDataAtom, MenuData } from 'store/menu-data.atom'
import data from './menuDataMock.json'
import { Atom } from 'jotai/core/atom'
import userEvent from '@testing-library/user-event'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('toro/analytics/useAnalytics')

jest.mock('toro/hooks/usePreference_new', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('toro/components/header/ShopAssistNavMenuBanner', () => ({
  __esModule: true,
  default: () => <div>ShopAssistNavMenuBanner</div>,
}))

const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUsePreference = jest.mocked(usePreference)
const onNavigationMock = jest.fn()

type AiGiftConciergeData = {
  T1EntryPointsCategory?: string
  isGiftConciergeEnabled?: boolean
}

function mockPreferencesForMobileNav(aiGiftConciergeData: AiGiftConciergeData = {}) {
  mockUsePreference.mockImplementation((payload: Record<string, unknown>) => {
    const result: Record<string, unknown> = {}
    if (payload.aiGiftConcierge) {
      result.aiGiftConcierge = {
        aiGiftConciergeData: {
          T1EntryPointsCategory: 'ks-gifts',
          isGiftConciergeEnabled: false,
          ...aiGiftConciergeData,
        },
      }
    }
    if (payload.navFlyoutStylings) {
      result.navFlyoutStylings = {}
    }
    return result
  })
}

const getJotaiContexts = () => {
  return new Map<Atom<MenuData>, MenuData>([[rawMenuDataAtom, data as unknown as MenuData]])
}

describe('<MobileNavigation>', () => {
  beforeEach(() => {
    mockPreferencesForMobileNav()
  })

  describe('Categories Rendering', () => {
    it('should render all top level categories', async () => {
      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      const categories = [
        'holiday deals',
        'gifts',
        'view all',
        'new',
        'handbags',
        'wallets',
        'jewelry',
        'shoes',
        'clothing',
        'accessories',
        'clearance',
      ]

      for (const category of categories) {
        const elements = await screen.findAllByText(new RegExp(category, 'i'))
        expect(elements[0]).toBeInTheDocument()
      }
    })
  })

  describe('Navigation Accordion Behavior', () => {
    beforeEach(() => {
      mockUseAnalytics.mockReturnValue({ send: jest.fn() })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should render with correct "defaultIndex" when t1 is set', async () => {
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const user = userEvent.setup()

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      const button = await screen.findByText('Gifts')
      await user.click(button)
      expect(await screen.findByText('Gifts By Recipient')).toBeInTheDocument()
    })

    it('should open a new category and close the previous one when clicked', async () => {
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
      const user = userEvent.setup()

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      // Open first T1 category: Handbags
      const handbagsButton = await screen.findByText('Handbags')
      await user.click(handbagsButton)

      // Verify its T2 content is visible
      const featuredShopsButton = await screen.findByText('Featured Shops')
      expect(featuredShopsButton).toBeInTheDocument()

      // Click on a T2 item
      await user.click(featuredShopsButton)
      expect(await screen.findByText('Disney X Kate Spade New York')).toBeInTheDocument()

      // Open a second T1 category: New
      const newButton = await screen.findByText('New')
      await user.click(newButton)

      // Verify the new T1 content is visible
      expect(await screen.findByText('All New')).toBeInTheDocument()
    })
  })

  describe('T1 entry point banner (ShopAssistNavMenuBanner)', () => {
    const bannerLabel = 'ShopAssistNavMenuBanner'

    it('does not render the banner when gift concierge is disabled', async () => {
      mockPreferencesForMobileNav({
        isGiftConciergeEnabled: false,
        T1EntryPointsCategory: 'kss-gifts',
      })

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      expect(await screen.findByText(/gifts/i)).toBeInTheDocument()
      expect(screen.queryByText(bannerLabel)).not.toBeInTheDocument()
    })

    it('renders the banner once after the matching T1 category when gift concierge is enabled', async () => {
      mockPreferencesForMobileNav({
        isGiftConciergeEnabled: true,
        T1EntryPointsCategory: 'kss-gifts',
      })

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      const banners = await screen.findAllByText(bannerLabel)
      expect(banners).toHaveLength(1)
    })
    it('does not render the banner when T1EntryPointsCategory is not found in menu data', async () => {
      mockPreferencesForMobileNav({
        isGiftConciergeEnabled: true,
        T1EntryPointsCategory: 'invalid-category', // does not exist in menu data
      })

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      expect(await screen.findByText(/gifts/i)).toBeInTheDocument()
      expect(screen.queryByText(bannerLabel)).not.toBeInTheDocument()
    })

    it('renders the banner after the last T1 category when T1EntryPointsCategory is "end"', async () => {
      mockPreferencesForMobileNav({ isGiftConciergeEnabled: true, T1EntryPointsCategory: 'end' })

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      const banners = await screen.findAllByText(bannerLabel)
      expect(banners).toHaveLength(1)
    })

    it('does not render the banner when T1EntryPointsCategory is empty', async () => {
      mockPreferencesForMobileNav({ isGiftConciergeEnabled: true, T1EntryPointsCategory: '' })

      render(<MobileNavigation onNavigation={onNavigationMock} />, {
        contexts: {
          JotaiProviderContext: getJotaiContexts(),
          PWAContext: { appData: {} },
        },
      })

      expect(await screen.findByText(/gifts/i)).toBeInTheDocument()
      expect(screen.queryByText(bannerLabel)).not.toBeInTheDocument()
    })
  })
})
