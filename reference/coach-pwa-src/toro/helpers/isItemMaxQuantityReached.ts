import get from 'lodash/get'
import { getProductFromCart } from 'toro/helpers/session'
import { ListingProduct } from 'toro/types/productTypes'

export const isItemMaxQuantityReached = (props: {
  product: ListingProduct
  cartSession: unknown
  maxQtyRestrictionEnabled: boolean
  maxQuantity: number
}) => {
  const { product, cartSession, maxQtyRestrictionEnabled, maxQuantity } = props
  const productId = (product?.id as string)?.includes(' ')
    ? product.id
    : get(product, 'defaultVariant.id', (product?.id as string)?.replace('-', ' '))
  const productFromCart = getProductFromCart(productId, cartSession)
  const productInventory = get(product, 'inventory.ats', 0) as number
  const productQuantityInCart = get(productFromCart, 'quantity', 0) as number
  const productMaxOrderableQty = get(
    product,
    'custom.c_maxOrderableQuantity',
    get(product, 'defaultVariant.customAttributes.c_maxOrderableQuantity', 0)
  ) as number
  const maxQty = maxQtyRestrictionEnabled
    ? productMaxOrderableQty <= 0
      ? maxQuantity
      : productMaxOrderableQty
    : productInventory
  return productQuantityInCart === maxQty
}
