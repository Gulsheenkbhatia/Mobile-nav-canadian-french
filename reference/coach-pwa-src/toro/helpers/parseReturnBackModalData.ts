import get from 'lodash/get'
import { isSoldOut } from 'toro/helpers/preferences'
import { getImage } from './imagesHelper'
import { ViewportContextType } from 'test-utils/ContextValuesTypes'
import isPlainObject from 'lodash/isPlainObject'
import { ProductForBadges } from 'toro/components/badges/types'

const SHOPPING_BAG_PATH = '/shopping-bag'

type ProductModalData = {
  link: string
  imageUrl: string
  imageAlt: string
  isCartProducts: boolean
}

export const parseReturnBackModalData = (
  product: ProductForBadges,
  viewport: ViewportContextType['viewport'],
  isCartProducts: boolean
): ProductModalData | void => {
  if (!product || !isPlainObject(product)) return
  const isProductSoldOut = isSoldOut(product)
  if (isProductSoldOut) return
  const { imageUrl, imageAlt } = getImage(product, viewport)
  const link = isCartProducts ? SHOPPING_BAG_PATH : get(product, 'url')
  return { link, imageUrl, imageAlt, isCartProducts }
}
