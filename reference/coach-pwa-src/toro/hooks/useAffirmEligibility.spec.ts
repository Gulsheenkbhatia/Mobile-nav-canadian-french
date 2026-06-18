import { renderHook } from '@testing-library/react'
import useAffirmEligibility from './useAffirmEligibility'
import usePreference from 'toro/hooks/usePreference_new'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

// Mock jotai/utils completely
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithDefault: jest.fn(),
  atomWithStorage: jest.fn(),
  selectAtom: jest.fn(),
}))

// Mock the store modules
jest.mock('store/pdp.atom', () => ({
  selectedVariantAtom: { toString: () => 'selectedVariantAtom' },
  orderingStatusAtom: { toString: () => 'orderingStatusAtom' },
}))

jest.mock('toro/hooks/usePreference_new', () => jest.fn())
jest.mock('toro/hooks/useExperiment', () => jest.fn())

describe('useAffirmEligibility', () => {
  // Get the mocked function after the module is mocked
  let mockUseAtomValue: jest.MockedFunction<any>
  const mockUsePreference = usePreference as jest.MockedFunction<typeof usePreference>

  // Default mock values
  const mockSelectedVariantData = { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] } // 40.00 is within 1-4000
  const mockOrderingStatus = ORDERING_STATUS.addToBag

  beforeAll(() => {
    // Access the mocked useAtomValue after jest has mocked the module
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jotaiUtils = require('jotai/utils')
    mockUseAtomValue = jotaiUtils.useAtomValue as jest.MockedFunction<any>
  })

  beforeEach(() => {
    // Mock useAtomValue to return different values based on the atom being accessed
    mockUseAtomValue.mockImplementation((atom) => {
      const atomString = atom.toString()
      if (atomString.includes('selectedVariant')) {
        return mockSelectedVariantData
      }
      if (atomString.includes('orderingStatus')) {
        return mockOrderingStatus
      }
      return null
    })

    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: true,
        AffirmProductMessage: true,
        AffirmPaymentMinTotal: '1',
        AffirmPaymentMaxTotal: '4000',
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  // Helper function to mock atom values
  const mockAtomValues = (selectedVariantData: any, orderingStatus: any) => {
    mockUseAtomValue.mockImplementation((atom) => {
      const atomString = atom.toString()
      if (atomString.includes('selectedVariant')) {
        return selectedVariantData
      }
      if (atomString.includes('orderingStatus')) {
        return orderingStatus
      }
      return null
    })
  }

  it('should return true when all conditions are met', () => {
    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(true)
  })

  it('should return false when AffirmOnline is disabled', () => {
    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: false,
        AffirmProductMessage: true,
        AffirmPaymentMinTotal: '1',
        AffirmPaymentMaxTotal: '4000',
      },
    })

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when AffirmProductMessage is disabled', () => {
    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: true,
        AffirmProductMessage: false,
        AffirmPaymentMinTotal: '1',
        AffirmPaymentMaxTotal: '4000',
      },
    })

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when price is below minimum', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '0.50' } }] }, // 0.50 is below minimum of 1
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when price is above maximum', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '5000.00' } }] }, // 5000.00 is above 4000
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when price is "N/A"', () => {
    mockAtomValues({ pricingInfo: [{ sales: { decimalPrice: 'N/A' } }] }, ORDERING_STATUS.addToBag)

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when price is missing', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: undefined } }] },
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when ordering status is preorder', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] },
      ORDERING_STATUS.preorder
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return false when ordering status is backorder', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] },
      ORDERING_STATUS.backorder
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should handle custom price ranges from preferences', () => {
    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: true,
        AffirmProductMessage: true,
        AffirmPaymentMinTotal: '50',
        AffirmPaymentMaxTotal: '500',
      },
    })

    // Price within custom range should return true (100.00 is within 50-500)
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '100.00' } }] },
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())
    expect(result.current).toBe(true)

    // Price outside custom range should return false (40.00 is below 50)
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] },
      ORDERING_STATUS.addToBag
    )

    const { result: result2 } = renderHook(() => useAffirmEligibility())
    expect(result2.current).toBe(false)
  })

  it('should handle invalid price range preferences gracefully', () => {
    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: true,
        AffirmProductMessage: true,
        AffirmPaymentMinTotal: undefined, // Invalid - should use default '1'
        AffirmPaymentMaxTotal: undefined, // Invalid - should use default '4000'
      },
    })
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] }, // 40.00 is within default 1-4000
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    // Should use default values (1-4000) and still work
    expect(result.current).toBe(true)
  })

  it('should handle missing selectedVariantData', () => {
    mockAtomValues(null, ORDERING_STATUS.addToBag)

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should handle missing pricingInfo', () => {
    mockAtomValues({ pricingInfo: null }, ORDERING_STATUS.addToBag)

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(false)
  })

  it('should return true for price at exact minimum boundary', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '1.00' } }] }, // 1.00 equals minimum
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(true)
  })

  it('should return true for price at exact maximum boundary', () => {
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '4000.00' } }] }, // 4000.00 equals maximum
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(true)
  })

  it('should handle decimal price processing correctly', () => {
    // Test that decimal price is processed correctly (as parseFloat)
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '12.34' } }] }, // 12.34 is within 1-4000
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(true)
  })

  it('should verify all conditions are checked together', () => {
    // Test that all conditions must be true for eligibility
    mockUsePreference.mockReturnValue({
      affirm: {
        AffirmOnline: true,
        AffirmProductMessage: true,
        AffirmPaymentMinTotal: '1',
        AffirmPaymentMaxTotal: '4000',
      },
    })
    mockAtomValues(
      { pricingInfo: [{ sales: { decimalPrice: '40.00' } }] }, // 40.00 is within 1-4000
      ORDERING_STATUS.addToBag
    )

    const { result } = renderHook(() => useAffirmEligibility())

    expect(result.current).toBe(true)
  })
})
