import { useMemo } from 'react'
import { useAtomValue } from 'jotai/utils'
import { isSgloaderScriptLoadedAtom } from 'store/scripts.atom'

export function useIsDisplayWidget({
  // configs
  isLoggedIn,
  isShoppingGivesActive,
  isDataLayerInitialized,
  shoppingGivesActiveCustomerSegment,
  // preferences
  shoppingGivesUrl,
  shoppingGivesStoreId,
  shoppingGivesBMIsEnabled,
  shoppingGivesGuestEnabled,
  shoppingGivesInsiderEnabled,
}): boolean {
  const isSgloaderScriptLoaded = useAtomValue(isSgloaderScriptLoadedAtom)

  return useMemo(() => {
    if (!isDataLayerInitialized) {
      return false
    }

    return (
      shoppingGivesBMIsEnabled &&
      !!shoppingGivesStoreId &&
      !!shoppingGivesUrl &&
      isShoppingGivesActive &&
      !!shoppingGivesActiveCustomerSegment &&
      (!isLoggedIn ? shoppingGivesGuestEnabled : shoppingGivesInsiderEnabled) &&
      isSgloaderScriptLoaded
    )
  }, [
    // preferences
    shoppingGivesUrl,
    shoppingGivesStoreId,
    shoppingGivesBMIsEnabled,
    shoppingGivesGuestEnabled,
    shoppingGivesInsiderEnabled,
    // configs
    isLoggedIn,
    isShoppingGivesActive,
    isSgloaderScriptLoaded,
    isDataLayerInitialized,
    shoppingGivesActiveCustomerSegment,
  ])
}
