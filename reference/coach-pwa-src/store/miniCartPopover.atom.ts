import { atom } from 'jotai'

export const isLoadMiniCartPopoverAtom = atom(false)

export const cartProductIdsAtom = atom([])

type BasketProduct = {
  product_id: string
  quantity: number
}

type SessionCart = { product_items: Array<BasketProduct> | null } | null

export const setCartProductIdsAtom = atom(null, (get, set, sessionCart: SessionCart): void => {
  if (!sessionCart?.product_items) return
  const cartProductIds = get(cartProductIdsAtom)
  let basketProductMap: Record<string, number> = {}
  const basketProducts = sessionCart.product_items || []
  for (const basketProduct of basketProducts) {
    if (basketProductMap[basketProduct.product_id]) {
      basketProductMap[basketProduct.product_id] += basketProduct.quantity
    } else {
      basketProductMap[basketProduct.product_id] = basketProduct.quantity
    }
  }
  const basketProductIds = Object.entries(basketProductMap).map((item) => item.join('-'))
  if (basketProductIds.every((id) => cartProductIds.includes(id))) return
  set(cartProductIdsAtom, basketProductIds)
})
