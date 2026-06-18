import { renderHook, act, CustomRenderOptions } from 'test-utils/react'
import useAddToCart, { UseAddToCartProps } from 'toro/hooks/useAddToCart'
import { NormalizedAccessorizeItProduct } from 'toro/types/productTypes'
import { fetchFullProductsDataFromClient } from 'toro/helpers/fetchProductDataFromClient'
import { getProductFromCart } from 'toro/helpers/session'
import { isItemMaxQuantityReached } from 'toro/helpers/isItemMaxQuantityReached'
import { fetchColorSizes } from 'toro/helpers/plp'
import { sendStaffStartTrackReq } from 'toro/helpers/staffStartHelper'
import { useDrawerAtom, ATB_DRAWER_ACTIONS } from 'toro/hooks/useDrawerAtom'
import useToast from 'toro/hooks/useToast'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { Atom, useAtom } from 'jotai'
import {
  miniCartOpenReasonAtom,
  productsWithMaxSizeATBAtom,
  productsWithDisabledATBAtom,
  sizeDrawerMobileAtom,
} from 'store/global.atom'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import { addToBagSizesAtom, sizeDrawerVgIdAtom } from 'store/plp.atom'
import { lastAddedProductToBagVariantIdAtom } from 'store/pdp.atom'
import { isStaffStartScriptAtom } from 'store/scripts.atom'

const mockFetchFullProductsDataFromClient = jest.mocked(fetchFullProductsDataFromClient)
const mockGetProductFromCart = jest.mocked(getProductFromCart)
const mockIsItemMaxQuantityReached = jest.mocked(isItemMaxQuantityReached)
const mockFetchColorSizes = jest.mocked(fetchColorSizes)
const mockSendStaffStartTrackReq = jest.mocked(sendStaffStartTrackReq)
const mockUseDrawerAtom = jest.mocked(useDrawerAtom)
const mockUseToast = jest.mocked(useToast)
const mockUseAnalytics = jest.mocked(useAnalytics)
const mockUseUpdateAtom = jest.mocked(useUpdateAtom)
const mockUseAtomValue = jest.mocked(useAtomValue)
const mockUseAtom = jest.mocked(useAtom)

const mockAddToCart = jest.fn().mockResolvedValue({})
const mockUpdateCart = jest.fn().mockResolvedValue({})
const mockSetDrawerState = jest.fn()
const mockToast = jest.fn()
const mockAnalyticsSend = jest.fn()
const mockSetFullscreenLoading = jest.fn()
const mockSetMiniCartOpenReason = jest.fn()
const mockSetAddToBagSizes = jest.fn()
const mockSetSizeDrawerVgId = jest.fn()
const mockSetSizeDrawerMobile = jest.fn()
const mockSetLastAddedProductToBagVariantId = jest.fn()

jest.mock('toro/helpers/fetchProductDataFromClient', () => ({
  fetchFullProductsDataFromClient: jest.fn(),
}))
jest.mock('toro/helpers/session', () => ({
  getProductFromCart: jest.fn(),
}))
jest.mock('toro/helpers/isItemMaxQuantityReached', () => ({
  isItemMaxQuantityReached: jest.fn(),
}))
jest.mock('toro/helpers/plp', () => ({
  fetchColorSizes: jest.fn(),
}))
jest.mock('toro/helpers/staffStartHelper', () => ({
  sendStaffStartTrackReq: jest.fn(),
}))
jest.mock('toro/hooks/usePreference_new', () => () => ({
  toggleSiteFeatures: { enableMaxQtyRestriction: true },
  cartCheckoutSettings: { defaultMaxOrderQuantity: 5 },
  staffStartPreferences: { merchantId: 'merchant-123' },
}))
jest.mock('toro/hooks/useDrawerAtom', () => ({
  useDrawerAtom: jest.fn(),
  ATB_DRAWER_ACTIONS: {
    BATCH_DRAWER_STATE: 'BATCH_DRAWER_STATE',
    SET_VISIBLE: 'SET_VISIBLE',
  },
}))
jest.mock('toro/hooks/useToast', () => jest.fn())
jest.mock('toro/analytics/useAnalytics', () => jest.fn())
jest.mock('toro/hooks/useExperiment')

