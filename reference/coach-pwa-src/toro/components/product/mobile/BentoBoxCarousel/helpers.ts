import { getProductImageSrc } from 'toro/helpers/productImages'
import {
  BentoMediaItemType,
  RawMediaItemType,
} from 'toro/components/product/mobile/BentoBoxCarousel/types'
import { MIN_MEDIA_ITEMS_REQUIRED } from 'toro/components/product/mobile/BentoBoxCarousel/constants'

const getBentoImageSrc = (cycleIndex: number, src?: string): string => {
  return getProductImageSrc(src, 'mobile', 'pdp', {
    isBentoBoxSmall: cycleIndex !== 0,
    isBentoBoxLarge: cycleIndex === 0,
  })
}

export const applyBentoMediaProps = (item: RawMediaItemType, index: number): BentoMediaItemType => {
  const bentoCycleIndex = (index + 1) % MIN_MEDIA_ITEMS_REQUIRED

  return {
    ...item,
    src: getBentoImageSrc(bentoCycleIndex, item.src),
    poster: item.type === 'video' ? getBentoImageSrc(bentoCycleIndex, item.poster?.src) : null,
    isLarge: bentoCycleIndex === 0,
  }
}
