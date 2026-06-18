import { atom } from 'jotai'
import { XgenRawResponse } from 'toro/lib/xgen'
import { atomWithReset } from 'jotai/utils'

export const xgenRecentlyViewedRawDataAtom = atomWithReset<XgenRawResponse | null>(null)

export const updateXgenRecentlyViewedAtom = atom(null, (get, set, data: XgenRawResponse) => {
  set(xgenRecentlyViewedRawDataAtom, data)
})

export const getXgenRecentlyViewedAtom = atom((get) => {
  return get(xgenRecentlyViewedRawDataAtom)
})
