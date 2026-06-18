import type { FC } from 'react'
import type { ClpRecommendationsConfig } from 'toro/helpers/recommendations'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

interface CLPRecommendationsSlotProps {
  schema: ClpRecommendationsConfig['schema']
}

const CLPRecommendationsSlot: FC<CLPRecommendationsSlotProps> = ({ schema }) => {
  const styles = useMultiStyleConfig('RecommendationsContainer')
  if (!schema) return null

  return (
    <Box sx={styles.clpWrapper}>
      <RecommendationsContainer type={schema} showDivider={false} styleVariantOverride="PLP" />
    </Box>
  )
}

export default CLPRecommendationsSlot
