import { render, waitFor } from 'test-utils/react'
import RecommendationItem from './index'
import useViewportType from 'toro/hooks/useViewportType'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import userEvent from '@testing-library/user-event'
import { useSaveForLaterHandlers } from 'toro/components/SaveForLater/useSaveForLaterHandlers'
import { useSaveForLaterComputed } from 'toro/components/SaveForLater/useSaveForLaterComputed'
import * as SaveForLaterModule from 'toro/components/SaveForLater'

jest.mock('toro/hooks/useViewportType')
jest.mocked(useViewportType).mockImplementation(() => ({ isDesktop: true, isMobile: false }))
jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/product',
  }
})
jest.mock('toro/components/SaveForLater/useSaveForLaterHandlers')
jest.mocked(useSaveForLaterHandlers).mockImplementation(() => ({
  handleAddToWishlist: jest.fn(),
  handleRemoveFromWishlist: jest.fn(),
}))
jest.mock('toro/components/SaveForLater/useSaveForLaterComputed')
const mockedUseSaveForLaterComputed = jest.mocked(useSaveForLaterComputed)
mockIntersectionObserver()
const onItemClick = jest.fn()
const selectRecommItem = jest.fn()
const addToWishlistRecommItem = jest.fn()
const removeFromWishlistRecommItem = jest.fn()

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
    SessionContext: {
      session: {},
    },
  },
}
const defaultProps = {
  product: {
    ID: '1',
    detailURL: 'https://www.coach.com/products/tabby-shoulder-bag-20/CM546-B4%2FHA.html?rrec=true',
    imageURL: 'https://coach.scene7.com/is/image/Coach/cm546_b4ha_a0?$imageRec$',
    name: 'Product 1',
    Color: 'Red',
    price: {
      saleprice: '420',
      fullprice: '690',
      currency: '$',
    },
  },
  idx: 0,
  viewport: 'desktop',
  hidePrice: false,
  addImpression: jest.fn(),
  selectRecommItem,
  addToWishlistRecommItem,
  removeFromWishlistRecommItem,
  scheme: 'testScheme',
  label: 'Test Label',
  variant: null,
  onItemClick,
  certonaPriceType: 'default',
  isSendOnceInViewport: false,
}
const renderComponent = () => {
  return {
    ...render(<RecommendationItem {...defaultProps} />, renderOptions),
    user: userEvent.setup({ delay: null }),
  }
}

describe('RecommendationItem', () => {
  beforeEach(() => {
    mockedUseSaveForLaterComputed.mockReturnValue({
      isInWishlist: false,
      wishlistFallbackId: '1',
      wishlistId: '1',
      selectedVariantComputed: {
        isCustomizedOrMonogrammed: false,
        customizationAction: null,
      },
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render recommendation item correctly', () => {
    const { getByText } = renderComponent()
    expect(getByText('Product 1')).toBeVisible()
  })

  it('should call onLinkClick when the product link is clicked', async () => {
    const { getByRole, user } = renderComponent()
    const productLink = getByRole('link')
    await user.click(productLink)

    await waitFor(() => {
      expect(onItemClick).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(selectRecommItem).toHaveBeenCalledWith({
        listName: 'Test Label',
        product: {
          ...defaultProps.product,
          is_quick_add: '0',
        },
        idx: 0,
        eventLocation: 'testScheme',
        recAIType: 'certona',
      })
    })
  })

  it('should call onAddToWishlistSuccess when the product is added to wishlist', async () => {
    const { user, getByLabelText } = renderComponent()
    const saveForLaterButton = getByLabelText('wishlist')
    await user.click(saveForLaterButton)
    await waitFor(() => {
      expect(addToWishlistRecommItem).toHaveBeenCalled()
    })
  })

  it('should call onRemoveFromWishlistSuccess when the product is removed from wishlist', async () => {
    mockedUseSaveForLaterComputed.mockReturnValue({
      isInWishlist: true,
      wishlistFallbackId: '1',
      wishlistId: '1',
      selectedVariantComputed: {
        isCustomizedOrMonogrammed: false,
        customizationAction: null,
      },
    })
    const { user, getByLabelText } = renderComponent()
    const saveForLaterButton = getByLabelText('wishlist')
    await user.click(saveForLaterButton)
    await waitFor(() => {
      expect(removeFromWishlistRecommItem).toHaveBeenCalled()
    })
  })

  it('should pass defaultOrFirstVariantID as wishlist identifier when available', () => {
    const spy = jest.spyOn(SaveForLaterModule, 'default')

    const productWithVariant = {
      ...defaultProps.product,
      defaultOrFirstVariantID: 'variant-123',
    }

    render(<RecommendationItem {...defaultProps} product={productWithVariant} />, renderOptions)

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedVariant: {
          productId: 'variant-123',
        },
      }),
      {}
    )

    spy.mockRestore()
  })

  it('should fallback to product ID when variant ID is not available', () => {
    const spy = jest.spyOn(SaveForLaterModule, 'default')

    renderComponent()

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedVariant: {
          productId: '1',
        },
      }),
      {}
    )

    spy.mockRestore()
  })
})
