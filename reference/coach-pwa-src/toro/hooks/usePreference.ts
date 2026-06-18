import { useMemo } from 'react'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import { getSiteValueFromPref } from 'toro/helpers/preferences'

const referentiallyEqualEmptyArr = []

type UsePreferenceProps = {
  groupId: string
  preferenceId: string
  siteId?: string
  defaultValue?: any
  isDisplayValue?: boolean
}

const usePreference = ({
  groupId,
  preferenceId,
  siteId,
  defaultValue = referentiallyEqualEmptyArr,
  isDisplayValue = false,
}: UsePreferenceProps) => {
  const preferencesByGroup = usePreferenceGroup({ groupId })
  return useMemo(() => {
    if (!preferencesByGroup) {
      return
    }
    if (siteId) {
      return getSiteValueFromPref(
        preferencesByGroup.find(({ id }) => id === preferenceId),
        siteId,
        defaultValue,
        isDisplayValue
      )
    } else {
      return preferencesByGroup.find(({ id }) => id === preferenceId)
    }
  }, [preferencesByGroup, preferenceId, siteId, isDisplayValue, defaultValue])
}

export default usePreference
