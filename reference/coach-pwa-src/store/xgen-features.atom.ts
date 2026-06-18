import { atom } from 'jotai'
import { XgenFeaturesConfig } from 'toro/lib/vendorProductsAdapter/shared/types/preferences'

export const xgenFeaturesAtom = atom<XgenFeaturesConfig>({
  search: false,
  recommendations: false,
  tracking: false,
})
