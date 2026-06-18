import get from 'lodash/get'
import {
  MediaItem,
  MediaVideo,
} from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt/types'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'

const secondViewFirstImageSuffix = 'a91'

function hasMediaAssetSuffix(url: string, suffixToCompareWith: string) {
  return isSpecificAssetTypeSrc(url, `_${suffixToCompareWith}`)
}

function getFirstVisitSequence(media, firstVisitImages) {
  const currentMedia = get(media, 'full', []) as MediaItem[]
  const matchImageSrcSuffix = (src) => src.match(/.+_(.+)$/)[1]
  const sortMedia = (ids) => (a, b) => {
    const suffixes = ids.split('/')
    return (
      suffixes.indexOf(matchImageSrcSuffix(a.src)) - suffixes.indexOf(matchImageSrcSuffix(b.src))
    )
  }

  const firstVisitMedia: MediaItem[] = firstVisitImages
    .split(',')
    .map((ids) => {
      return currentMedia
        .sort(sortMedia(ids))
        .find((item) => new RegExp(`(${ids.replace('/', '|')})$`).test(item.src))
    })
    .filter(Boolean)

  const remainingImages: MediaItem[] = currentMedia.filter((mediaItem) => {
    for (const firstVisitImage of firstVisitMedia) {
      if (firstVisitImage.src === mediaItem.src) {
        return false
      }
    }
    return true
  })

  return {
    firstVisitItems: firstVisitMedia,
    firstVisitAllItems: [...firstVisitMedia, ...remainingImages],
  }
}

function getSecondVisitSequece(media) {
  const currentMedia = get(media, 'full', []) as MediaItem[]
  const secondVisitItems = currentMedia.sort((mediaItemA, mediaItemB) => {
    // First Images must get highest priority
    const isAFirstImage = hasMediaAssetSuffix(mediaItemA.src, secondViewFirstImageSuffix)
    const isBFirstImage = hasMediaAssetSuffix(mediaItemB.src, secondViewFirstImageSuffix)
    if (isAFirstImage) return -1
    if (isBFirstImage) return 1

    // Videos will get second priority
    const isAVideo = (mediaItemA as MediaVideo).type === 'video'
    const isBVideo = (mediaItemB as MediaVideo).type === 'video'
    if (isAVideo && isBVideo) return 0
    if (isAVideo) return -1
    if (isBVideo) return 1

    // Keep the rest unsorted
    return 0
  })

  return { secondVisitItems }
}

export default function getAdaptiveCarouselAltMedia(media, firstVisitImages, isSecondVisit) {
  if (isSecondVisit) {
    return getSecondVisitSequece(media)
  }
  if (!firstVisitImages) return null
  return getFirstVisitSequence(media, firstVisitImages)
}