jest.mock('jotai/utils', () => {
  const actual = jest.requireActual('jotai/utils')
  return {
    ...actual,
    useUpdateAtom: jest.fn(),
    useAtomValue: jest.fn(),
  }
})

const mockSetProductsWithDisabledATB = jest.fn()
const mockSetProductsWithMaxSizeATB = jest.fn()

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')
  return {
    ...actual,
    useAtom: jest.fn(),
  }
})

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({ locale: 'en' })
  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

const TEST_VARIANT_ID = 'variant-123'
const TEST_VARIANT_GROUP_ID = 'vg-123'

const createMockProduct = (overrides = {}) => ({
  id: TEST_VARIANT_ID,
  name: 'Test Product',
  inventory: { ats: 10 },
  ...overrides,
})

const createMockSession = (productItems: Array<Record<string, unknown>> = []) => ({
  initialized: true,
  cart: {
    product_items: productItems,
  },
})

const createMockCartItem = (overrides = {}) => ({
  product_id: TEST_VARIANT_ID,
  quantity: 1,
  item_id: 'item-123',
  ...overrides,
})

const createMockAccessory = (overrides = {}) =>
  ({
    id: 'accessory-123',
    buyableVariantId: 'accessory-sku',
    productDataForGA: { name: 'Accessory Product' },
    inventory: { ats: 10 },
    priceFormatted: '$50.00',
    imageURL: 'https://example.com/accessory.jpg',
    ...overrides,
  } as unknown as NormalizedAccessorizeItProduct)

const createAtomValues = (
  overrides: {
    productsWithDisabledATB?: string[]
    productsWithMaxSizeATB?: string[]
  } = {}
): Map<Atom<unknown>, unknown> => {
  const entries: [Atom<unknown>, unknown][] = [
    [productsWithDisabledATBAtom as Atom<unknown>, overrides.productsWithDisabledATB ?? []],
    [productsWithMaxSizeATBAtom as Atom<unknown>, overrides.productsWithMaxSizeATB ?? []],
  ]
  return new Map(entries)
}

const setupMocks = () => {
  mockUseDrawerAtom.mockReturnValue([
    {
      drawerVisible: false,
      drawerQuantity: 0,
      variantId: '',
      isPartialAdded: false,
      drawerErrorMsgFlag: false,
    },
    mockSetDrawerState,
  ])

  mockUseToast.mockReturnValue(mockToast)

  mockUseAnalytics.mockReturnValue({ send: mockAnalyticsSend })

  mockUseAtomValue.mockImplementation((atom) => {
    if (atom === isStaffStartScriptAtom) return false
    return undefined
  })

  mockUseUpdateAtom.mockImplementation((atom) => {
    if (atom === setFullscreenLoadingAtom) return mockSetFullscreenLoading
    if (atom === miniCartOpenReasonAtom) return mockSetMiniCartOpenReason
    if (atom === addToBagSizesAtom) return mockSetAddToBagSizes
    if (atom === sizeDrawerVgIdAtom) return mockSetSizeDrawerVgId
    if (atom === sizeDrawerMobileAtom) return mockSetSizeDrawerMobile
    if (atom === lastAddedProductToBagVariantIdAtom) return mockSetLastAddedProductToBagVariantId
    return jest.fn()
  })

  mockUseAtom.mockImplementation(((atom: unknown) => {
    if (atom === productsWithDisabledATBAtom) return [[], mockSetProductsWithDisabledATB]
    if (atom === productsWithMaxSizeATBAtom) return [[], mockSetProductsWithMaxSizeATB]
    return [null, jest.fn()]
  }) as typeof mockUseAtom)

  mockGetProductFromCart.mockReturnValue(null)
  mockIsItemMaxQuantityReached.mockReturnValue(false)
  mockFetchFullProductsDataFromClient.mockResolvedValue([createMockProduct()])
  mockFetchColorSizes.mockResolvedValue([])
}

