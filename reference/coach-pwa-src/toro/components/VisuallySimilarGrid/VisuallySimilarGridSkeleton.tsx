import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import Skeleton from 'toro/components/Skeleton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const VisuallySimilarGridSkeleton: React.FC<{ gridColumns?: 2 | 3 }> = ({ gridColumns = 2 }) => {
  const styles = useMultiStyleConfig('VisuallySimilarGrid')

  return (
    <Box sx={styles.container}>
      <Box sx={styles.skeletonTitleWrapper}>
        <Skeleton sx={styles.skeletonTitle}>
          <Box mb="mar" />
        </Skeleton>
      </Box>
      <Grid
        sx={styles.skeletonGridContainer}
        templateColumns={`repeat(${gridColumns}, minmax(0, 1fr))`}
      >
        {Array.from({ length: gridColumns * 2 }, (_, idx) => (
          <Box key={`skeleton-${idx}`} sx={styles.skeletonTile}>
            <Skeleton sx={styles.skeletonImage}>
              <Box mb="mar" />
            </Skeleton>
            <Skeleton sx={styles.skeletonName}>
              <Box mb="mar" />
            </Skeleton>
            <Skeleton sx={styles.skeletonPrice}>
              <Box mb="mar" />
            </Skeleton>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default VisuallySimilarGridSkeleton
