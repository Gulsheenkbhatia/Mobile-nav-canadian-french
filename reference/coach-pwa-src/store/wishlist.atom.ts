import { atom } from 'jotai'
import { STORAGE_WISHLIST_KEY } from 'toro/constants/storageIds'
import { atomWithStorage } from 'jotai/utils'
import sessionStorage from 'toro/helpers/sessionStorage'

export const updatedWishListAtom = atom(null)

export const wishlistIdsAtom = atomWithStorage(STORAGE_WISHLIST_KEY, [], sessionStorage)

export const addToWishlistAtom = atom(null, (get, set, id: string) => {
  // No need to check if item can be added because we are using canAdd everytime before this function
  const wishlistIds = get(wishlistIdsAtom)
  wishlistIds.push(id)
  set(wishlistIdsAtom, [...wishlistIds])
})

export const removeFromWishlistAtom = atom(null, (get, set, id: string) => {
  // No need to check if item can be removed because we are using canRemove everytime before this function
  const wishlistIds = get(wishlistIdsAtom)
  const index = wishlistIds.findIndex((_id) => _id === id)
  wishlistIds.splice(index, 1)
  set(wishlistIdsAtom, [...wishlistIds])
})
