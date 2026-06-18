import { InventoryInfo } from 'toro/types/productTypes/common'
import getAPIURL from 'helpers/getAPIURL'
import withCorrId from 'helpers/traceability'
import { atom } from 'jotai'
import {
  productDataAtom,
  selectedColorAtom,
  selectedVariantGroupAtom,
  isSizedProductAtom,
  selectedVariantAtom,
  selectedSizeAtom,
} from 'store/pdp.atom'
import { loadable } from 'jotai/utils'

export type InventoryResponsePayload = {
  inventoryInfo: InventoryInfo
  inventoryListID: string
  status: 'SUCCESS' | 'FAILURE'
  variantInventoryData: InventoryInfo[]
  variationGroupInventoryData: InventoryInfo[]
}

export const inventoryAtom = atom<Promise<InventoryResponsePayload>>(async (get) => {
  const vgId =
    get(selectedVariantGroupAtom)?.id ||
    get(selectedVariantGroupAtom)?.productID ||
    get(productDataAtom)?.selectedVariantGroupId ||
    get(productDataAtom)?.defaultColor?.vgId

  if (!vgId) return

  try {
    const fetchWithCorrId = withCorrId()
    const response = await fetchWithCorrId(getAPIURL(`/inventory?vgId=${vgId}`))
    const data = await response.json()

    return data?.inventory
  } catch (err) {
    console.error(`Error fetching inventory for variant group ${vgId}.`)
    return
  }
})

export const inventoryLoadable = loadable(inventoryAtom)

export const selectedVariantInventoryAtom = atom<InventoryInfo>((get) => {
  const inventory = get(inventoryLoadable)
  const isSizedProduct = get(isSizedProductAtom)
  const selectedVariantData = get(selectedVariantAtom)
  const selectedSize = get(selectedSizeAtom)

  if (inventory.state !== 'hasData') {
    return get(productDataAtom)?.inventory
  }

  if (selectedSize || !isSizedProduct) {
    const vInventoryData = inventory?.data?.variantInventoryData
    return vInventoryData?.find((item) =>
      item?.id?.includes(selectedVariantData?.id || selectedVariantData?.productId)
    )
  }
  const selectedColorId = get(selectedColorAtom)?.id
  const vgInventoryData = inventory?.data?.variationGroupInventoryData
  return vgInventoryData?.find((item) => item?.id?.includes(selectedColorId))
})
