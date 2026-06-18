import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { isSubBrandActiveAtom, subBrandAtom } from 'store/global.atom'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'
import { isSubBrandLink as checkSubBrandLink } from 'helpers/subBrand'

const useIsSubBrandSwitch = (href = '') => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const subBrand = useAtomValue(subBrandAtom)
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)

  return useMemo(() => {
    const isSubBrandLink = checkSubBrandLink(href, subBrand)
    const isSubBrandProductPage = isSubBrandLink && href.includes('/products/')

    const isNavigatingToOneCoachSubBrand =
      isOneCoachNAEnabled && isSubBrandLink && !isSubBrandActive && !isSubBrandProductPage

    const isNavigatingFromOneCoachSubBrand =
      isOneCoachNAEnabled && !isSubBrandLink && isSubBrandActive

    if (isNavigatingToOneCoachSubBrand || isNavigatingFromOneCoachSubBrand) {
      return true
    }
    if (isOneCoachNAEnabled) {
      return false
    }
    if (!subBrand || !(href.includes('/products/') || href.includes('/shop/'))) {
      return false
    }
    if (isSubBrandActive) {
      return !isSubBrandLink
    }
    return isSubBrandLink
  }, [isSubBrandActive, subBrand, href, isOneCoachNAEnabled])
}

export default useIsSubBrandSwitch
