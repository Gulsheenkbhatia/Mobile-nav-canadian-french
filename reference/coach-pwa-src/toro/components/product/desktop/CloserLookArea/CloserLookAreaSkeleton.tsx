import React from 'react'
import Box from 'toro/components/Box'
import Center from 'toro/components/Center'
import Grid from 'toro/components/Grid'
import Skeleton from 'toro/components/Skeleton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function CloserLookAreaSkeleton() {
  const styles = useMultiStyleConfig('CloserLookArea')

  return (
    <Box sx={styles.skeletonContainer}>
      <Box>
        <Center mr="10%" mt="40px" mb="40px" ml="10%">
          <Grid columnGap="mar" width="100%" templateColumns="repeat(2, 1fr)">
            <Box>
              <Skeleton height="462px" width="100%">
                <Box mb="mar" />
              </Skeleton>
            </Box>
            <Box>
              <Skeleton
                height="32px"
                width="calc(100% - 64px)"
                mr="32px"
                ml="32px"
                mt="200px"
                mb="40px"
              >
                <Box mb="mar" />
              </Skeleton>
              <Skeleton height="72px" width="100%">
                <Box mb="mar" />
              </Skeleton>
            </Box>
          </Grid>
        </Center>
      </Box>
    </Box>
  )
}

export default CloserLookAreaSkeleton
