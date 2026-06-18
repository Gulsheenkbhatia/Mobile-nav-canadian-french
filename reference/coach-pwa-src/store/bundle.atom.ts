import { atom } from 'jotai'
import { Color, Size } from 'toro/types/productTypes/common'
import { atomWithDefault } from 'jotai/utils'

interface BundleSelectedVariation {
  [key: string]: [Color | null, Size | null, Size | null]
}
interface BundleOrderingStatus {
  [key: string]: [string, boolean]
}

type BundleSelectedSizeOrWidth = [string, number]

interface BundleErrorPayload {
  quantity: number
  availableQuantity: number
  itemsNotAvailableMsg: string
}

interface BundleErrorState {
  maxQuantityError: boolean
  itemsNotAvailableError: boolean
  payload: BundleErrorPayload
}

type BundleError = Record<string, BundleErrorState>

export const bundleIsNotifyMeAvailableAtom = atom<boolean>(false)
export const bundleVariantsProductsQtyAtom = atom({})
export const bundleSelectedSizeAtom = atom({})
export const bundleSelectedWidthAtom = atom({})
export const bundleSelectedVariationAtom = atom<BundleSelectedVariation>({})
export const selectedBundleVariantsDataAtom = atom({})
export const selectedBundleVariantGroupDataAtom = atom({})
export const bundleOrderingStatusAtom = atom<BundleOrderingStatus>({})
export const stickyContainerStateAtom = atom({})

export const bundleErrorsAtom = atomWithDefault<BundleError>((get) => {
  const selectedBundleVariantsData = { ...get(selectedBundleVariantsDataAtom) }

  for (const variantIdx in selectedBundleVariantsData) {
    selectedBundleVariantsData[variantIdx] = {
      maxQuantityError: false,
      itemsNotAvailableError: false,
      payload: {},
    }
  }

  return selectedBundleVariantsData
})

export const setBundleSelectedSizeAtom = atom(
  null,
  (get, set, update: Record<string, BundleSelectedSizeOrWidth>) => {
    set(bundleSelectedSizeAtom, { ...get(bundleSelectedSizeAtom), ...update })
  }
)
export const setBundleSelectedWidthAtom = atom(
  null,
  (get, set, update: Record<string, BundleSelectedSizeOrWidth>) => {
    set(bundleSelectedWidthAtom, { ...get(bundleSelectedWidthAtom), ...update })
  }
)

export interface BundlePromotionAtomType {
  _type: string
  id: string
  online: {
    default: boolean
  }
  c_body: {
    default: {
      markup: string
    }
  }
  metaData: { [key: string]: any }
  other_info: { [key: string]: any }
  status: string
  error_message: string
}

export const bundlePromotionAtom = atom<Record<string, BundlePromotionAtomType>>({})
