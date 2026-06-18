import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Slider from 'toro/components/Slider'
import NextArrow from 'toro/components/Certona/Arrows/Right'
import PrevArrow from 'toro/components/Certona/Arrows/Left'
import useTheme from 'toro/hooks/useTheme'
import get from 'lodash/get'
import { useRef, useState, useEffect, useMemo } from 'react'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import Lazy from 'toro/components/Lazy'
import useViewportType from 'toro/hooks/useViewportType'
import Skeleton from 'toro/components/Skeleton'
import isMobileDevice from 'toro/helpers/isMobileDevice'
import usePreference from 'toro/hooks/usePreference_new'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { InView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import { maxCertonadataRecommendationAtom } from 'store/global.atom'
import { SLIDE_WIDTH, SLIDER_WIDTH } from 'toro/constants/appConstants.js'
import usePageType from 'toro/hooks/usePageType'
import CertonaHomeRecommendationItem from 'toro/components/Certona/RecommendationOnHome/CertonaHomeRecommendationItem'

const CertonaRecommendationOnHome = function ({ certonaData, label, hidePrice, brand, siteId }) {
  const sliderRef = useRef()
  const theme = useTheme()
  const { viewport, isDesktop } = useViewportType()
  const { isPDP } = usePageType()

  const products = get(certonaData, 'items', [])
  const { addImpression, selectRecommItem } = useRecommAnalytics({ products, certonaData })

  const {
    certonaConfiguration: { HomePageCertonaSlotConfig = null, certonaATBConfigs },
    recommendations: {
      disableRecommendationOnPages,
      hideRecentlyViewedOnPages,
      hideRecommendations,
    },
  } = usePreference({
    CertonaConfiguration: ['HomePageCertonaSlotConfig', 'certonaATBConfigs'],
    recommendations: '*',
  })

  const hideYmalOnPDP = disableRecommendationOnPages?.includes('PDP')
  const hideRecentlyViewedPDP = hideRecentlyViewedOnPages?.includes('PDP')
  const maxCertonadataRecommendation = useAtomValue(maxCertonadataRecommendationAtom)

  const styles = useMultiStyleConfig('HomeRecommendations')
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [certonaInViewport, setCertonaInViewport] = useState(false)

  const manageVisibility = (visible) => {
    if (visible) {
      setCertonaInViewport(true)
    }
  }

  useEffect(() => {
    if (certonaData && certonaInViewport) {
      setShowSkeleton(false)
    }
  }, [certonaInViewport, certonaData])

  const CertonaTitle = get(HomePageCertonaSlotConfig, 'heading.en')
  const CertonaSubTitle = get(HomePageCertonaSlotConfig, 'subHeading.en')
  const ImageUrl = get(HomePageCertonaSlotConfig, 'style.ImageUrl')
  const backgroundColor = get(HomePageCertonaSlotConfig, 'style.color', '')

  products?.splice(maxCertonadataRecommendation || 16)
  const { slidesToShow, slidesToScroll, centerMode, swipeToSlide, initialSlide, showArrows } =
    viewport === 'mobile'
      ? {
          slidesToShow: products?.length < 3 ? products?.length : 2.5,
          slidesToScroll: 1,
          centerMode: false,
          swipeToSlide: true,
          initialSlide: 0,
          showArrows: false,
          centerPadding: '0',
          infinite: true,
          className: 'center',
        }
      : {
          slidesToShow: products?.length <= 3 ? products?.length : viewport === 'desktop' ? 4 : 3,
          slidesToScroll: true,
          centerMode: false,
          swipeToSlide: false,
          initialSlide: 0,
          showArrows: true,
        }

  const arrowProps = {
    fill: theme.colors.main.black,
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
    svg: {
      width: '48px',
      height: '48px',
    },
  }

  const hasATBButton = !!certonaATBConfigs?.[certonaData?.scheme]

  const onArrowClick = ({ currentSlide, type }) => {
    if (type === 'next') {
      sliderRef.current.slickGoTo(currentSlide + 1)
    } else {
      sliderRef.current.slickGoTo(currentSlide - 1)
    }
  }

  const onTileVisible = (product, idx) => () => {
    addImpression({
      listName: label.trim(),
      product: { ...product, is_quick_add: hasATBButton && product.is_quick_add },
      idx,
      certonaScheme: certonaData?.scheme,
      recAIType: 'certona',
    })
  }

  const onLinkClick = (product, idx) => () => {
    selectRecommItem({
      listName: label.trim(),
      product: { ...product, is_quick_add: hasATBButton && product.is_quick_add },
      idx,
      eventLocation: certonaData?.scheme,
      recAIType: 'certona',
    })
  }

  const carouselWidth =
    products?.length * SLIDE_WIDTH > SLIDER_WIDTH ? SLIDER_WIDTH : products?.length * SLIDE_WIDTH

  const productItems = products.map((product, idx) => {
    return (
      <CertonaHomeRecommendationItem
        key={`product-${product.ID}`}
        product={product}
        idx={idx}
        certonaData={certonaData}
        onTileVisible={onTileVisible}
        onLinkClick={onLinkClick}
        hasATBButton={hasATBButton}
        hidePrice={hidePrice}
        brand={brand}
        siteId={siteId}
      />
    )
  })

  const recommendationWrapperStyles = useMemo(
    () => styles.recommendationWrapper(isDesktop, hideYmalOnPDP),
    [isDesktop, !hideYmalOnPDP]
  )
  const certonaTitleStyles = useMemo(() => styles.certonaTitleHome?.(isDesktop), [isDesktop])
  const certonaSubTitleStyles = useMemo(() => styles.certonaSubTitle?.(isDesktop), [isDesktop])
  if (!products?.length) return null
  return (
    <Box
      minH="260px"
      background={`${ImageUrl ? `url(${ImageUrl})` : ''} ${backgroundColor}`}
      backgroundSize="cover"
    >
      <Lazy onVisible={manageVisibility}>
        {certonaData && !hideRecommendations && (!hideRecentlyViewedPDP || !hideYmalOnPDP) && (
          <Box
            style={{ minHeight: isDesktop ? '455px' : '316px' }}
            m={'0 auto 32px'}
            className="content-divider"
          >
            {products?.length > 0 && Object.keys(products[0])?.length > 0 && (
              <Flex flexDirection="column" w="100%" sx={recommendationWrapperStyles}>
                <Box
                  as="h2"
                  className="certona_title"
                  sx={certonaTitleStyles}
                  data-qa="certona-title"
                >
                  {CertonaTitle || label}
                </Box>
                {CertonaSubTitle && (
                  <Box as="h3" sx={certonaSubTitleStyles}>
                    {CertonaSubTitle}
                  </Box>
                )}

                {!isMobileDevice() && (
                  <Box
                    as="div"
                    maxWidth={`${carouselWidth}px`}
                    sx={styles.recommendationSliderWrapper}
                    className={'recommendSlider'}
                    mt={!CertonaSubTitle && '32px'}
                    data-qa={
                      isPDP ? 'pdp_recommendation_section_wrapper' : 'recommendations-section'
                    }
                  >
                    <Slider
                      ref={sliderRef}
                      infinite={false}
                      accessibility={true}
                      speed={600}
                      slidesToShow={slidesToShow}
                      slidesToScroll={slidesToScroll}
                      centerMode={centerMode}
                      initialSlide={initialSlide}
                      arrows={showArrows}
                      swipeToSlide={swipeToSlide}
                      nextArrow={
                        <NextArrow
                          variant="chevronArrows"
                          click={onArrowClick}
                          arrowProps={arrowProps}
                          slidesToShow={slidesToShow}
                          recommendation={true}
                          dataQa="recommendation_section_right_carousel"
                        />
                      }
                      prevArrow={
                        <PrevArrow
                          click={onArrowClick}
                          arrowProps={arrowProps}
                          variant="chevronArrows"
                          dataQa="recommendation_section_left_carousel"
                        />
                      }
                    >
                      {productItems}
                    </Slider>
                  </Box>
                )}

                {isMobileDevice() && (
                  <Box
                    maxW="100vw"
                    className="mob-recommend"
                    sx={styles.recommendationMobileSliderWrapper}
                    data-qa="recommendations-section"
                  >
                    <Flex
                      maxWidth="100vw"
                      sx={styles.mobileRecommendationItems}
                      className="mob-recommend-items"
                    >
                      {productItems}
                    </Flex>
                  </Box>
                )}
              </Flex>
            )}
          </Box>
        )}{' '}
      </Lazy>
      {showSkeleton && (
        <InView onChange={manageVisibility} rootMargin="355px 0px -100px 0px">
          <>
            {!isDesktop ? (
              <Box w="100%">
                <Box>
                  <Skeleton height="23px" width="60%" m="22px auto">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
                <Box m="20px" minH="200px" display="flex" flexDirection="row" alignItems="end">
                  <Box width="40%" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="160px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="60%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>

                  <Box width="40%" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="160px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="60%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box w="100%" maxWidth="904px" m="auto">
                <Box>
                  <Skeleton height="32px" width="40%" m="22px auto">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
                <Box m="20px" minH="200px" display="flex" flexDirection="row" alignItems="end">
                  <Box width="216px" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="270px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="100%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>

                  <Box width="216px" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="270px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="100%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>

                  <Box width="216px" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="270px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="100%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>

                  <Box width="216px" mr="20px" display="flex" flexDirection="column">
                    <Skeleton height="270px" width="100%">
                      <Box mb="mar" />
                    </Skeleton>
                    <Skeleton height="23px" width="100%" m="22px auto">
                      <Box mb="mar" />
                    </Skeleton>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        </InView>
      )}
    </Box>
  )
}

export default withErrorBoundaryWrapper(CertonaRecommendationOnHome)
