import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import FastShipping from 'toro/components/product/mobile/FastShipping/index'
import {
  fastShippingPdpAtom,
  isShowingFastShippingModalAtom,
  productDataAtom,
} from 'store/pdp.atom'
import useAnalytics from 'toro/analytics/useAnalytics'

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

describe('FastShipping', () => {
  const mockAnalyticsSend = jest.fn()

  /** Mirrors `fastShippingPdpAtom` return shape for JotaiProviderContext overrides */
  type FastShippingPdpAtomMockValue = {
    modalTitle: string
    shippingBody: unknown
    hasContent: boolean
  }

  const slotWithContent: FastShippingPdpAtomMockValue = {
    modalTitle: 'fast shipping slot title',
    shippingBody: {
      content: {
        text: 'Fast shipping slot title',
        body: '<div id="shipText"><p>Ship copy</p></div>',
      },
    },
    hasContent: true,
  }

  const slotEmpty: FastShippingPdpAtomMockValue = {
    modalTitle: '',
    shippingBody: '',
    hasContent: false,
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
  })

  const setup = (options: { slot?: FastShippingPdpAtomMockValue } = {}) => {
    const { slot = slotWithContent } = options
    const atomContext = new Map([
      [fastShippingPdpAtom, slot],
      [isShowingFastShippingModalAtom, false],
      [productDataAtom, { id: 'PRODUCT-123' }],
    ] as any) as any

    return render(<FastShipping />, {
      contexts: {
        JotaiProviderContext: atomContext,
        ViewportContext: { isMobile: true },
      },
    })
  }

  it('renders header and sub header copy', () => {
    setup()
    expect(screen.getByText('Fast Shipping')).toBeInTheDocument()
    expect(screen.getByText('Quick dispatch and reliable delivery.')).toBeInTheDocument()
  })

  it('renders learn more when fast-shipping-pdp slot has content', () => {
    setup({ slot: slotWithContent })
    expect(screen.getByTestId('fast-shipping-learn-more-link')).toBeInTheDocument()
  })

  it('hides the block when fast-shipping-pdp slot has no content', () => {
    setup({ slot: slotEmpty })
    expect(screen.queryByTestId('fast-shipping-learn-more-link')).not.toBeInTheDocument()
    expect(screen.queryByText('Fast Shipping')).not.toBeInTheDocument()
  })

  it('sends productInteraction analytics when learn more is clicked', async () => {
    const user = userEvent.setup()
    setup()
    await user.click(screen.getByTestId('fast-shipping-learn-more-link'))
    expect(mockAnalyticsSend).toHaveBeenCalledWith(
      'productInteraction',
      expect.objectContaining({
        eventAction: 'fast shipping quick dispatch and reliable delivery. click',
        eventLabel: 'PRODUCT-123',
      })
    )
  })
})
