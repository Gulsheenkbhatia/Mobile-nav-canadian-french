import { renderHook } from 'test-utils/react'
import useSplideCarousel from 'toro/hooks/useSplideCarousel'

const mockInjectJquery = jest.fn()

const mockPWAContext = {
  injectJquery: mockInjectJquery,
}

const setup = (shouldInjectSplide: boolean, initialProps?: { shouldInjectSplide: boolean }) => {
  return renderHook(() => useSplideCarousel({ shouldInjectSplide }), {
    initialProps,
    contexts: {
      PWAContext: mockPWAContext,
    },
  })
}

describe('useSplideCarousel', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should not call injectJquery when shouldInjectSplide is false', () => {
    setup(false)
    expect(mockInjectJquery).not.toHaveBeenCalled()
  })

  it('should call injectJquery when shouldInjectSplide is true', () => {
    setup(true)
    expect(mockInjectJquery).toHaveBeenCalledTimes(1)
  })
  it('should call injectJquery only once when shouldInjectSplide changes', () => {
    const { rerender } = renderHook(
      ({ shouldInjectSplide }) => useSplideCarousel({ shouldInjectSplide }),
      { initialProps: { shouldInjectSplide: false }, contexts: { PWAContext: mockPWAContext } }
    )
    expect(mockInjectJquery).not.toHaveBeenCalled()
    rerender({ shouldInjectSplide: true })
    expect(mockInjectJquery).toHaveBeenCalledTimes(1)
    rerender({ shouldInjectSplide: false })
    expect(mockInjectJquery).toHaveBeenCalledTimes(1)
  })
})
