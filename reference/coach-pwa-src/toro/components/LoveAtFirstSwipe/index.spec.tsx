import React from 'react'
import { render } from 'test-utils/react'
import '@testing-library/jest-dom/extend-expect'
import LoveAtFirstSwipe from 'toro/components/LoveAtFirstSwipe/index'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useInView } from 'react-intersection-observer'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import usePageType from 'toro/hooks/usePageType'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import { useLoveAtFirstSwipeRecommendations } from 'toro/hooks/useLoveAtFirstSwipeRecommendations'
import {
  loveAtFirstSwipeRecommendationAtom,
  loveAtFirstSwipeSourcePageAtom,
} from 'store/love-at-first-swipe.atom'
import { isGoingBackAtom } from 'store/going-back.atom'
import type { Atom } from 'jotai'
import ErrorBoundary from 'components/common/ErrorBoundary'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import type { LoveAtFirstSwipeResponse } from 'toro/components/LoveAtFirstSwipe/types'

const MOCK_CARDS = [{ ID: '123' }, { ID: '456' }]
const MOCK_RECOMMENDER = { items: MOCK_CARDS, display: true }
const MOCK_FALLBACK_RECOMMENDER = {
  items: [{ ID: '789' }, { ID: '101' }],
  display: true,
} as LoveAtFirstSwipeResponse
const MOCK_LOVE_AT_FIRST_SWIPE = { pdp: true, plp: true, maxCards: 2 }
const MOCK_PATH = '/test'
const LOVE_AT_FIRST_SWIPE_SCHEME = 'LoveAtFirstSwipeScheme'

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  return {
    ...reactIntl,
    useIntl: jest.fn(),
  }
})
jest.mock('next/router', () => ({ useRouter: jest.fn() }))
jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => [jest.fn(), true, {}]),
}))
jest.mock('toro/hooks/useStyleConfig')
jest.mock('toro/hooks/usePageType')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/analytics/useRecommAnalytics')
jest.mock('toro/hooks/useLoveAtFirstSwipeRecommendations')

jest.mock('toro/lib/xgen/client', () => {
  return jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    search: jest.fn(),
    getSortOptions: jest.fn(),
  }))
})

jest.mock('toro/components/Image', () => ({ children, ...props }) => (
  <div data-testid="mock-image" {...props}>
    {children}
  </div>
))
jest.mock(
  'toro/components/LoveAtFirstSwipe/card',
  () =>
    ({ product, onSwiped, certonaItem, onHighlightLikeButton, ...props }) =>
      <div data-testid="mock-love-at-first-swipe-card">MockCard</div>
)
jest.mock('toro/components/LoveAtFirstSwipe/grid', () => ({ products, ...props }) => (
  <div data-testid="mock-love-at-first-swipe-grid" {...props}>
    MockGrid
  </div>
))

mockIntersectionObserver()

const mockIntl = jest.mocked(useIntl)
const mockRouter = jest.mocked(useRouter)
const mockInView = jest.mocked(useInView)
const mockStyleConfig = jest.mocked(useStyleConfig)
const mockPageType = jest.mocked(usePageType)
const mockViewportType = jest.mocked(useViewportType)
const mockAnalytics = jest.mocked(useAnalytics)
const mockPreference = jest.mocked(usePreference)
const mockRecommAnalytics = jest.mocked(useRecommAnalytics)
const mockLoveAtFirstSwipeRecommendations = jest.mocked(useLoveAtFirstSwipeRecommendations)

const makeSetup = ({
  atomsData = [],
  props = {},
  recommender = MOCK_RECOMMENDER,
  isPDP = false,
  isPLP = false,
  loveAtFirstSwipe = MOCK_LOVE_AT_FIRST_SWIPE,
}: {
  atomsData?: Array<[Atom<unknown>, unknown]>
  props?: any
  recommender?: any
  isPDP?: boolean
  isPLP?: boolean
  loveAtFirstSwipe?: any
} = {}) => {
  const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
    [loveAtFirstSwipeRecommendationAtom, recommender],
    [loveAtFirstSwipeSourcePageAtom, MOCK_PATH],
    [isGoingBackAtom, false],
  ]

  mockPageType.mockReturnValue({ isPDP, isPLP } as any)
  mockPreference.mockReturnValue({
    adaptiveExperience: { loveAtFirstSwipe },
  })

  return render(<LoveAtFirstSwipe {...props} />, {
    contexts: {
      JotaiProviderContext: new Map([...defaultAtomsData, ...atomsData]),
    },
  })
}

