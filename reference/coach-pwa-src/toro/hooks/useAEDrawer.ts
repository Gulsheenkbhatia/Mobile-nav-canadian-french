import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'
import { isSubBrandActiveAtom } from 'store/global.atom'
import { setAEDrawerConfigAtom } from 'store/ae-drawer.atom'
import get from 'lodash/get'

/* 
  Used for the Adaptable Experience Certona recommender drawer.

  Returns the atom setter function for the drawer config if everything
  required is enabled/configured.
*/

const useAEDrawer = () => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const setAEDrawerConfig = useUpdateAtom(setAEDrawerConfigAtom)
  const { isDesktop } = useViewportType()

  const {
    adaptiveExperience: { enableAEDrawerExp },
  } = usePreference({
    adaptiveExperience: ['enableAEDrawerExp'],
  })

  const isAEDrawerEnabledOnPDP = get(enableAEDrawerExp, 'PDP.enable', false)
  const isAEDrawerExperienceEnabled =
    getPreferenceConfigValue(enableAEDrawerExp, isSubBrandActive, isDesktop) &&
    isAEDrawerEnabledOnPDP

  if (isAEDrawerExperienceEnabled) {
    return setAEDrawerConfig
  }

  return null
}

export default useAEDrawer
