import userEvent from '@testing-library/user-event'
import { act, renderHook } from 'test-utils/react'
import { Atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { preferencesAtom } from 'store/preferences.atom'
import {
  openShopAssistChatRequestAtom,
  setOpenShopAssistChatRequestAtom,
  stickyAiChatAtom,
} from 'store/shop-assist-chat.atom'
import { STORAGE_SHOP_ASSIST_STICKY_AI_CHAT } from 'toro/constants/storageIds'
import { AiGiftConciergeAttributeName, AiGiftConciergeEventLocation } from 'toro/cms/constants'
import { useGiftConciergeLauncher } from './useGiftConciergeLauncher'

let mockAsPath = '/'

jest.mock('next/router', () => ({
  useRouter: () => ({
    get asPath() {
      return mockAsPath
    },
  }),
}))

/** Seeds preferences + shop-assist read state. Path comes from `mockAsPath` (next/router mock). */
function createJotaiContext() {
  return new Map<Atom<unknown>, unknown>([
    [preferencesAtom, {}],
    [openShopAssistChatRequestAtom, null],
  ])
}

/** Reads shop-assist atoms alongside the hook for assertions. */
function useGiftConciergeLauncherWithStore() {
  const initializeAiGiftConciergeLauncher = useGiftConciergeLauncher()
  const openRequest = useAtomValue(openShopAssistChatRequestAtom)
  const stickyAi = useAtomValue(stickyAiChatAtom)
  const setOpenRequest = useUpdateAtom(setOpenShopAssistChatRequestAtom)
  return { initializeAiGiftConciergeLauncher, openRequest, stickyAi, setOpenRequest }
}

describe('useGiftConciergeLauncher', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_SHOP_ASSIST_STICKY_AI_CHAT)
    mockAsPath = '/product/test'
  })

  it(`returns undefined from initialize when the container has no ${AiGiftConciergeAttributeName} elements`, () => {
    const { result } = renderHook(() => useGiftConciergeLauncher(), {
      contexts: {
        JotaiProviderContext: createJotaiContext(),
      },
    })

    const container = document.createElement('div')
    const cleanup = result.current(container)

    expect(cleanup).toBeUndefined()
  })

  it('opens Shop Assist from a descendant trigger using the current route', async () => {
    const { result } = renderHook(() => useGiftConciergeLauncherWithStore(), {
      contexts: {
        JotaiProviderContext: createJotaiContext(),
      },
    })

    const container = document.createElement('div')
    const trigger = document.createElement('button')
    trigger.setAttribute(AiGiftConciergeAttributeName, '')
    container.appendChild(trigger)
    document.body.appendChild(container)

    try {
      act(() => {
        result.current.initializeAiGiftConciergeLauncher(container)
      })

      expect(result.current.openRequest).toBeNull()

      const user = userEvent.setup()
      await user.click(trigger)

      expect(result.current.openRequest).toBe(AiGiftConciergeEventLocation.PDP)
      expect(result.current.stickyAi).toBe(true)
    } finally {
      document.body.removeChild(container)
    }
  })

  it('removes listeners when the returned cleanup runs', async () => {
    const { result } = renderHook(() => useGiftConciergeLauncherWithStore(), {
      contexts: {
        JotaiProviderContext: createJotaiContext(),
      },
    })

    const container = document.createElement('div')
    const trigger = document.createElement('button')
    trigger.setAttribute(AiGiftConciergeAttributeName, '')
    container.appendChild(trigger)
    document.body.appendChild(container)

    let cleanup: (() => void) | undefined

    try {
      act(() => {
        cleanup = result.current.initializeAiGiftConciergeLauncher(container)
      })

      const user = userEvent.setup()
      await user.click(trigger)

      expect(result.current.openRequest).toBe(AiGiftConciergeEventLocation.PDP)

      act(() => {
        result.current.setOpenRequest(null)
      })

      act(() => {
        cleanup?.()
      })

      await user.click(trigger)

      expect(result.current.openRequest).toBeNull()
    } finally {
      document.body.removeChild(container)
    }
  })
})
