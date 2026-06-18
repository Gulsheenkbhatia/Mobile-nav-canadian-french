import { useMemo } from 'react'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference_new'

interface MediaItem {
  type?: string
  isLookBook?: boolean
  [key: string]: any
}

const useSimilarOptionsOnPDP = () => {
  const {
    toggleSiteFeatures: { similarOptionsCTAConfig },
  } = usePreference({
    ToggleSiteFeatures: ['similarOptionsCTAConfig'],
  })

  const isSimilarOptionOnPDPEnabled = get(similarOptionsCTAConfig, 'PDP.enable', false)

  const extendMediaForSimilarOption = useMemo(
    () => (processedMedias: MediaItem[]) => {
      if (isSimilarOptionOnPDPEnabled && processedMedias.length > 0) {
        const firstProductImage = processedMedias.find(
          (i) => i.type !== 'video' && i.isLookBook !== true
        )

        if (firstProductImage) {
          return [...processedMedias, firstProductImage]
        }
      }

      return processedMedias
    },
    [isSimilarOptionOnPDPEnabled]
  )

  return { isSimilarOptionOnPDPEnabled, extendMediaForSimilarOption }
}

export default useSimilarOptionsOnPDP
