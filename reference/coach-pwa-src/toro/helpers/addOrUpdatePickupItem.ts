import get from 'lodash/get'

interface AddOrUpdatePickupItemParams {
  session: any
  sessionActions: {
    addToCart: (params: any) => Promise<void>
    updateCart: (params: any) => Promise<void>
  }
  product: any
  productId: string
  storeId: string
  quantity: number
}

export async function addOrUpdatePickupItem({
  session,
  sessionActions,
  product,
  productId,
  storeId,
  quantity,
}: AddOrUpdatePickupItemParams) {
  const cartItems = get(session, 'cart.product_items', [])

  const existingPickupItem = cartItems.find(
    (item: any) => item.product_id === productId && item.c_fromStoreId === storeId
  )

  const isExistingItem = Boolean(existingPickupItem)

  const action = isExistingItem ? sessionActions.updateCart : sessionActions.addToCart

  return await action({
    product,
    storeId,
    productId,
    quantity: isExistingItem ? existingPickupItem.quantity + quantity : quantity,
    ...(isExistingItem && { itemId: existingPickupItem.item_id }),
  })
}
