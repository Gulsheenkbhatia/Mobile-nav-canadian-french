import { atom } from 'jotai'

// The main atom that holds whether the full product info is expanded
export const showFullProductInfoPdpAtom = atom(false)

export const setShowFullProductInfoPdpAtom = atom(null, (get, set, value: boolean) => {
  set(showFullProductInfoPdpAtom, value)
})
