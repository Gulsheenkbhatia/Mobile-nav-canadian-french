import { atom } from 'jotai'

const initialRouteKeyAtom = atom<string>('')
initialRouteKeyAtom.onMount = (setAtom) => {
  setAtom(window.history?.state?.key || '')
}

export default initialRouteKeyAtom
