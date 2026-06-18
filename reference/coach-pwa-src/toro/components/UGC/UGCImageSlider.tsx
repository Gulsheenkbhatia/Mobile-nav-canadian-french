import { useCallback, useRef, useState } from 'react'
import ReactSlickSlider from 'react-slick'
import type { UGCItem, UGCPageType } from 'toro/components/UGC/types'
import Slider from 'toro/components/Slider'
import Box from 'toro/components/Box'
import NextArrow from 'toro/components/Certona/Arrows/Right'
import PrevArrow from 'toro/components/Certona/Arrows/Left'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import UGCPopup from 'toro/components/UGC/UGCPopup'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import UGCSkeleton from 'toro/components/UGC/UGCSkeleton'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import UGCVideo from 'toro/components/UGC/UGCVideo'
import useUGCVideoRotation from 'toro/components/UGC/useUGCVideoRotation'

export const isVideoContent = (item: UGCItem) => item?.content?.media?.mediatype === 'video'

interface UGCImageSliderProps {
  showImages?: UGCItem[]
  isNonShopable?: boolean
  isGridEnable?: boolean
  fetchNext: () => void
  gridToShow?: number
  loading?: boolean
  variant?: string
  displayShowMore?: boolean
  pageType?: UGCPageType
  wyngItemCount?: number
  hasNext?: boolean
}

