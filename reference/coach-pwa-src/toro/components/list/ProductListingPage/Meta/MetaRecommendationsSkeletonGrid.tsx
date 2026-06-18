import { memo } from 'react'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'

const META_SKELETON_TILE_COUNT = 6

type MetaRecommendationsSkeletonGridProps = {
  style: Record<string, unknown>
}

function MetaRecommendationsSkeletonGrid({ style }: MetaRecommendationsSkeletonGridProps) {
  return (
    <Box sx={style.recommendationsSkeletonGrid}>
      {Array.from({ length: META_SKELETON_TILE_COUNT }).map((_, i) => (
        <Box key={i} sx={style.recommendationsSkeletonCell}>
          <Skeleton sx={style.recommendationsSkeletonImage} />
          <Skeleton sx={style.recommendationsSkeletonTitle} />
          <Skeleton sx={style.recommendationsSkeletonPrice} />
          <Skeleton sx={style.recommendationsSkeletonButton} />
        </Box>
      ))}
    </Box>
  )
}

export default memo(MetaRecommendationsSkeletonGrid)
