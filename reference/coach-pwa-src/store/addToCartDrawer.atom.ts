import { atom } from 'jotai'

export type ATBDrawerState = {
  drawerVisible: boolean
  drawerQuantity: number
  isPartialAdded: boolean
  drawerErrorMsgFlag: boolean
  variantId?: string
  vgId?: string
}

const initialState: ATBDrawerState = {
  drawerQuantity: 0,
  drawerVisible: false,
  isPartialAdded: false,
  drawerErrorMsgFlag: false,
}

export const drawerAtom = atom(initialState)
