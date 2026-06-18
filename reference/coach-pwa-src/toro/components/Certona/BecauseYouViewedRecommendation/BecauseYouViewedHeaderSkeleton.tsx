import { memo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function BecauseYouViewedHeaderSkeleton() {
  const styles = useMultiStyleConfig('BecauseYouViewedRecommendation')

  return (
    <Flex w="100%" sx={styles.skeletonBecauseYouViewedWrapper}>
      <Box w="100%" sx={styles.certonaHeaderContainer}>
        <Skeleton sx={styles.skeletonHeaderThumbnail}>
          <Box mb="mar" />
        </Skeleton>

        <Flex w="100%" sx={styles.certonaHeaderTitleWrapper}>
          <Skeleton sx={styles.skeletonHeaderTitle}>
            <Box mb="mar" />
          </Skeleton>

          <Skeleton sx={styles.skeletonHeaderSubtitle}>
            <Box mb="mar" />
          </Skeleton>
        </Flex>
      </Box>
    </Flex>
  )
}

export default memo(BecauseYouViewedHeaderSkeleton)
