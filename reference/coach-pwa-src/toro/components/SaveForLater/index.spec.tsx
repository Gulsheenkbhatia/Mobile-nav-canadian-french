import React from 'react'
import SaveForLater from './index'
import { useAtomValue } from 'jotai/utils'
import usePageType from 'toro/hooks/usePageType'
import { render } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import { useSaveForLaterComputed } from 'toro/components/SaveForLater/useSaveForLaterComputed'

jest.mock('toro/hooks/useIcon')
jest.mock('toro/hooks/usePageType', () =>
  jest.fn(() => ({
    isPDP: false,
    isPLP: true,
    isRetailHP: false,
    isOutletHP: false,
    isSubHP: false,
    isHP: false,
    isSRP: false,
    isContentPage: false,
    isProductPassport: false,
  }))
)
jest.mock('toro/hooks/useExperiment', () => jest.fn(() => false))
jest.mock('toro/hooks/useViewportType', () => jest.fn(() => ({ isMobile: false, isDesktop: true })))
jest.mock('toro/components/SaveForLater/useSaveForLaterComputed')
jest.mock('toro/hooks/useTimeout', () => ({
  __esModule: true,
  default: jest.fn((callback) => ({
    start: jest.fn(callback),
    clear: jest.fn(callback),
  })),
}))
jest.mock('jotai/utils')
const mockedUseAtomValue = jest.mocked(useAtomValue)

const mockHandleAddToWishlist = jest.fn()
const mockHandleRemoveFromWishlist = jest.fn()
jest.mock('toro/components/SaveForLater/useSaveForLaterHandlers', () => ({
  __esModule: true,
  useSaveForLaterHandlers: jest.fn().mockImplementation(() => ({
    handleAddToWishlist: mockHandleAddToWishlist,
    handleRemoveFromWishlist: mockHandleRemoveFromWishlist,
  })),
}))

const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseExperiment = useExperiment as jest.MockedFn<typeof useExperiment>
const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
const mockedUseSaveForLaterComputed = useSaveForLaterComputed as jest.MockedFn<
  typeof useSaveForLaterComputed
>

const mockUseSaveForLaterComputedData = {
  isInWishlist: false,
  wishlistFallbackId: '1',
  wishlistId: '1',
  selectedVariantComputed: {
    isCustomizedOrMonogrammed: false,
    customizationAction: null,
  },
  hasSizes: false,
}

const renderComponent = (props) => {
  const user = userEvent.setup()
  return { user, ...render(<SaveForLater {...props} />, { contexts: {} }) }
}

describe('SaveForLater Component', () => {
  beforeEach(() => {
    mockedUseSaveForLaterComputed.mockReturnValue(mockUseSaveForLaterComputedData)
  })

  it('should display the inactive wishlist icon initially', () => {
    const { container } = renderComponent({})
    expect(container.querySelector('button use[href="#icon-empty-heart"]')).toBeVisible()
  })

  it('should display the active wishlist icon when isInWishlist is true', () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true, isDesktop: false })
    mockedUseSaveForLaterComputed.mockReturnValue({
      ...mockUseSaveForLaterComputedData,
      isInWishlist: true,
    })
    const { container } = renderComponent({
      isQuickView: true,
      pdpQaTag: 'pdpQaTagRecomm',
    })
    expect(container.querySelector('button use[href="#icon-heart"]')).toBeInTheDocument()
  })

  it('should handle add to wishlist action', async () => {
    const { container, user } = renderComponent({})
    await user.click(container.querySelector('button use[href="#icon-empty-heart"]'))
    expect(mockHandleAddToWishlist).toHaveBeenCalled()
  })

  it('should handle remove from wishlist action', async () => {
    mockedUseSaveForLaterComputed.mockReturnValue({
      ...mockUseSaveForLaterComputedData,
      isInWishlist: true,
    })
    const { container, user } = renderComponent({
      onRemoveFromWishlistSuccess: mockHandleRemoveFromWishlist,
    })
    await user.click(container.querySelector('button use[href="#icon-heart"]'))
    expect(mockHandleRemoveFromWishlist).toHaveBeenCalled()
  })

  it('should render with isQuickView, isRecommendationTile and isTangibleeVisible are set to true', async () => {
    mockedUsePageType.mockImplementation(() => ({
      isPDP: true,
      isHP: false,
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isProductPassport: false,
      isContentPage: false,
    }))
    mockedUseExperiment.mockImplementation(() => true)
    const { getByTestId, container, user } = renderComponent({
      isQuickView: true,
      isRecommendationTile: true,
      isTangibleeVisible: true,
    })
    await user.click(container.querySelector('button use[href="#icon-wishlist-empty"]'))
    expect(getByTestId('qv_btn_wshlst_inactive')).toBeInTheDocument()
    expect(container.getElementsByClassName('btn-wishlist-container-recommend').length).toBe(1)
  })

  it('should render with isInWishlist, isProductHeader are set to true and pdpQaTag is equal to pdpQaTagMobile', async () => {
    mockedUseSaveForLaterComputed.mockReturnValue({
      ...mockUseSaveForLaterComputedData,
      isInWishlist: true,
    })
    mockedUseViewportType.mockReturnValue({ isMobile: true, isDesktop: false })
    mockedUseAtomValue.mockImplementation(() => true)
    mockedUsePageType.mockImplementation(() => ({
      isPDP: true,
      isHP: false,
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isProductPassport: false,
      isContentPage: false,
    }))
    mockedUseExperiment.mockImplementation(() => true)

    const { container, user, getByTestId } = renderComponent({
      isProductHeader: true,
      pdpQaTag: 'pdpQaTagMobile',
    })
    await user.click(container.querySelector('button use[href="#icon-wishlist-filled"]'))
    expect(getByTestId('m_pdp_btn_pdt_wshlst')).toBeInTheDocument()
    expect(getByTestId('cm_tile_button_pt_wshlist_active')).toBeInTheDocument()
  })
})
