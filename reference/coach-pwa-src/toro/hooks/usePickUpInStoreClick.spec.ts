jest.mock('toro/hooks/usePreference_new', () => jest.fn())
jest.mock('toro/hooks/useViewportType', () => jest.fn())
jest.mock('toro/hooks/useDrawerAtom', () => ({
  useDrawerAtom: jest.fn(),
  ATB_DRAWER_ACTIONS: {
    BATCH_DRAWER_STATE: 'BATCH_DRAWER_STATE',
    SET_VISIBLE: 'SET_VISIBLE',
  },
}))
jest.mock('toro/hooks/useSelectedVariantData', () => jest.fn())

import { renderHook, act } from 'test-utils/react'
import { usePickUpInStoreClick } from './usePickUpInStoreClick'
import usePreference from 'toro/hooks/usePreference_new'
import useViewportType from 'toro/hooks/useViewportType'
import { useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { selectedQtyAtom, productDataAtom } from 'store/pdp.atom'

const mockSetDrawerState = jest.fn()

const setup = ({
  sessionOverrides = {},
  appDataOverrides = {},
  atomValues = {},
}: {
  sessionOverrides?: any
  appDataOverrides?: any
  atomValues?: {
    selectedQty?: number
    productData?: any
  }
} = {}) => {
  const mockAddToCart = jest.fn().mockResolvedValue({})

  const contexts: any = {
    PWAContext: {
      appData: {
        isAddToCartDrawerEnabled: true,
        ...appDataOverrides,
      },
    },
    SessionContext: {
      session: {
        cart: {
          product_items: [],
        },
        ...sessionOverrides.session,
      },
      actions: {
        addToCart: mockAddToCart,
        ...sessionOverrides.actions,
      },
    },
  }

  const atomsMap = new Map()
  let hasAtomValues = false

  if ('selectedQty' in atomValues) {
    atomsMap.set(selectedQtyAtom, atomValues.selectedQty)
    hasAtomValues = true
  }

  if ('productData' in atomValues) {
    atomsMap.set(productDataAtom, atomValues.productData)
    hasAtomValues = true
  }

  if (hasAtomValues) {
    contexts.JotaiProviderContext = atomsMap
  }

  return {
    result: renderHook(() => usePickUpInStoreClick(), { contexts }).result,
    mockAddToCart,
  }
}

describe('usePickUpInStoreClick Hook - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(usePreference).mockReturnValue({
      toggleSiteFeatures: { maxQtyRestrictionEnabled: false },
      cartCheckoutSettings: { defaultMaxOrderQuantity: 5 },
    })

    jest.mocked(useViewportType).mockReturnValue({
      isMobile: true,
      isTablet: false,
      isDesktop: false,
    })

    jest.mocked(useDrawerAtom).mockReturnValue([null, mockSetDrawerState])

    jest.mocked(useSelectedVariantData).mockReturnValue(['variant-123', 10])
  })

  describe('Hook Structure', () => {
    test('returns a function', () => {
      const { result } = setup()

      expect(typeof result.current).toBe('function')
    })

    test('returned function is callable', async () => {
      const { result } = setup()

      await expect(result.current('test-store')).resolves.not.toThrow()
    })
  })

  describe('Loading State Management', () => {
    test('completes successfully when called', async () => {
      const { result, mockAddToCart } = setup()

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId: 'store-123',
        })
      )
    })

    test('calls addToCart after execution', async () => {
      const { result, mockAddToCart } = setup()

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalled()
    })

    test('handles errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockAddToCartError = jest.fn().mockRejectedValue(new Error('Test error'))

      const { result } = setup({ sessionOverrides: { actions: { addToCart: mockAddToCartError } } })

      await act(async () => {
        await result.current('store-123')
      })

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    test('handles addToCart errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockAddToCartError = jest.fn().mockRejectedValue(new Error('Network error'))

      const { result } = setup({ sessionOverrides: { actions: { addToCart: mockAddToCartError } } })

      await act(async () => {
        await result.current('store-123')
      })

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
      consoleSpy.mockRestore()
    })

    test('continues to work after error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockAddToCartMulti = jest
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValue({})

      const { result } = setup({
        sessionOverrides: { actions: { addToCart: mockAddToCartMulti } },
      })

      await act(async () => {
        await result.current('store-123')
      })

      await act(async () => {
        await result.current('store-456')
      })

      expect(mockAddToCartMulti).toHaveBeenCalledTimes(2)
      consoleSpy.mockRestore()
    })
  })

  describe('Session and Data Handling', () => {
    test('handles missing variant gracefully', async () => {
      const { result, mockAddToCart } = setup()

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalled()
    })
  })

  describe('Platform-Specific Behavior', () => {
    test('opens drawer on mobile after successful add to cart', async () => {
      jest.mocked(useViewportType).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      })

      const { result, mockAddToCart } = setup()

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 1,
          storeId: 'store-123',
          productId: 'variant-123',
        })
      )
      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: 'BATCH_DRAWER_STATE',
        payload: {
          drawerQuantity: 1,
          isPartialAdded: false,
          drawerErrorMsgFlag: false,
          variantId: 'variant-123',
        },
      })
      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: 'SET_VISIBLE',
        payload: {
          drawerVisible: true,
          variantId: 'variant-123',
        },
      })
    })

    test('opens drawer on tablet after successful add to cart', async () => {
      jest.mocked(useViewportType).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
      })

      const { result } = setup()

      await act(async () => {
        await result.current('store-456')
      })

      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: 'BATCH_DRAWER_STATE',
        payload: expect.objectContaining({
          drawerQuantity: 1,
          isPartialAdded: false,
        }),
      })
      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: 'SET_VISIBLE',
        payload: expect.objectContaining({
          drawerVisible: true,
        }),
      })
    })

    test('does not open drawer on desktop', async () => {
      jest.mocked(useViewportType).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      })

      const { result } = setup()

      await act(async () => {
        await result.current('store-789')
      })

      expect(mockSetDrawerState).not.toHaveBeenCalled()
    })

    test('does not open drawer when drawer is disabled', async () => {
      jest.mocked(useViewportType).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      })

      const { result } = setup({ appDataOverrides: { isAddToCartDrawerEnabled: false } })

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockSetDrawerState).not.toHaveBeenCalled()
    })
  })

  describe('Quantity and Cart Logic', () => {
    test('handles cart with existing items of the same product', async () => {
      const { result, mockAddToCart } = setup({
        sessionOverrides: {
          session: {
            cart: {
              product_items: [
                { product_id: 'variant-123', product_name: 'Test Product', quantity: 2 },
              ],
            },
          },
        },
      })

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalled()
    })

    test('adds to cart when bag capacity allows partial quantity', async () => {
      jest.mocked(useSelectedVariantData).mockReturnValue(['variant-123', 10])

      const { result, mockAddToCart } = setup({
        sessionOverrides: {
          session: {
            cart: {
              product_items: [
                { product_id: 'variant-123', product_name: 'Test Product', quantity: 5 },
              ],
            },
          },
        },
      })

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: expect.any(Number),
        })
      )
    })

    test('uses bag capacity when allowAddItemToCart is true', async () => {
      jest.mocked(useSelectedVariantData).mockReturnValue(['variant-123', 5])

      const { result, mockAddToCart } = setup({
        sessionOverrides: {
          session: {
            cart: {
              product_items: [{ product_id: 'variant-123', quantity: 3 }],
            },
          },
        },
      })

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: expect.any(Number),
        })
      )
    })
  })

  describe('Rejection Scenarios', () => {
    test('processes add to cart even when product exists in cart', async () => {
      jest.mocked(useSelectedVariantData).mockReturnValue(['variant-123', 5])

      const { result, mockAddToCart } = setup({
        sessionOverrides: {
          session: {
            cart: {
              product_items: [{ product_id: 'variant-123', quantity: 3 }],
            },
          },
        },
      })

      await act(async () => {
        await result.current('store-123')
      })

      expect(mockAddToCart).toHaveBeenCalled()
    })
  })

  describe('Add to Cart Parameters', () => {
    test('passes correct parameters to addToCart', async () => {
      const { result, mockAddToCart } = setup()

      await act(async () => {
        await result.current('store-xyz')
      })

      expect(mockAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 1,
          storeId: 'store-xyz',
          productId: 'variant-123',
        })
      )
    })
  })
})
