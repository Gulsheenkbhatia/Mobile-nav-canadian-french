import { memo, FC, useRef, useCallback, useEffect, useState } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import CustomSlot from 'toro/cms/components/CustomSlot'
import dynamic from 'next/dynamic'
import useProductData from 'toro/hooks/useProductData'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import useSplideCarousel from 'toro/hooks/useSplideCarousel'
import Lazy from 'toro/components/Lazy'
import ContentImpressionWrapper from 'toro/components/product/desktop/ContentImpressionWrapper'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getOnContentSliderMoveEvents } from 'toro/helpers/pdpGaEvents'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import { applyProductSwatchesClick } from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'
import ContentAreaSkeleton from 'toro/components/product/desktop/ContentSlider/ContentAreaSkeleton'

// Dynamically import content area components
const ContentAreaOneCmsSlot = dynamic(
  () => import('toro/components/product/ContentArea/ContentAreaOneCmsSlot'),
  { ssr: false }
)

const ContentAreaTwoCmsSlot = dynamic(
  () => import('toro/components/product/ContentArea/ContentAreaTwoCmsSlot'),
  { ssr: false }
)

const ContentAreaThreeCmsSlot = dynamic(
  () => import('toro/components/product/ContentArea/ContentAreaThreeCmsSlot'),
  { ssr: false }
)

export enum CONTENT_AREAS {
  CONTENT_AREA_ONE = 'contentAreaOne',
  CONTENT_AREA_TWO = 'contentAreaTwo',
  CONTENT_AREA_THREE = 'contentAreaThree',
}

interface ContentAreaComponentProps {
  contentArea: CONTENT_AREAS
}

const ContentAreaComponent: FC<ContentAreaComponentProps> = ({ contentArea }) => {
  const analytics = useAnalytics()
  const styles = useStyleConfig('ContentSlider')
  const contentAreaRef = useRef(null)
  const { contentUpdated, onClick } = useCmsAnalytics(contentAreaRef)
  const { isMobile } = useViewportType()
  const [
    contentAreaOne,
    contentAreaOneCustomAttr,
    contentAreaTwo,
    contentAreaTwoCustomAttr,
    contentAreaThree,
    contentAreaThreeCustomAttr,
  ] = useProductData([
    'pdpContentAreas.pdp-content-area-one-markup',
    'custom.c_pdpContentAreaOne',
    'pdpContentAreas.pdp-content-area-two-markup',
    'custom.c_pdpContentAreaTwo',
    'pdpContentAreas.pdp-content-area-three-markup',
    'custom.c_pdpContentAreaThree',
  ])

  const {
    brandProdAttributes: {
      isEnableContentOne,
      pdpContentAreaOne,
      isEnableContentTwo,
      pdpContentAreaTwo,
      isEnableContentThree,
      pdpContentAreaThree,
    },
  } = usePreferenceNew({
    brandProdAttributes: [
      'isEnableContentOne',
      'pdpContentAreaOne',
      'isEnableContentTwo',
      'pdpContentAreaTwo',
      'isEnableContentThree',
      'pdpContentAreaThree',
    ],
  })

  const selectedVariantId = useSelectedVariantData('id')
  const selectedVariantIdRef = useRef(selectedVariantId)
  selectedVariantIdRef.current = selectedVariantId

  const getContentAreaData = () => {
    switch (contentArea) {
      case CONTENT_AREAS.CONTENT_AREA_ONE:
        return {
          content: contentAreaOne,
          customAttr: contentAreaOneCustomAttr,
          preference: pdpContentAreaOne,
          isEnabled: isEnableContentOne,
          Component: ContentAreaOneCmsSlot,
          id: CONTENT_AREAS.CONTENT_AREA_ONE,
        }
      case CONTENT_AREAS.CONTENT_AREA_TWO:
        return {
          content: contentAreaTwo,
          customAttr: contentAreaTwoCustomAttr,
          preference: pdpContentAreaTwo,
          isEnabled: isEnableContentTwo,
          Component: ContentAreaTwoCmsSlot,
          id: CONTENT_AREAS.CONTENT_AREA_TWO,
        }
      case CONTENT_AREAS.CONTENT_AREA_THREE:
        return {
          content: contentAreaThree,
          customAttr: contentAreaThreeCustomAttr,
          preference: pdpContentAreaThree,
          isEnabled: isEnableContentThree,
          Component: ContentAreaThreeCmsSlot,
          id: CONTENT_AREAS.CONTENT_AREA_THREE,
        }
      default:
        return null
    }
  }

  const contentAreaData = getContentAreaData()
  const { content, customAttr, preference, isEnabled, Component, id } = contentAreaData
  const existContentAreaValue = customAttr || preference
  const isAreaOnline = get(content, 'online.default')
  const isSplideCarouselExists = get(content, 'content.isSplideCarouselExists', false)
  const [contentLoaded, setContentLoaded] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  useSplideCarousel({
    shouldInjectSplide:
      isEnabled && existContentAreaValue && isAreaOnline && isSplideCarouselExists,
  })

  const manageSkeleton = useCallback((visible: boolean) => {
    if (visible) {
      setShowSkeleton(false)
    }
  }, [])

  useEffect(() => {
    if (!contentLoaded) return
    const cleanupSwatches = applyProductSwatchesClick(id)
    return () => {
      cleanupSwatches()
    }
  }, [contentLoaded])

  const onSliderMove = useCallback(() => {
    const eventsPayload = getOnContentSliderMoveEvents({
      selectedVariantId: selectedVariantIdRef.current,
    })
    analytics.send(...eventsPayload)
  }, [])

  useEffect(() => {
    contentUpdated()
  }, [content, contentLoaded])

  if (!isEnabled || !existContentAreaValue || !isAreaOnline || !contentAreaData) {
    return null
  }

  return (
    <>
      <Lazy onVisible={manageSkeleton}>
        <ContentImpressionWrapper
          eventAction="content module impression"
          sensorDelay={500}
          onLoad={() => setContentLoaded(true)}
        >
          <Box id={id} sx={styles.wrapper} ref={contentAreaRef} onClick={onClick}>
            <CustomSlot
              ignoreHidden
              Component={Component}
              content={content}
              onSliderMove={onSliderMove}
            />
          </Box>
        </ContentImpressionWrapper>
      </Lazy>
      {showSkeleton && isMobile && <ContentAreaSkeleton />}
    </>
  )
}

export default withErrorBoundaryWrapper(memo(ContentAreaComponent))
