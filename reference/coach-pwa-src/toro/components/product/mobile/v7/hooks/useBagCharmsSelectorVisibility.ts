import { useMemo } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import useProductCategoryFlags from 'toro/hooks/useProductCategoryFlags'

const useBagCharmsSelectorVisibility = () => {
  const { isBagCategory } = useProductCategoryFlags()
  const {
    tangiblee: {
      TANGIBLEE_INTEGRATION_SCRIPT_PDPV7: scriptSrc,
      IS_TANGIBLEE_ENABLED: isTangibleeEnabled,
    },
  } = usePreference({
    Tangiblee: ['TANGIBLEE_INTEGRATION_SCRIPT_PDPV7', 'IS_TANGIBLEE_ENABLED'],
  })

  return useMemo(
    () => isBagCategory && !!isTangibleeEnabled && !!scriptSrc,
    [isBagCategory, isTangibleeEnabled, scriptSrc]
  )
}

export default useBagCharmsSelectorVisibility
