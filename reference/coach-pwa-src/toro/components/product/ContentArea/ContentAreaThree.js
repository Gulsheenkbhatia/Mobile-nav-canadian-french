import React, { useRef, useEffect } from 'react'
import Box from 'toro/components/Box'
import Center from 'toro/components/Center'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import Grid from 'toro/components/Grid'
import useViewportType from 'toro/hooks/useViewportType'
import Hidden from 'toro/components/Hidden'
import Skeleton from 'toro/components/Skeleton'
import { Container } from '@chakra-ui/react'
import CustomSlot from 'toro/cms/components/CustomSlot'
import ContentAreaThreeCmsSlot from 'toro/components/product/ContentArea/ContentAreaThreeCmsSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import PropTypes from 'prop-types'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import { useAtomValue } from 'jotai/utils'
import { useInView } from 'react-intersection-observer'
import useSplideCarousel from 'toro/hooks/useSplideCarousel'
import { applyProductSwatchesClick } from 'toro/helpers/home'
import { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'

function ContentAreaThree({ siteId, content, contentAreaCustomAttribute }) {
  const styles = useMultiStyleConfig('ContentArea')
  const { content: { isSplideCarouselExists = false } = {} } = content || {}
  useSplideCarousel({ shouldInjectSplide: isSplideCarouselExists })
  const enableContentAreaThree = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'isEnableContentThree',
  })
  const existContentAreaThree = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'pdpContentAreaThree',
  })
  const { isDesktop, isTablet, isMobile } = useViewportType()
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const enableContentAreaThreeValue = getSiteValueFromPref(enableContentAreaThree, siteId)
  const existContentAreaThreeValue =
    contentAreaCustomAttribute || getSiteValueFromPref(existContentAreaThree, siteId)

  const { ref, inView } = useInView({
    rootMargin: `-${headerHeight + 24}px`,
    triggerOnce: true,
    onChange: () => {
      const videoElement = document?.querySelector('.ac-video.content-video')
      const videoSrc = videoElement?.getElementsByTagName('source')
      const { desktopVideoSrc, mobileVideoSrc } = videoElement?.dataset || {}

      if (isDesktop && desktopVideoSrc) {
        videoSrc?.[0].setAttribute('src', desktopVideoSrc)
      } else if ((isMobile || isTablet) && mobileVideoSrc) {
        videoSrc?.[0].setAttribute('src', mobileVideoSrc)
      }
    },
  })

  const promoBannerNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(promoBannerNode)
  const hasVideoContent = content?.hasVideo
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideoContent, promoBannerNode)
  const { default: isContentOnline } = content?.online || {}

  useEffect(() => {
    if (!inView) return
    const cleanupSwatches = applyProductSwatchesClick(CONTENT_AREAS.CONTENT_AREA_THREE)
    contentUpdated()
    return () => {
      cleanupSwatches()
    }
  }, [content, inView])

  const compToShow =
    enableContentAreaThreeValue &&
    existContentAreaThreeValue &&
    !!content &&
    !!Object.keys(content)?.length &&
    isContentOnline &&
    inView

  if (!enableContentAreaThreeValue && !existContentAreaThreeValue) {
    return null
  }

  return (
    <Box ref={hasVideoContent ? viewportVideoHandlerRef : promoBannerNode}>
      {!inView && (
        <Box ref={ref}>
          <Hidden onDesktop w="100%">
            <Box m="42px">
              <Box>
                <Skeleton height="241px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="23px" width="100%" mt="22px" mb="22px">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="40px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Box>
          </Hidden>
          {isDesktop && (
            <Hidden onNonDesktop w="100%">
              <Box>
                <Center mr="10%" mt="40px" mb="40px" ml="10%">
                  <Grid columnGap="mar" width="100%" templateColumns="repeat(2, 1fr)">
                    <Box>
                      <Skeleton height="462px" width="100%">
                        <Box mb="mar" />
                      </Skeleton>
                    </Box>
                    <Box>
                      <Skeleton
                        height="32px"
                        width="calc(100% - 64px)"
                        mr="32px"
                        ml="32px"
                        mt="200px"
                        mb="40px"
                      >
                        <Box mb="mar" />
                      </Skeleton>
                      <Skeleton height="72px" width="100%">
                        <Box mb="mar" />
                      </Skeleton>
                    </Box>
                  </Grid>
                </Center>
              </Box>
            </Hidden>
          )}
        </Box>
      )}
      {compToShow && (
        <Box className="content-divider custom-content-area-container">
          <Container
            id={CONTENT_AREAS.CONTENT_AREA_THREE}
            className="content-areaThree"
            maxW={isDesktop ? '62.5%' : '100%'}
            p={isDesktop ? '' : '40px 16px 40px'}
            sx={styles.contentAreaThree}
          >
            <CustomSlot content={content} Component={ContentAreaThreeCmsSlot} ignoreHidden={true} />
          </Container>
        </Box>
      )}
      <Box className="content-divider" />
    </Box>
  )
}

ContentAreaThree.propTypes = {
  siteId: PropTypes.string,
  content: PropTypes.object,
  productData: PropTypes.object,
}

export default withErrorBoundaryWrapper(ContentAreaThree)
