import { fetchActiveProductData } from 'toro/helpers/fetchActiveProductData'
import { fetchProductDataFromClient } from 'toro/helpers/fetchProductDataFromClient'

const isActiveProductApiEnabled = process.env.NEXT_PUBLIC_ENABLE_ACTIVE_PRODUCT_API === 'true'

interface FetchSwatchProductDataParams {
  id: string
  activeColorId?: string
  cached?: boolean
  masterId: string
  variants?: any[]
  locale?: string
}

export function fetchSwatchProductData({
  id,
  activeColorId,
  cached,
  masterId,
  variants,
  locale,
}: FetchSwatchProductDataParams) {
  if (isActiveProductApiEnabled) {
    return fetchActiveProductData({
      id,
      masterId,
      activeColorId,
      locale,
    })
  }

  return fetchProductDataFromClient({
    id,
    activeColorId,
    cached,
    masterId,
    variants,
    locale,
    url: undefined,
    colorId: undefined,
    signal: undefined,
    include: undefined,
  })
}
