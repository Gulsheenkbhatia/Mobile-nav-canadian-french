import React from 'react'
import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import ReviewOverlayOnImage from './index'
import useViewportType from 'toro/hooks/useViewportType'
import useDisclosure from 'toro/hooks/useDisclosure'
import useAnalytics from 'toro/analytics/useAnalytics'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useExperiment from 'toro/hooks/useExperiment'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'

jest.mock('jotai/utils', () => ({
  useUpdateAtom: jest.fn(),
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  selectAtom: jest.fn(),
  loadable: jest.fn(),
  atomFamily: jest.fn(),
  createJSONStorage: jest.fn(),
}))

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/hooks/useViewportType', () => jest.fn())
jest.mock('toro/hooks/useDisclosure', () => jest.fn())
jest.mock('toro/analytics/useAnalytics', () => jest.fn())
jest.mock('toro/hooks/useHeaderHeight', () => jest.fn())
jest.mock('toro/hooks/useHeaderPositionPref', () => jest.fn())
jest.mock('toro/hooks/useExperiment', () => jest.fn())
jest.mock('toro/components/ReviewOverlayOnImage/icon/close-icon-white.svg', () => 'close-icon')
jest.mock('toro/hooks/usePreference_new')

const mockedUsePreference = jest.mocked(usePreference)

const setReviewModalOpened = jest.fn()
const setIsReviewClosed = jest.fn()
const selectedVariantId = 'variant-123'
const pdpReviewsData = [
  {
    details: {
      nickname: 'Gussie Simmons',
      headline: 'Great Product',
      comments: 'Loved it!',
      created_date: '2023-07-17',
    },
    metrics: { rating: 4.5 },
  },
  {
    details: {
      nickname: 'Theodore Christensen',
      headline: 'Really Great Product ',
      comments: 'Loved it! 2',
      created_date: '2023-07-18',
    },
    metrics: { rating: 5.5 },
  },
]

const renderComponent = (reviewData = pdpReviewsData) => {
  mockedUsePreference.mockImplementation(() => ({
    adaptiveExperience: {
      reviewOverlayStyle: {
        brand: { show_number_of_reviews: false },
        subBrand: { show_number_of_reviews: false },
      },
    },
    powerReviews: {
      enableEmplifi: false,
    },
  }))
  return render(
    <ReviewOverlayOnImage
      setIsReviewClosed={setIsReviewClosed}
      selectedVariantId={selectedVariantId}
      pdpReviewsData={reviewData}
    />,
    {
      contexts: {
        PWAContext: {
          appData: {},
        },
      },
    }
  )
}

describe('ReviewOverlayOnImage', () => {
  beforeEach(() => {
    useUpdateAtom.mockReturnValue(setReviewModalOpened)
    useAtomValue.mockReturnValue(false)
    useViewportType.mockReturnValue({ isMobile: false })
    useDisclosure.mockReturnValue({ isOpen: true, onOpen: jest.fn(), onClose: jest.fn() })
    useAnalytics.mockReturnValue({ send: jest.fn() })
    useHeaderHeight.mockReturnValue(50)
    useHeaderPositionPref.mockReturnValue({ isTransparentStickyHeader: false })
    useExperiment.mockReturnValue(false)
  })

  it('calls setReviewModalOpened and handleAnalyticsEvent on button click', async () => {
    const user = userEvent.setup()
    const { getByText } = renderComponent()

    await user.click(getByText('View All Reviews'))
    expect(setReviewModalOpened).toHaveBeenCalledWith(true)
  })

  it('handles close click', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    useDisclosure.mockReturnValue({ isOpen: true, onOpen: jest.fn(), onClose })
    const { container } = renderComponent()

    await user.click(container.querySelector('button close-icon'))
    expect(onClose).toHaveBeenCalled()
    expect(setIsReviewClosed).toHaveBeenCalledWith(true)
  })

  it('renders correctly when isMobile is true', () => {
    useViewportType.mockReturnValue({ isMobile: true })
    useExperiment.mockReturnValue(true)
    const { getByTestId } = renderComponent()

    expect(getByTestId('review-overlay-container-upper')).toBeVisible()
  })

  it('does not render review overlay lower container when isOpen is false', () => {
    useDisclosure.mockReturnValue({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })
    const { getByTestId } = renderComponent()

    expect(getByTestId('review-overlay-container-lower')).not.toBeVisible()
  })

  it('does not render review overlay upper container when isOpen is false and isReviewsImageOverlayExperimentUpper is true', () => {
    useViewportType.mockReturnValue({ isMobile: true })
    useDisclosure.mockReturnValue({ isOpen: false, onOpen: jest.fn(), onClose: jest.fn() })
    useExperiment.mockReturnValue(true)
    const { getByTestId } = renderComponent()

    expect(getByTestId('review-overlay-container-upper')).not.toBeVisible()
  })

  it('calculate topPosition correctly when isTransparentStickyHeader is true and isTabbedAdaptivePDPEligible is false', () => {
    useAtomValue.mockImplementation((atom) => {
      if (atom === isTabbedAdaptivePDPEligibleAtom) return true
      return false
    })

    const { getByText } = renderComponent()

    const topPosition = `calc(var(--spacing-3) + 50px)`
    expect(getByText('View All Reviews').parentElement.parentElement).toHaveStyle(
      `top: ${topPosition}`
    )
  })

  it('handles empty details and metrics objects in pdpReviewsData', () => {
    const { queryByText } = renderComponent([{}])

    expect(queryByText('View All Reviews')).not.toBeInTheDocument()
  })
})
