import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'

export default function RecommendedCategoryProductsSkeleton({ styles }) {
  return (
    <Box sx={styles.skeletonProductsWrapper}>
      {[...Array(4)].map((_, index) => (
        <Box key={`recommended-category-skeleton-${index}`}>
          <Skeleton sx={styles.skeletonProductImage} />
          <Box sx={styles.skeletonProductText}>
            <Skeleton sx={styles.skeletonProductPrice} />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
