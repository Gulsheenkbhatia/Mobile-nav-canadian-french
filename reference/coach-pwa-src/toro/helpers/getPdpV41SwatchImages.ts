import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'

export const getPdpV41SwatchImages = ({ colors = [], variationGroup = [] }) => {
  return colors.map((item) => {
    const itemVariationGroup = variationGroup.find((vg) => item.vgId === vg.id)
    const b0image = itemVariationGroup?.b0Image
    if (b0image) {
      return { ...item, pdpV41SwatchImage: b0image }
    }
    const productImages = itemVariationGroup?.imageGroups?.find(
      (imageObj) => imageObj?.viewType?.toLowerCase() === 'product'
    )?.images
    const a0Image = productImages?.find((item) => isSpecificAssetTypeSrc(item?.src, 'a0')) ||
      productImages?.[0] || { src: '', alt: '' }
    return { ...item, pdpV41SwatchImage: a0Image }
  })
}
