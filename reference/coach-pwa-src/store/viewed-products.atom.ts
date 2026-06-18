import { atom } from 'jotai'
import { STORAGE_VIEWED_PRODUCTS } from 'toro/constants/storageIds'
import { atomWithStorage } from 'jotai/utils'
import isString from 'lodash/isString'
import _get from 'lodash/get'
import { preferencesAtom } from './preferences.atom'

const MAX_VIEWED_PRODUCTS = 6

export const viewedProductsAtom = atomWithStorage(STORAGE_VIEWED_PRODUCTS, [])

export const addToViewedProductsAtom = atom(null, (get, set, id: string) => {
  const preferences = get(preferencesAtom)
  const maxProductStorage = _get(
    preferences,
    'Storefront Configs.maxProductStorage',
    MAX_VIEWED_PRODUCTS
  )

  const viewedIds = get(viewedProductsAtom)
  if (!isString(id) || id.length === 0 || viewedIds.includes(id)) {
    return
  }

  set(viewedProductsAtom, [...viewedIds, id].slice(-maxProductStorage))
})
