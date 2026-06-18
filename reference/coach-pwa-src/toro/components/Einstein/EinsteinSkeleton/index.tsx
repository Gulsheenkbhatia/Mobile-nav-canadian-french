import { memo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import { InView } from 'react-intersection-observer'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function EinsteinSkeleton({
  manageVisibility,
  variant,
}: {
  manageVisibility?: () => void
  variant?: string
}) {
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('PDPEinsteinRecommendations', { variant })

  return (
    <InView onChange={manageVisibility} rootMargin="355px 0px -100px 0px">
      <>
        <Box w="100%" {...(isDesktop ? { maxWidth: '904px', m: 'auto' } : {})}>
          <Box>
            <Skeleton sx={styles.skeletonTitle}>
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Box sx={styles.skeletonWrapper}>
            {Array.from({ length: !isDesktop ? 2 : 4 }, (_, i) => (
              <Box key={i} sx={styles.skeletonProductTile}>
                <Skeleton sx={styles.skeletonImage}>
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton sx={styles.skeletonProductName}>
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            ))}
          </Box>
        </Box>
      </>
    </InView>
  )
}

export default memo(EinsteinSkeleton)
