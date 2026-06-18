import { useMemo } from 'react'
import { wishlistIdsAtom } from 'store/wishlist.atom'
import { useAtomValue } from 'jotai/utils'
import isArray from 'lodash/isArray'

const useIsInWishlist = (productId: string) => {
  const wishlistIds = useAtomValue(wishlistIdsAtom)

  return useMemo(() => {
    if (!isArray(wishlistIds)) {
      return false
    }
    return wishlistIds.some((item) => item === productId)
  }, [wishlistIds])
}

export default useIsInWishlist
