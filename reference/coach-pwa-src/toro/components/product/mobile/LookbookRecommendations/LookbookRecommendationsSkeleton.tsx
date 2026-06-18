import type { FC } from 'react'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import useStyles from 'toro/hooks/useStyles'

const LookbookRecommendationsSkeleton: FC = () => {
  const styles = useStyles()

  return (
    <Box sx={styles.rootWrapper}>
      <Box sx={styles.sectionTitle}>
        <Skeleton height="29px" />
      </Box>
      <Box as="ul" sx={styles.itemList}>
        {[...Array(3)].map((_, index) => {
          return (
            <Box as="li" key={index} sx={styles.itemListItem}>
              <Skeleton height="373px" />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default LookbookRecommendationsSkeleton
