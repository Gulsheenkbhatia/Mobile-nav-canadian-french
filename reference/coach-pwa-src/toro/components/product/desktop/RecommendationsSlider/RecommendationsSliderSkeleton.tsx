import React from 'react'
import Skeleton from 'toro/components/Skeleton'
import Center from 'toro/components/Center'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const GRID_SIZE = 5

const RecommendationsSliderSkeleton = () => {
  const styles = useMultiStyleConfig('RecommendationsSlider')
  const renderSkeleton = [...Array(GRID_SIZE)].map((e, i) => (
    <Box key={i}>
      <Skeleton sx={styles.itemSkeleton} />
    </Box>
  ))

  return (
    <Box sx={styles.rootContainerSkeleton}>
      <Center>
        <Skeleton sx={styles.titleSkeleton} />
      </Center>

      <Center sx={styles.gridWrapperSkeleton}>
        <Grid sx={styles.gridSkeleton}>{renderSkeleton}</Grid>
      </Center>
    </Box>
  )
}

export default RecommendationsSliderSkeleton
