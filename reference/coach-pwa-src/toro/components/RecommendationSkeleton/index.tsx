import { memo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import { InView } from 'react-intersection-observer'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
type RecommendationSkeletonProps = {
  manageVisibility?: () => any
}

function RecommendationSkeleton({ manageVisibility }: RecommendationSkeletonProps) {
  const { isDesktop } = useViewportType()

  return (
    <InView onChange={manageVisibility} rootMargin="355px 0px -100px 0px">
      <>
        {!isDesktop ? (
          <Box w="100%">
            <Box>
              <Skeleton height="23px" width="60%" m="22px auto">
                <Box mb="mar" />
              </Skeleton>
            </Box>
            <Box m="20px" minH="200px" display="flex" flexDirection="row" alignItems="end">
              <Box width="40%" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="160px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="60%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>

              <Box width="40%" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="160px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="60%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box w="100%" maxWidth="904px" m="auto">
            <Box>
              <Skeleton height="32px" width="40%" m="22px auto">
                <Box mb="mar" />
              </Skeleton>
            </Box>
            <Box m="20px" minH="200px" display="flex" flexDirection="row" alignItems="end">
              <Box width="216px" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="270px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="100%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>

              <Box width="216px" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="270px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="100%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>

              <Box width="216px" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="270px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="100%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>

              <Box width="216px" mr="20px" display="flex" flexDirection="column">
                <Skeleton height="270px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
                <Skeleton height="23px" width="100%" m="22px auto">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Box>
          </Box>
        )}
      </>
    </InView>
  )
}

export default memo(RecommendationSkeleton)
