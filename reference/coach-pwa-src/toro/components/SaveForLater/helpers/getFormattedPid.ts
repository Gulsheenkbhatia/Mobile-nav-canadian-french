import { getColorVariantId, parseProductId } from 'toro/helpers/productVariations'

export type FindFormattedPidProps = {
  wishlistId: string
  selectedVariant: unknown // TODO: expects typescript type
}
export function getFormattedPid({ wishlistId, selectedVariant }): string {
  const { masterId, colorId } = parseProductId(wishlistId)
  const _colorId = selectedVariant?.variationValues?.color || colorId

  return getColorVariantId(masterId, _colorId, [selectedVariant]) || wishlistId
}
