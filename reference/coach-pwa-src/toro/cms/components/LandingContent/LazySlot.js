import { forwardRef, useRef } from 'react'
import Lazy from 'toro/components/Lazy'
import WrapIf from 'toro/components/WrapIf'
import HtmlContent from 'toro/components/HtmlContent'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'

const LAZY_LOAD_INDEX = 3

const LazySlot = forwardRef(
  (
    {
      slot,
      idx,
      lazyLoadImages,
      lazyLoadVideos,
      enableLazy = true,
      lazyThreshold = LAZY_LOAD_INDEX,
    },
    ref
  ) => {
    const theme = useStyleConfig('LandingContent')

    const rootNode = useRef(null)
    const { onClick } = useCmsAnalytics(rootNode)
    const hasVideo = slot?.hasVideo || false
    const viewportVideoHandlerRef = useViewportVideoHandler(hasVideo, ref)

    const isATFSlot = idx <= lazyThreshold
    const shouldLazy = enableLazy && !isATFSlot

    return (
      <WrapIf condition={shouldLazy} Component={Lazy}>
        <HtmlContent
          ref={hasVideo ? viewportVideoHandlerRef : ref}
          sx={theme.htmlContent?.()}
          lazyLoadImages={shouldLazy && lazyLoadImages}
          lazyLoadVideos={shouldLazy && lazyLoadVideos}
          key={`${slot.id}-${idx}`}
          content={slot.html}
          onClickCmsAnalytics={onClick}
        />
      </WrapIf>
    )
  }
)

export default LazySlot
