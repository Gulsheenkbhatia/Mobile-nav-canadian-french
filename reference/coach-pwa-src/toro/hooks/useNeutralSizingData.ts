import { useMemo } from 'react'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import { countryTabIndexAtom } from 'store/pdp.atom'
import get from 'lodash/get'

type UseNeutralSizingDataReturn = {
  isNeutralSizingEnabled: boolean
  neutralSizingCountryTypes: string[]
  selectedNeutralSizingCountry: string | undefined
}

const useNeutralSizingData = function (): UseNeutralSizingDataReturn {
  const {
    storefrontConfigs: { defaultSize },
  } = usePreferenceNew({
    'Storefront Configs': ['defaultSize'],
  })
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const countryTabIndex = useAtomValue(countryTabIndexAtom)

  const activeBrandPref = isSubBrandActive ? defaultSize?.subBrand : defaultSize?.brand
  const isNeutralSizingEnabled = activeBrandPref?.isEnabled
  const neutralSizingCountryTypes = activeBrandPref?.sizeType || []

  return useMemo(
    () => ({
      isNeutralSizingEnabled,
      neutralSizingCountryTypes,
      selectedNeutralSizingCountry: isNeutralSizingEnabled
        ? get(neutralSizingCountryTypes, `[${countryTabIndex}]`)
        : undefined,
    }),
    [isNeutralSizingEnabled, neutralSizingCountryTypes, countryTabIndex]
  )
}

export default useNeutralSizingData
