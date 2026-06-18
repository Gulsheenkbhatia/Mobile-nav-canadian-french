import { render } from 'test-utils/react'
import CoachtopiaLogoButton from 'toro/components/CoachtopiaLogoButton'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import userEvent from '@testing-library/user-event'

jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useMultiStyleConfig')
jest.mock('toro/analytics/useAnalytics')

const mockUseMultiStyleConfigElements = {
  wrapper: {},
  link: {},
}
const mockSendAnalytics = jest.fn()

const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseMultiStyleConfig = useMultiStyleConfig as jest.MockedFn<typeof useMultiStyleConfig>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>

describe('CoachtopiaLogoButton tests', () => {
  beforeEach(() => {
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: {
        coachtopiaHomeURL: '/shop/test',
        enableCoachtopiaButton: { enable: true, backgroundColor: 'var(--color-white-base)' },
      },
    }))
    mockedUseMultiStyleConfig.mockImplementation(() => mockUseMultiStyleConfigElements)
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should not render when enable flag is false', () => {
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: {
        coachtopiaHomeURL: '/shop/test',
        enableCoachtopiaButton: { enable: false },
      },
    }))
    const { container } = render(<CoachtopiaLogoButton />)
    const link = container.querySelector('a')
    expect(link).not.toBeInTheDocument()
  })

  it('should render logo button with correct link when enabled', () => {
    const { container } = render(<CoachtopiaLogoButton />)
    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/shop/test')
  })

  it('should apply custom background color from preferences', () => {
    const customBgColor = '#FF0000'
    mockedUsePreference.mockImplementation(() => ({
      coachtopia: {
        coachtopiaHomeURL: '/shop/coachtopia',
        enableCoachtopiaButton: { enable: true, backgroundColor: customBgColor },
      },
    }))
    const { container } = render(<CoachtopiaLogoButton />)
    const link = container.querySelector('a')
    expect(link).toHaveStyle({ backgroundColor: customBgColor })
  })

  it('should render vertical divider when divider prop is vertical', () => {
    const { container } = render(<CoachtopiaLogoButton divider="vertical" />)
    const divider = container.querySelector('hr')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('should render horizontal divider when divider prop is horizontal', () => {
    const { container } = render(<CoachtopiaLogoButton divider="horizontal" />)
    const divider = container.querySelector('hr')
    expect(divider).toBeInTheDocument()
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('should pass variant to style config', () => {
    render(<CoachtopiaLogoButton variant="hp" />)
    expect(mockedUseMultiStyleConfig).toHaveBeenCalledWith('CoachtopiaLogoButton', {
      variant: 'hp',
    })
  })

  it('should send analytics event on click', async () => {
    const user = userEvent.setup()
    const { container } = render(<CoachtopiaLogoButton />)
    const link = container.querySelector('a')
    await user.click(link)
    expect(mockSendAnalytics).toHaveBeenCalledWith('navClick', {
      eventLocation: 'sub nav',
      text: 'coachtopia',
    })
  })
})
