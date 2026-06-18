import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import { PageTypeFlags } from 'toro/types'
import getPageTypeFlags from 'helpers/pageTypeFlags'

const usePageType = (): PageTypeFlags => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const { coachtopia: { coachtopiaHomeURL: subBrandHomeURL = '' } = {} } = usePreference({
    coachtopia: ['coachtopiaHomeURL'],
  })
  const pathname = usePathname() || ''

  return useMemo(
    () => getPageTypeFlags(pathname, isSubBrandActive ? subBrandHomeURL : undefined),
    [pathname, isSubBrandActive, subBrandHomeURL]
  )
}

export default usePageType
