import { useAtomValue } from 'jotai/utils'
import { useMemo, useEffect, useState } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'
import {
  klarnaDetailsAtom,
  affirmPriceAtom,
  afterPayPriceAtom,
  isKlarnaEnabledAtom,
} from 'store/pdp.atom'
import get from 'lodash/get'
import { affirmScriptLoadedAtom, afterpayScriptLoadedAtom } from 'store/scripts.atom'
import { extractNumericPrice } from 'toro/helpers/extractNumericPrice'

const PRICE_LOADING_TIMEOUT = 10000 // 10 seconds

interface PayInInstallmentsResult {
  enableKlarna: boolean
  enableAfterpay: boolean
  shouldShowAffirm: boolean
  minInstallmentPrice: string | null
  isLoadingPrices: boolean
}

interface PriceData {
  price: number
  formattedPrice: string
  source: 'klarna' | 'afterpay' | 'affirm'
}

/**
 * Hook that consolidates payment installment options
 * Returns enableKlarna, enableAfterpay, shouldShowAffirm, isLoadingPrices flags
 * and the minimum installment price across all enabled options
 */
const usePayInInstallments = (): PayInInstallmentsResult => {
  const shouldShowAffirm = useAffirmEligibility()
  const klarnaDetails = useAtomValue(klarnaDetailsAtom)
  const affirmPrice = useAtomValue(affirmPriceAtom)
  const afterPayPrice = useAtomValue(afterPayPriceAtom)
  const isAffirmScriptLoaded = useAtomValue(affirmScriptLoadedAtom)
  const isAfterpayScriptLoaded = useAtomValue(afterpayScriptLoadedAtom)
  const enableKlarna: boolean = useAtomValue(isKlarnaEnabledAtom)

  const [hasTimedOut, setHasTimedOut] = useState(false)

  const {
    afterPay: { enableAfterpay = false },
  } = usePreference({
    afterPay: ['enableAfterpay'],
  })

  // Set up timeout to calculate price with available options after 10 seconds
  // This is need for the case when something is wrong with any of the vendors and we want to show the price with available options.
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true)
    }, PRICE_LOADING_TIMEOUT)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const klarnaPriceWithCurrency = useMemo(() => {
    const textMainValue = get(klarnaDetails, 'textMain.value', '')
    if (!textMainValue) {
      return null
    }

    // Extract price with currency symbol from the text
    // Matches patterns like: $30.00, €30,00, £30.00, etc.
    const priceMatch = textMainValue.match(/([€$£¥₹])\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[,.]\d{2})?)/)
    if (priceMatch) {
      return `${priceMatch[1]}${priceMatch[2]}`
    }

    // Alternative pattern where currency symbol comes after (e.g., 30.00€)
    const priceMatchAfter = textMainValue.match(
      /(\d{1,3}(?:[,.\s]\d{3})*(?:[,.]\d{2})?)\s*([€$£¥₹])/
    )
    if (priceMatchAfter) {
      return `${priceMatchAfter[1]}${priceMatchAfter[2]}`
    }

    return null
  }, [klarnaDetails])

  // Calculate minimum price and loading state
  const { minInstallmentPrice, isLoadingPrices } = useMemo(() => {
    const enabledOptions: Array<{
      enabled: boolean
      price: string | null
      scriptLoaded: boolean
      source: 'klarna' | 'afterpay' | 'affirm'
    }> = [
      {
        enabled: enableKlarna,
        price: klarnaPriceWithCurrency,
        scriptLoaded: true, //klarna we are getting from server side as separate call, no need to wait.
        source: 'klarna',
      },
      {
        enabled: enableAfterpay,
        price: afterPayPrice,
        scriptLoaded: isAfterpayScriptLoaded,
        source: 'afterpay',
      },
      {
        enabled: shouldShowAffirm,
        price: affirmPrice,
        scriptLoaded: isAffirmScriptLoaded,
        source: 'affirm',
      },
    ]

    // Filter only enabled options
    const enabledPriceOptions = enabledOptions.filter((option) => option.enabled)

    // If no options are enabled, return early
    if (enabledPriceOptions.length === 0) {
      return { minInstallmentPrice: null, isLoadingPrices: false }
    }

    // Check if all enabled options have loaded their scripts AND prices
    const allScriptsLoaded = enabledPriceOptions.every((option) => option.scriptLoaded)
    const allPricesLoaded = enabledPriceOptions.every((option) => option.price !== null)

    // Before timeout, wait for all prices to load
    if (!hasTimedOut && (!allScriptsLoaded || !allPricesLoaded)) {
      return { minInstallmentPrice: null, isLoadingPrices: true }
    }

    // After timeout or when all prices loaded, filter options that have prices available
    const optionsWithPrices = enabledPriceOptions.filter((option) => option.price !== null)

    // If no prices are available yet (even after timeout), return null
    if (optionsWithPrices.length === 0) {
      return { minInstallmentPrice: null, isLoadingPrices: false }
    }

    // Parse all available prices and find the minimum
    const validPrices: PriceData[] = optionsWithPrices
      .map((option) => {
        if (!option.price) return null

        const numericPrice = extractNumericPrice(option.price)
        if (numericPrice !== null) {
          return {
            price: numericPrice,
            formattedPrice: option.price,
            source: option.source,
          }
        }
        return null
      })
      .filter((price): price is PriceData => price !== null)

    // If no valid prices found after parsing, return null
    if (validPrices.length === 0) {
      return { minInstallmentPrice: null, isLoadingPrices: false }
    }

    // Find the minimum price
    const minPrice = validPrices.reduce((min, current) =>
      current.price < min.price ? current : min
    )

    return {
      minInstallmentPrice: minPrice.formattedPrice,
      isLoadingPrices: false,
    }
  }, [
    enableKlarna,
    enableAfterpay,
    shouldShowAffirm,
    klarnaPriceWithCurrency,
    afterPayPrice,
    affirmPrice,
    isAffirmScriptLoaded,
    isAfterpayScriptLoaded,
    hasTimedOut,
  ])

  return {
    enableKlarna,
    enableAfterpay,
    shouldShowAffirm,
    minInstallmentPrice,
    isLoadingPrices,
  }
}

export default usePayInInstallments
