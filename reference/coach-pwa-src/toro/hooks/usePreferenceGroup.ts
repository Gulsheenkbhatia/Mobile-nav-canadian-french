import { useContext, useMemo } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import type { Preference } from 'toro/helpers/preferences'

const referentiallyEqualEmptyArr: Preference[] = []

interface UsePreferenceGroupProps {
  groupId?: string
}

const usePreferenceGroup = ({ groupId }: UsePreferenceGroupProps = {}): Preference[] | null => {
  const { appData } = useContext(PWAContext)
  const { preferences } = appData || {}

  return useMemo(() => {
    if (!groupId) {
      return null
    }
    return get(preferences, groupId, referentiallyEqualEmptyArr)
  }, [preferences, groupId])
}

export default usePreferenceGroup
