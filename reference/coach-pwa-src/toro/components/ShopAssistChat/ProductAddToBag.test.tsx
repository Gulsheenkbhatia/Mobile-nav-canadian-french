import React from 'react'
import { render, screen, waitFor } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ProductAddToBag from 'toro/components/ShopAssistChat/ProductAddToBag'
import { fetchFullProductsDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import { productHasSizes } from 'toro/helpers/plp'
import { currentLocaleAtom } from 'store/global.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import {
  shopAssistProductDataCacheAtom,
  SHOP_ASSIST_PRODUCT_CACHE_TTL_MS,
  type ShopAssistProductCacheEntry,
} from 'store/shop-assist-chat.atom'
import type { Atom } from 'jotai'

const mockFetchFullProductsDataFromClient = jest.mocked(fetchFullProductsDataFromClient)
const mockProductHasSizes = jest.mocked(productHasSizes)

const mockAnalyticsSend = jest.fn()

jest.mock('toro/analytics/useAnalytics', () => () => ({
  send: mockAnalyticsSend,
}))

jest.mock('toro/helpers/fetchProductDataFromClient', () => ({
  fetchFullProductsDataFromClient: jest.fn(),
}))

jest.mock('toro/helpers/plp', () => ({
  fetchColorSizes: jest.fn(),
  fetchSizeVariantData: jest.fn(),
  productHasSizes: jest.fn(),
}))

jest.mock('toro/hooks/usePreference_new', () => () => ({
  toggleSiteFeatures: { enableMaxQtyRestriction: false },
  cartCheckoutSettings: { defaultMaxOrderQuantity: 5 },
}))

jest.mock('toro/hooks/useViewportType', () => () => ({
  isDesktop: true,
  isMobile: false,
}))

const mockAddToCart = jest.fn().mockResolvedValue(undefined)
const mockUpdateCart = jest.fn().mockResolvedValue(undefined)

const mockProduct = {
  id: 'product-123',
  name: 'Test Product',
  defaultColor: { orderable: false },
  inventory: { ats: 5 },
}

const createInitialAtoms = (
  cacheOverrides?: Record<string, ShopAssistProductCacheEntry>
): Map<Atom<unknown>, unknown> => {
  const cache = new Map<string, ShopAssistProductCacheEntry>()

  if (cacheOverrides) {
    Object.entries(cacheOverrides).forEach(([key, value]) => {
      cache.set(key, value)
    })
  }

  return new Map<Atom<unknown>, unknown>([
    [currentLocaleAtom, 'en-US'],
    [isPlpV3Atom, false],
    [shopAssistProductDataCacheAtom, cache],
  ])
}

function renderProductAddToBag(
  props: Partial<React.ComponentProps<typeof ProductAddToBag>> = {},
  atomOverrides?: Map<Atom<unknown>, unknown>
) {
  const initialValues = atomOverrides ?? createInitialAtoms()

  return render(
    <ProductAddToBag
      productId="product-123"
      productIndex={0}
      productData={{
        id: 'product-123',
        title: 'Test Product',
        price: 100,
        category: 'test',
        color: 'red',
        image_url: 'https://dummy.com/image.jpg',
        url: '/product/test-product',
      }}
      formatAnalyticsItems={(items) =>
        items.map(() => ({
          extendAnalyticsData: {},
        }))
      }
      setIsSizeDrawerOpen={jest.fn()}
      registerDrawerHandler={jest.fn()}
      {...props}
    />,
    {
      contexts: {
        PWAContext: { deviceType: 'desktop', appData: { siteId: 'coh_us_out' } },
        SessionContext: {
          session: { initialized: true, cart: { product_items: [] } },
          actions: { addToCart: mockAddToCart, updateCart: mockUpdateCart },
        },
        JotaiProviderContext: initialValues,
      },
    }
  )
}

describe('ProductAddToBag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchFullProductsDataFromClient.mockResolvedValue([mockProduct])
    mockProductHasSizes.mockReturnValue(false)
  })

  describe('product data cache', () => {
    it('should call fetchFullProductsDataFromClient on first click', async () => {
      const user = userEvent.setup()

      renderProductAddToBag()

      const addToBagButton = screen.getByRole('button', { name: /add to bag/i })

      await user.click(addToBagButton)

      await waitFor(() => {
        expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledTimes(1)

        expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledWith(
          ['product-123'],
          expect.objectContaining({
            includeInventory: true,
            withMaster: false,
            locale: 'en-US',
          })
        )
      })
    })

    it('should not call fetchFullProductsDataFromClient on second click when cache is valid', async () => {
      const user = userEvent.setup()

      renderProductAddToBag()

      const addToBagButton = screen.getByRole('button', { name: /add to bag/i })

      await user.click(addToBagButton)

      await waitFor(() => {
        expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledTimes(1)
      })

      await user.click(addToBagButton)

      await waitFor(() => {
        expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledTimes(1)
      })
    })

    it('should call fetchFullProductsDataFromClient again when cache entry is expired', async () => {
      const expiredEntry: ShopAssistProductCacheEntry = {
        data: [mockProduct],
        expiresAt: Date.now() - 1000,
      }

      const user = userEvent.setup()

      renderProductAddToBag({}, createInitialAtoms({ 'product-123-en-US': expiredEntry }))

      const addToBagButton = screen.getByRole('button', { name: /add to bag/i })

      await user.click(addToBagButton)

      await waitFor(() => {
        expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledTimes(1)
      })
    })

    it('should use cached data when valid entry exists', async () => {
      const validEntry: ShopAssistProductCacheEntry = {
        data: [mockProduct],
        expiresAt: Date.now() + SHOP_ASSIST_PRODUCT_CACHE_TTL_MS,
      }

      const user = userEvent.setup()

      renderProductAddToBag({}, createInitialAtoms({ 'product-123-en-US': validEntry }))

      const addToBagButton = screen.getByRole('button', { name: /add to bag/i })

      await user.click(addToBagButton)

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalled()
      })

      expect(mockFetchFullProductsDataFromClient).not.toHaveBeenCalled()
    })
  })
})
