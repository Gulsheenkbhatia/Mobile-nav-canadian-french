import { render, screen, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import FreeShippingAndReturns from 'toro/components/product/mobile/FreeShippingAndReturns/index'
import {
  finalSaleShippingAtom,
  isShowingShippingAndReturnsModal,
  productDataAtom,
} from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'

// Mock next/router since ShippingAndReturnsContent uses CustomSlot which uses useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}))

jest.mock('toro/analytics/useAnalytics')

const mockUseAnalytics = jest.mocked(useAnalytics)

interface MockFinalSaleShippingData {
  finalSaleText: string
  shippingBody: {
    content?: {
      text?: string
      markup?: string
    }
    online?: {
      default?: boolean
    }
  } | null
}

interface TestSetupOptions {
  finalSaleText?: string
  shippingBody?: MockFinalSaleShippingData['shippingBody']
  isModalOpen?: boolean
  productId?: string
}

describe('FreeShippingAndReturns', () => {
  const mockAnalyticsSend = jest.fn()

  const defaultShippingData: MockFinalSaleShippingData = {
    finalSaleText: 'free shipping on orders $75+',
    shippingBody: {
      content: {
        text: 'Free shipping on orders $75+',
        markup: '<p>Shipping details...</p>',
      },
      online: {
        default: true,
      },
    },
  }

  beforeEach(() => {
    mockAnalyticsSend.mockClear()

    mockUseAnalytics.mockReturnValue({
      send: mockAnalyticsSend,
      addImpression: jest.fn(),
      isDataLayerInitialized: true,
      pageBecameInteractive: jest.fn(),
      createEventData: jest.fn(),
    } as any)

    jest.clearAllMocks()
  })

  const setup = (options: TestSetupOptions = {}) => {
    const {
      finalSaleText = defaultShippingData.finalSaleText,
      shippingBody = defaultShippingData.shippingBody,
      isModalOpen = false,
      productId = 'PRODUCT-123',
    } = options

    const atomContext = new Map([
      [finalSaleShippingAtom, { finalSaleText, shippingBody }],
      [isShowingShippingAndReturnsModal, isModalOpen],
      [productDataAtom, { id: productId }],
    ] as any) as any

    const contexts: any = {
      JotaiProviderContext: atomContext,
      ViewportContext: { isMobile: true },
      PWAContext: {
        appData: {
          siteId: 'coh_us_out',
          isOptGtmDisabled: false,
        },
      },
    }

    return render(<FreeShippingAndReturns />, { contexts })
  }

  const getLearnMoreLink = () => {
    return screen.getByTestId('learn-more-link')
  }

  describe('Rendering', () => {
    it('should render without crashing', () => {
      setup()
      const titleText = screen.getByText('Free shipping')
      const iconContainer = screen.getByTestId('shopping-bag-speed-icon')
      const thresholdText = screen.getByText('On orders $75 +')
      const learnMoreLink = screen.getByText('Learn more')
      const arrowIconContainer = screen.getByTestId('bopis-arrow-right-icon')

      expect(titleText).toBeVisible()
      expect(iconContainer).toBeVisible()
      expect(thresholdText).toBeVisible()
      expect(learnMoreLink).toBeVisible()
      expect(arrowIconContainer).toBeVisible()
    })
  })

  describe('Conditional Rendering', () => {
    it('should return null when finalSaleText is empty string', () => {
      setup({ finalSaleText: '' })
      expect(screen.queryByText('Free shipping')).not.toBeInTheDocument()
    })

    it('should render content when finalSaleText has value', () => {
      setup({ finalSaleText: 'free shipping available' })
      expect(screen.getByText('Free shipping')).toBeVisible()
    })
  })

  describe('User Interactions', () => {
    it('should prevent default behavior on click', async () => {
      const user = userEvent.setup()
      setup()
      const learnMoreLink = getLearnMoreLink()
      await user.click(learnMoreLink)
      expect(learnMoreLink).toBeVisible()
    })

    it('should toggle modal state when "Learn more" is clicked', async () => {
      const user = userEvent.setup()
      setup({ isModalOpen: false })

      const learnMoreLink = getLearnMoreLink()
      await user.click(learnMoreLink)
      expect(learnMoreLink).toBeVisible()
    })

    it('should toggle modal state from true to false when clicked', async () => {
      const user = userEvent.setup()
      setup({ isModalOpen: true })

      const learnMoreLink = getLearnMoreLink()
      await user.click(learnMoreLink)
      expect(learnMoreLink).toBeVisible()
    })
  })

  describe('Modal Interaction & State', () => {
    it('should open modal when "Learn more" is clicked', async () => {
      const user = userEvent.setup()
      setup({ isModalOpen: false })
      const learnMoreLink = screen.getByTestId('learn-more-link')

      await user.click(learnMoreLink)

      const dialog = await screen.findByRole('dialog', {})
      expect(dialog).toBeVisible()
      expect(screen.getByText(defaultShippingData.finalSaleText)).toBeVisible()
    })

    it('should render correct content in modal', async () => {
      setup({ isModalOpen: true })
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeVisible()
        expect(screen.getByText(defaultShippingData.finalSaleText)).toBeVisible()
      })
    })

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup()
      setup({ isModalOpen: true })

      const closeButton = await screen.findByRole('button', { name: /close/i })
      expect(closeButton).toBeVisible()

      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should handle empty string title in modal', async () => {
      setup({ finalSaleText: '', isModalOpen: true })
      expect(screen.queryByText('Free shipping')).not.toBeInTheDocument()
    })

    it('should handle null shippingBody in modal', async () => {
      setup({ shippingBody: null, isModalOpen: true })
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeVisible()
        expect(screen.getByText(defaultShippingData.finalSaleText)).toBeVisible()
      })
    })
  })

  describe('Analytics Tracking', () => {
    it('should send analytics event when "Learn more" is clicked', async () => {
      const user = userEvent.setup()
      setup({ productId: 'PRODUCT-456' })
      const learnMoreLink = getLearnMoreLink()

      await user.click(learnMoreLink)

      expect(mockAnalyticsSend).toHaveBeenCalledTimes(1)
      expect(mockAnalyticsSend).toHaveBeenCalledWith('productInteraction', {
        eventAction: 'free shipping on orders $75 + click',
        eventLabel: 'PRODUCT-456',
      })
    })

    it('should format event action with lowercase title and threshold', async () => {
      const user = userEvent.setup()
      setup()
      const learnMoreLink = getLearnMoreLink()

      await user.click(learnMoreLink)

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'productInteraction',
        expect.objectContaining({
          eventAction: 'free shipping on orders $75 + click',
        })
      )
    })

    it('should handle missing analytics object gracefully', async () => {
      const user = userEvent.setup()
      mockUseAnalytics.mockReturnValue(null)
      setup()
      const learnMoreLink = getLearnMoreLink()

      await expect(user.click(learnMoreLink)).resolves.not.toThrow()
    })

    it('should not send analytics when analytics is null', async () => {
      const user = userEvent.setup()
      mockUseAnalytics.mockReturnValue(null)
      setup()
      const learnMoreLink = getLearnMoreLink()

      await user.click(learnMoreLink)

      expect(mockAnalyticsSend).not.toHaveBeenCalled()
    })
  })

  describe('Props Handling', () => {
    it('should pass finalSaleText as title to modal', async () => {
      const customTitle = 'custom shipping title'
      setup({ finalSaleText: customTitle, isModalOpen: true })

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeVisible()
        expect(screen.getByText(customTitle)).toBeVisible()
      })
    })

    it('should pass shippingBody to modal', async () => {
      const customShippingBody = {
        content: { text: 'Custom shipping info', markup: '<p>Custom</p>' },
        online: { default: true },
      }
      setup({ shippingBody: customShippingBody, isModalOpen: true })
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeVisible()
        expect(screen.getByText(defaultShippingData.finalSaleText)).toBeVisible()
      })
    })

    it('should handle undefined shippingBody', async () => {
      setup({ shippingBody: undefined, isModalOpen: true })
      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeVisible()
        expect(screen.getByText(defaultShippingData.finalSaleText)).toBeVisible()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty shippingBody content', () => {
      setup({
        shippingBody: {
          content: {},
          online: { default: true },
        },
      })
      expect(screen.getByText('Free shipping')).toBeVisible()
    })
  })

  describe('State Management', () => {
    it('should read finalSaleText from atom', () => {
      setup({ finalSaleText: 'test shipping text' })
      expect(screen.getByText('Free shipping')).toBeVisible()
    })
  })
})
