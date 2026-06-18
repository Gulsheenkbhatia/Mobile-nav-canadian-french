import { useEffect, useContext, useCallback, useRef } from 'react'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import PWAContext from 'components/common/PWAContext'
import { applyProductSwatchesClick, applySplideSliders } from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'
import { isPlpV3Atom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'
import { PROMOTILE_CONTAINER_ID } from 'toro/constants/appConstants'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'
/**
 * TORO InlinePromoPLPTile
 */

interface InlinePromoTilePLPProps {
  markup?: string
  colSpan: number
  rowSpan?: number
  isSplideContent?: boolean
  hasVideo?: boolean
}

const prepareInlineContent = (content: string = ''): string => {
  return content.replace(/(col-md-6|col-md-3)/gi, '').replace('!important', '')
}

function InlinePromoTilePLP({
  markup,
  colSpan,
  rowSpan,
  isSplideContent,
  hasVideo = false,
}: InlinePromoTilePLPProps): JSX.Element {
  const { isDesktop } = useViewportType()
  const numberOfTilesInRow = isDesktop ? 4 : 2
  const hasProductInRows = numberOfTilesInRow > colSpan
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const plpv2ClassName = isPlpV3 ? 'promo-tile-plpv2' : ''
  const { injectJquery } = useContext(PWAContext)
  const swatchCleanupRef = useRef<(() => void) | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const { contentUpdated } = useCmsAnalytics(rootRef)
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideo, rootRef)

  const onMount = useCallback(async (): Promise<void> => {
    try {
      if (isSplideContent) {
        await injectJquery()
        applySplideSliders(PROMOTILE_CONTAINER_ID)
        swatchCleanupRef.current = applyProductSwatchesClick(PROMOTILE_CONTAINER_ID)
      }
    } catch (e) {
      console.log('Error when init splide on inline promo tile', e)
    }
  }, [injectJquery, isSplideContent])

  useEffect(() => {
    onMount()
    return () => {
      if (swatchCleanupRef.current) {
        swatchCleanupRef.current()
        swatchCleanupRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    contentUpdated()
  }, [])

  return (
    <Box
      position="relative"
      minWidth="0" // prevent grid blowout
      maxHeight={hasProductInRows && !rowSpan ? 'var(--max-promo-tile-wrapper-height)' : null}
      overflow={hasProductInRows ? 'hidden' : ''}
      height="100%"
      ref={rootRef}
      sx={{
        '& .product-tile__container.col-6': { maxWidth: '100%!important' },
        '@media (max-width: 544px)': {
          '& .product-tile__container.col-6': {
            '& img': {
              height: '100% !important',
            },
          },
        },
      }}
      className={`cms-slot promo-tile-wrapper ${plpv2ClassName}`}
      id={PROMOTILE_CONTAINER_ID}
    >
      <HtmlContent
        content={prepareInlineContent(markup)}
        lazyLoadVideos
        lazyLoadImages
        playsInLine
        ref={hasVideo ? viewportVideoHandlerRef : null}
      />
    </Box>
  )
}

export default InlinePromoTilePLP
