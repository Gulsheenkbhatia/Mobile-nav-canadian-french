import { render, screen, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import SustainabilityExperienceContainer from 'toro/components/product/SustainableExperience/SustainabilityExperienceContainer'
import useAnalytics from 'toro/analytics/useAnalytics'

// Mock hooks
jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true, isDesktop: true }))
jest.mock('toro/analytics/useAnalytics', () => jest.fn())
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const defaultProps = {
  sustainabilityIconsData: [
    {
      materialContent: { default: 'Recycled' },
      materialImagePath: { default: 'path/to/image' },
    },
  ],
  onHeroPDP: false,
  isMobile: false,
  productData: { masterId: '12345' },
}

const defaultRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
      injectJquery: jest.fn(),
    },
  },
}

const makeSetup = (props, renderProps) => {
  return render(<SustainabilityExperienceContainer {...{ ...defaultProps, ...props }} />, {
    ...defaultRenderOptions,
    ...renderProps,
  })
}

describe('SustainabilityExperienceContainer', () => {
  const mockAnalytics = { send: jest.fn() }

  beforeEach(() => {
    useAnalytics.mockReturnValue(mockAnalytics)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', async () => {
    makeSetup()
    await waitFor(() => expect(screen.getByRole('button')).toBeVisible())
  })

  it('should not render when sustainabilityIconsData is empty', () => {
    const { container } = makeSetup({
      sustainabilityIconsData: [],
    })

    expect(container.firstChild.innerHTML).toBe('')
  })

  it('should open the modal and sends analytics on icon click', async () => {
    makeSetup()
    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(mockAnalytics.send).toHaveBeenCalledWith('productInteraction', {
      eventLocation: 'accordion',
      eventAction: 'recycled click',
      eventLabel: '12345',
    })
  })

  it('should render correct styles with component when onHeroPDP is enabled', () => {
    makeSetup({
      onHeroPDP: true,
    })
    const container = screen.getByRole('button').parentElement.parentElement
    expect(container).toHaveClass('sustain-icons-container_heroPDP')
    expect(container).toHaveTextContent('')
  })

  it('should render correct styles with component when onHeroPDP is disabled', () => {
    makeSetup()
    const container = screen.getByRole('button').parentElement.parentElement
    expect(container).toHaveClass('sustain-icons-container_productDetails')
    expect(container).toHaveTextContent('Recycled')
  })
})
