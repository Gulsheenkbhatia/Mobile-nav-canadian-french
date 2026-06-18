import { renderHook, act } from 'test-utils/react'
import useAddItemToCart from 'toro/hooks/useAddToCartDesktopMobile'
import { useAtomValue, useResetAtom, useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import SessionContext from 'toro/components/SessionContext'
import usePreference from 'toro/hooks/usePreference_new'
import { miniCartOpenReasonAtom } from 'store/global.atom'
import useProductData from 'toro/hooks/useProductData'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import {
  lastAddedProductToBagAtom,
  lastAddedProductToBagVariantIdAtom,
  maxQuantityErrorAtom,
  setMaxQuantityErrorAtom,
  selectedQtyAtom,
  submittableVariantIdAtom,
  selectedSizeAtom,
  isSizedProductAtom,
  orderingErrorAtom,
  addingToBagErrorAtom,
  gaProductDataAtom,
  isMegaPDPEligibleAtom,
  isStickyBarScrolledAtom,
  addToBagButtonRefAtom,
} from 'store/pdp.atom'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import { selectedVariantInventoryAtom } from 'store/inventory.atom'
import { ORDERING_ERROR } from 'toro/helpers/productVariations'
import useAnalytics from 'toro/analytics/useAnalytics'
import {
  getAddToCartEvents,
  getNotSelectedErrorEvents,
  getQuantityNotAvailableErrorEvents,
  getAtcRequestErrorEvents,
} from 'toro/helpers/pdpGaEvents'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
import { useDrawerAtom } from 'toro/hooks/useDrawerAtom'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useToroEventDispatch')
jest.mock('jotai/utils')
jest.mock('toro/hooks/useCertonaRequest')
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
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useSelectedColorData')
jest.mock('toro/hooks/useSelectedVariantData')
jest.mock('toro/hooks/useProductData')
jest.mock('toro/components/header/MiniCart/useLoadMiniCartPopover')
jest.mock('toro/helpers/pdpGaEvents')
jest.mock('toro/hooks/useDrawerAtom')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/useExperiment')

const mockSession = {
  initialized: true,
  cart: {
    product_items: [],
  },
}

const mockSessionActions = {
  addToCart: jest.fn(),
  updateCart: jest.fn(),
}

const mockDispatchToroEvent = jest.fn()
const mockSetFullscreenLoading = jest.fn()
const mockSetMiniCartOpenReason = jest.fn()
const mockSetLastAddedProductToBagAtom = jest.fn()
const mockSetLastAddedProductToBagVariantIdAtom = jest.fn()
const mockLoadMiniCartPopover = jest.fn()
const mockSetMaxQuantityError = jest.fn()
const mockSetOrderingError = jest.fn()
const mockSetAddingToBagError = jest.fn()
const mockSendAnalytics = jest.fn()
const mockSetAtbButtonRef = jest.fn()
const mockResetVisitedPagesCount = jest.fn()
const mockMakeCertonaRequest = jest.fn()
const mockSetDrawerState = jest.fn()

const mockedUseToroEventDispatch = useToroEventsDispatch as jest.MockedFn<
  typeof useToroEventsDispatch
>
const mockedUseUpdateAtom = useUpdateAtom as jest.MockedFn<typeof useUpdateAtom>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUseCertonaRequest = useCertonaRequest as jest.MockedFn<typeof useCertonaRequest>
const mockedUseResetAtom = useResetAtom as jest.MockedFn<typeof useResetAtom>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseSelectedColorData = useSelectedColorData as jest.MockedFn<
  typeof useSelectedColorData
>
const mockedUseSelectedVariantData = useSelectedVariantData as jest.MockedFn<
  typeof useSelectedVariantData
>
const mockedUseProductData = useProductData as jest.MockedFn<typeof useProductData>
const mockedUseLoadMiniCartPopover = useLoadMiniCartPopover as jest.MockedFn<
  typeof useLoadMiniCartPopover
>
const mockedGetAddToCartEvents = getAddToCartEvents as jest.MockedFn<typeof getAddToCartEvents>
const mockedGetNotSelectedErrorEvents = getNotSelectedErrorEvents as jest.Mock
const mockedGetQuantityNotAvailableErrorEvents = getQuantityNotAvailableErrorEvents as jest.Mock
const mockedGetAtcRequestErrorEvents = getAtcRequestErrorEvents as jest.Mock
const mockedUseDrawerAtom = useDrawerAtom as jest.MockedFn<typeof useDrawerAtom>
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>

const mockAddToCartEvents = [['add_to_cart', { eventData: 'add' }]]
const mockNotSelectedErrorEvents = [['error', { eventData: 'not_selected' }]]
const mockQuantityErrorEvents = [['error', { eventData: 'quantity' }]]
const mockAtcErrorEvents = [['error', { eventData: 'atc_failed' }]]

const defaultProps = {
  isBuyNow: false,
}
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionContext.Provider value={{ actions: mockSessionActions, session: mockSession }}>
    {children}
  </SessionContext.Provider>
)
const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return renderHook(() => useAddItemToCart(combinedProps), { wrapper })
}

