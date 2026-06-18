import { renderHook } from 'test-utils/react'
import useRVRecommendations from './useRVRecommendations'
import { CertonaSchemeType } from 'store/certona-schemes.atoms'

jest.mock('toro/hooks/useRecentlyViewedData', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    title: 'Recently Viewed',
    products: [],
    display: true,
  })),
}))

jest.mock('toro/analytics/useAnalytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    send: jest.fn(),
  })),
}))

jest.mock('toro/analytics/useRecommAnalytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    addImpression: jest.fn(),
    selectRecommItem: jest.fn(),
  })),
}))

describe('useRVRecommendations', () => {
  const defaultProps = {
    location: 'plp',
    certonaScheme: 'RV_ON_TOP_OF_PLP' as CertonaSchemeType,
    enableBadging: true,
    limit: 10,
    forwardedRef: { current: null },
    carouselRef: { current: null },
  }

  it('should return title, products, and display status', () => {
    const { result } = renderHook(() => useRVRecommendations(defaultProps))

    expect(result.current).toHaveProperty('title')
    expect(result.current).toHaveProperty('products')
    expect(result.current).toHaveProperty('display')
  })

  it('should return event handlers', () => {
    const { result } = renderHook(() => useRVRecommendations(defaultProps))

    expect(result.current).toHaveProperty('handleClick')
    expect(result.current).toHaveProperty('onLinkClick')
    expect(result.current).toHaveProperty('onTileVisible')
    expect(typeof result.current.handleClick).toBe('function')
    expect(typeof result.current.onLinkClick).toBe('function')
    expect(typeof result.current.onTileVisible).toBe('function')
  })

  it('should handle empty products array', () => {
    const { result } = renderHook(() => useRVRecommendations(defaultProps))

    expect(result.current.products).toEqual([])
  })
})
