import { useReducerAtom } from 'jotai/utils'
import { ATBDrawerState, drawerAtom } from 'store/addToCartDrawer.atom'

export enum ATB_DRAWER_ACTIONS {
  BATCH_DRAWER_STATE = 'BATCH_DRAWER_STATE',
  SET_VISIBLE = 'SET_VISIBLE',
}

type DrawerAction = {
  type: ATB_DRAWER_ACTIONS
  payload: Partial<ATBDrawerState>
}

function drawerReducer(state: ATBDrawerState, { type, payload }: DrawerAction) {
  switch (type) {
    case ATB_DRAWER_ACTIONS.BATCH_DRAWER_STATE: {
      return {
        ...state,
        ...payload,
      }
    }
    case ATB_DRAWER_ACTIONS.SET_VISIBLE:
      return {
        ...state,
        drawerVisible: payload.drawerVisible,
      }
    default:
      return state
  }
}

export const useDrawerAtom = () => useReducerAtom(drawerAtom, drawerReducer)
