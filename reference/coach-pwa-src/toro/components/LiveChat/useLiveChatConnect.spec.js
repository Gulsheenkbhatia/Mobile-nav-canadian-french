import { renderHook } from 'test-utils/react'
import useLiveChatConnect from './useLiveChatConnect'
import { usePathname } from 'next/navigation'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('toro/hooks/useViewportType', () => jest.fn())

jest.mock('toro/hooks/usePreference_new', () => jest.fn())

jest.mock('toro/helpers/getCurrentLocale', () => jest.fn())

const setup = (appData) => {
  return renderHook(() => useLiveChatConnect(), {
    contexts: {
      PWAContext: {
        appData: {
          liveChatESW: true,
          subBrand: 'testBrand',
          isSubBrandEnabled: true,
          ...appData,
        },
      },
    },
  })
}

describe('useLiveChatConnect', () => {
  beforeEach(() => {
    useViewportType.mockReturnValue({
      isTablet: false,
      isDesktop: true,
      isMobile: false,
    })

    usePathname.mockReturnValue('/')

    getCurrentLocale.mockReturnValue({
      locale: 'en-US',
      region: 'US',
    })

    usePreference.mockReturnValue({
      sfscChatConfigs: {
        enableLiveChat: true,
        countriesConfigJSON: [{ countryCode: 'US', liveChatEnabledLocale: 'en_US' }],
        enableLiveChatOnDevices: ['desktop'],
        excludeLiveChatOnPages: ['/excluded-page'],
      },
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    })
  })

  it('should enable live chat if all conditions are met', () => {
    const { result } = setup()
    expect(result.current.shouldLiveChatEnabled).toBe(true)
  })

  it('should disable live chat if liveChatESW is false', () => {
    const { result } = setup({ liveChatESW: false })
    expect(result.current.shouldLiveChatEnabled).toBe(false)
  })

  it('should disable live chat if enableLiveChat is false', () => {
    usePreference.mockReturnValueOnce({
      sfscChatConfigs: {
        enableLiveChat: false,
        countriesConfigJSON: [{ countryCode: 'US', liveChatEnabledLocale: 'en_US' }],
        enableLiveChatOnDevices: ['desktop'],
        excludeLiveChatOnPages: ['/excluded-page'],
      },
      coachtopia: {
        coachtopiaHomeURL: '/shop/testBrand',
      },
    })

    const { result } = setup()

    expect(result.current.shouldLiveChatEnabled).toBe(false)
  })

  it('should disable live chat if current page is excluded', () => {
    usePathname.mockReturnValue('/excluded-page')

    const { result } = setup()
    expect(result.current.shouldLiveChatEnabled).toBe(false)
  })

  it('should disable live chat if device type is not allowed', () => {
    useViewportType.mockReturnValueOnce({
      isTablet: true,
      isDesktop: false,
      isMobile: false,
    })

    const { result } = setup()
    expect(result.current.shouldLiveChatEnabled).toBe(false)
  })

  it('should disable live chat if locale is not supported', () => {
    getCurrentLocale.mockReturnValueOnce({
      locale: 'fr-FR',
      region: 'FR',
    })

    const { result } = setup()
    expect(result.current.shouldLiveChatEnabled).toBe(false)
  })
})
