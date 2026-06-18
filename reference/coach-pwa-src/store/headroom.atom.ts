import { atom } from 'jotai'

export const isMobileDrawerActiveAtom = atom<boolean>(false)
export const isHeadroomActiveAtom = atom<boolean>(true)
export const isHeaderHeightAtom = atom<number>(0)
export const bannerHeightAtom = atom<number>(0)
export const isHeaderHiddenAtom = atom<boolean>(false)
export const isTransparentHeaderAtom = atom<boolean>(false)
export const setIsTransparentHeaderAtom = atom(null, (_, set, newValue: boolean) => {
  set(isTransparentHeaderAtom, newValue)
})
