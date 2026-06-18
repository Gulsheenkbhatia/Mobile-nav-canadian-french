import { useMemo } from 'react'
import usePreference from 'toro/hooks/usePreference_new'

export type PricePreferences = {
  markdownPriceEnabled: boolean
  showBundleListPrice: boolean
  isHideStrikeOffPriceEnabled: boolean
  showPromotionalPrice: boolean
  isPriceRangeToggleEnabled: boolean
  isKsSur: boolean
}

export default function usePricePreferences(): PricePreferences {
  const {
    generalConfiguration: { siteIdentifier },
    priceSitePreferences: {
      priceRangeToggle: isPriceRangeToggleEnabled,
      promotionalPriceToggle: showPromotionalPrice,
      markDownPriceStyle: markdownPriceEnabled = false,
    },
    toggleSiteFeatures: { hideStrikeOffPrice: isHideStrikeOffPriceEnabled },
    bundleConfigurations: { showBundleListPrice },
  } = usePreference({
    generalConfiguration: ['siteIdentifier'],
    priceSitePreferences: ['priceRangeToggle', 'promotionalPriceToggle', 'markDownPriceStyle'],
    ToggleSiteFeatures: ['hideStrikeOffPrice'],
    bundleConfigurations: ['showBundleListPrice'],
  })

  const isKsSur = (siteIdentifier?.value || siteIdentifier) === 'ksna-surprise'

  return useMemo(
    (): PricePreferences => ({
      markdownPriceEnabled,
      showBundleListPrice,
      isHideStrikeOffPriceEnabled,
      showPromotionalPrice,
      isPriceRangeToggleEnabled,
      isKsSur,
    }),
    [
      markdownPriceEnabled,
      showBundleListPrice,
      isHideStrikeOffPriceEnabled,
      showPromotionalPrice,
      isPriceRangeToggleEnabled,
      isKsSur,
    ]
  )
}
