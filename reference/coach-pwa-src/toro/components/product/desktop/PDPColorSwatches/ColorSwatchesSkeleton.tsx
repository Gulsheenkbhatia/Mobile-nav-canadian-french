import { memo } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'

function ColorSwatchesSkeleton({ styles }) {
  return (
    <Box sx={styles.containerWrapper}>
      <Box sx={styles.colorLabel}>
        <Skeleton sx={styles.skeletonColorLabel} isLoaded={false} />
      </Box>

      <Box sx={styles.mainWrapper}>
        <Flex sx={styles.skeletonWrapper}>
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} sx={styles.skeletonSwatch} isLoaded={false} />
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

export default memo(ColorSwatchesSkeleton)
