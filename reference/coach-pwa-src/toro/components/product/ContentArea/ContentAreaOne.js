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
import ContentAreaOneCmsSlot from 'toro/components/product/ContentArea/ContentAreaOneCmsSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { InView } from 'react-intersection-observer'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import PropTypes from 'prop-types'
import useSplideCarousel from 'toro/hooks/useSplideCarousel'
import { applyProductSwatchesClick } from 'toro/helpers/home'
import { CONTENT_AREAS } from 'toro/components/product/desktop/ContentSlider'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'

function ContentAreaOne({ siteId, content, contentAreaCustomAttribute }) {
  const styles = useMultiStyleConfig('ContentArea')
  const { content: { isSplideCarouselExists = false } = {} } = content || {}
  useSplideCarousel({ shouldInjectSplide: isSplideCarouselExists })

  const enableContentAreaOne = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'isEnableContentOne',
  })

  const existContentAreaOne = usePreference({
    groupId: 'brandProdAttributes',
    preferenceId: 'pdpContentAreaOne',
  })

  const enableContentAreaOneValue = getSiteValueFromPref(enableContentAreaOne, siteId)
  const existContentAreaOneValue =
    contentAreaCustomAttribute || getSiteValueFromPref(existContentAreaOne, siteId)

  const { isDesktop } = useViewportType()
  const [showSkeleton, setShowSkeleton] = useState(true)

  const manageSkeleton = (visible) => {
    if (visible) {
      setShowSkeleton(false)
    }
  }

  const { default: isContentOnline } = content?.online || {}
  const promoBannerNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(promoBannerNode)
  const hasVideoContent = content?.hasVideo
  const viewportVideoHandlerRef = useViewportVideoHandler(hasVideoContent, promoBannerNode)

  useEffect(() => {
    if (showSkeleton) return
    const cleanupSwatches = applyProductSwatchesClick(CONTENT_AREAS.CONTENT_AREA_ONE)
    contentUpdated()
    return () => {
      cleanupSwatches()
    }
  }, [content, showSkeleton])

  const compToShow =
    enableContentAreaOneValue &&
    existContentAreaOneValue &&
    !!content &&
    !!Object.keys(content)?.length &&
    isContentOnline

  if (!enableContentAreaOneValue && !existContentAreaOneValue) {
    return null
  }

  return (
    <Box
      ref={hasVideoContent ? viewportVideoHandlerRef : promoBannerNode}
      minH={compToShow ? '402px' : '0'}
    >
      <Lazy onVisible={manageSkeleton}>
        {compToShow && (
          <Box minH={isDesktop ? '481px' : '402px'} className="content-divider">
            <Container
              id={CONTENT_AREAS.CONTENT_AREA_ONE}
              className="content-areaOne"
              maxW={isDesktop ? '62.5%' : '100%'}
              p={isDesktop ? '20px 0' : '40px 0'}
              sx={styles.contentAreaOne}
            >
              <CustomSlot ignoreHidden={true} Component={ContentAreaOneCmsSlot} content={content} />
            </Container>
          </Box>
        )}
      </Lazy>
      {showSkeleton && (
        <InView onChange={manageSkeleton} rootMargin="405px 0px -100px 0px">
          <>
            <Hidden onDesktop w="100%" style={{ aspectRatio: '800 / 1000' }}>
              <Box className="content-divider" minH={isDesktop ? '481px' : '402px'}>
                <Box mt="40px">
                  <Skeleton width="100%" height={isDesktop ? '481px' : '414px'}>
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
              </Box>
            </Hidden>
            <Hidden onNonDesktop w="100%">
              <Box minH="730px">
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
          </>
        </InView>
      )}
    </Box>
  )
}

ContentAreaOne.propTypes = {
  siteId: PropTypes.string,
  content: PropTypes.object,
  productData: PropTypes.object,
}

export default withErrorBoundaryWrapper(ContentAreaOne)
