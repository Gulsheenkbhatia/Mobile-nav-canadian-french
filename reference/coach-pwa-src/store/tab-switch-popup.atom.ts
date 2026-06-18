import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { STORAGE_TAB_SWITCH_SHOWN } from 'toro/constants/storageIds'
import { ONE_SITE_BRAND_TABS, OneSiteBrandTabs } from 'lib/oneSite/config'

type TabSwitchPopupShown = Record<OneSiteBrandTabs, boolean>

const defaultTabSwitchPopupShown: TabSwitchPopupShown = {
  [ONE_SITE_BRAND_TABS.COACH]: false,
  [ONE_SITE_BRAND_TABS.OUTLET]: false,
}

// Use sessionStorage so popup resets when browser session ends
const sessionStorageOptions = createJSONStorage<TabSwitchPopupShown>(() => sessionStorage)

export const tabSwitchPopupShownAtom = atomWithStorage<TabSwitchPopupShown>(
  STORAGE_TAB_SWITCH_SHOWN,
  defaultTabSwitchPopupShown,
  sessionStorageOptions
)
