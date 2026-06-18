import { renderHook } from '@testing-library/react'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import useReviewOverlayImageSrc from 'toro/hooks/useReviewOverlayImageSrc'
import { Provider as JotaiProvider } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom, isQuickViewAtom } from 'store/pdp.atom'

jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/usePreference_new')
jest.mock('jotai/utils', () => {
  const originalModule = jest.requireActual('jotai/utils')
  return {
    ...originalModule,
    useAtomValue: jest.fn(),
  }
})

const jotaiWrapper =
  (shouldMatch = false) =>
  ({ children }) => {
    return <JotaiProvider>{children}</JotaiProvider>
  }

const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>

const reviewsOnImageCarouselTurnedOnBMPref = {
  powerReviews: {
    enableEmplifi: false,
  },
  toggleSiteFeatures: {
    reviewsOnImageCarouselConfigs: {
      enable: true,
      ImageSuffixLookup: '_a5,_a3',
      reviewThreshold: '4',
    },
  },
}

describe('useReviewOverlayImageSrc', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should not match if the experiment or preference are disabled', () => {
    mockedUseExperiment.mockImplementation(() => false)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 0 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => reviewsOnImageCarouselTurnedOnBMPref)

    const { result: result1 } = renderHook(
      () => useReviewOverlayImageSrc([{ src: 'test/src/url_a3', type: '' }]),
      { wrapper: jotaiWrapper() }
    )

    expect(result1.current).toEqual('')

    jest.restoreAllMocks()

    mockedUseExperiment.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 0 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => ({
      powerReviews: {
        enableEmplifi: false,
      },
      toggleSiteFeatures: {
        reviewsOnImageCarouselConfigs: {
          enable: false,
          ImageSuffixLookup: '_a5,_a3',
          reviewThreshold: '4',
        },
      },
    }))

    const { result: result2 } = renderHook(
      () => useReviewOverlayImageSrc([{ src: '', type: '' }]),
      { wrapper: jotaiWrapper() }
    )

    expect(result2.current).toEqual('')
  })

  it('should match a url if in the imageSuffixLookup value', () => {
    mockedUseExperiment.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 4.5 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => reviewsOnImageCarouselTurnedOnBMPref)

    const { result } = renderHook(
      () => useReviewOverlayImageSrc([{ src: 'test/src/url_a3', type: '' }]),
      { wrapper: jotaiWrapper(true) }
    )

    expect(result.current).toEqual('test/src/url_a3')
  })

  it('should not match a url if not in the imageSuffixLookup value', () => {
    mockedUseExperiment.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 0 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => reviewsOnImageCarouselTurnedOnBMPref)

    const { result } = renderHook(
      () => useReviewOverlayImageSrc([{ src: 'test/src/url_a8', type: '' }]),
      { wrapper: jotaiWrapper() }
    )

    expect(result.current).toEqual('')
  })
  it('should not match if the reviews average rating is lowest than review threshold', () => {
    mockedUseExperiment.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return false
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 3.0 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => reviewsOnImageCarouselTurnedOnBMPref)

    const { result } = renderHook(
      () => useReviewOverlayImageSrc([{ src: 'test/src/url_a3', type: '' }]),
      { wrapper: jotaiWrapper() }
    )

    expect(result.current).toEqual('')
  })
  it('should match if the reviews average rating is higher than review threshold', () => {
    mockedUseExperiment.mockImplementation(() => true)
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isQuickViewAtom) return true
      if (atom === productDataAtom)
        return {
          reviewsData: { results: [{ rollup: { average_rating: 4.5 } }] },
        }
      return false
    })
    mockedUsePreference.mockImplementation(() => reviewsOnImageCarouselTurnedOnBMPref)

    const { result } = renderHook(
      () => useReviewOverlayImageSrc([{ src: 'test/src/url_a3', type: '' }]),
      { wrapper: jotaiWrapper(true) }
    )

    expect(result.current).toEqual('test/src/url_a3')
  })
})
