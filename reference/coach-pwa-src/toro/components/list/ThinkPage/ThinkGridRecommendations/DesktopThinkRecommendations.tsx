import { FC, memo, useCallback, useRef, useState, ComponentType } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import RecommendationItemTile from 'toro/components/RecommendationItemTile'
import CertonaSkeleton from 'toro/components/Certona/CertonaSkeleton'
import noop from 'lodash/noop'
import { NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import useThinkRecommendations from 'toro/components/list/ThinkPage/ThinkGridRecommendations/useThinkRecommendations'
import LazySlot from 'toro/cms/components/LandingContent/LazySlot'

type LazySlotProps = {
  slot: { id: string; html: string; hasVideo: boolean }
  lazyLoadImages?: boolean
  lazyLoadVideos?: boolean
}

const LazySlotTyped = LazySlot as ComponentType<LazySlotProps>

type DesktopThinkRecommendationsProps = {
  id: string
  type: string
  title?: string
  subtitle?: string
  viewMoreText: string
  viewLessText: string
  content?: { html: string; id: string; hasVideo: boolean } | null
}

const VIEW_MORE_BUTTON_THRESHOLD = 8
const LAZY_SLOT_INDEX = 1

const DesktopThinkRecommendations: FC<DesktopThinkRecommendationsProps> = ({
  type,
  title,
  subtitle,
  content,
  viewMoreText,
  viewLessText,
}) => {
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
  const [isExpanded, setIsExpanded] = useState(false)
  const recommendationSectionRef = useRef<HTMLDivElement | null>(null)
  const expandedSectionRef = useRef<HTMLDivElement | null>(null)

  const hasMoreProducts = items?.length > VIEW_MORE_BUTTON_THRESHOLD

  const handleViewMoreClick = useCallback(() => {
    setIsExpanded(true)
    analytics.send('listInteraction', { eventAction: 'view more click', eventLabel: viewMoreText })

    requestAnimationFrame(() => {
      expandedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [analytics, viewMoreText])

  const handleViewLessClick = useCallback(() => {
    setIsExpanded(false)
    analytics.send('listInteraction', { eventAction: 'view less click', eventLabel: viewLessText })

    requestAnimationFrame(() => {
      recommendationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [analytics, viewLessText])

  if (isLoading) {
    return <CertonaSkeleton variant="PLP" manageVisibility={noop} />
  }

  if (!items?.length) {
    return null
  }

  const productsToRender =
    isExpanded && hasMoreProducts ? items : items.slice(0, VIEW_MORE_BUTTON_THRESHOLD)

  return (
    <Box ref={ref} sx={styles.container}>
      {inView && (
        <Box ref={recommendationSectionRef}>
          {title && (
            <Box as="h2" sx={styles.title}>
              {title}
            </Box>
          )}

          {subtitle && (
            <Box as="p" sx={styles.description}>
              {subtitle}
            </Box>
          )}

          <Box sx={styles.desktopGrid}>
            {productsToRender.map((product, idx) => (
              <>
                <Box
                  key={`product-tile-${idx}`}
                  className="productTile"
                  sx={styles.desktopGridItem}
                  ref={idx === VIEW_MORE_BUTTON_THRESHOLD ? expandedSectionRef : null}
                >
                  <RecommendationItemTile
                    idx={idx}
                    containerId={containerId}
                    strategyId={strategyId}
                    productItem={product}
                    styleVariant="recommendationsOnThinkPage"
                    analyticsEvents={analyticsEvents}
                    containerLabel={label}
                    vendor={vendor}
                  />
                </Box>
                {idx === LAZY_SLOT_INDEX ? (
                  <Box key={`lazy-slot-${idx}`} className="lazySlot" sx={styles.desktopGridItem}>
                    {content?.html && (
                      <LazySlotTyped slot={content} lazyLoadImages lazyLoadVideos />
                    )}
                  </Box>
                ) : null}
              </>
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
      )}
    </Box>
  )
}

export default withErrorBoundaryWrapper(memo(DesktopThinkRecommendations))
