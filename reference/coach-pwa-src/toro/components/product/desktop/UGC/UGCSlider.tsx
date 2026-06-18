import { useCallback, useState } from 'react'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import UGCPopup from 'toro/components/UGC/UGCPopup'
import SectionSlider from 'toro/components/product/desktop/SectionSlider'
import useViewportType from 'toro/hooks/useViewportType'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import UGCVideo from 'toro/components/UGC/UGCVideo'
import { isVideoContent } from 'toro/components/UGC/UGCImageSlider'

const UGCSlider = ({ showImages = [], styles }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [popupStartIndex, setPopupStartIndex] = useState(0)
  const [visibleSlideIndex, setVisibleSlideIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const { isMobile } = useViewportType()
  const isPdpV6 = useTemplate([TemplateName.pdpv6])
  const minImagesForLoop = isPdpV6 ? 2 : 0

  const handlePlayToggle = useCallback((index: number, shouldPlay: boolean) => {
    setVisibleSlideIndex(index)
    setUserPaused(!shouldPlay)
  }, [])

  const handleUgcInteraction = useCallback((index) => {
    setModalOpen(true)
    setUserPaused(true)
    setPopupStartIndex(index)
  }, [])

  const handleSlideMove = useCallback((idx) => {
    setUserPaused(false)
    setVisibleSlideIndex(idx)
  }, [])

  return (
    <>
      <UGCPopup
        showImages={showImages}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        popupStartIndex={popupStartIndex}
        isNonShopable={true}
      />
      <Box className="ugc-slider-container" sx={styles.sliderContainer}>
        <SectionSlider
          loop={showImages.length > minImagesForLoop}
          onMove={handleSlideMove}
          sliderOptions={{
            start: 0,
            focus: 'center',
            autoWidth: true,
            gap: isMobile ? '12px' : '18px',
          }}
        >
          {showImages.map((item, i) => (
            <Box sx={styles.imageContainer} key={item?.id} data-qa="ugc-image">
              {isVideoContent(item) ? (
                <UGCVideo
                  onClick={() => handleUgcInteraction(i)}
                  videoSrc={item?.content?.platform_data?.social_platform_original_url}
                  shouldPlay={visibleSlideIndex === i && !userPaused}
                  onPlayToggle={handlePlayToggle}
                  index={i}
                  sx={styles.imageOrVideo}
                  loop
                  showControls
                />
              ) : (
                <Image
                  onClick={() => handleUgcInteraction(i)}
                  src={item?.content?.media?.media_urls?.large_image}
                  sx={styles.imageOrVideo}
                  data-action="onImageClick"
                />
              )}
            </Box>
          ))}
        </SectionSlider>
      </Box>
    </>
  )
}

export default UGCSlider
