import {
  MediaImage,
  MediaItem,
} from 'toro/components/product/ProductMediaArea/AdaptiveProductCarouselMobileAlt/types'
import { isSpecificAssetTypeSrc } from 'toro/components/product/ProductMediaArea/helpers'
import { EXPERIMENTS } from 'toro/constants/experiments'

type LookBookPreference = {
  brand: boolean
  subBrand: boolean
  imageAssets: string[]
  imageAssets_c?: string[]
  imageAssets_d?: string[]
  departments: string[]
}

interface LookBookMedia extends MediaImage {
  isLookBook?: boolean
}

const getAssetTypesForVariant = (pref: LookBookPreference, variant?: string) => {
  if (variant === EXPERIMENTS.LOOKBOOK_VIDEO_WAYS_TO_WEAR) return pref.imageAssets_c
  if (variant === EXPERIMENTS.LOOKBOOK_VIDEO_WHAT_FITS_INSIDE) return pref.imageAssets_d
  return pref.imageAssets
}

export default function getLookBookMedia(
  media: MediaItem[],
  department: string,
  preference?: LookBookPreference,
  isSubBrand = false,
  activeLookBookVariant?: string
): MediaItem[] {
  if (
    !preference ||
    (isSubBrand ? !preference.subBrand : !preference.brand) ||
    !department ||
    !preference.departments.includes(department)
  ) {
    return media
  }

  const assetTypes = getAssetTypesForVariant(preference, activeLookBookVariant)
  if (!assetTypes) return media
  const firstMedia = media.find((item) =>
    assetTypes.some((t) => isSpecificAssetTypeSrc(item.src, t))
  ) as LookBookMedia | undefined

  if (!firstMedia) return media

  return [
    { ...firstMedia, isLookBook: true } as LookBookMedia,
    ...media.filter((m) => m.src !== firstMedia.src),
  ]
}
