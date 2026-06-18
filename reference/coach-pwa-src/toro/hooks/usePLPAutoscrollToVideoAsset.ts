import { useAtomValue } from 'jotai/utils'
import { viewedProductsAtom } from 'store/viewed-products.atom'
import get from 'lodash/get'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import type { Color, MediaItem } from 'toro/types/productTypes'
import usePreference from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import { isOnModelPlp2UpAtom } from 'store/plp.atom'

type UsePLPAutoscrollToVideoAsset = (
  color: Color,
  thumbnails: MediaItem[]
) => {
  autoscrollToVideoEnabled: boolean
  videoAssetIndex: number
  halfScrollRequired: boolean
}

export const getThumbnailIndex2UpTemplate = (index: number) => {
  return index < 0 ? index : Math.floor(index / 2)
}

export const isHalfScrollRequired = (index: number) => index > 1 && index % 2 === 0

export const usePLPAutoscrollToVideoAsset: UsePLPAutoscrollToVideoAsset = (color, thumbnails) => {
  const viewedProductIds = useAtomValue(viewedProductsAtom)
  const {
    toggleSiteFeatures: { similarOptionsCTAConfig },
  } = usePreference({ ToggleSiteFeatures: ['similarOptionsCTAConfig'] })
  const isSimilarOptionsCtaEnabled = get(similarOptionsCTAConfig, 'PLP.enable', false)
  const isPlpAutoscrollToVideoEnabled = useExperiment(EXPERIMENTS.PLP_AUTOSCROLL_TO_VIDEO)
  const { isPLP } = usePageType()
  const isOnModel2UpTemplateEnabled = useAtomValue(isOnModelPlp2UpAtom)

  const { videoAssetIndex, halfScrollRequired } = useMemo(() => {
    if (isEmpty(thumbnails))
      return {
        videoAssetIndex: -1,
        halfScrollRequired: false,
      }

    const index = thumbnails.findIndex((thumbnail) => {
      return 'type' in thumbnail && thumbnail.type === 'video'
    })

    return {
      videoAssetIndex: isOnModel2UpTemplateEnabled ? getThumbnailIndex2UpTemplate(index) : index,
      halfScrollRequired: isOnModel2UpTemplateEnabled ? isHalfScrollRequired(index) : false,
    }
  }, [thumbnails, isOnModel2UpTemplateEnabled])

  const autoscrollToVideoEnabled = useMemo(() => {
    if (
      !isPLP ||
      !isPlpAutoscrollToVideoEnabled ||
      isEmpty(color) ||
      !isSimilarOptionsCtaEnabled ||
      videoAssetIndex < 0
    ) {
      return false
    }

    return (
      viewedProductIds.includes(color.masterId) ||
      viewedProductIds.some((id) => color.vgId?.startsWith(id))
    )
  }, [
    isPLP,
    isPlpAutoscrollToVideoEnabled,
    color,
    isSimilarOptionsCtaEnabled,
    viewedProductIds,
    videoAssetIndex,
  ])

  return {
    autoscrollToVideoEnabled,
    videoAssetIndex,
    halfScrollRequired,
  }
}
