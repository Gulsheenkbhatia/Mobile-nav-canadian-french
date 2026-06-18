import { useMemo } from 'react'
import get from 'lodash/get'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom } from 'store/pdp.atom'

// Used to find the matching image src for the one to display the reviews overlay on
const useReviewOverlayImageSrc = (fullMedias: Array<{ src: string; type: string }>) => {
  const isReviewsImageOverlayExperiment = useExperiment(
    `${EXPERIMENTS.PDP_REVIEWS_OVERLAY_IMAGE_UPPER}-${EXPERIMENTS.PDP_REVIEWS_OVERLAY_IMAGE_LOWER}`
  )

  const {
    toggleSiteFeatures: { reviewsOnImageCarouselConfigs },
  } = usePreference({
    ToggleSiteFeatures: ['reviewsOnImageCarouselConfigs'],
  })
  const productData = useAtomValue(productDataAtom)

  const { custom, reviewsData } = productData || {}

  const averageRating = get(custom, 'c_avgRatingEmplifi', 0)

  const reviewsAverageRating =
    get(reviewsData, 'results[0].rollup.average_rating', 0) || averageRating

  const reviewThreshold = get(reviewsOnImageCarouselConfigs, 'reviewThreshold')

  const isHighReviewsAverageRating = Number(reviewsAverageRating) >= Number(reviewThreshold)

  const reviewsOnImageCarouselEnabled = get(reviewsOnImageCarouselConfigs, 'enable', false)

  return useMemo(() => {
    if (
      !reviewsOnImageCarouselEnabled ||
      !isReviewsImageOverlayExperiment ||
      !isHighReviewsAverageRating
    ) {
      return ''
    }

    const medias = fullMedias.filter((item) => !!item && item.type !== 'video')

    if (!medias.length) {
      return ''
    }

    const suffixes = get(reviewsOnImageCarouselConfigs, 'ImageSuffixLookup')?.split(',')
    if (!suffixes) {
      return ''
    }

    for (const suffix of suffixes) {
      for (const { src } of medias) {
        if (src.split('?')[0]?.endsWith(suffix)) {
          return src
        }
      }
    }

    return ''
  }, [fullMedias, isReviewsImageOverlayExperiment, reviewsOnImageCarouselEnabled])
}

export default useReviewOverlayImageSrc
