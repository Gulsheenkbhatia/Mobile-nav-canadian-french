import React, { useState, useRef, useEffect } from 'react'
import Box from 'toro/components/Box'
import Center from 'toro/components/Center'
import usePreference from 'toro/hooks/usePreference'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import Skeleton from 'toro/components/Skeleton'
import Hidden from 'toro/components/Hidden'
import Grid from 'toro/components/Grid'
import Lazy from 'toro/components/Lazy'
import useViewportType from 'toro/hooks/useViewportType'
import { Container } from '@chakra-ui/react'
import CustomSlot from 'toro/cms/components/CustomSlot'
import ContentAreaTwoCmsSlot from 'toro/components/product/ContentArea/ContentAreaTwoCmsSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { InView } from 'react-intersection-observer'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import PropTypes from 'prop-types'
import useSplideCarousel from 'toro/hooks/useSplideCarousel'
import { applyProductSwatchesClick } from 'toro/helpers/home'
import { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'

function ContentAreaTwo({ siteId, content, contentAreaCustomAttribute }) {
  const styles = useMultiStyleConfig('ContentArea')
  const { content: { isSplideCarouselExists = false } = {} } = content || {}
  useSplideCarousel({ shouldInjectSplide: isSplideCarouselExists })
  const enableContentAreaTwo = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'isEnableContentTwo',
  })
  const existContentAreaTwo = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'pdpContentAreaTwo',
  })
  const enableContentAreaTwoValue = getSiteValueFromPref(enableContentAreaTwo, siteId)

  const existContentAreaTwoValue =
    contentAreaCustomAttribute || getSiteValueFromPref(existContentAreaTwo, siteId)
  const { isDesktop } = useViewportType()
  const [showSkeleton, setShowSkeleton] = useState(true)

  const manageSkeleton = (visible) => {
    if (visible) {
      setShowSkeleton(false)
    }
  }

  const promoBannerNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(promoBannerNode)
  const hasVideoContent = content?.hasVideo
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideoContent, promoBannerNode)
  const { default: isContentOnline } = content?.online || {}

  useEffect(() => {
    if (showSkeleton) return
    const cleanupSwatches = applyProductSwatchesClick(CONTENT_AREAS.CONTENT_AREA_TWO)
    contentUpdated()
    return () => {
      cleanupSwatches()
    }
  }, [content, showSkeleton])

  const compToShow =
    enableContentAreaTwoValue &&
    existContentAreaTwoValue &&
    !!content &&
    !!Object.keys(content)?.length &&
    isContentOnline

  if (!enableContentAreaTwoValue && !existContentAreaTwoValue) {
    return null
  }

  return (
    <Box
      ref={hasVideoContent ? viewportVideoHandlerRef : promoBannerNode}
      minH={compToShow ? '348px' : '0'}
    >
      <Lazy onVisible={manageSkeleton}>
        {compToShow && (
          <Box className="content-divider" sx={styles.contentDivider}>
            <Container
              id={CONTENT_AREAS.CONTENT_AREA_TWO}
              className="content-areaTwo"
              maxW={isDesktop ? '62.5%' : '100%'}
              p={isDesktop ? '32px 0 32px' : '40px 16px 40px'}
              sx={styles.contentAreaTwo}
            >
              <CustomSlot content={content} Component={ContentAreaTwoCmsSlot} ignoreHidden={true} />
            </Container>
          </Box>
        )}
      </Lazy>
      {showSkeleton && (
        <InView onChange={manageSkeleton} rootMargin="415px 0px -100px 0px">
          <>
            <Hidden onDesktop w="100%">
              <Box m="42px" minH="348px">
                <Box>
                  <Skeleton height="348px" width="100%">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
              </Box>
            </Hidden>
            {isDesktop && (
              <Hidden onNonDesktop w="100%">
                <Box minH="529px">
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
          </>
        </InView>
      )}
    </Box>
  )
}

ContentAreaTwo.propTypes = {
  siteId: PropTypes.string,
  content: PropTypes.object,
  productData: PropTypes.object,
}

export default withErrorBoundaryWrapper(ContentAreaTwo)
