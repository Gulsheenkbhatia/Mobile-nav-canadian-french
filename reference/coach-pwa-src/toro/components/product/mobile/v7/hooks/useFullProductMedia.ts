import get from 'lodash/get'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useSimilarOptionsOnPDP from 'toro/hooks/useSimilarOptionsOnPDP'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import usePreference from 'toro/hooks/usePreference_new'
import useProductData from 'toro/hooks/useProductData'

const useFullProductMedia = () => {
  const media = useSelectedColorData('media')
  const isPdpV7 = useTemplate([TemplateName.pdpv7])
  const enableFullBleed = useProductData('custom.c_enableFullBleed') ?? false
  const {
    fullBleed: { dynamicAssetConfig },
  } = usePreference({
    'Full-Bleed': ['dynamicAssetConfig'],
  })

  const { extendMediaForSimilarOption } = useSimilarOptionsOnPDP()

  const rawFullMedias = get(media, 'full', [])

  const pdpV7PngHeroEnabled = Boolean(isPdpV7 && dynamicAssetConfig?.enable && enableFullBleed)

  const productMedias = rawFullMedias.map((item, idx) => ({
    ...item,
    isPdpV7PngHero: pdpV7PngHeroEnabled && idx === 0 && item.type !== 'video',
    poster:
      item.type === 'video'
        ? getProductImageSrc(get(item, 'poster.src'), 'mobile', 'pdp')
        : undefined,
  }))

  return extendMediaForSimilarOption(productMedias)
}

export default useFullProductMedia
