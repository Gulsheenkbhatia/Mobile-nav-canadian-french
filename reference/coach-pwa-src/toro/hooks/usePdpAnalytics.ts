import {
  gaProductDataAtom,
  selectedSubmittableVariantDataAtom,
  selectedVariantGroupAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { useEffect, useRef } from 'react'
import useAnalytics from 'toro/analytics/useAnalytics'
import get from 'lodash/get'
import { selectedVariantInventoryAtom, inventoryLoadable } from 'store/inventory.atom'

const usePdpAnalytics = () => {
  const gaProductData = useAtomValue(gaProductDataAtom)
  const selectedSubmittableVariantData = useAtomValue(selectedSubmittableVariantDataAtom)
  const selectedVariantGroup = useAtomValue(selectedVariantGroupAtom)
  const selectedVariantInventory = useAtomValue(selectedVariantInventoryAtom)
  const inventory = useAtomValue(inventoryLoadable)
  const lastSelectedVariantInventoryIdRef = useRef('')

  const analytics = useAnalytics()

  const isProductExist = gaProductData?.isProductExist

  useEffect(() => {
    if (
      !isProductExist ||
      !selectedVariantInventory?.id ||
      inventory.state !== 'hasData' ||
      lastSelectedVariantInventoryIdRef.current === selectedVariantInventory?.id
    )
      return

    lastSelectedVariantInventoryIdRef.current = selectedVariantInventory?.id || ''

    const selectedSku = get(
      selectedSubmittableVariantData,
      'id',
      get(selectedVariantGroup, 'variantsAssigned')?.[0]
    )

    analytics.send('viewItem', {
      ...gaProductData,
      product: {
        ...gaProductData.product,
        quantity: '1',
      },
      selectedVariantId: selectedSku,
    })
  }, [isProductExist, selectedVariantInventory?.id, inventory.state])
}

export default usePdpAnalytics
