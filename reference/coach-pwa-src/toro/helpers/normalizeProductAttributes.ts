import type { ProductReachVariants } from 'toro/types/productTypes'
import type { ProductVerticalValues } from 'toro/constants/OneSite'

/**
 * Normalizes custom product attributes:
 * - productReach and productVertical value to lowercase.
 * Handles string values, arrays (takes the first element), null, and undefined.
 */
export function normalizeProductReach(
  value: ProductReachVariants | ProductReachVariants[] | null | undefined
): ProductReachVariants | undefined {
  if (value == null) {
    return undefined
  }

  // Handle array case: productReach can be an array, take the first element
  const productReachValue = Array.isArray(value) ? value[0] : value

  if (productReachValue == null) {
    return undefined
  }

  return String(productReachValue).toLowerCase() as ProductReachVariants
}

export function normalizeProductVertical(
  value: ProductVerticalValues | string | null | undefined
): ProductVerticalValues | undefined {
  if (value == null) {
    return undefined
  }

  return String(value).toLowerCase() as ProductVerticalValues
}
