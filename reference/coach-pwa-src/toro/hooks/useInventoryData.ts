import { selectAtom, useAtomValue } from 'jotai/utils'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { useCallback } from 'react'
import { inventoryAtom } from 'store/inventory.atom'

/**
 * Custom hook to retrieve inventory data based on provided IDs.
 *
 * @param {string | string[]} ids - A single ID or an array of IDs to filter the inventory data.
 * @returns {Inventory} The filtered inventory data based on the provided IDs.
 */
const useInventoryData = (ids: string | string[]) => {
  const dependency = Array.isArray(ids) ? ids.join(':') : ids
  const selector = useCallback(
    (inventory) => {
      const predicate = (variant) => (id) => new RegExp(id).test(variant?.id)
      const { variationGroupInventoryData = [] } = inventory || {}
      if (isEmpty(ids)) {
        return
      }
      if (isArray(ids)) {
        return variationGroupInventoryData.filter((variant) => ids.some(predicate(variant)))
      }

      return variationGroupInventoryData.find((variant) => predicate(variant))
    },
    [dependency]
  )
  return useAtomValue(selectAtom(inventoryAtom, selector))
}

export default useInventoryData
