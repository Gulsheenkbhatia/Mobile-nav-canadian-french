import { memo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import { InView } from 'react-intersection-observer'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { TABBED_VARIANTS } from 'toro/components/Certona/helpers'

function CertonaSkeletonRecommendationTile({ styles, isDesktop, isTabbed = false }) {
  return (
    <Box sx={styles.skeletonTileWrapper}>
      <Skeleton sx={styles.skeletonTile(isDesktop)}>
        <Box mb="mar" />
      </Skeleton>
      <Skeleton sx={styles.skeletonProductName(isDesktop, '117px')}>
        <Box mb="mar" />
      </Skeleton>
      {isTabbed && (
        <Skeleton sx={styles.skeletonProductPrice(isDesktop, '43px')}>
          <Box mb="mar" />
        </Skeleton>
      )}
    </Box>
  )
}

function CertonaSkeleton({ manageVisibility = null, variant }) {
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('PDPRecommendations', { variant })
  const isTabbed = TABBED_VARIANTS.has(variant)
  return (
    <InView onChange={manageVisibility} rootMargin="355px 0px -100px 0px">
      <Box sx={styles.skeletonRootWrapper}>
        <Box>
          <Skeleton sx={styles.skeletonHorizontalBar(isDesktop)}>
            <Box />
          </Skeleton>
        </Box>
        {!isDesktop ? (
          <Box w="100%">
            <Box>
              <Skeleton sx={styles.skeletonTitle(isDesktop)}>
                <Box mb="mar" />
              </Skeleton>
            </Box>
            <Box sx={styles.skeletonTilesWrapper}>
              <CertonaSkeletonRecommendationTile
                variant={variant}
                styles={styles}
                isDesktop={isDesktop}
                isTabbed={isTabbed}
              />
              <CertonaSkeletonRecommendationTile
                variant={variant}
                styles={styles}
                isDesktop={isDesktop}
                isTabbed={isTabbed}
              />
              {isTabbed && (
                <CertonaSkeletonRecommendationTile
                  variant={variant}
                  styles={styles}
                  isDesktop={isDesktop}
                  isTabbed={isTabbed}
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={styles.skeletonWrapper} w="100%" maxWidth="904px" m="auto">
            <Box>
              <Skeleton sx={styles.skeletonTitle(isDesktop)}>
                <Box mb="mar" />
              </Skeleton>
            </Box>
            <Box sx={styles.skeletonTilesWrapper}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={index}
                  sx={styles.skeletonTileBox}
                  width="216px"
                  mr="4px"
                  display="flex"
                  flexDirection="column"
                >
                  <Skeleton sx={styles.skeletonTile(isDesktop)}>
                    <Box mb="mar" />
                  </Skeleton>
                  <Skeleton sx={styles.skeletonProductName(isDesktop)}>
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Box>
          <Skeleton sx={styles.skeletonHorizontalBar(isDesktop)}>
            <Box />
          </Skeleton>
        </Box>
      </Box>
    </InView>
  )
}

export default memo(CertonaSkeleton)
