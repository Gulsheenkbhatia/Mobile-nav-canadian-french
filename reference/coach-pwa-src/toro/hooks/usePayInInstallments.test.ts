import { renderHook, act } from 'test-utils/react'
import { jest } from '@jest/globals'
import usePayInInstallments from './usePayInInstallments'

// Mock external hooks
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/useAffirmEligibility')

import usePreference from 'toro/hooks/usePreference_new'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import {
  klarnaDetailsAtom,
  affirmPriceAtom,
  afterPayPriceAtom,
  isKlarnaEnabledAtom,
} from 'store/pdp.atom'
import { affirmScriptLoadedAtom, afterpayScriptLoadedAtom } from 'store/scripts.atom'

const mockUsePreference = jest.mocked(usePreference)
const mockUseAffirmEligibility = jest.mocked(useAffirmEligibility)

describe('usePayInInstallments', () => {
  // Mock data fixtures
  const mockKlarnaDetails = {
    textMain: {
      value: 'or as low as $30.00/mo. with Klarna.',
    },
  }

  // Helper to render hook with Jotai Provider
  const renderHookWithProvider = (atomValues: Record<string, any> = {}) => {
    return renderHook(() => usePayInInstallments(), {
      contexts: {
        JotaiProviderContext: new Map([
          [klarnaDetailsAtom, atomValues.klarnaDetails ?? null],
          [affirmPriceAtom, atomValues.affirmPrice ?? null],
          [afterPayPriceAtom, atomValues.afterPayPrice ?? null],
          [isKlarnaEnabledAtom, atomValues.enableKlarna ?? false],
          [affirmScriptLoadedAtom, atomValues.isAffirmScriptLoaded ?? false],
          [afterpayScriptLoadedAtom, atomValues.isAfterpayScriptLoaded ?? false],
        ] as any),
      },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockUsePreference.mockReturnValue({
      afterPay: { enableAfterpay: false },
    })
    mockUseAffirmEligibility.mockReturnValue(false)
  })

  describe('Hook Return Values', () => {
    it('should return all expected properties with correct types', () => {
      const { result } = renderHookWithProvider()

      expect(typeof result.current.enableKlarna).toBe('boolean')
      expect(typeof result.current.enableAfterpay).toBe('boolean')
      expect(typeof result.current.shouldShowAffirm).toBe('boolean')
      expect(
        result.current.minInstallmentPrice === null ||
          typeof result.current.minInstallmentPrice === 'string'
      ).toBe(true)
      expect(typeof result.current.isLoadingPrices).toBe('boolean')
    })

    it('should return false for all providers when none are enabled', () => {
      const { result } = renderHookWithProvider()

      expect(result.current.enableKlarna).toBe(false)
      expect(result.current.enableAfterpay).toBe(false)
      expect(result.current.shouldShowAffirm).toBe(false)
      expect(result.current.minInstallmentPrice).toBeNull()
      expect(result.current.isLoadingPrices).toBe(false)
    })
  })

  describe('Single Provider Scenarios', () => {
    it('should return Klarna price when only Klarna is enabled', () => {
      const { result } = renderHookWithProvider({
        enableKlarna: true,
        klarnaDetails: mockKlarnaDetails,
      })

      expect(result.current.enableKlarna).toBe(true)
      expect(result.current.enableAfterpay).toBe(false)
      expect(result.current.shouldShowAffirm).toBe(false)
      expect(result.current.minInstallmentPrice).toBe('$30.00')
      expect(result.current.isLoadingPrices).toBe(false)
    })

    it('should return Afterpay price when only Afterpay is enabled', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })

      const { result } = renderHookWithProvider({
        afterPayPrice: '$24.62',
        isAfterpayScriptLoaded: true,
      })

      expect(result.current.enableKlarna).toBe(false)
      expect(result.current.enableAfterpay).toBe(true)
      expect(result.current.shouldShowAffirm).toBe(false)
      expect(result.current.minInstallmentPrice).toBe('$24.62')
      expect(result.current.isLoadingPrices).toBe(false)
    })

    it('should return Affirm price when only Affirm is enabled', () => {
      mockUseAffirmEligibility.mockReturnValue(true)

      const { result } = renderHookWithProvider({
        affirmPrice: '$28.50',
        isAffirmScriptLoaded: true,
      })

      expect(result.current.enableKlarna).toBe(false)
      expect(result.current.enableAfterpay).toBe(false)
      expect(result.current.shouldShowAffirm).toBe(true)
      expect(result.current.minInstallmentPrice).toBe('$28.50')
      expect(result.current.isLoadingPrices).toBe(false)
    })

    it('should show loading when provider enabled but no price available', () => {
      jest.useFakeTimers()

      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })

      const { result } = renderHookWithProvider({
        afterPayPrice: null,
        isAfterpayScriptLoaded: true,
      })

      // Before timeout, should be loading
      expect(result.current.isLoadingPrices).toBe(true)
      expect(result.current.minInstallmentPrice).toBeNull()

      // After timeout
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      expect(result.current.isLoadingPrices).toBe(false)
      expect(result.current.minInstallmentPrice).toBeNull()

      jest.useRealTimers()
    })
  })

  describe('Minimum Price Calculation', () => {
    it('should return lowest price among multiple providers', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      const { result } = renderHookWithProvider({
        enableKlarna: true,
        klarnaDetails: mockKlarnaDetails, // $30.00
        afterPayPrice: '$24.62',
        isAfterpayScriptLoaded: true,
        affirmPrice: '$28.50',
        isAffirmScriptLoaded: true,
      })

      expect(result.current.minInstallmentPrice).toBe('$24.62')
      expect(result.current.isLoadingPrices).toBe(false)
    })

    it('should return null when all enabled providers have null prices', () => {
      jest.useFakeTimers()

      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      const { result } = renderHookWithProvider({
        afterPayPrice: null,
        isAfterpayScriptLoaded: true,
        affirmPrice: null,
        isAffirmScriptLoaded: true,
      })

      // After timeout - no prices available
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      expect(result.current.minInstallmentPrice).toBeNull()
      expect(result.current.isLoadingPrices).toBe(false)

      jest.useRealTimers()
    })
  })

  describe('Loading State Management', () => {
    it('should show loading when Afterpay script not loaded', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })

      const { result } = renderHookWithProvider({
        afterPayPrice: null,
        isAfterpayScriptLoaded: false,
      })

      expect(result.current.isLoadingPrices).toBe(true)
      expect(result.current.minInstallmentPrice).toBeNull()
    })

    it('should show loading when Affirm script not loaded', () => {
      mockUseAffirmEligibility.mockReturnValue(true)

      const { result } = renderHookWithProvider({
        affirmPrice: null,
        isAffirmScriptLoaded: false,
      })

      expect(result.current.isLoadingPrices).toBe(true)
      expect(result.current.minInstallmentPrice).toBeNull()
    })

    it('should not show loading when all scripts loaded and prices available', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })
      mockUseAffirmEligibility.mockReturnValue(true)

      const { result } = renderHookWithProvider({
        enableKlarna: true,
        klarnaDetails: mockKlarnaDetails,
        afterPayPrice: '$24.62',
        isAfterpayScriptLoaded: true,
        affirmPrice: '$28.50',
        isAffirmScriptLoaded: true,
      })

      expect(result.current.isLoadingPrices).toBe(false)
      expect(result.current.minInstallmentPrice).toBe('$24.62')
    })

    it('should not show loading when no providers enabled', () => {
      const { result } = renderHookWithProvider()

      expect(result.current.isLoadingPrices).toBe(false)
      expect(result.current.minInstallmentPrice).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle JPY format (no decimals)', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })

      const { result } = renderHookWithProvider({
        afterPayPrice: '¥1,234',
        isAfterpayScriptLoaded: true,
      })

      expect(result.current.minInstallmentPrice).toBe('¥1,234')
    })

    it('should handle INR format', () => {
      mockUsePreference.mockReturnValue({
        afterPay: { enableAfterpay: true },
      })

      const { result } = renderHookWithProvider({
        afterPayPrice: '₹1,234.56',
        isAfterpayScriptLoaded: true,
      })

      expect(result.current.minInstallmentPrice).toBe('₹1,234.56')
    })
  })
})
