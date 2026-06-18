import { useMemo } from 'react'
import reverse from 'lodash/reverse'
import orderBy from 'lodash/orderBy'
import { appendQuantityToProducts } from 'toro/components/header/MiniCart/helpers'
import get from 'lodash/get'
import { useAtomValue } from 'jotai/utils'
import { cartProductIdsAtom } from 'store/miniCartPopover.atom'

const processBundleProducts = (cartProducts: Record<string, any>[]) => {
  const reversedProducts = reverse([...cartProducts])

  const bundleItems = reversedProducts.filter((item) => item.c_isBundleProductLineItem)
  if (!bundleItems.length) return reversedProducts

  const bundleVariants = bundleItems.filter((item) => item.c_headlessLastUpdated)
  if (!bundleVariants.length) return appendQuantityToProducts(reversedProducts)

  const sortedBundles = orderBy(bundleVariants, ['c_headlessLastUpdated'], ['desc'])
  const nonBundleItems = reversedProducts.filter(
    (item) => !(item.c_headlessLastUpdated && item.c_isBundleProductLineItem)
  )

  return appendQuantityToProducts([...sortedBundles, ...nonBundleItems])
}

const groupProductsWithEmbellishments = (products: Record<string, any>[]) => {
  return products.reduce<Record<string, any>[]>((finalItems, product) => {
    const customizerProductId = get(product, 'c_customizerId', '')
    const hasEmbellishments = get(product, 'c_hasEmbellishments', false)
    const isEmbellishment = get(product, 'c_customizerParentId', false)

    if (isEmbellishment) return finalItems

    if (hasEmbellishments) {
      const embellishments = products.filter(
        (prod) => get(prod, 'c_customizerParentId') === customizerProductId
      )

      return [
        ...finalItems,
        {
          ...product,
          embellishments,
        },
      ]
    }

    return [...finalItems, product]
  }, [])
}

type UseCartTotalQuantity = (args: { cartProducts: Record<string, any>[] }) => number

const useCartTotalQuantity: UseCartTotalQuantity = ({ cartProducts }) => {
  const cartProductIds = useAtomValue(cartProductIdsAtom)

  const customizedProducts = useMemo(() => {
    if (!cartProducts.length) return []

    const processedProducts = processBundleProducts(cartProducts)
    return groupProductsWithEmbellishments(processedProducts)
  }, [cartProductIds, cartProducts])

  return useMemo(() => {
    return customizedProducts.reduce((total, product) => total + (product.quantity || 0), 0)
  }, [customizedProducts])
}

export default useCartTotalQuantity