interface SetupOptions {
  hookProps?: Partial<UseAddToCartProps>
  sessionOverrides?: {
    session?: ReturnType<typeof createMockSession> | null
    actions?: { addToCart?: jest.Mock; updateCart?: jest.Mock } | null
  }
  viewportOverrides?: {
    isDesktop?: boolean
    isMobile?: boolean
    viewport?: 'desktop' | 'mobile' | 'tablet'
  }
  appDataOverrides?: Record<string, unknown>
  atomOverrides?: Parameters<typeof createAtomValues>[0]
}

const setup = (options: SetupOptions = {}) => {
  const {
    hookProps = {},
    sessionOverrides = {},
    viewportOverrides = {},
    appDataOverrides = {},
    atomOverrides = {},
  } = options

  const defaultHookProps: UseAddToCartProps = {
    variantId: TEST_VARIANT_ID,
    variantGroupId: TEST_VARIANT_GROUP_ID,
    ...hookProps,
  }

  const defaultViewport = {
    isDesktop: true,
    isMobile: false,
    viewport: 'desktop' as const,
    ...viewportOverrides,
  }

  const contexts: CustomRenderOptions['contexts'] = {
    PWAContext: {
      appData: {
        defaultLocale: 'en-US',
        locale: 'en-US',
        ...appDataOverrides,
      },
    },
    ViewportContext: defaultViewport,
    SessionContext:
      sessionOverrides.actions === null
        ? { session: null, actions: null }
        : {
            session: sessionOverrides.session ?? createMockSession(),
            actions: {
              addToCart: sessionOverrides.actions?.addToCart ?? mockAddToCart,
              updateCart: sessionOverrides.actions?.updateCart ?? mockUpdateCart,
            },
          },
    JotaiProviderContext: createAtomValues(atomOverrides),
  }

  return {
    ...renderHook(() => useAddToCart(defaultHookProps), { contexts }),
    mockAddToCart: sessionOverrides.actions?.addToCart ?? mockAddToCart,
    mockUpdateCart: sessionOverrides.actions?.updateCart ?? mockUpdateCart,
  }
}