const UGCImageSlider = ({
  showImages,
  isNonShopable,
  isGridEnable,
  fetchNext,
  gridToShow,
  loading,
  variant,
  displayShowMore,
  pageType,
}: UGCImageSliderProps) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('UGCStyling', { variant })
  const { SocialGallery } = styles
  const sliderRef = useRef<ReactSlickSlider>()
  const [isModalOpen, setModalOpen] = useState(false)
  const [popupStartIndex, setPopupStartIndex] = useState(0)
  const analytics = useAnalytics()
  const { isDesktop, isMobile } = useViewportType()
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isMobileNotCentered = variant === 'wyngMobileNotCentered'
  const isSingleImage = showImages?.length === 1
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0)
  const {
    pixleeUgc: { enablePixleeUGC },
  } = usePreference({
    pixleeUGC: ['enablePixleeUGC'],
  })

  const sliderProps = isMobile
    ? {
        slidesToShow: isPDPV3Mobile || isMobileNotCentered ? 1.16 : 1,
        slidesToScroll: 1,
        centerMode: !(isPDPV3Mobile || isMobileNotCentered),
        swipeToSlide: true,
        initialSlide: 0,
        arrows: false,
        centerPadding: '68px',
        infinite: false,
        maxWidth: '290px',
        maxHeight: '290px',
      }
    : {
        slidesToShow: 4,
        slidesToScroll: false,
        centerMode: false,
        swipeToSlide: false,
        initialSlide: 0,
        arrows: true,
        infinite: false,
      }

  const {
    shouldPlayVideo,
    shouldResetVideo,
    onPlayToggle,
    onActiveVideoEnded,
    shouldLoop,
    stopRotation,
  } = useUGCVideoRotation({
    items: showImages,
    isDesktop: !!isDesktop,
    activeSlideIndex: visibleSlideIndex,
    slidesToShow: sliderProps.slidesToShow,
  })

  const onShowMoreClick = useCallback(() => {
    fetchNext()
    analytics.send('UGCUgcInteraction', {
      eventLocation: 'ugc gallery',
      eventAction: 'show more photo click',
      eventLabel: 'none',
    })
  }, [fetchNext])

  const handleUgcInteraction = useCallback(
    (index) => {
      setModalOpen(true)
      stopRotation()
      setPopupStartIndex(index)
      analytics.send('UGCUgcInteraction', {
        eventLocation: 'content tile',
        eventAction: 'ugc container click',
        eventLabel: 'none',
      })
    },
    [analytics]
  )

  const handleSlideFocus = useCallback(
    (index) => (e) => {
      const isKeyboardFocus = !e.currentTarget.matches(':focus:not(:focus-visible)')
      if (isKeyboardFocus) {
        sliderRef.current?.slickGoTo(index)
      }
    },
    []
  )

  const onArrowClick = ({ currentSlide, type }: { currentSlide: number; type: string }) => {
    if (type === 'next') {
      sliderRef.current.slickGoTo(currentSlide + 1)
      analytics.send('UGCUgcInteraction', {
        eventLocation: 'carousel right arrow',
        eventAction: 'ugc container click',
        eventLabel: 'none',
      })
    } else {
      sliderRef.current.slickGoTo(currentSlide - 1)
      analytics.send('UGCUgcInteraction', {
        eventLocation: 'carousel left arrow',
        eventAction: 'ugc container click',
        eventLabel: 'none',
      })
    }
  }

  const sliderContainerProps = {
    className: 'wyngimageslider',
    m: '0 auto',
    ...(isDesktop && { maxWidth: '1233px' }),
  }

  const renderImages =
    showImages?.map?.((item, index) => {
      return (
        <GridItem
          width={isMobile ? '173.5px' : '262px'}
          height={isMobile ? '173.5px' : '262px'}
          key={item?.id}
        >
          <Box as="button" type="button" onClick={() => handleUgcInteraction(index)}>
            <Image
              src={
                enablePixleeUGC
                  ? item?.content?.media?.media_urls?.square_medium_image
                  : item?.content?.media?.media_urls?.medium_image
              }
              aspectImgRatio="1"
            />
          </Box>
        </GridItem>
      )
    }) || []

  return (
    <>
      <UGCPopup
        showImages={showImages}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        popupStartIndex={popupStartIndex}
        isNonShopable={isNonShopable}
        setPopupStartIndex={setPopupStartIndex}
        pageType={pageType}
      />
      {isGridEnable ? (
        <Box
          className="Ugc-Wyng-Container"
          maxWidth={isMobile ? '351px' : '1344px'}
          sx={SocialGallery.ugcContainer}
          data-qa="ugc_cntnr_galleryimgsnippet"
        >
          <Grid templateColumns={`repeat(${gridToShow}, 1fr)`} gap={isMobile ? 1 : 2}>
            {renderImages?.length > 0 ? renderImages : []}
          </Grid>
          {loading ? <UGCSkeleton isGridEnable /> : null}
          <Box display={displayShowMore ? 'block' : 'none'} sx={SocialGallery.showMore}>
            <Button variant="plain" size="xs" onClick={onShowMoreClick}>
              {formatMessage({
                id: 'pdp.product.wyngShowMorePhotos',
                defaultMessage: 'Show More Photos',
              })}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box {...sliderContainerProps} data-qa="ugc_wyng_image_slider">
          <Box
            className="slidercontainer"
            sx={styles.sliderContainer(isMobile, isSingleImage)}
            data-qa="ugc_wyng_image_slider_container"
          >
            <Slider
              ref={sliderRef}
              accessibility={true}
              speed={600}
              {...sliderProps}
              afterChange={setVisibleSlideIndex}
              nextArrow={
                <NextArrow
                  click={onArrowClick}
                  arrowProps={{
                    ...styles.arrowProps,
                    transform: 'translate(160%, -40%)',
                    right: 0,
                  }}
                  slidesToShow={sliderProps.slidesToShow}
                  wyngSlider={true}
                  dataQa="ugc_link_slider_right_arrow"
                  variant="chevronArrows"
                />
              }
              prevArrow={
                <PrevArrow
                  click={onArrowClick}
                  arrowProps={styles.arrowProps}
                  dataQa="ugc_link_slider_left_arrow"
                  variant="chevronArrows"
                />
              }
            >
              {(showImages || []).map((item, i) => {
                const totalSlides = showImages?.length || 0
                const slideLabel = formatMessage(
                  {
                    id: isVideoContent(item) ? 'ugc.openVideo' : 'ugc.openImage',
                    defaultMessage: isVideoContent(item)
                      ? 'Open UGC video {index} of {total}'
                      : 'Open UGC image {index} of {total}',
                  },
                  { index: i + 1, total: totalSlides }
                )

                const thumbStyle = isVideoContent(item)
                  ? {
                      style: {
                        objectFit: 'cover',
                        aspectRatio: '1',
                      },
                    }
                  : {}

                return (
                  <Box
                    as="button"
                    type="button"
                    className="wyng-image-container"
                    sx={styles.imageContainer(isMobile)}
                    onClick={() => handleUgcInteraction(i)}
                    onFocus={handleSlideFocus(i)}
                    key={item?.id}
                    aria-label={slideLabel}
                  >
                    {isVideoContent(item) ? (
                      <Box sx={styles.videoContainer}>
                        <UGCVideo
                          videoSrc={item?.content?.platform_data?.social_platform_original_url}
                          shouldPlay={shouldPlayVideo(i)}
                          onEnded={shouldPlayVideo(i) ? onActiveVideoEnded : undefined}
                          onPlayToggle={onPlayToggle}
                          index={i}
                          sx={styles.video}
                          showControls
                          loop={shouldLoop}
                          resetOnPlay={shouldResetVideo(i)}
                        />
                      </Box>
                    ) : (
                      <Image
                        src={
                          enablePixleeUGC
                            ? item?.content?.media?.media_urls?.square_medium_image
                            : item?.content?.media?.media_urls?.medium_image
                        }
                        w="100%"
                        sx={styles.image}
                        {...thumbStyle}
                        aspectRatio={1}
                      />
                    )}
                  </Box>
                )
              })}
            </Slider>
          </Box>
        </Box>
      )}
    </>
  )
}

export default UGCImageSlider
