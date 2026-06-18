import { ReactNode } from 'react'
import { render, CustomRenderOptions, waitFor, act } from 'test-utils/react'
import TruefitWidget from './index'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import fetch from 'toro/helpers/fetch'
import useAnalytics from 'toro/analytics/useAnalytics'

jest.mock('react-focus-lock', () => ({ children }: { children: ReactNode }) => <>{children}</>)
jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
}))
jest.mock('toro/helpers/fetch', () => jest.fn())
jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('toro/analytics/useAnalytics')

const mockSendAnalytics = jest.fn()
const mockFetch = fetch as jest.Mock
const mockSetTokenInCookie = Cookies.set as jest.Mock
const mockGetTokenFromCookies = Cookies.get as jest.Mock
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

const commonRender = async (recommendations: any, token: string | undefined) => {
  mockFetch.mockResolvedValueOnce({
    json: async () => ({ recommendations }),
    headers: {
      get: jest.fn().mockReturnValue(token),
    },
  })
  mockGetTokenFromCookies.mockReturnValue(token)

  return render(
    <TruefitWidget
      masterId="test"
      truefitClientID="client-id"
      trueFitApiUrl="api.url"
      variantId="variant"
      isSticky={false}
    />,
    renderOptions
  )
}

describe('TruefitWidget Component', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('handles message events correctly', async () => {
    const user = userEvent.setup()
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com', message: 'Switch Profile' },
        recommendable: true,
        status: 'nouser',
      },
    }
    const { queryByRole, findByRole } = await commonRender(mockRecommendations, 'new-token')
    const avatarButton = await findByRole('button', { name: /Avatar Icon/i })
    await user.click(avatarButton)
    const iframe = await findByRole('dialog')
    expect(iframe).toBeInTheDocument()

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ recommendations: mockRecommendations }),
      headers: { get: jest.fn().mockReturnValue('new-token') },
    })

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://truefitcorp.com',
          data: JSON.stringify({ message: 'close' }),
        })
      )
    })
    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeVisible()
    })
  })

  test('renders correctly when recommendable is false', async () => {
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: false,
      },
    }
    const { queryByRole } = await commonRender(mockRecommendations, 'existing-token')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
    expect(queryByRole('button')).toBeNull()
  })
  test('handles fetch errors condition correctly', async () => {
    const error = new Error('Fetch error')
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    mockFetch.mockRejectedValueOnce(error)
    const { queryByRole } = await commonRender(
      {
        test: {
          cta: { url: 'http://example.com' },
          profileSwitcherCta: { url: 'http://profile.com' },
          recommendable: true,
        },
      },
      'existing-token'
    )
    await waitFor(() =>
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in fetching recommendations from truefit',
        error
      )
    )
    expect(queryByRole('button')).toBeNull()
    consoleSpy.mockRestore()
  })

  test('fires widget impression event when status is "nouser" and not isClicked', async () => {
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: true,
        status: 'nouser',
      },
    }
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    await commonRender(mockRecommendations, 'new-token')

    await waitFor(() => {
      expect(mockSendAnalytics).toHaveBeenCalledWith('truefitInteraction', {
        eventLabel: 'variant',
        eventAction: 'truefit widget impression',
      })
    })
  })

  test('fires recommendation click event when status is "success" and isClicked', async () => {
    const user = userEvent.setup()
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: true,
        status: 'success',
      },
    }
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    const { findByRole } = await commonRender(mockRecommendations, 'new-token')
    const button = await findByRole('button')
    await user.click(button)
    await waitFor(() =>
      expect(mockSendAnalytics).toHaveBeenCalledWith('truefitInteraction', {
        eventLabel: 'variant',
        eventAction: 'truefit recommendation click',
      })
    )
  })

  test('handles error when fetching token and does not update state', async () => {
    const error = new Error('Fetch error')
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    mockFetch.mockRejectedValueOnce(error)
    await commonRender(undefined, 'new-token')
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in fetching recommendations from truefit',
        error
      )
      expect(mockSendAnalytics).not.toHaveBeenCalled()
    })
    consoleSpy.mockRestore()
  })

  test('calls setTokenInCookie with the user token when a message event with "usertoken" is received', async () => {
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: true,
      },
    }
    await commonRender(mockRecommendations, 'existing-token')

    const userTokenData = { value: 'new-user-token' }
    const messageEvent = {
      origin: 'https://truefitcorp.com',
      data: JSON.stringify({
        message: 'usertoken',
        data: userTokenData,
      }),
    }

    await act(async () => {
      window.dispatchEvent(new MessageEvent('message', messageEvent))
    })
    await waitFor(() => {
      expect(mockSetTokenInCookie).toHaveBeenCalledWith('X-TF-UserToken', userTokenData.value, {
        sameSite: 'None',
        secure: true,
      })
    })
  })

  test('opens modal when onAvatarIconClick is triggered', async () => {
    const user = userEvent.setup()
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com', message: 'Switch Profile' },
        recommendable: true,
        status: 'nouser',
      },
    }
    const { findByRole } = await commonRender(mockRecommendations, 'new-token')
    const avatarButton = await findByRole('button', { name: /Avatar Icon/i })
    await user.click(avatarButton)
    const iframe = await findByRole('dialog')
    expect(iframe).toBeInTheDocument()
  })
  test('fetches token and recommendations when token does not exist', async () => {
    mockGetTokenFromCookies.mockReturnValue(undefined)

    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: true,
      },
    }

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ token: 'fresh-token' }),
      headers: {
        get: jest.fn(),
      },
    })

    mockFetch.mockResolvedValueOnce({
      json: async () => ({ recommendations: mockRecommendations }),
      headers: {
        get: jest.fn().mockReturnValue('new-token'),
      },
    })

    render(
      <TruefitWidget
        masterId="test"
        truefitClientID="client-id"
        trueFitApiUrl="api.url"
        variantId="variant"
        isSticky={false}
      />,
      renderOptions
    )
    await waitFor(() => {
      expect(mockSetTokenInCookie).toHaveBeenCalled()
    })
  })
  test('sets eventAction to "truefit widget click" when status is "nouser" and isClicked is true', async () => {
    const user = userEvent.setup()
    const mockRecommendations = {
      test: {
        cta: { url: 'http://example.com' },
        profileSwitcherCta: { url: 'http://profile.com' },
        recommendable: true,
        status: 'nouser',
      },
    }
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockGetTokenFromCookies.mockReturnValue('existing-token')
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ recommendations: mockRecommendations }),
      headers: {
        get: jest.fn().mockReturnValue('new-token'),
      },
    })
    const { findByRole } = await commonRender(mockRecommendations, 'new-token')
    const button = await findByRole('button')
    await user.click(button)
    await waitFor(() =>
      expect(mockSendAnalytics).toHaveBeenCalledWith('truefitInteraction', {
        eventLabel: 'variant',
        eventAction: 'truefit widget click',
      })
    )
  })
})