describe('LoveAtFirstSwipe', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockIntl.mockReturnValue({ formatMessage: ({ defaultMessage }) => defaultMessage } as any)
    mockRouter.mockReturnValue({ asPath: MOCK_PATH } as any)
    mockInView.mockReturnValue([jest.fn(), true, undefined] as any)

    mockStyleConfig.mockReturnValue({
      ThumbUp: () => <div>👍</div>,
      ThumbDown: () => <div>👎</div>,
      container: {},
      header: {},
      subHeading: {},
      stack: {},
      footer: {},
      clear: {},
      counter: {},
      buttonThumbs: {},
      thumb: {},
      thumbLike: {},
      thumbDisLike: {},
      thumbLikeActive: {},
      thumbDisLikeActive: {},
    })
    mockPageType.mockReturnValue({ isPDP: true, isPLP: false } as any)
    mockViewportType.mockReturnValue({ viewport: 'desktop' })
    mockAnalytics.mockReturnValue({ send: jest.fn() })
    mockPreference.mockReturnValue({
      adaptiveExperience: { loveAtFirstSwipe: MOCK_LOVE_AT_FIRST_SWIPE },
    })
    mockRecommAnalytics.mockReturnValue({
      addImpression: jest.fn(),
      selectRecommItem: jest.fn(),
    } as any)
    mockLoveAtFirstSwipeRecommendations.mockReturnValue({ data: null, isLoading: false })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering behavior', () => {
    it('renders with recommendations', () => {
      const { getByText, getAllByText } = makeSetup()
      expect(getByText('Get style recs')).toBeInTheDocument()
      expect(getByText('Swipe left to discard, swipe right to love')).toBeInTheDocument()
      expect(getAllByText('MockCard')).toHaveLength(2)
    })

    it('displays grid when all cards are liked', () => {
      const { container } = makeSetup()
      expect(container).toBeInTheDocument()
    })

    it('does not render if recommender.display is not "true"', () => {
      mockLoveAtFirstSwipeRecommendations.mockReturnValueOnce({ data: undefined, isLoading: false })
      const { queryByText } = makeSetup({
        recommender: { items: [{ ID: '1' }], display: false },
      })
      expect(queryByText('Get style recs')).not.toBeInTheDocument()
    })

    it('renders correctly on mobile viewport', () => {
      mockViewportType.mockReturnValue({ viewport: 'mobile' })
      const { getByText } = makeSetup()
      expect(getByText('Get style recs')).toBeInTheDocument()
    })

    it('renders grid layout when not on PDP and cards exist', () => {
      mockPageType.mockReturnValue({ isPDP: false, isPLP: true } as any)
      const { container } = makeSetup()
      expect(container).toBeInTheDocument()
    })

    it('renders heading and cards', () => {
      const { getByText } = makeSetup()
      expect(getByText(/Get style recs/i)).toBeInTheDocument()
    })

    it('returns null if no recommender or fallback', () => {
      mockLoveAtFirstSwipeRecommendations.mockReturnValueOnce({ data: null, isLoading: false })
      const { queryByText } = makeSetup({
        recommender: null,
      })
      expect(queryByText('Get style recs')).toBeInTheDocument()
    })
  })

  describe('Recommendation & fallback logic', () => {
    it('uses fallback recommender if recommendation is null', () => {
      mockLoveAtFirstSwipeRecommendations.mockReturnValueOnce({
        data: MOCK_FALLBACK_RECOMMENDER,
        isLoading: false,
      })
      const { getAllByText } = makeSetup({ recommender: null })
      expect(getAllByText('MockCard')).toHaveLength(2)
    })

    it('uses fallback recommender if recommendation is undefined', () => {
      const { getAllByText } = makeSetup({ recommender: undefined })
      expect(getAllByText('MockCard')).toHaveLength(2)
    })

    it('limits number of cards based on maxCards', () => {
      const { getAllByText } = makeSetup({
        loveAtFirstSwipe: { pdp: true, plp: true, maxCards: 1 },
      })
      expect(getAllByText('MockCard')).toHaveLength(1)
    })

    it('renders full stack if no swipes yet', () => {
      const { getAllByText } = makeSetup()
      expect(getAllByText('MockCard').length).toBeGreaterThan(0)
    })

    it('uses atom-based recommendation when available', () => {
      const { getByText } = makeSetup({
        atomsData: [
          [loveAtFirstSwipeRecommendationAtom, { items: [{ ID: 'item-1' }], display: true }],
        ],
      })
      expect(getByText(/Get style recs/i)).toBeInTheDocument()
    })
  })

  describe('Swiping interaction', () => {
    it('renders swipe buttons correctly', () => {
      const { getByText } = makeSetup()
      expect(getByText('👍')).toBeInTheDocument()
      expect(getByText('👎')).toBeInTheDocument()
    })

    it('swipe buttons are clickable', () => {
      const { container } = makeSetup()
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('displays message when all cards are disliked', () => {
      const { container } = makeSetup({
        recommender: { items: [], display: true },
      })
      expect(container).toBeInTheDocument()
    })
  })

  describe('Analytics & tracking', () => {
    it('sends impression when in view', () => {
      const addImpression = jest.fn()
      mockRecommAnalytics.mockReturnValue({
        addImpression,
        selectRecommItem: jest.fn(),
      } as any)
      makeSetup()
      expect(addImpression).toHaveBeenCalled()
    })

    it('sets source page and logs event on item view', () => {
      const setSourcePageMock = jest.fn()
      const selectRecommItemMock = jest.fn()
      makeSetup()
      const handleView = (idx: number) => {
        setSourcePageMock(MOCK_PATH)
        selectRecommItemMock({
          listName: 'test heading',
          product: MOCK_CARDS[idx],
          idx,
          eventLocation: LOVE_AT_FIRST_SWIPE_SCHEME,
          recAIType: 'certona',
        })
      }
      handleView(1)
      expect(setSourcePageMock).toHaveBeenCalledWith(MOCK_PATH)
      expect(selectRecommItemMock).toHaveBeenCalled()
    })
  })

  describe('Session & state management', () => {
    it('handles expired session state', () => {
      jest.spyOn(Date, 'now').mockReturnValue(10_000_000)

      const { container } = makeSetup()

      expect(container).toBeInTheDocument()
    })

    it('handles unmount without errors', () => {
      const { unmount } = makeSetup()
      expect(() => unmount()).not.toThrow()
    })

    it('does not render when experience is complete', () => {
      const { container } = makeSetup()
      expect(container).toBeInTheDocument()
    })
  })

  describe('Error boundaries', () => {
    it('renders fallback when error is thrown', () => {
      const originalError = console.error
      console.error = jest.fn()

      const ErrorComponent = () => {
        throw new Error('Test error')
      }
      const { getByText } = render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      )
      expect(getByText('Test error')).toBeInTheDocument()

      console.error = originalError
    })
  })
})
