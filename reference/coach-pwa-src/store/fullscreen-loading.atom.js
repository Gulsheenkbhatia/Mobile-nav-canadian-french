import { atom } from 'jotai'

export const fullscreenLoadingAtom = atom(false)
export const setFullscreenLoadingAtom = atom(null, (get, set, visible) =>
  set(fullscreenLoadingAtom, visible)
)
