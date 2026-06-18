import { useCallback, useEffect, useRef, useState } from 'react'
import ReactSlickSlider from 'react-slick'
import type { UGCItem, UGCPageType } from 'toro/components/UGC/types'
import Slider from 'toro/components/Slider'
import Box from 'toro/components/Box'
import NextArrow from 'toro/components/Certona/Arrows/Right'
import PrevArrow from 'toro/components/Certona/Arrows/Left'
import useTheme from 'toro/hooks/useTheme'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import UGCRelatedProducts from './UGCRelatedProducts'
import ViewMoreText from './ViewMoreText'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import UGCVideo from 'toro/components/UGC/UGCVideo'
import { isVideoContent } from 'toro/components/UGC/UGCImageSlider'
import { useIntl } from 'react-intl'

interface UGCPopupProps {
  showImages?: UGCItem[]
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
  popupStartIndex: number
  isNonShopable?: boolean
  setActiveSlide?: (slide: number) => void
  setPopupStartIndex?: (index: number) => void
  pageType?: UGCPageType
}

const UGCPopup = ({
  showImages,
  isModalOpen,
  setModalOpen,
  popupStartIndex,
  isNonShopable,
}: UGCPopupProps) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('UGCStyling')
  const sliderRef = useRef<ReactSlickSlider>()
  const theme = useTheme()
  const [viewText, setViewText] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(popupStartIndex)
  const [userPaused, setUserPaused] = useState(false)
  const analytics = useAnalytics()
  const { isDesktop, isMobile } = useViewportType()
  const {
    pixleeUgc: { enablePixleeUGC },
  } = usePreference({
    pixleeUGC: ['enablePixleeUGC'],
  })

  const sliderArrowProps = {
    position: 'absolute',
    zIndex: 1,
    top: !isMobile ? '50%' : isNonShopable ? '50%' : '25%',
    '&:hover': {
      cursor: 'pointer',
    },
    svg: {
      width: '48px',
      height: '48px',
    },
    path: {
      fill: theme.colors.main.white,
    },
  }

  const handlePlayToggle = useCallback((_index: number, shouldPlay: boolean) => {
    setUserPaused(!shouldPlay)
  }, [])

  const onArrowClick = useCallback(
    ({ currentSlide, type }: { currentSlide: number; type: string }) => {
      if (type === 'next') {
        sliderRef?.current?.slickGoTo(currentSlide + 1)
        analytics.send('UGCUgcInteraction', {
          eventLocation: 'carousel right arrow',
          eventAction: 'ugc container click',
          eventLabel: 'none',
        })
      } else {
        sliderRef?.current?.slickGoTo(currentSlide - 1)
        analytics.send('UGCUgcInteraction', {
          eventLocation: 'carousel left arrow',
          eventAction: 'ugc container click',
          eventLabel: 'none',
        })
      }
      setViewText(true)
      setUserPaused(false)
    },
    []
  )

  const onClose = useCallback(() => {
    setModalOpen(false)
    setViewText(true)
    setUserPaused(false)
  }, [setModalOpen])

  const onSwipe = useCallback(() => {
    setViewText(true)
    setUserPaused(false)
  }, [])

  useEffect(() => {
    setCurrentSlide(popupStartIndex)
    setUserPaused(false)
  }, [popupStartIndex])

  const modalMediaSx = {
    width: '100%',
    maxHeight: isDesktop && !enablePixleeUGC ? '375px' : isMobile ? '100%' : '65vh',
    maxWidth: isDesktop ? '375px' : '100%',
    ...(isDesktop ? { objectFit: 'contain' } : {}),
  }

  return (
    <>
      <Modal
        lockFocusAcrossFrames
        returnFocusOnClose={false}
        blockScrollOnMount={false}
        isOpen={isModalOpen}
        isCentered
        variant={'mobFullHeight'}
        onClose={onClose}
      >
        <ModalOverlay sx={styles.modelOverlay} />
        <ModalContent
          minHeight={isMobile ? '100vh' : '536px'}
          minWidth={isMobile ? '100vw' : isNonShopable ? '519px' : '600px'}
          sx={styles.modalContent}
          overflow={isMobile ? 'hidden' : null}
        >
          <Box w="100%" sx={styles.modalSliderContainer(isMobile, isNonShopable)}>
            <ModalCloseButton sx={styles.modalCloseButton(isDesktop, isNonShopable)} />
            <Slider
              ref={sliderRef}
              accessibility={true}
              speed={0}
              swipeToSlide={false}
              slidesToShow={1}
              initialSlide={popupStartIndex}
              infinite={false}
              centerMode={false}
              arrows={true}
              onSwipe={onSwipe}
              afterChange={(nextIndex) => {
                setCurrentSlide(nextIndex)
                setUserPaused(false)
              }}
              nextArrow={
                <NextArrow
                  click={onArrowClick}
                  arrowProps={{
                    ...sliderArrowProps,
                    transform: 'translate(160%, -40%)',
                    right: isMobile ? '18%' : 0,
                  }}
                  slidesToShow={1}
                  dataQa="ugc_link_image_container_right_arrow"
                  variant="chevronArrows"
                />
              }
              prevArrow={
                <PrevArrow
                  click={onArrowClick}
                  arrowProps={{ ...sliderArrowProps, left: isMobile ? '18%' : 0 }}
                  wyngModal={true}
                  dataQa="ugc_link_image_container_left_arrow"
                  variant="chevronArrows"
                />
              }
            >
              {(showImages || []).map((item, index) => (
                <Box
                  className="imageContainer"
                  key={item?.id}
                  sx={styles.modalImageContainer()}
                  data-qa="ugc_image_container"
                  aria-hidden={index !== currentSlide}
                >
                  {index === currentSlide && (
                    <Box
                      display="flex"
                      padding={
                        isDesktop ? (isNonShopable ? '72px' : '36px 32px 38px 26px') : '0 0 38px 0'
                      }
                      alignItems="start"
                      justifyContent="space-between"
                      flexDirection={isDesktop ? 'row' : 'column'}
                    >
                      <Box className="wrap" w={isMobile ? '100%' : 'auto'} data-qa="ugc-img-model">
                        {isVideoContent(item) ? (
                          <UGCVideo
                            videoSrc={item?.content?.platform_data?.social_platform_original_url}
                            shouldPlay={index === currentSlide && !userPaused}
                            onPlayToggle={handlePlayToggle}
                            index={index}
                            sx={modalMediaSx}
                            loop
                            showControls
                          />
                        ) : (
                          <Image
                            src={item?.content?.media?.media_urls?.medium_image}
                            w="100%"
                            maxHeight={
                              isDesktop && !enablePixleeUGC ? '375px' : isMobile ? '100%' : '65vh'
                            }
                            objectFit={isDesktop ? 'contain' : null}
                            maxWidth={isDesktop ? '375px' : '100%'}
                          />
                        )}
                        <ViewMoreText
                          authorName={
                            isVideoContent(item)
                              ? item?.content?.author?.profile?.username
                                ? `@${item?.content?.author?.profile?.username}`
                                : formatMessage({
                                    id: 'pdp.product.ugc.coachCommunity',
                                    defaultMessage: 'Coach Community',
                                  })
                              : undefined
                          }
                          viewMore={viewText}
                          text={item?.content?.text}
                        />
                      </Box>
                      {!isNonShopable && <UGCRelatedProducts item={item} />}
                    </Box>
                  )}
                </Box>
              ))}
            </Slider>
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UGCPopup
