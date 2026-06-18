import { FC, memo, useState, useCallback } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import noop from 'lodash/noop'
import { NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import useThinkRecommendations from 'toro/components/list/ThinkPage/ThinkGridRecommendations/useThinkRecommendations'

type MobileThinkRecommendationsProps = {
  type: string
  viewMoreText: string
  viewLessText: string
}

const MobileThinkRecommendations: FC<MobileThinkRecommendationsProps> = ({
  viewMoreText,
  viewLessText,
  type,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    styles,
    ref,
    inView,
    isLoading,
    items,
    analytics,
    analyticsEvents,
    containerId,
    strategyId,
    vendor,
    label,
  } = useThinkRecommendations({ type })

  const handleViewMoreClick = useCallback(() => {
    setIsExpanded(true)
    analytics.send('listInteraction', {
      eventAction: 'view more click',
      eventLabel: viewMoreText,
    })
  }, [analytics, viewMoreText])

  const handleViewLessClick = useCallback(() => {
    setIsExpanded(false)
    analytics.send('listInteraction', {
      eventAction: 'view less click',
      eventLabel: viewLessText,
    })
  }, [analytics, viewLessText])

  if (!items?.length) {
    return null
  }

  // Show only first 3 products initially, all if expanded
  const visibleProducts = isExpanded ? items : items.slice(0, 3)
  const hasMoreProducts = items.length > 3

  return (
    <Box ref={ref} sx={styles.container}>
      {isLoading ? (
        <CertonaSkeleton variant="PLP" manageVisibility={noop} />
      ) : (
        inView && (
          <Box sx={styles.wrapper}>
            {label && (
              <Box as="h2" sx={styles.title}>
                {label}
              </Box>
            )}

            <Box sx={styles.gridWrapper}>
              {visibleProducts.map((product, idx) => (
                <RecommendationItemTile
                  key={product.id}
                  idx={idx}
                  containerId={containerId}
                  strategyId={strategyId}
                  productItem={product}
                  styleVariant="recommendationsOnThinkPage"
                  analyticsEvents={analyticsEvents}
                  containerLabel={label}
                  vendor={vendor}
                />
              ))}
            </Box>

            {hasMoreProducts && (
              <Flex justifyContent="center" sx={styles.ctaWrapper}>
                <Button
                  variant="ghost"
                  onClick={isExpanded ? handleViewLessClick : handleViewMoreClick}
                  sx={styles.ctaButton}
                  data-qa={isExpanded ? 'view_less_button' : 'view_more_button'}
                >
                  {isExpanded ? (
                    <>
                      {viewLessText} <NavChevronUpIcon width="16" height="16" ml={2} />
                    </>
                  ) : (
                    <>
                      {viewMoreText} <NavChevronDownIcon width="16" height="16" ml={2} />
                    </>
                  )}
                </Button>
              </Flex>
            )}
          </Box>
        )
      )}
    </Box>
  )
}

export default withErrorBoundaryWrapper(memo(MobileThinkRecommendations))
