interface AccordionsReducerState {
  activeIndexes: number[]
}

export const initialState = {
  activeIndexes: [],
}

export enum ACCORDIONS_REDUCER_ACTIONS {
  SET_INDEXES = 'SET_INDEXES',
  SET_INDEXES_BY_PARAMS = 'SET_INDEXES_BY_PARAMS',
}

interface SetIndexes {
  type: ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES
  payload: number[]
}
interface SetIndexesByParams {
  type: ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES_BY_PARAMS
  payload: { freeShippingAccVisible: boolean; accordionSectionExpandValue: any }
}

type AccordionReducerActions = SetIndexes | SetIndexesByParams

const getIndexes = (freeShippingAccVisible, accordionSectionExpandValue) => {
  return [
    accordionSectionExpandValue?.pdpProductDetailsState?.rank,
    accordionSectionExpandValue?.pdpEditorNotesExpandState?.rank,
  ].map((index) => index - 1 + Number(freeShippingAccVisible))
}

export const accordionsReducer = (
  state: AccordionsReducerState,
  action: AccordionReducerActions
) => {
  switch (action.type) {
    case ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES: {
      return { ...state, activeIndexes: action.payload }
    }
    case ACCORDIONS_REDUCER_ACTIONS.SET_INDEXES_BY_PARAMS: {
      const { freeShippingAccVisible, accordionSectionExpandValue } = action.payload

      return {
        ...state,
        activeIndexes: getIndexes(freeShippingAccVisible, accordionSectionExpandValue),
      }
    }
    default: {
      return state
    }
  }
}
