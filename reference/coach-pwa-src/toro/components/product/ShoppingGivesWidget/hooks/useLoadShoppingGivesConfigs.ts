import { useCallback, useEffect, useState } from 'react'

import { SHOPPING_GIVES_PROD_CONFIG_MODE } from 'toro/constants/appConstants'
import { API_SHOPPING_GIVES_DEV, API_SHOPPING_GIVES_PROD } from 'toro/constants/Urls'
import { getActiveCustomerSegment } from 'toro/components/product/ShoppingGivesWidget/helpers/getAvailableCustomerSegments'

type UseLoadShoppingGivesConfigsProps = {
  configMode: string
  isLoggedIn: boolean
  createEventData: unknown
  shoppingGivesStoreId: string
  shoppingGivesGuestCustomerSegment: string
}

export type UseLoadShoppingGivesConfigs = {
  isShoppingGivesActive: boolean
  shoppingGivesDonationValues: {
    defaultDonation: number
    primaryCurrency: string
    donationActionValue: number
    defaultDonationType: number
  }
  shoppingGivesActiveCustomerSegment: {
    DonationActionValue: number
  }
}

/*
 * This hook is responsible for loading the Shopping Gives API configuration and applying it to the widget.
 * Preferences enabled (yes) => Load Shopping Gives config (yes) => Next step
 * */
export function useGetShoppingGivesConfigs({
  // global
  configMode,
  isLoggedIn,
  // analytics
  createEventData,
  // preferences
  shoppingGivesStoreId,
  shoppingGivesGuestCustomerSegment,
}: UseLoadShoppingGivesConfigsProps): UseLoadShoppingGivesConfigs {
  const [isConfigLoading, setIsConfigLoading] = useState(false)
  const [shoppingGivesDonationValues, setShoppingGivesDonationValues] = useState(null)
  const [shoppingGivesActiveCustomerSegment, setShoppingGivesActiveCustomerSegment] = useState(null)
  const [isShoppingGivesActive, setIsShoppingGivesActive] = useState(false)

  // TODO: [ATOM] Investigate if we can move this call an atom and make it as a global state
  const loadAndApplyShoppingGivesConfig = useCallback(
    async (signal: AbortController['signal']) => {
      setIsConfigLoading(true)

      const response = await loadShoppingGivesConfig({
        signal,
        configMode,
        isLoggedIn,
        createEventData,
        shoppingGivesStoreId,
        shoppingGivesGuestCustomerSegment,
      })

      if (response) {
        const {
          isActive,
          activeSegment,
          defaultDonation,
          primaryCurrency,
          isExperienceActive,
          defaultDonationType,
          donationActionValue,
        } = response

        setShoppingGivesDonationValues({
          defaultDonation,
          primaryCurrency,
          donationActionValue,
          defaultDonationType,
        })

        setShoppingGivesActiveCustomerSegment(activeSegment)
        setIsShoppingGivesActive(isExperienceActive && isActive)
      }
    },
    [
      configMode,
      isLoggedIn,
      createEventData,
      shoppingGivesStoreId,
      shoppingGivesGuestCustomerSegment,
    ]
  )

  useEffect(() => {
    const abortController = new AbortController()

    if (!isConfigLoading) {
      loadAndApplyShoppingGivesConfig(abortController.signal).finally(() =>
        setIsConfigLoading(false)
      )
    }

    return () => {
      if (!abortController.signal.aborted || isConfigLoading) {
        abortController.abort()
      }
    }
  }, [isLoggedIn, configMode, shoppingGivesStoreId])

  return {
    isShoppingGivesActive,
    shoppingGivesDonationValues,
    shoppingGivesActiveCustomerSegment,
  }
}

type LoadShoppingGivesConfig = {
  isActive: boolean
  activeSegment: {
    DonationActionValue: number
  }
  defaultDonation: number
  primaryCurrency: string
  isExperienceActive: boolean
  defaultDonationType: number
  donationActionValue: number
}

async function loadShoppingGivesConfig({
  signal,
  configMode,
  isLoggedIn,
  createEventData,
  shoppingGivesStoreId,
  shoppingGivesGuestCustomerSegment,
}): Promise<LoadShoppingGivesConfig> {
  try {
    const response = await fetchShoppingGivesAPI(shoppingGivesStoreId, configMode, signal)

    const {
      IsActive: isActive,
      DefaultDonation: defaultDonation,
      PrimaryCurrency: primaryCurrency,
      CustomerSegments: customerSegments,
      DefaultDonationType: defaultDonationType,
      IsExperienceActive: isExperienceActive,
    } = response || {}

    const activeSegment = await getActiveCustomerSegment(
      customerSegments,
      isLoggedIn,
      createEventData,
      shoppingGivesGuestCustomerSegment
    )

    const donationActionValue = activeSegment?.DonationActionValue || 0

    return {
      isActive,
      activeSegment,
      defaultDonation,
      primaryCurrency,
      isExperienceActive,
      donationActionValue,
      defaultDonationType,
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      console.log('Shopping Gives Widget: Fetch operation was aborted')
    } else {
      console.error('Shopping Gives Widget: load shopping gives config error:', e)
    }

    return null
  }
}

async function fetchShoppingGivesAPI(
  shoppingGivesStoreId: string,
  configMode: string,
  signal?: AbortController['signal']
) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-store-id': shoppingGivesStoreId,
    },
    signal,
  }

  const apiUrl =
    configMode === SHOPPING_GIVES_PROD_CONFIG_MODE
      ? API_SHOPPING_GIVES_PROD
      : API_SHOPPING_GIVES_DEV

  const res = await fetch(apiUrl, options)
  return await res.json()
}
