import { atom } from 'jotai'
import isBoolean from 'lodash/isBoolean'

export const isSgloaderScriptLoadedAtom = atom<boolean>(false)
export const setSgloaderScriptLoadedAtom = atom(null, (_, set, term: boolean) => {
  if (!isBoolean(term)) {
    return
  }
  set(isSgloaderScriptLoadedAtom, term)
})

export const afterpayScriptLoadedAtom = atom<boolean>(false)

export const setAfterpayScriptLoadedAtom = atom(null, (_, set) => {
  set(afterpayScriptLoadedAtom, true)
})

export const paidyScriptLoadedAtom = atom<boolean>(false)

export const setPaidyScriptLoadedAtom = atom(null, (_, set) => {
  set(paidyScriptLoadedAtom, true)
})

export const affirmScriptLoadedAtom = atom<boolean>(false)

export const setAffirmScriptLoadedAtom = atom(null, (_, set) => {
  set(affirmScriptLoadedAtom, true)
})

export const staffStartScriptsAtom = atom<object[]>([])

export const setStaffStartScriptsAtom = atom(
  null,

  (get, set, newScripts: object[]) => {
    if (newScripts.length === 0) {
      set(staffStartScriptsAtom, [])
      return
    }
    const currentScripts = get(staffStartScriptsAtom)
    const updatedScripts = [...currentScripts, ...newScripts]
    set(staffStartScriptsAtom, updatedScripts)
  }
)
export const isStaffStartScriptAtom = atom(false)
