import React from 'react'
import { render, screen } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import StarReviewRating from './index'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import { EXPERIMENTS } from 'toro/constants/experiments'

// Mock all the hooks
jest.mock('toro/hooks/useStyleConfig')
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/analytics/useAnalytics')
jest.mock('jotai/utils')

// Mock the SVG component
jest.mock('design-tokens/icon/review/star.svg', () => {
  return function MockFullStar({ width, height, ...props }) {
    return <svg data-testid="full-star" width={width} height={height} {...props} />
  }
})

const mockUseStyleConfig = jest.mocked(useStyleConfig)
const mockUseProductData = jest.mocked(useProductData)
const mockUsePreference = jest.mocked(usePreference)
const mockUseExperiment = jest.mocked(useExperiment)
const mockUseViewportType = jest.mocked(useViewportType)
const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseAtomValue = jest.mocked(useAtomValue)

describe('StarReviewRating', () => {
  const mockAnalytics = {
    send: jest.fn(),
  }

  const mockReviewSectionNode = {
    scrollIntoView: jest.fn(),
  }

  const mockStyles = {
    starReviewRatingWrapper: {},
    starReviewRatingIcon: {},
    starReviewRatingValue: {},
    starReviewRatingCount: {},
  }

  const defaultProductData = [
    false, // isHideReview
    4.5, // avgRatingEmplifi
    null, // averageRatingValue
    null, // totalReviewsValue
    10, // revCountEmplifi
    'test-master-id', // masterId
  ]

  const defaultPreferences = {
    powerReviews: { enableEmplifi: true },
    toggleSiteFeatures: { hideReviewsCountOnPDP: true },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseStyleConfig.mockReturnValue(mockStyles)
    mockUseProductData.mockReturnValue(defaultProductData)
    mockUsePreference.mockReturnValue(defaultPreferences)
    mockUseExperiment.mockReturnValue(false)
    mockUseViewportType.mockReturnValue({ isMobile: false })
    mockUseAnalytics.mockReturnValue(mockAnalytics)
    mockUseAtomValue.mockReturnValue(mockReviewSectionNode)
  })

  describe('Basic Rendering', () => {
    it('should render with default props when reviews are available', () => {
      render(<StarReviewRating />)

      expect(screen.getByTestId('d_head-review-wrapper')).toBeVisible()
      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.queryByText('(10)')).toBeNull()
    })
  })

  describe('Review Count Display', () => {
    it('should show review count on mobile with PDP_V6 experiment and hideReviewsCountOnPDP preference disabled', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: false },
      })

      render(<StarReviewRating />)

      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.getByText('(10)')).toBeVisible()
    })

    it('should not show review count on desktop', () => {
      mockUseViewportType.mockReturnValue({ isMobile: false })
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: false },
      })

      render(<StarReviewRating />)

      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.queryByText('(10)')).toBeNull()
    })

    it('should not show review count when PDP_V6 experiment is disabled', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })
      mockUseExperiment.mockReturnValue(false)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: false },
      })

      render(<StarReviewRating />)

      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.queryByText('(10)')).toBeNull()
    })

    it('should not show review count when hideReviewsCountOnPDP preference is true', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: true },
      })

      render(<StarReviewRating />)

      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.queryByText('(10)')).toBeNull()
    })

    it('should not show review count when total reviews is 0', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: false },
      })
      mockUseProductData.mockReturnValue([
        false, // isHideReview
        4.5, // avgRatingEmplifi
        null, // averageRatingValue
        null, // totalReviewsValue
        0, // revCountEmplifi - no reviews
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)

      expect(screen.queryByText('(0)')).toBeNull()
    })
  })

  describe('Data Qa Attributes', () => {
    it('should use desktop data-qa attribute', () => {
      render(<StarReviewRating />)

      expect(screen.getByTestId('d_head-review-wrapper')).toBeVisible()
    })
  })

  describe('Visibility Conditions', () => {
    it('should not render when reviews are hidden', () => {
      mockUseProductData.mockReturnValue([
        true, // isHideReview - hidden
        4.5, // avgRatingEmplifi
        null, // averageRatingValue
        null, // totalReviewsValue
        10, // revCountEmplifi
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)
      expect(screen.queryByTestId('d_head-review-wrapper')).toBeNull()
    })

    it('should not render when Emplifi is disabled', () => {
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        powerReviews: { enableEmplifi: false },
      })

      render(<StarReviewRating />)
      expect(screen.queryByTestId('d_head-review-wrapper')).toBeNull()
    })

    it('should not render when no reviews and no rating', () => {
      mockUseProductData.mockReturnValue([
        false, // isHideReview
        0, // avgRatingEmplifi - no rating
        null, // averageRatingValue
        null, // totalReviewsValue
        0, // revCountEmplifi - no reviews
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)
      expect(screen.queryByTestId('d_head-review-wrapper')).toBeNull()
    })

    it('should render when only rating is available (no reviews)', () => {
      mockUseProductData.mockReturnValue([
        false, // isHideReview
        4.5, // avgRatingEmplifi
        null, // averageRatingValue
        null, // totalReviewsValue
        0, // revCountEmplifi - no reviews
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)

      expect(screen.getByText('4.5')).toBeVisible()
      expect(screen.queryByText('(0)')).toBeNull()
    })
  })

  describe('Rating Data Priority', () => {
    it('should prefer averageRatingValue over avgRatingEmplifi', () => {
      mockUseProductData.mockReturnValue([
        false, // isHideReview
        4.5, // avgRatingEmplifi
        4.8, // averageRatingValue - preferred
        null, // totalReviewsValue
        10, // revCountEmplifi
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)

      expect(screen.getByText('4.8')).toBeVisible()
      expect(screen.queryByText('4.5')).toBeNull()
    })

    it('should prefer totalReviewsValue over revCountEmplifi', () => {
      mockUseViewportType.mockReturnValue({ isMobile: true })
      mockUseExperiment.mockReturnValue(true)
      mockUsePreference.mockReturnValue({
        ...defaultPreferences,
        toggleSiteFeatures: { hideReviewsCountOnPDP: false },
      })
      mockUseProductData.mockReturnValue([
        false, // isHideReview
        4.5, // avgRatingEmplifi
        null, // averageRatingValue
        15, // totalReviewsValue - preferred
        10, // revCountEmplifi
        'test-master-id', // masterId
      ])

      render(<StarReviewRating />)

      expect(screen.getByText('(15)')).toBeVisible()
      expect(screen.queryByText('(10)')).toBeNull()
    })
  })

  describe('Analytics', () => {
    it('should send analytics event when clicked and scroll to review section', async () => {
      const { user } = render(<StarReviewRating />)

      await user.click(screen.getByTestId('d_head-review-wrapper'))

      expect(mockAnalytics.send).toHaveBeenCalledWith('reviewInteraction', {
        eventLocation: 'product',
        eventAction: 'product rating click',
        eventLabel: 'test-master-id',
      })
      expect(mockReviewSectionNode.scrollIntoView).toHaveBeenCalled()
    })
  })

  describe('Hook Calls', () => {
    it('should call useStyleConfig with correct parameter', () => {
      render(<StarReviewRating />)

      expect(mockUseStyleConfig).toHaveBeenCalledWith('StarReviewRatingStyles')
    })

    it('should call useExperiment with PDP_V6 experiment', () => {
      render(<StarReviewRating />)

      expect(mockUseExperiment).toHaveBeenCalledWith(EXPERIMENTS.PDP_V6)
    })

    it('should call usePreference with correct groups', () => {
      render(<StarReviewRating />)

      expect(mockUsePreference).toHaveBeenCalledWith({
        powerReviews: ['enableEmplifi'],
        ToggleSiteFeatures: ['hideReviewsCountOnPDP'],
      })
    })

    it('should call useProductData with correct paths', () => {
      render(<StarReviewRating />)

      expect(mockUseProductData).toHaveBeenCalledWith([
        'custom.c_hideReview',
        'custom.c_avgRatingEmplifi',
        'reviewsData.results[0].rollup.average_rating',
        'reviewsData.results[0].rollup.review_count',
        'custom.c_revCountEmplifi',
        'masterId',
      ])
    })
  })
})
