import usePreference from 'toro/hooks/usePreference_new'
import useBagCharmsSelectorVisibility from './useBagCharmsSelectorVisibility'

const useBagLowerStackFlags = () => {
  const {
    tangiblee: { IS_TANGIBLEE_ENABLED: isTangibleeEnabled },
  } = usePreference({
    Tangiblee: ['IS_TANGIBLEE_ENABLED'],
  })
  const isBagCharmsSelectorVisible = useBagCharmsSelectorVisibility()
  return { isTangibleeEnabled, isBagCharmsSelectorVisible }
}

export default useBagLowerStackFlags
