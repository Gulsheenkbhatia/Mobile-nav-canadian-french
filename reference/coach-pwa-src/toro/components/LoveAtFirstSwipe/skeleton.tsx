import { SystemStyleObject } from '@chakra-ui/react'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'

type SkeletonWithStyle = {
  style: Record<string, SystemStyleObject>
}

function LoveAtFirstSwipeStackSkeleton({ style }: SkeletonWithStyle) {
  return (
    <>
      <Skeleton sx={style.skeletonStackCard1} />
      <Skeleton sx={style.skeletonStackCard2} />
      <Skeleton sx={style.skeletonStackCard3} />
    </>
  )
}

function LoveAtFirstSwipeStackCountSkeleton({ style }: SkeletonWithStyle) {
  return <Skeleton sx={style.skeletonCount} />
}

function LoveAtFirstSwipeGridSkeleton({ style }: SkeletonWithStyle) {
  return (
    <>
      {[...Array(2)].map((_, index) => (
        <Box key={`love-at-first-swipe-grid-skeleton-${index}`} sx={style.skeletonGridContainer}>
          <Skeleton sx={style.skeletonGridImage} />
          <Skeleton sx={style.skeletonGridPrice} />
        </Box>
      ))}
    </>
  )
}

export {
  LoveAtFirstSwipeStackSkeleton,
  LoveAtFirstSwipeStackCountSkeleton,
  LoveAtFirstSwipeGridSkeleton,
}
