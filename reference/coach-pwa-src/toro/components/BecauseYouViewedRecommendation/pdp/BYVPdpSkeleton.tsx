import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import BecauseYouViewedHeaderSkeleton from 'toro/components/Certona/BecauseYouViewedRecommendation/BecauseYouViewedHeaderSkeleton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function BYVPdpCarouselSkeleton() {
  const styles = useMultiStyleConfig('BecauseYouViewedPdp')

  return (
    <Box sx={styles.skeletonCarousel}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Box key={i} sx={styles.skeletonCard}>
          <Skeleton sx={styles.skeletonCardImage}>
            <Box />
          </Skeleton>
          <Skeleton sx={styles.skeletonCardName}>
            <Box />
          </Skeleton>
          <Skeleton sx={styles.skeletonCardPrice}>
            <Box />
          </Skeleton>
        </Box>
      ))}
    </Box>
  )
}

function BYVPdpSkeleton() {
  return (
    <>
      <BecauseYouViewedHeaderSkeleton />
      <BYVPdpCarouselSkeleton />
    </>
  )
}

export default BYVPdpSkeleton
