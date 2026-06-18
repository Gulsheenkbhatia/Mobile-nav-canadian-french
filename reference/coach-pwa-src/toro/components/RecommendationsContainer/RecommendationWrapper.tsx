import type { FC, ReactNode } from 'react'
import Box from 'toro/components/Box'
import { RecommendationStyles } from 'toro/components/RecommendationsContainer/types'
import Flex from 'toro/components/Flex'
import type { ContainerSupportedTypes } from 'toro/components/RecommendationsContainer/index'
import RecommendationTitle from 'toro/components/product/mobile/SocialRecommendations/RecommendationTitle'
import Text from 'toro/components/Text'

interface RecommendationWrapperProps {
  type: ContainerSupportedTypes
  children: ReactNode
  navigation?: ReactNode
  footer?: ReactNode
  hideLabel?: boolean
  label?: string
  showDivider?: boolean
  styles?: RecommendationStyles
  titleStyles?: RecommendationStyles
  vendor?: string
  showRecommendationTitle?: boolean
  enableHeaderTitle?: boolean
  headerTitle?: string
}

const RecommendationWrapper: FC<RecommendationWrapperProps> = ({
  children,
  showDivider,
  vendor,
  type,
  styles,
  titleStyles,
  hideLabel,
  label,
  navigation,
  showRecommendationTitle,
  footer,
  enableHeaderTitle = false,
  headerTitle = '',
}) => {
  return (
    <>
      {showRecommendationTitle && <RecommendationTitle styles={titleStyles} />}
      <Box
        className={showDivider && 'content-divider'}
        data-recommendations-vendor={vendor}
        data-recommendations-container={type}
        sx={{
          ...(showDivider && styles.baseRecommendationContentDivider),
          ...styles.baseRecommendationRoot,
        }}
      >
        <Flex flexDirection="column" w="100%" sx={styles.baseRecommendationWrapper}>
          {enableHeaderTitle && (
            <Text sx={styles.baseRecommendationTitle} as="h2">
              {headerTitle}
            </Text>
          )}
          {!hideLabel &&
            label &&
            (enableHeaderTitle ? (
              <Text sx={styles.baseRecommendationSubtitle}>{label}</Text>
            ) : (
              <Box as="h2" sx={styles.baseRecommendationTitle}>
                {label}
              </Box>
            ))}
          {navigation}
          {children}
          {footer}
        </Flex>
      </Box>
    </>
  )
}

export default RecommendationWrapper
