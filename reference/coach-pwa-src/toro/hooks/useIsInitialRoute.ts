import { useAtomValue } from 'jotai/utils'
import initialRouteKeyAtom from 'store/initial-route-key.atom'

const useIsInitialRoute = (): boolean => {
  const initialRouteKey = useAtomValue(initialRouteKeyAtom)
  return !initialRouteKey || window.history?.state?.key === initialRouteKey
}

export default useIsInitialRoute
