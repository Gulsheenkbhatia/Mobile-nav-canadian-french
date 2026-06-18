import { useEffect, useContext, useRef, useCallback, useState, useMemo } from 'react'
import Lazy from 'toro/components/Lazy'
import MainContainer from 'toro/components/MainContainer'
import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import PWAContext from 'components/common/PWAContext'
import { applyProductSwatchesClick, applySplideSliders } from 'toro/helpers/home'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'

function CategoryBottomContentSlot({ content, styles, hasVideo = false }) {
  const { injectJquery } = useContext(PWAContext)
  const swatchCleanupRef = useRef(null)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const categoryBottomSlotRef = useRef(null)
  const { contentUpdated } = useCmsAnalytics(categoryBottomSlotRef)
  const isJsonLdContent = useMemo(
    () => !hasVideo && typeof content === 'string' && content.includes('application/ld+json'),
    [content, hasVideo]
  )
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideo, categoryBottomSlotRef)

  const onMount = useCallback(async () => {
    try {
      await injectJquery()
      applySplideSliders('category-bottom-content-slot')
      contentUpdated()
      swatchCleanupRef.current = applyProductSwatchesClick('category-bottom-content-slot')
    } catch (e) {
      console.log('Error when init splide on category bottom content slot', e)
    }
  }, [injectJquery])

  const manageContentLoad = (visible) => {
    if (visible) {
      setIsContentLoaded(true)
    }
  }

  useEffect(() => {
    if (!isContentLoaded) return
    onMount()
    return () => {
      if (swatchCleanupRef.current) {
        swatchCleanupRef.current()
        swatchCleanupRef.current = null
      }
    }
  }, [isContentLoaded])

  const slotContent = (
    <MainContainer sx={styles.bottomContentSlotWrapper}>
      <HtmlContent lazyLoadVideos lazyLoadImages content={content} w="100%" />
    </MainContainer>
  )

  return (
    <Box ref={hasVideo ? viewportVideoHandlerRef : categoryBottomSlotRef}>
      {isJsonLdContent ? slotContent : <Lazy onVisible={manageContentLoad}>{slotContent}</Lazy>}
    </Box>
  )
}

export default CategoryBottomContentSlot
