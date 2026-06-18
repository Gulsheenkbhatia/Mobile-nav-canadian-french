import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import { FC } from 'react'
import { RecommendationStyles } from 'toro/components/RecommendationsContainer/types'
import { SOCIAL_LANDER_GRID_HEADER_TITLE } from 'toro/constants/adaptiveExperience'

interface RecommendationTitleProps {
  styles: RecommendationStyles
}

const RecommendationTitle: FC<RecommendationTitleProps> = ({ styles }) => {
  const { formatMessage } = useIntl()

  return (
    <Text
      variant="secondary"
      sx={{ ...styles.baseRecommendationTitle, display: 'block', marginTop: 'var(--spacing-10)' }}
    >
      {formatMessage({
        id: 'pdp.socialRecommendations.title',
        defaultMessage: SOCIAL_LANDER_GRID_HEADER_TITLE,
      })}
    </Text>
  )
}

export default RecommendationTitle
