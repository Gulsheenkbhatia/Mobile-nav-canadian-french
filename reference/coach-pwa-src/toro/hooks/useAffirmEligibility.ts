import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { selectedVariantAtom, orderingStatusAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'

// Constants for better performance and maintainability
const UNAVAILABLE_STATUSES = new Set([ORDERING_STATUS.preorder, ORDERING_STATUS.backorder])
const AFFIRM_PREFERENCES = [
  'AffirmOnline',
  'AffirmProductMessage',
  'AffirmPaymentMinTotal',
  'AffirmPaymentMaxTotal',
] as const

/**
 * Hook that calculates Affirm eligibility
 * Returns boolean indicating whether Affirm should be displayed
 */
const useAffirmEligibility = () => {
  const selectedVariantData = useAtomValue(selectedVariantAtom)
  const orderingStatus = useAtomValue(orderingStatusAtom)

  const {
    affirm: {
      AffirmOnline: enableAffirmGlobal = false,
      AffirmProductMessage: enableAffirmPdp = false,
      AffirmPaymentMinTotal: affirmMin = '1',
      AffirmPaymentMaxTotal: affirmMax = '4000',
    },
  } = usePreference({
    affirm: AFFIRM_PREFERENCES,
  })

  // Memoize price calculation to avoid expensive operations on every render
  const priceData = useMemo(() => {
    const salesPrice = selectedVariantData?.pricingInfo?.[0]?.sales?.decimalPrice

    if (!salesPrice || salesPrice === 'N/A') {
      return { isValid: false, price: 0 }
    }

    const price = parseFloat(salesPrice)
    return { isValid: !isNaN(price), price }
  }, [selectedVariantData?.pricingInfo])

  // Memoize threshold calculations
  const thresholds = useMemo(() => {
    const min = parseFloat(affirmMin || '1')
    const max = parseFloat(affirmMax || '4000')
    return { min, max }
  }, [affirmMin, affirmMax])

  const shouldShowAffirm = useMemo(() => {
    // Early return if any basic requirement fails
    if (!enableAffirmGlobal || !enableAffirmPdp) {
      return false
    }

    // Check if product is available (not preorder/backorder)
    if (UNAVAILABLE_STATUSES.has(orderingStatus)) {
      return false
    }

    // Check price validity and range
    if (!priceData.isValid) {
      return false
    }

    return priceData.price >= thresholds.min && priceData.price <= thresholds.max
  }, [enableAffirmGlobal, enableAffirmPdp, orderingStatus, priceData, thresholds])

  return shouldShowAffirm
}

export default useAffirmEligibility
