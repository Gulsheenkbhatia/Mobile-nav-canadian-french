import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import _partition from 'lodash/partition'

export function getFileBaseName(url) {
  if (!isString(url)) {
    return ''
  }
  const terminationOfUrl = url.split('/').pop()
  const fileBaseName = terminationOfUrl.split('?')[0].split('#')[0]

  return fileBaseName
}

export function getLastImageIdx(medias) {
  for (let i = medias.length - 1; i >= 0; i--) {
    if (medias[i].type !== 'video') {
      return i
    }
  }
}
const videoRegex = /[^a-zA-Z0-9]+/g
export const getVideoSources = (videoSrc, selectedVariant, selectedColor) => {
  const videoSrcArray = []
  const productVideos = videoSrc?.Product
  const cleanedSelectedColor = isEmpty(selectedVariant)
    ? selectedColor?.id?.replace(videoRegex, '')
    : selectedVariant?.variationValues?.color?.replace(videoRegex, '')
  if (cleanedSelectedColor && productVideos) {
    for (const videoKey of Object.keys(productVideos)) {
      const filepathWithSku = videoKey.split('_')
      if (filepathWithSku.length > 1) {
        const matches = filepathWithSku[1].match(new RegExp(cleanedSelectedColor, 'ig'))
        !!matches?.length && videoSrcArray.push(productVideos[videoKey])
      }
    }
  }
  return videoSrcArray
}

export const isSpecificAssetTypeSrc = (src, assetType) => {
  if (!src) return false

  const url = src.split('?')[0]
  const dotIndex = url.lastIndexOf('.')
  const slashIndex = url.lastIndexOf('/')

  return (dotIndex > slashIndex ? url.substring(0, dotIndex) : url).endsWith(assetType)
}

export const getAssetTypeFromSrc = (src) => {
  return src?.split('?')[0].split('_').pop()
}

/**
 * Extracts a lookbook image from a media array by asset types.
 * @param {ProductMediaItem[]} media - Array of media objects
 * @param {string[]} assetTypes - Array of asset types
 * @returns {[ProductMediaItem | null, ProductMediaItem[]]} Tuple: [matched object or null, remaining media]
 */
export const extractLookbookImage = (media, assetTypes) => {
  const mediaItems = Array.isArray(media) ? media : []
  const mediaTypes = Array.isArray(assetTypes) ? assetTypes : []

  if (!mediaItems.length || !mediaTypes.length) {
    return [null, mediaItems]
  }

  const [matched, rest] = _partition(
    mediaItems,
    (item) =>
      item?.type === 'image' && mediaTypes.some((type) => isSpecificAssetTypeSrc(item.src, type))
  )

  return [matched[0] || null, rest]
}
