import { useEffect } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import menuDataAtom, {
  reInitActiveMobileMenuItemsAtom,
  activeMobileMenuItemsAtom,
} from 'store/menu-data.atom'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

export default function useReInitMenuItems() {
  const {
    coachtopia: { coachtopiaRootCategory },
  } = usePreference({
    coachtopia: ['coachtopiaRootCategory'],
  })

  const { isHP, isSubHP, isProductPassport } = usePageType()
  const reInitActiveMobileMenuItems = useUpdateAtom(reInitActiveMobileMenuItemsAtom)
  const { topCategories } = useAtomValue(menuDataAtom)
  const activeMenuItems = useAtomValue(activeMobileMenuItemsAtom)

  useEffect(() => {
    if (!topCategories) return

    if (isSubHP) {
      reInitActiveMobileMenuItems()
      return
    }

    const isActiveT1Valid =
      topCategories.includes(activeMenuItems?.t1) || activeMenuItems?.t1 === coachtopiaRootCategory

    if (!isProductPassport && (isHP || !isActiveT1Valid)) {
      reInitActiveMobileMenuItems()
    }
  }, [isHP, isSubHP, isProductPassport])
}
