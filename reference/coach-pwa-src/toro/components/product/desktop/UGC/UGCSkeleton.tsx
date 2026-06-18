import Skeleton from 'toro/components/Skeleton'
import Center from 'toro/components/Center'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const GRID_SIZE_DESKTOP = 5
const GRID_SIZE_MOBILE = 3

const UGCSkeleton = () => {
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('UGC')
  const gridSize = isDesktop ? GRID_SIZE_DESKTOP : GRID_SIZE_MOBILE

  const renderSkeleton = [...Array(gridSize)].map((_, index) => (
    <Box key={index}>
      <Skeleton sx={styles.itemSkeleton} />
    </Box>
  ))

  return (
    <Box sx={styles.rootContainerSkeleton}>
      <Center>
        <Grid sx={styles.headerGridSkeleton}>
          <Box sx={styles.headerSkeleton}>
            <Box>
              <Skeleton sx={styles.titleSkeleton} />
            </Box>
            <Box>
              <Skeleton sx={styles.subtitleSkeleton} />
            </Box>
            {isDesktop && (
              <Box>
                <Skeleton sx={styles.buttonSkeleton} />
              </Box>
            )}
          </Box>
        </Grid>
      </Center>

      <Center sx={styles.gridWrapperSkeleton}>
        <Grid sx={styles.gridSkeleton}>{renderSkeleton}</Grid>
      </Center>
    </Box>
  )
}

export default UGCSkeleton
