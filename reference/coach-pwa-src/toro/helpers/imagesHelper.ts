import { getPropValuesFromVariationValues } from 'toro/helpers/productVariations'
import { getVGSizesfromColor } from 'toro/helpers/skuHelper'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { ViewportContextType } from 'test-utils/ContextValuesTypes'
import get from 'lodash/get'
import isPlainObject from 'lodash/isPlainObject'
import compact from 'lodash/compact'
import { getAssetTypeFromSrc } from 'toro/components/product/ProductMediaArea/helpers'
import uniqBy from 'lodash/uniqBy'

type ImageData = {
  imageAlt: string
  imageUrl: string
}

export const formatSizeWidth = (itemAddedtoCart, sizeId, color, neutralSizingData) => {
  const { isNeutralSizingEnabled, neutralSizingCountryTypes } = neutralSizingData || {}
  const sizes = getVGSizesfromColor(itemAddedtoCart, color)
  const addedFormattedSize = sizes?.find((item) => item.id == sizeId)
  const formattedSize =
    (isNeutralSizingEnabled && isPlainObject(addedFormattedSize?.text)) ||
    isPlainObject(addedFormattedSize?.text)
      ? { ...addedFormattedSize, text: addedFormattedSize?.text[neutralSizingCountryTypes[0]] }
      : addedFormattedSize
  return formattedSize
}

export const getImageProperties = (
  product: object,
  isNewMegaPDPPreference?: boolean,
  neutralSizingData?: object
) => {
  const values = getPropValuesFromVariationValues(product, true, isNewMegaPDPPreference)
  return values?.size
    ? {
        ...values,
        size: formatSizeWidth(
          product,
          get(values, 'size.id', get(values, 'size.value')),
          get(values, 'color'),
          neutralSizingData
        ),
      }
    : values
}

export const getImage = (product: object, viewport: ViewportContextType['viewport']): ImageData => {
  const image = getImageProperties(product)
  const thumbnail = get(image, 'color.media.thumbnail', get(product, 'media.thumbnail'))
  const imageAlt = get(thumbnail, 'alt', 'product')
  const imageUrl = getProductImageSrc(thumbnail?.src, viewport, 'plp')

  return { imageAlt, imageUrl }
}

export const mergeThumbnailsWithOnModel = (
  onModelPlpSequence = [],
  displayedThumbnails = [],
  allThumbnails = [],
  isOnModelPlp2Up = false
) => {
  let onModelPlpSequencedThumbnails = []

  if (!!onModelPlpSequence?.length) {
    onModelPlpSequencedThumbnails = compact(
      onModelPlpSequence.map((item) =>
        allThumbnails.find(({ src = '' }) => item === getAssetTypeFromSrc(src))
      )
    )

    let updatedThumbnailsArray = [...displayedThumbnails]

    if (!!onModelPlpSequencedThumbnails.length) {
      updatedThumbnailsArray.splice(isOnModelPlp2Up ? 1 : 0, 0, onModelPlpSequencedThumbnails[0])
    }

    return uniqBy(updatedThumbnailsArray, ({ src }) => src)
  }

  return displayedThumbnails
}
