import React from 'react'
import Hidden from 'toro/components/Hidden'
import Skeleton from 'toro/components/Skeleton'
import Center from 'toro/components/Center'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'

interface UGCSkeletonProps {
  isGridEnable?: boolean
  initialFetch?: boolean
}

function UGCSkeleton({ isGridEnable, initialFetch }: UGCSkeletonProps) {
  const gridSize = isGridEnable ? 5 : 4

  const renderSkeleton = [...Array(isGridEnable ? gridSize * 2 : gridSize)].map((e, i) =>
    isGridEnable ? (
      <Box key={i}>
        <Skeleton height="263px" width="263px">
          <Box mb="mar" />
        </Skeleton>
      </Box>
    ) : (
      <Box key={i}>
        <Skeleton height="290px" width="100%">
          <Box mb="mar" />
        </Skeleton>
      </Box>
    )
  )

  const gridMobileSkeleton = [...Array(4)].map((e, i) => (
    <Box key={i}>
      <Skeleton height="173px">
        <Box mb="mar" />
      </Skeleton>
    </Box>
  ))

  return (
    <>
      <Hidden onDesktop w="100%">
        <Box m="26px" mx="70px" height={isGridEnable ? 'initial' : '372px'}>
          <Box display={initialFetch ? 'block' : 'none'}>
            <Skeleton height="28px" width="100%">
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Box display={initialFetch ? 'block' : 'none'}>
            <Skeleton height="16px" width="100%" mt="12px" mb="42px">
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Box display={isGridEnable ? 'none' : 'block'}>
            <Skeleton height="236px" width="100%">
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Center mb="40px" display={isGridEnable ? 'block' : 'none'}>
            <Grid columnGap="mar" gap="1" width="100%" templateColumns={`repeat(2, 1fr)`}>
              {gridMobileSkeleton}
            </Grid>
          </Center>
        </Box>
      </Hidden>
      <Hidden onNonDesktop w="90%" textAlign="center" mx="5%">
        <Box maxWidth="1276" m="0 auto">
          <Center display={initialFetch ? 'block' : 'none'} width="100%">
            <Grid columnGap="mar" width="100%" templateColumns="repeat(1, 1fr)">
              <Box mt="48px" height="86px">
                <Box>
                  <Skeleton height="40px" width="100%">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
                <Box>
                  <Skeleton height="23px" width="100%" mt="22px" mb="22px">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
              </Box>
            </Grid>
          </Center>

          <Center mt="40px" mb="40px">
            <Grid
              columnGap="mar"
              width={isGridEnable ? '1344px' : '100%'}
              templateColumns={`repeat(${gridSize}, 1fr)`}
            >
              {renderSkeleton}
            </Grid>
          </Center>
        </Box>
      </Hidden>
    </>
  )
}

export default UGCSkeleton
