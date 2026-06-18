import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import { exposeMobileSearchBarAtom } from 'store/search.atom'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'

export default function () {
  const { isPDP, isHP, isSRP, isPLP } = usePageType()

  const { xgenPreferences: { searchV2Features = {} } = {} } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })

  const exposedSearchOnSRP = get(searchV2Features, 'ExposedSearchOnSRP', false)
  const exposedSearchOnPLP = get(searchV2Features, 'ExposedSearchOnPLP', false)
  const exposeMobileSearchBar = useAtomValue(exposeMobileSearchBarAtom)

  if (isHP || !exposeMobileSearchBar || isPDP) {
    return false
  }

  return (isSRP && exposedSearchOnSRP) || (isPLP && exposedSearchOnPLP)
}
