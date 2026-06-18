import { atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { preferencesAtom } from 'store/preferences.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { oneSiteActiveTabAtom } from 'store/menu-data.atom'
import { getDynamicStyles } from 'toro/components/DynamicSubNavigation/getDynamicStyles'

const dynamicSubNavigationConfigAtom = selectAtom(
  preferencesAtom,
  (preferences) => preferences?.ToggleSiteFeatures?.dynamicSubNavigationStyles
)

export const dynamicSubNavigationStylesAtom = atom((get) => {
  const config = get(dynamicSubNavigationConfigAtom)
  const isSubBrandActive = get(isSubBrandActiveAtom)
  const oneSiteActiveTab = get(oneSiteActiveTabAtom)

  return getDynamicStyles({ config, isSubBrandActive, oneSiteActiveTab })
})
