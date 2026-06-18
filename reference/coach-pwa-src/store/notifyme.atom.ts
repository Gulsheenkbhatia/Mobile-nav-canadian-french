import { atom } from 'jotai'

export const notifyMeModalDataAtom = atom<any>(null)
export const isNotifyMeModalRenderedAtom = atom(false)
export const notifyMeChosenProductIdAtom = atom('')
export const notifyMeChosenProductNameAtom = atom('')

export const isNotifyMeModalVisibleAtom = atom(false)
export const setIsNotifyMeModalVisibleAtom = atom(null, (_, set, visible: boolean) => {
  if (visible) {
    set(isNotifyMeModalRenderedAtom, true)
  }
  set(isNotifyMeModalVisibleAtom, visible)
})