describe('useAddToCart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
    setupMocks()
  })

  describe('Hook Initialization', () => {
    it('returns expected initial state', () => {
      const { result } = setup()

      expect(result.current.isError).toBe(false)
      expect(result.current.isDisabled).toBe(false)
      expect(result.current.isMaxQuantityReached).toBe(false)
      expect(result.current.errorMessage).toBe('')
      expect(result.current.showSizesSelectionDesktop).toBe(false)
    })

    it('returns addToCart and addToCartVariant functions', () => {
      const { result } = setup()

      expect(typeof result.current.addToCart).toBe('function')
      expect(typeof result.current.addToCartVariant).toBe('function')
      expect(typeof result.current.onCloseSizeDrawer).toBe('function')
    })

    it('returns early when session actions are not available', async () => {
      const { result } = setup({
        sessionOverrides: { session: null, actions: null },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(mockFetchFullProductsDataFromClient).not.toHaveBeenCalled()
      expect(mockAddToCart).not.toHaveBeenCalled()
    })

    it('onCloseSizeDrawer sets showSizesSelectionDesktop to false', async () => {
      mockFetchColorSizes.mockResolvedValue([
        { value: 'S', name: 'Small', orderable: true, variantId: 'variant-s' },
      ])

      const { result } = setup({
        hookProps: { isSizedProduct: true, variantGroupId: TEST_VARIANT_GROUP_ID },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(result.current.showSizesSelectionDesktop).toBe(true)

      act(() => {
        result.current.onCloseSizeDrawer()
      })

      expect(result.current.showSizesSelectionDesktop).toBe(false)
    })
  })

  describe('Product Availability Validation', () => {
    it('shows error toast on mobile when product is out of stock', async () => {
      const outOfStockProduct = createMockProduct({ inventory: { ats: 0 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([outOfStockProduct])

      const { result } = setup({
        viewportOverrides: { isDesktop: false, isMobile: true, viewport: 'mobile' },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        })
      )
      expect(mockAddToCart).not.toHaveBeenCalled()
    })

    it('blocks add to cart when inventory is exhausted in cart', async () => {
      const productWithLowInventory = createMockProduct({ inventory: { ats: 2 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([productWithLowInventory])
      mockGetProductFromCart.mockReturnValue(createMockCartItem({ quantity: 2 }))

      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(result.current.isError).toBe(true)
      expect(mockAddToCart).not.toHaveBeenCalled()
    })

    it('blocks add to cart when max quantity restriction is reached', async () => {
      mockIsItemMaxQuantityReached.mockReturnValue(true)
      mockGetProductFromCart.mockReturnValue(createMockCartItem({ quantity: 5 }))

      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(result.current.isError).toBe(true)
      expect(mockAddToCart).not.toHaveBeenCalled()
    })

    it('sends siteError analytics on validation failure', async () => {
      const outOfStockProduct = createMockProduct({ inventory: { ats: 0 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([outOfStockProduct])

      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'siteError',
        expect.objectContaining({
          eventAction: 'quick add to bag',
        })
      )
    })

    it('tracks disabled products in global atom for unsized products', async () => {
      const outOfStockProduct = createMockProduct({ inventory: { ats: 0 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([outOfStockProduct])

      const { result } = setup({ hookProps: { isSizedProduct: false } })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockSetProductsWithDisabledATB).toHaveBeenCalledWith(
        expect.arrayContaining([TEST_VARIANT_ID])
      )
    })
  })

  describe('Add to Cart Flow', () => {
    it('adds new item when product is not in cart', async () => {
      mockGetProductFromCart.mockReturnValue(null)

      const { result, mockAddToCart: addToCartMock } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(addToCartMock).toHaveBeenCalledWith({
        product: { id: TEST_VARIANT_ID },
        productId: TEST_VARIANT_ID,
        quantity: 1,
      })
    })

    it('updates quantity when product already exists in cart', async () => {
      mockGetProductFromCart.mockReturnValue(createMockCartItem({ quantity: 2 }))

      const { result, mockUpdateCart: updateCartMock } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(updateCartMock).toHaveBeenCalledWith({
        product: { id: TEST_VARIANT_ID },
        productId: TEST_VARIANT_ID,
        quantity: 3,
        itemId: 'item-123',
      })
    })

    it('executes complete add to cart flow with all side effects', async () => {
      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      // fetches full product data before validation
      expect(mockFetchFullProductsDataFromClient).toHaveBeenCalledWith(
        [TEST_VARIANT_ID],
        expect.objectContaining({
          includeInventory: true,
          withMaster: false,
          locale: 'en-US',
        })
      )

      // closes drawer before starting add to cart operation
      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: ATB_DRAWER_ACTIONS.SET_VISIBLE,
        payload: { drawerVisible: false },
      })

      // opens drawer after successful add to cart
      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
        payload: {
          drawerVisible: true,
          drawerQuantity: 1,
          variantId: TEST_VARIANT_ID,
        },
      })

      // sets last added product variant id after successful add
      expect(mockSetLastAddedProductToBagVariantId).toHaveBeenCalledWith(TEST_VARIANT_ID)

      // sends addToCart analytics event on successful add
      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'addToCart',
        expect.objectContaining({
          product: expect.objectContaining({
            is_quick_add: '1',
          }),
        })
      )

      // sets mini cart open reason to AddToBag after successful add
      expect(mockSetMiniCartOpenReason).toHaveBeenCalledWith('addToBag')

      // closes mobile size drawer before opening post-ATB drawer
      expect(mockSetSizeDrawerMobile).toHaveBeenCalledWith(false)
    })
  })

  describe('Max Quantity Restriction', () => {
    it('tracks max quantity reached products on desktop', async () => {
      mockIsItemMaxQuantityReached.mockReturnValue(true)
      mockGetProductFromCart.mockReturnValue(createMockCartItem({ quantity: 5 }))

      const { result } = setup({
        hookProps: { isSizedProduct: false },
        viewportOverrides: { isDesktop: true, isMobile: false, viewport: 'desktop' },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockSetProductsWithMaxSizeATB).toHaveBeenCalledWith(
        expect.arrayContaining([TEST_VARIANT_ID])
      )
    })

    it('shows toast on mobile when max quantity reached', async () => {
      mockIsItemMaxQuantityReached.mockReturnValue(true)
      mockGetProductFromCart.mockReturnValue(createMockCartItem({ quantity: 5 }))

      const { result } = setup({
        viewportOverrides: { isDesktop: false, isMobile: true, viewport: 'mobile' },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        })
      )
    })
  })

  describe('Sized Product Flow', () => {
    it('opens size drawer on desktop for sized products', async () => {
      mockFetchColorSizes.mockResolvedValue([
        { value: 'S', name: 'Small', orderable: true, variantId: 'variant-s' },
      ])

      const { result } = setup({
        hookProps: { isSizedProduct: true, variantGroupId: TEST_VARIANT_GROUP_ID },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(mockFetchColorSizes).toHaveBeenCalledWith(TEST_VARIANT_GROUP_ID)
      expect(result.current.showSizesSelectionDesktop).toBe(true)
    })

    it('opens size drawer on mobile for sized products', async () => {
      mockFetchColorSizes.mockResolvedValue([
        { value: 'S', name: 'Small', orderable: true, variantId: 'variant-s' },
      ])

      const { result } = setup({
        hookProps: { isSizedProduct: true, variantGroupId: TEST_VARIANT_GROUP_ID },
        viewportOverrides: { isDesktop: false, isMobile: true, viewport: 'mobile' },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(mockFetchColorSizes).toHaveBeenCalledWith(TEST_VARIANT_GROUP_ID)
      expect(mockSetSizeDrawerMobile).toHaveBeenCalledWith(true)
    })

    it('calls onSizedProductClick callback when provided', async () => {
      const mockOnSizedProductClick = jest.fn()
      mockFetchColorSizes.mockResolvedValue([
        { value: 'S', name: 'Small', orderable: true, variantId: 'variant-s' },
      ])

      const { result } = setup({
        hookProps: {
          isSizedProduct: true,
          variantGroupId: TEST_VARIANT_GROUP_ID,
          onSizedProductClick: mockOnSizedProductClick,
        },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(mockOnSizedProductClick).toHaveBeenCalled()
    })

    it('does not call addToCartVariant directly for sized products', async () => {
      mockFetchColorSizes.mockResolvedValue([
        { value: 'S', name: 'Small', orderable: true, variantId: 'variant-s' },
      ])

      const { result, mockAddToCart: addToCartMock } = setup({
        hookProps: { isSizedProduct: true, variantGroupId: TEST_VARIANT_GROUP_ID },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(addToCartMock).not.toHaveBeenCalled()
    })

    it('does not open size drawer when fetchColorSizes returns empty array', async () => {
      mockFetchColorSizes.mockResolvedValue([])

      const { result } = setup({
        hookProps: { isSizedProduct: true, variantGroupId: TEST_VARIANT_GROUP_ID },
      })

      await act(async () => {
        await result.current.addToCart()
      })

      expect(mockFetchColorSizes).toHaveBeenCalledWith(TEST_VARIANT_GROUP_ID)
      expect(result.current.showSizesSelectionDesktop).toBe(false)
      expect(mockSetSizeDrawerMobile).not.toHaveBeenCalled()
    })
  })

  describe('Accessorize It Bundle Products', () => {
    it('validates both main product and accessory availability', async () => {
      const mockAccessory = createMockAccessory()
      mockGetProductFromCart.mockReturnValue(null)

      const { result } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: mockAccessory,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockGetProductFromCart).toHaveBeenCalledTimes(2)
    })

    it('shows error when accessory is not selected for bundle', async () => {
      const { result } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: null,
        },
        viewportOverrides: { isDesktop: false, isMobile: true, viewport: 'mobile' },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        })
      )
      expect(mockAddToCart).not.toHaveBeenCalled()
    })

    it('adds accessory to cart before main product', async () => {
      const mockAccessory = createMockAccessory()
      const callOrder: string[] = []
      mockGetProductFromCart.mockReturnValue(null)

      const trackingAddToCart = jest.fn().mockImplementation(({ productId }) => {
        callOrder.push(productId)
        return Promise.resolve({})
      })

      const { result } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: mockAccessory,
        },
        sessionOverrides: {
          actions: { addToCart: trackingAddToCart, updateCart: mockUpdateCart },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(callOrder).toEqual(['accessory-sku', TEST_VARIANT_ID])
    })

    it('sends bundled analytics event with both products', async () => {
      const mockAccessory = createMockAccessory()
      mockGetProductFromCart.mockReturnValue(null)

      const { result } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: mockAccessory,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'addToCart',
        expect.objectContaining({
          product: expect.objectContaining({
            isBundleProductItems: true,
            bundleData: expect.arrayContaining([
              expect.objectContaining({ id: TEST_VARIANT_ID }),
              expect.objectContaining({ name: 'Accessory Product' }),
            ]),
          }),
        })
      )
    })

    it('updates accessory quantity when already in cart', async () => {
      const mockAccessory = createMockAccessory()
      mockGetProductFromCart.mockImplementation((productId) => {
        if (productId === 'accessory-sku') {
          return createMockCartItem({
            product_id: 'accessory-sku',
            quantity: 1,
            item_id: 'accessory-item',
          })
        }
        return null
      })

      const { result, mockUpdateCart: updateCartMock } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: mockAccessory,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(updateCartMock).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'accessory-sku',
          quantity: 2,
          itemId: 'accessory-item',
        })
      )
    })

    it('opens drawer with quantity 2 for bundle products', async () => {
      const mockAccessory = createMockAccessory()
      mockGetProductFromCart.mockReturnValue(null)

      const { result } = setup({
        hookProps: {
          isAccessorizeItBundleProduct: true,
          accessorizeItSelectedProduct: mockAccessory,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockSetDrawerState).toHaveBeenCalledWith({
        type: ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE,
        payload: expect.objectContaining({
          drawerQuantity: 2,
        }),
      })
    })
  })

  describe('Error Handling', () => {
    it('handles addToCart API errors gracefully', async () => {
      const failingAddToCart = jest.fn().mockRejectedValue(new Error('Network error'))

      const { result } = setup({
        sessionOverrides: {
          actions: { addToCart: failingAddToCart, updateCart: mockUpdateCart },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(result.current.isError).toBe(true)
    })

    it('shows toast on error when showToastAlways is true', async () => {
      const failingAddToCart = jest.fn().mockRejectedValue(new Error('Network error'))

      const { result } = setup({
        hookProps: { showToastAlways: true },
        sessionOverrides: {
          actions: { addToCart: failingAddToCart, updateCart: mockUpdateCart },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
        })
      )
    })

    it('calls onAddToCartError callback on failure', async () => {
      const mockOnAddToCartError = jest.fn()
      const failingAddToCart = jest.fn().mockRejectedValue(new Error('Network error'))

      const { result } = setup({
        hookProps: { onAddToCartError: mockOnAddToCartError },
        sessionOverrides: {
          actions: { addToCart: failingAddToCart, updateCart: mockUpdateCart },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockOnAddToCartError).toHaveBeenCalled()
    })

    it('calls onAddToCartSuccess callback on successful add', async () => {
      const mockOnAddToCartSuccess = jest.fn()

      const { result } = setup({
        hookProps: { onAddToCartSuccess: mockOnAddToCartSuccess },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockOnAddToCartSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: TEST_VARIANT_ID })
      )
    })
  })

  describe('Staff Start Integration', () => {
    it('sends staff start tracking request when script is loaded', async () => {
      mockUseAtomValue.mockImplementation((atom) => {
        if (atom === isStaffStartScriptAtom) return true
        return undefined
      })

      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockSendStaffStartTrackReq).toHaveBeenCalledWith({
        merchantId: 'merchant-123',
        selectedQty: 1,
        productId: TEST_VARIANT_ID,
      })
    })

    it('does not send staff start request when script is not loaded', async () => {
      mockUseAtomValue.mockImplementation((atom) => {
        if (atom === isStaffStartScriptAtom) return false
        return undefined
      })

      const { result } = setup()

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockSendStaffStartTrackReq).not.toHaveBeenCalled()
    })
  })

  describe('Analytics Integration', () => {
    it('sends selectItem event when recAIType is provided', async () => {
      const { result } = setup({
        hookProps: {
          analyticsData: {
            recAIType: 'certona',
            experienceId: 'exp-123',
            containerLabel: 'Recommendations',
          },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'selectItem',
        expect.objectContaining({
          product: expect.objectContaining({
            extendAnalyticsData: expect.objectContaining({
              item_list_name: 'Recommendations',
              scheme_exp_id: 'exp-123',
            }),
          }),
        })
      )
    })

    it('sends selectItem first when sendSelectItemFirst flag is true', async () => {
      const callOrder: string[] = []
      mockAnalyticsSend.mockImplementation((event) => {
        callOrder.push(event)
        return Promise.resolve()
      })

      const { result } = setup({
        hookProps: {
          analyticsData: {
            sendSelectItemFirst: true,
            eventLocation: 'pdp',
            recAIType: 'certona',
          },
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(callOrder).toContain('selectItem')
      expect(callOrder).toContain('addToCart')
    })
  })

  describe('State Reset on Variant Change', () => {
    it('clears error state when variantId changes', async () => {
      const contexts: CustomRenderOptions['contexts'] = {
        PWAContext: {
          appData: {
            defaultLocale: 'en-US',
            locale: 'en-US',
          },
        },
        ViewportContext: {
          isDesktop: true,
          isMobile: false,
          viewport: 'desktop',
        },
        SessionContext: {
          session: createMockSession(),
          actions: {
            addToCart: mockAddToCart,
            updateCart: mockUpdateCart,
          },
        },
        JotaiProviderContext: createAtomValues(),
      }

      const { result, rerender } = renderHook(
        ({ variantId }) => useAddToCart({ variantId, variantGroupId: TEST_VARIANT_GROUP_ID }),
        {
          contexts,
          initialProps: { variantId: TEST_VARIANT_ID },
        }
      )

      const outOfStockProduct = createMockProduct({ inventory: { ats: 0 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([outOfStockProduct])

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(result.current.isError).toBe(true)

      mockFetchFullProductsDataFromClient.mockResolvedValue([createMockProduct()])

      rerender({ variantId: 'variant-456' })

      expect(result.current.isError).toBe(false)
    })
  })

  describe('Standalone Accessory Products', () => {
    it('validates availability for standalone accessory', async () => {
      const { result } = setup({
        hookProps: {
          isStandaloneAccessory: true,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockFetchFullProductsDataFromClient).toHaveBeenCalled()
    })

    it('uses accessorize it event action for standalone accessory', async () => {
      const outOfStockProduct = createMockProduct({ inventory: { ats: 0 } })
      mockFetchFullProductsDataFromClient.mockResolvedValue([outOfStockProduct])

      const { result } = setup({
        hookProps: {
          isStandaloneAccessory: true,
        },
      })

      await act(async () => {
        await result.current.addToCartVariant(TEST_VARIANT_ID)
      })

      expect(mockAnalyticsSend).toHaveBeenCalledWith(
        'siteError',
        expect.objectContaining({
          eventAction: 'accessorize it atb click',
        })
      )
    })
  })
})
