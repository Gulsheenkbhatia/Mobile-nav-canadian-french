import { render, screen, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import WindowShopInspirationToggle from 'toro/components/WindowShopInspirationToggle'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useRouter } from 'next/router'

jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const mockPush = jest.fn()
const mockUseMultiStyleConfig = useMultiStyleConfig as jest.Mock
const mockUseRouter = useRouter as jest.Mock

describe('WindowShopInspirationToggle', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      asPath: '/',
      push: mockPush,
    })
    mockUseMultiStyleConfig.mockReturnValue({
      switchWrapper: {},
      EightRaysStarIcon: () => {},
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = (enableTooltip = false, windowShopUrl = '/shop/inspiration') => {
    return render(
      <WindowShopInspirationToggle windowShopUrl={windowShopUrl} enableTooltip={enableTooltip} />,
      { contexts: {} }
    )
  }

  it('renders the component with the correct label', () => {
    renderComponent()
    expect(screen.getByText('Window Shop')).toBeInTheDocument()
  })

  it('displays the tooltip when enableTooltip is true and switch is unchecked', () => {
    renderComponent(true)
    const tooltipText = 'View our latest eye candy'
    expect(screen.getByText(tooltipText)).toBeInTheDocument()
  })

  it('hides the tooltip when switch is checked', async () => {
    mockUseRouter.mockReturnValue({
      asPath: '/shop/inspiration',
      push: mockPush,
    })
    renderComponent(true)
    const switchElement = screen.getByRole('checkbox')

    expect(switchElement).toBeChecked()
    await waitFor(() =>
      expect(screen.queryByText('View our latest eye candy')).not.toBeInTheDocument()
    )
  })

  it('toggles the switch to checked and navigates to the windowShopUrl', async () => {
    renderComponent()
    const user = userEvent.setup()
    const switchElement = screen.getByRole('checkbox')

    await user.click(switchElement)

    expect(switchElement).toBeChecked()
    expect(mockPush).toHaveBeenCalledWith('/shop/inspiration')
  })

  it('toggles the switch to unchecked and navigates to the home page', async () => {
    mockUseRouter.mockReturnValue({
      asPath: '/shop/inspiration',
      push: mockPush,
    })
    renderComponent()
    const user = userEvent.setup()
    const switchElement = screen.getByRole('checkbox')

    // Switch is initially checked because `asPath` includes the `windowShopUrl`
    expect(switchElement).toBeChecked()

    await user.click(switchElement)

    expect(switchElement).not.toBeChecked()
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
