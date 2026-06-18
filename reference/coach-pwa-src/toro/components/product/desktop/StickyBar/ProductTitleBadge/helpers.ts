import { ProductVariant } from 'toro/types/productTypes'
import get from 'lodash/get'

type SelectedData = {
  c_inventoryThreshold: ProductVariant['customAttributes']['c_inventoryThreshold']
  sourceCodeBadge: ProductVariant['sourceCodeBadge']
  sourceCodeMessage: ProductVariant['sourceCodeMessage']
  marketingBadgeConf: ProductVariant['marketingBadgeConf']
  marketingMessageConf: ProductVariant['marketingMessageConf']
  bestSellerCheck: ProductVariant['bestSellerCheck']
  validFrom: ProductVariant['validFrom']
  c_avgRatingEmplifi: ProductVariant['customAttributes']['c_avgRatingEmplifi']
  c_revCountEmplifi: ProductVariant['customAttributes']['c_revCountEmplifi']
  c_isFinalSale: ProductVariant['customAttributes']['c_isFinalSale']
  c_maxSalePercent: ProductVariant['customAttributes']['c_maxSalePercent']
}

export const selectBadgeDataFromSelectedVariant = (
  selectedVariant: ProductVariant
): SelectedData => {
  const extract = (path: string) => get(selectedVariant, path)
  return {
    c_inventoryThreshold: extract('customAttributes.c_inventoryThreshold'),
    sourceCodeBadge: extract('sourceCodeBadge'),
    sourceCodeMessage: extract('sourceCodeMessage'),
    marketingBadgeConf: extract('marketingBadgeConf'),
    marketingMessageConf: extract('marketingMessageConf'),
    bestSellerCheck: extract('bestSellerCheck'),
    validFrom: extract('validFrom'),
    c_avgRatingEmplifi: extract('customAttributes.c_avgRatingEmplifi'),
    c_revCountEmplifi: extract('customAttributes.c_revCountEmplifi'),
    c_isFinalSale: extract('customAttributes.c_isFinalSale'),
    c_maxSalePercent: extract('customAttributes.c_maxSalePercent'),
  }
}

export const prioritize = <T>(...values: (T | null | undefined)[]): T | undefined => {
  return values.find((value) => value !== undefined && value !== null)
}
