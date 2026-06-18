import usePreference from 'toro/hooks/usePreference_new'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import useExposedSearch from 'toro/hooks/useExposedSearch'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import { isOneCoachTabbedAtom } from 'store/global.atom'

// original header height which is used for desktop and old experience
const HEADER_HEIGHT = 82
// new header height, controlled by enableNewGlobalHeader BM preference.
const NEW_HEADER_HEIGHT = 56
// new header height, controlled by ONE_COACH_TABBED abtest.
const ONE_COACH_TABBED_HEADER_HEIGHT = 48

const useHeaderHeight = () => {
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const {
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreference({
    generalConfiguration: ['enableNewGlobalHeader'],
  })
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const exposeMobileSearchBar = useExposedSearch()

  return useMemo(() => {
    if (typeof window !== 'undefined' && headerHeight > 0) {
      return headerHeight
    }
    if (isOneCoachTabbedHeaderActive) {
      return ONE_COACH_TABBED_HEADER_HEIGHT
    }
    if (enableNewGlobalHeader || exposeMobileSearchBar) {
      return NEW_HEADER_HEIGHT
    }
    return HEADER_HEIGHT
  }, [enableNewGlobalHeader, headerHeight, exposeMobileSearchBar, isOneCoachTabbedHeaderActive])
}

export default useHeaderHeight
