import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { Collapse } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import { ChevronBoldDownIcon } from 'toro/icons'
import type { RecentlyViewedProduct } from 'toro/hooks/useRecentlyViewedData'
import CollapsibleItem from 'toro/components/CollapsibleRVRecommendationsCarousel/CollapsibleItem'

export type CollapsibleRecommendationsCarouselProps = {
  products: RecentlyViewedProduct[]
  display: boolean
  title: string
  experienceId: string
  vendorScheme: string
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => Promise<void>
  location: string
  headerSlot: React.ReactNode
  onContainerClick?: () => void
  containerCallbackRef?: (node: HTMLElement | null) => void
  defaultExpanded?: boolean
  containerId?: string
  carouselId?: string
  headerDataQa?: string
}

const CollapsibleRecommendationsCarousel = ({
  products,
  display,
  title,
  experienceId,
  vendorScheme,
  addImpression,
  selectRecommItem,
  location,
  headerSlot,
  onContainerClick,
  containerCallbackRef,
  defaultExpanded = false,
  containerId = 'rv_collapsible_container',
  carouselId = 'rv_collapsible_carousel',
  headerDataQa = 'rv-collapsible-header',
}: CollapsibleRecommendationsCarouselProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const hasTrackedImpression = useRef(false)
  const styles = useMultiStyleConfig('CollapsibleRVCarousel', {})
  const analytics = useAnalytics()

  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  const { ref: inViewRef } = useInView({
    triggerOnce: false,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && !hasTrackedImpression.current && display && products.length > 0) {
        hasTrackedImpression.current = true
        analytics.send('listInteraction', {
          eventAction: 'recommendation dropdown module impression',
          eventLabel: title?.toLowerCase() || 'recently viewed',
        })
      }
    },
  })

  const handleContainerRef = useCallback(
    (node: HTMLElement | null) => {
      inViewRef(node)
      containerCallbackRef?.(node)
    },
    [inViewRef, containerCallbackRef]
  )

  const toggleExpanded = useCallback(() => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)

    if (display && products.length > 0) {
      analytics.send('listInteraction', {
        eventLocation: location,
        eventAction: newExpandedState
          ? 'recommendation dropdown module open'
          : 'recommendation dropdown module close',
        eventLabel: title?.toLowerCase() || 'recently viewed',
      })
    }
  }, [isExpanded, display, products.length, analytics, location, title])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggleExpanded()
      }
    },
    [toggleExpanded]
  )

  if (!products.length || !display) {
    return null
  }

  return (
    <Box
      id={containerId}
      sx={styles.collapsibleContainer}
      onClick={onContainerClick}
      ref={handleContainerRef}
    >
      <Box
        sx={styles.collapsibleHeader}
        onClick={toggleExpanded}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-qa={headerDataQa}
      >
        {headerSlot}

        <Box
          sx={{
            ...styles.chevronIcon,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronBoldDownIcon width="16px" height="16px" />
        </Box>
      </Box>

      <Collapse in={isExpanded} animateOpacity>
        <Flex sx={styles.carouselWrapper}>
          <Flex sx={styles.carousel} id={carouselId}>
            {products.map((product, idx) => (
              <CollapsibleItem
                key={`product-${product?.ID}`}
                product={product}
                idx={idx}
                scheme={vendorScheme}
                experienceId={experienceId}
                title={title}
                styles={styles}
                addImpression={addImpression}
                selectRecommItem={selectRecommItem}
              />
            ))}
          </Flex>
        </Flex>
      </Collapse>
    </Box>
  )
}

export default memo(CollapsibleRecommendationsCarousel)
