import { renderHook, waitFor } from '@testing-library/react'
import useOptimizelySession from './useOptimizelySession'
import Cookies from 'js-cookie'
import * as utils from 'jotai/utils'
import { useInterval } from '@chakra-ui/hooks'
import {
  OPTIMIZELY_ENABLED,
  OPTIMIZELY_ENABLED_FEATURES,
  OPTIMIZELY_USER_ID,
} from 'toro/constants/cookies'

jest.mock('@chakra-ui/hooks')

const mockedUseInterval = useInterval as any

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: '/mock-url',
    }),
  }
})

jest.mock('js-cookie', () => {
  return {
    get: jest.fn(() => 'mock-cookie-value'),
  }
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ features: 'mock-feature' }),
  } as Response)
)

describe('useOptimizelySession hook', () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('Does not refresh session if sdk key is not set', () => {
    renderHook(() => useOptimizelySession('', 1000))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('Does not refresh session if cookie did not expire', () => {
    jest.spyOn(Cookies, 'get').mockImplementation((cookie: string) => {
      switch (cookie) {
        default:
        case OPTIMIZELY_ENABLED_FEATURES:
          return 'mock-cookie-value'
        case OPTIMIZELY_ENABLED:
          return 'true'
      }
    })
    renderHook(() => useOptimizelySession('mock-key', 1000))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('Re-fetches enabled features on client side navigation when cookie expires', async () => {
    const mocksSetEnabledFeatures = jest.fn()
    let enabled = true
    mockedUseInterval.mockImplementation((callback) => {
      if (enabled) {
        enabled = false
        callback()
      }
    })
    jest.spyOn(utils, 'useUpdateAtom').mockReturnValue(mocksSetEnabledFeatures)
    jest.spyOn(Cookies, 'get').mockImplementation((cookie: string) => {
      switch (cookie) {
        default:
        case OPTIMIZELY_ENABLED_FEATURES:
          return undefined
        case OPTIMIZELY_ENABLED:
          return 'true'
        case OPTIMIZELY_USER_ID:
          return 'true'
      }
    })
    renderHook(() => useOptimizelySession('mock-key', 1000))
    expect(global.fetch).toHaveBeenCalled()
    await waitFor(() => expect(mocksSetEnabledFeatures).toHaveBeenCalledWith('mock-feature'))
  })
})
