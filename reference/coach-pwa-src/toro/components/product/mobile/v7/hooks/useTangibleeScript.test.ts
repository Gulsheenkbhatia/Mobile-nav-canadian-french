import React, { createRef, type ReactNode } from 'react'
import PWAContext from 'components/common/PWAContext'
import { renderHook as rtlRenderHook, act, waitFor } from 'test-utils/react'
import { jest } from '@jest/globals'

import { useTangibleeScript, type TangibleeScriptOptions } from './useTangibleeScript'

jest.mock('toro/hooks/usePreference_new')
import usePreference from 'toro/hooks/usePreference_new'

const mockUsePreference = jest.mocked(usePreference)

function renderUseTangibleeScript(
  injectScriptOnce: () => Promise<void> | null,
  tangibleeOptions?: TangibleeScriptOptions
) {
  const containerRef = createRef<HTMLDivElement>()
  const Wrapper = ({ children }: { children?: ReactNode }) =>
    React.createElement(
      PWAContext.Provider,
      {
        value: {
          deviceType: 'mobile',
          appData: { siteId: 'coh_us_out' },
          injectScriptOnce,
        },
      },
      React.createElement('div', { ref: containerRef }, children)
    )
  const hook = rtlRenderHook(() => useTangibleeScript(containerRef, tangibleeOptions), {
    wrapper: Wrapper,
  })
  return { ...hook, containerRef }
}

describe('useTangibleeScript', () => {
  beforeEach(() => {
    mockUsePreference.mockReturnValue({
      tangiblee: {
        IS_TANGIBLEE_ENABLED: true,
        TANGIBLEE_INTEGRATION_SCRIPT_PDPV7: 'https://example.com/tangiblee.js',
      },
    } as ReturnType<typeof usePreference>)
    window.globalTangiblee = { run: jest.fn() }
  })

  afterEach(() => {
    delete window.globalTangiblee
    jest.restoreAllMocks()
  })

  it('sets isContentReady to true when an iframe is added to containerRef after a 100ms wait', async () => {
    const injectScriptOnce = jest.fn(() => Promise.resolve())
    const { result, containerRef } = renderUseTangibleeScript(injectScriptOnce)

    await waitFor(() => expect(injectScriptOnce).toHaveBeenCalled())

    jest.useFakeTimers()
    try {
      act(() => {
        jest.advanceTimersByTime(100)
      })
    } finally {
      jest.useRealTimers()
    }

    containerRef.current?.appendChild(document.createElement('iframe'))

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('calls onIsContentReadyChange with true when iframe appears and false on unmount', async () => {
    const onIsContentReadyChange = jest.fn()
    const injectScriptOnce = jest.fn(() => Promise.resolve())
    const { unmount, containerRef } = renderUseTangibleeScript(injectScriptOnce, {
      onIsContentReadyChange,
    })

    await waitFor(() => expect(injectScriptOnce).toHaveBeenCalled())

    jest.useFakeTimers()
    try {
      act(() => {
        jest.advanceTimersByTime(100)
      })
    } finally {
      jest.useRealTimers()
    }

    onIsContentReadyChange.mockClear()
    act(() => {
      containerRef.current?.appendChild(document.createElement('iframe'))
    })

    await waitFor(() => {
      expect(onIsContentReadyChange).toHaveBeenCalledWith(true)
    })

    unmount()
    expect(onIsContentReadyChange).toHaveBeenCalledWith(false)
  })

  it('disconnects the MutationObserver on unmount', async () => {
    const disconnectSpy = jest.spyOn(MutationObserver.prototype, 'disconnect')
    const injectScriptOnce = jest.fn(() => Promise.resolve())
    const { unmount } = renderUseTangibleeScript(injectScriptOnce)

    await waitFor(() => expect(injectScriptOnce).toHaveBeenCalled())
    await act(async () => {
      await Promise.resolve()
    })

    unmount()

    expect(disconnectSpy).toHaveBeenCalled()
  })
})