describe('useAddItemToCart', () => {
  beforeEach(() => {
    // Reset session state
    mockSession.cart.product_items = []
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case submittableVariantIdAtom:
          return 'variant123'
        case selectedVariantInventoryAtom:
          return { ats: 10 }
        case selectedQtyAtom:
          return 1
        case xgenFeaturesAtom:
          return { recommendations: false }
        case maxQuantityErrorAtom:
          return 1
        case isSizedProductAtom:
          return true
        case gaProductDataAtom:
          return { name: 'Test Product' }
        case isMegaPDPEligibleAtom:
          return true
        case isStickyBarScrolledAtom:
          return false
        case selectedSizeAtom:
          return false
        default:
          return undefined
      }
    })
    mockedUseUpdateAtom.mockImplementation((atom) => {
      switch (atom) {
        case orderingErrorAtom:
          return mockSetOrderingError
        case miniCartOpenReasonAtom:
          return mockSetMiniCartOpenReason
        case setFullscreenLoadingAtom:
          return mockSetFullscreenLoading
        case lastAddedProductToBagAtom:
          return mockSetLastAddedProductToBagAtom
        case lastAddedProductToBagVariantIdAtom:
          return mockSetLastAddedProductToBagVariantIdAtom
        case setMaxQuantityErrorAtom:
          return mockSetMaxQuantityError
        case addingToBagErrorAtom:
          return mockSetAddingToBagError
        case addToBagButtonRefAtom:
          return mockSetAtbButtonRef
        default:
          return undefined
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      giftWrapping: { enableGiftWrappingAndMsg: true },
      toggleSiteFeatures: { enableMaxQtyRestriction: true, hideQuantityDropdown: false },
      cartCheckoutSettings: { defaultMaxOrderQuantity: 5 },
    }))
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseResetAtom.mockReturnValue(mockResetVisitedPagesCount)
    mockedUseToroEventDispatch.mockReturnValue(mockDispatchToroEvent)
    mockedUseSelectedColorData.mockReturnValue([false, false, 'color123', 'front'])
    mockedUseSelectedVariantData.mockReturnValue(5)
    mockedUseProductData.mockReturnValue(['prod123', 'red', {}, 'master123'])
    mockedUseCertonaRequest.mockReturnValue(mockMakeCertonaRequest)
    mockedUseLoadMiniCartPopover.mockReturnValue(mockLoadMiniCartPopover)
    mockedGetAddToCartEvents.mockReturnValue(mockAddToCartEvents)
    mockedGetNotSelectedErrorEvents.mockReturnValue(mockNotSelectedErrorEvents)
    mockedGetQuantityNotAvailableErrorEvents.mockReturnValue(mockQuantityErrorEvents)
    mockedGetAtcRequestErrorEvents.mockReturnValue(mockAtcErrorEvents)
    mockedUseDrawerAtom.mockReturnValue([
      {
        drawerVisible: false,
        drawerQuantity: 0,
        isPartialAdded: false,
        drawerErrorMsgFlag: false,
        variantId: '',
      },
      mockSetDrawerState,
    ])
    mockedUseViewportType.mockReturnValue({ isMobile: false, isDesktop: true, viewport: 'desktop' })
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should render the hook without crashing and returns correct initial values', () => {
    const { result } = makeSetup()
    expect(result.current.isQuantitySelectorDisabled).toBe(false)
    expect(result.current.isDisabled).toBe(1)
    expect(result.current.enableMaxQtyRestriction).toBe(true)
    expect(result.current.defaultMaxOrderQuantity).toBe(5)
    expect(result.current.maxQty).toBe(5)
  })

  it('should render the hook without crashing and adds new item to cart successfully', async () => {
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockResetVisitedPagesCount).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(true) // Desktop shows fullscreen loading
    expect(mockMakeCertonaRequest).toHaveBeenCalled()
    expect(mockSetLastAddedProductToBagAtom).toHaveBeenCalled()
    expect(mockDispatchToroEvent).toHaveBeenCalledWith({ type: 'on-add-to-cart' })
    expect(mockLoadMiniCartPopover).toHaveBeenCalled()
    expect(mockSessionActions.addToCart).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false)
    expect(mockSetDrawerState).toHaveBeenCalledWith({
      type: 'BATCH_DRAWER_STATE',
      payload: {
        drawerVisible: true,
        drawerQuantity: 1,
        variantId: 'variant123',
      },
    })
  })

  it('should handle API errors gracefully', async () => {
    mockSessionActions.addToCart.mockRejectedValue(new Error('API error'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetAddingToBagError).toHaveBeenCalledWith('Something went wrong, please try again')
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false) // Desktop shows fullscreen loading
    expect(mockSendAnalytics).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('should handle mobile viewport correctly - no fullscreen loading management', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true, isDesktop: false, viewport: 'mobile' })
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockResetVisitedPagesCount).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).not.toHaveBeenCalledWith(true) // Mobile doesn't show fullscreen loading
    expect(mockMakeCertonaRequest).toHaveBeenCalled()
    expect(mockSetLastAddedProductToBagAtom).toHaveBeenCalled()
    expect(mockDispatchToroEvent).toHaveBeenCalledWith({ type: 'on-add-to-cart' })
    expect(mockLoadMiniCartPopover).toHaveBeenCalled()
    expect(mockSessionActions.addToCart).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).not.toHaveBeenCalledWith(false) // Mobile doesn't manage fullscreen loading
  })

  it('should handle mobile API errors gracefully - no fullscreen loading management', async () => {
    mockedUseViewportType.mockReturnValue({ isMobile: true, isDesktop: false, viewport: 'mobile' })
    mockSessionActions.addToCart.mockRejectedValue(new Error('API error'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetAddingToBagError).toHaveBeenCalledWith('Something went wrong, please try again')
    expect(mockSetFullscreenLoading).not.toHaveBeenCalledWith(false) // Mobile doesn't manage fullscreen loading
    expect(mockSendAnalytics).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('should render the hook properly and updates the existing item in cart', async () => {
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 1,
        item_id: 'item123',
      },
    ]
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSessionActions.updateCart).toHaveBeenCalledWith({
      product: { id: 'variant123' },
      quantity: 2,
      itemId: 'item123',
      productId: 'variant123',
    })
  })

  it('should render the hook properly and handles max quantity error correctly', async () => {
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 5,
      },
    ]
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(true)
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false) // Desktop manages fullscreen loading
  })

  it('should handle customized products properly', async () => {
    mockedUseSelectedColorData.mockReturnValue([true, false, 'custom123', 'front'])
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSessionActions.addToCart).toHaveBeenCalledWith({
      id: 'custom123',
      location: 'front',
    })
  })

  it('should handle the scenario when no variant is selected (sized product without size)', async () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === submittableVariantIdAtom) return null
      if (atom === selectedSizeAtom) return null
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetOrderingError).toHaveBeenCalledWith(ORDERING_ERROR.notSelected)
    expect(mockSendAnalytics).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false) // Desktop manages fullscreen loading
  })

  it('should render the hook properly when quantity is not available', async () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === selectedVariantInventoryAtom) return { ats: 1 }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 0,
      },
    ]
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('should render the hook without crashing when quantity is 1', async () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === selectedVariantInventoryAtom) return { ats: 1 }
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 1,
      },
    ]
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
    expect(mockResetVisitedPagesCount).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(true) // Desktop shows fullscreen loading
  })

  it('should set button ref when event is provided', async () => {
    const mockEvent = {
      currentTarget: document.createElement('button'),
    } as React.MouseEvent<HTMLButtonElement>
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart(mockEvent)
    })
    expect(mockSetAtbButtonRef).toHaveBeenCalledWith(mockEvent.currentTarget)
  })

  it('should handle the buyNow flow when it is true', async () => {
    const { result } = makeSetup({ isBuyNow: true })
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSendAnalytics).toHaveBeenCalledWith('add_to_cart', { eventData: 'add' })
    // buyNow flow should not call setFullscreenLoading(false) or setDrawerState
    expect(mockSetDrawerState).not.toHaveBeenCalled()
  })

  it('should handle gift items in cart', async () => {
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 1,
        gift: true,
      },
    ]
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSessionActions.addToCart).toHaveBeenCalled()
  })

  it('should reset max quantity error when variant changes', () => {
    const { rerender } = makeSetup()
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === submittableVariantIdAtom) return 'variant456'
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    rerender()
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
  })

  it('should handle the scenario when cartQuantity + selectedQty > maxQty with cart at max capacity', async () => {
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === selectedQtyAtom) return 6
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    mockSession.cart.product_items = [
      {
        product_id: 'variant123',
        quantity: 5,
      },
    ]
    mockedUseSelectedVariantData.mockReturnValue(5)
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(true)
    expect(mockSetFullscreenLoading).toHaveBeenCalledWith(false) // Desktop manages fullscreen loading
  })

  it('should render the hook properly when isBuyNow is not present', async () => {
    const { result } = renderHook(() => useAddItemToCart(), { wrapper })
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockResetVisitedPagesCount).toHaveBeenCalled()
    expect(mockSetFullscreenLoading).toHaveBeenCalled()
    expect(mockLoadMiniCartPopover).toHaveBeenCalled()
  })

  it('should render the hook properly when isCustomized and isMonogrammed is undefined', async () => {
    mockedUseSelectedColorData.mockReturnValue([undefined, undefined, 'color123', 'front'])
    makeSetup()
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
  })

  it('should render the hook properly and handle the scenario when defaultMaxOrderQuantity is null', async () => {
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      cartCheckoutSettings: {
        defaultMaxOrderQuantity: null,
      },
    }))
    makeSetup()
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
  })

  it('should render the hook properly and handle the scenario when enableMaxQtyRestriction is false', async () => {
    mockedUseSelectedVariantData.mockReturnValue(0)
    const useAtomImplementation = mockedUseAtomValue.getMockImplementation()
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === selectedVariantInventoryAtom) return null
      return useAtomImplementation ? useAtomImplementation(atom) : undefined
    })
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      toggleSiteFeatures: {
        ...original.toggleSiteFeatures,
        enableMaxQtyRestriction: false,
      },
    }))
    const { result } = makeSetup()
    await act(async () => {
      result.current.addToCart()
    })
    expect(mockSetMaxQuantityError).toHaveBeenCalledWith(false)
  })
})
