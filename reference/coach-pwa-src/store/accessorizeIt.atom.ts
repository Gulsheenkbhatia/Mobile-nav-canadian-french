import getAPIURL from 'helpers/getAPIURL'
import withCorrId from 'helpers/traceability'
import { atom } from 'jotai'
import { selectedVariantGroupAtom } from 'store/pdp.atom'
import { encodeAccessorizeItParam } from 'toro/helpers/minProducts'
import type {
  AccessorizeItProductsData,
  NormalizedAccessorizeItProduct,
} from 'toro/types/productTypes'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'

type AccessorizeItProductsIDsSet = {
  straps?: string | string[]
  charms?: string | string[]
  vgId?: string
}

export const accessorizeItProductsIDsSetAtom = atom<AccessorizeItProductsIDsSet>((get) => {
  const selectedVariantGroup = get(selectedVariantGroupAtom)
  if (!selectedVariantGroup) return {}

  const enableCoachCreate = _get(selectedVariantGroup, 'customAttributes.c_enableCoachCreate')
  const straps = _get(selectedVariantGroup, 'customAttributes.c_accessorizeItStraps')
  const charms = _get(selectedVariantGroup, 'customAttributes.c_accessorizeItCharms')

  // If PIM toggle is off and no accessorize-it data is available, return empty object
  if (!enableCoachCreate || (!straps && !charms)) return {}

  return {
    straps,
    charms,
    vgId: selectedVariantGroup?.id,
  }
})

// components that use this atom should be used with Suspense
export const accessorizeItProductsDataAtom = atom<Promise<AccessorizeItProductsData>>(
  async (get) => {
    const accessorizeItProductsIDsSet = get(accessorizeItProductsIDsSetAtom)
    if (_isEmpty(accessorizeItProductsIDsSet)) return {}

    // Prepare the data object for encoding
    const accessorizeItData: AccessorizeItProductsIDsSet = {}

    if (accessorizeItProductsIDsSet.straps) {
      accessorizeItData.straps = accessorizeItProductsIDsSet.straps
    }

    if (accessorizeItProductsIDsSet.charms) {
      accessorizeItData.charms = accessorizeItProductsIDsSet.charms
    }

    // Encode the data for the query parameter
    const encodedIds = encodeAccessorizeItParam(accessorizeItData)
    const selectedVariantGroup = get(selectedVariantGroupAtom)
    try {
      const fetchWithCorrId = withCorrId()
      const response = await fetchWithCorrId(
        getAPIURL(
          `/get-accessorize-it-data?ids=${encodedIds}&vgId=${accessorizeItProductsIDsSet.vgId}`
        )
      )
      const data = await response.json()

      return data
    } catch (err) {
      console.error(
        `Error fetching accessorize-it data for variant group ${selectedVariantGroup.id}.`
      )
      return {}
    }
  }
)

export const accessorizeItSelectedProductIDAtom = atom<string>('')

export const setAccessorizeItSelectedProductIDAtom = atom(null, (get, set, productID: string) => {
  if (!isString(productID)) return
  set(accessorizeItSelectedProductIDAtom, productID)
})

export const accessorizeItSelectedProductAtom = atom<NormalizedAccessorizeItProduct | null>(
  (get) => {
    const accessorizeItSelectedProductID = get(accessorizeItSelectedProductIDAtom)
    const accessorizeItProductsData = get(accessorizeItProductsDataAtom)

    if (!accessorizeItSelectedProductID || _isEmpty(accessorizeItProductsData)) {
      return null
    }

    const allProducts = Object.values(accessorizeItProductsData).filter(Array.isArray).flat()

    const selectedProduct = allProducts.find(
      (product) => product.id === accessorizeItSelectedProductID
    )

    return selectedProduct || null
  }
)

export const accessorizeItInViewAtom = atom<boolean>(false)

export const setAccessorizeItInViewAtom = atom(null, (get, set, inView: boolean) => {
  set(accessorizeItInViewAtom, inView)
})
