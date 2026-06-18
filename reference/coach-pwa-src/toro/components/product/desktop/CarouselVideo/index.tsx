import React, { useRef, useState, useEffect } from 'react'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { VideoMutedIcon, VideoUnmutedIcon, VideoPlayIcon, VideoPauseIcon } from 'toro/icons'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getPlayVideoButtonClickEvent } from 'toro/helpers/pdpGaEvents'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import { isMegaPDPEligibleAtom, isNewMegaPDPEligibleAtom, productIdAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
interface CarouselVideoPropTypes {
  isPlay: boolean
  isActive: boolean
  poster: string
  videoSrc: string
  objectFit: any
  isGallery: boolean
  muted: boolean
  hasClickedPlay: boolean
  idx: number
}

const CarouselVideo = ({
  isPlay = false,
  isActive = false,
  poster,
  videoSrc,
  objectFit,
  isGallery,
  muted: mutedDefault = false,
  hasClickedPlay = false,
  idx,
}: CarouselVideoPropTypes) => {
  const [play, setPlay] = useState(false)
  const [muted, setMuted] = useState(mutedDefault)
  const [lowPowerMode, setLowPowerMode] = useState(false)
  const videoRef = useRef(null)
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('CarouselVideoDesktop')
  const analytics = useAnalytics()
  const selectedVariantId = useSelectedVariantData('id')
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const isMegaPDP = isMegaPDPEligible || isNewMegaPDPEligible
  const productId = useAtomValue(productIdAtom)

  const isVideoPaused = !play && isActive
  const HeroImgPlayIcon = isVideoPaused ? VideoPlayIcon : VideoPauseIcon
  const HeroImgMuteIcon = muted ? VideoMutedIcon : VideoUnmutedIcon

  const fireSwatchVideoClickEvent = () => {
    const index = idx ? `p${idx + 1}:` : ''
    analytics.send('swatchInteraction', {
      eventLocation: isMegaPDP ? 'mega product' : 'product',
      eventAction: `${index}swatch video click`,
      swatchType: 'product image',
      eventLabel: productId,
      swatchValue: videoSrc,
      swatchVariant: productId,
    })
  }

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setPlay(true)
        })
        .catch((error) => {
          // Check for NotAllowedError to detect Low Power Mode
          if (error.name === 'NotAllowedError') {
            setLowPowerMode(true)
          }
          setPlay(false)
        })
      videoRef.current.focus()
    }
  }

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setPlay(false)
    }
  }

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setPlay(false)
    }
  }

  const togglePlayVideo = ({ forcePlay = false }) => {
    if (forcePlay && videoRef.current) {
      playVideo()
      return
    }
    if (videoRef.current) {
      if (play) {
        pauseVideo()
      } else {
        playVideo()
      }
    }
  }

  const handleToggleMute = () => {
    setMuted((current) => !current)
    fireSwatchVideoClickEvent()
  }

  const onPlayVideoButtonClick = (e) => {
    const imagePath = getFileBaseName(videoSrc)
    const eventPayload = getPlayVideoButtonClickEvent({ selectedVariantId, imagePath })
    analytics.send(...eventPayload)
  }

  const onPlayIconClick = (e) => {
    togglePlayVideo(e)
    fireSwatchVideoClickEvent()
  }

  // This useEffect handles when a video enters/exits the active position
  useEffect(() => {
    if (isPlay && isActive && (!lowPowerMode || hasClickedPlay)) {
      togglePlayVideo({ forcePlay: isGallery })
    } else {
      resetVideo()
      pauseVideo()
    }
  }, [isActive, isPlay, lowPowerMode, hasClickedPlay])

  // This useEffect handles the initialization of the videos
  useEffect(() => {
    const shouldPlay = isActive && poster && (!lowPowerMode || hasClickedPlay)
    if (videoRef?.current && (!lowPowerMode || hasClickedPlay)) {
      videoRef.current.load()
    }
    if (shouldPlay) {
      // Note: render process needs to finish first
      setTimeout(() => {
        playVideo()
      })
    }
  }, [isActive, poster, lowPowerMode, hasClickedPlay])

  return (
    <Box position="relative" h={'100%'}>
      {videoSrc && (
        <>
          <video
            poster={poster}
            loop
            muted={muted}
            preload="none"
            playsInline
            ref={videoRef}
            className="pdp-carousel-d"
            style={{
              objectFit,
              height: '100%',
              borderRadius: '18px',
            }}
          >
            <source src={`${videoSrc}#t=0`} type="video/mp4" />
            {formatMessage({
              id: 'pdp.browserNotSupportHTML5Video',
              defaultMessage: 'Your browser does not support HTML5 video.',
            })}
          </video>
        </>
      )}
      {!play && (!isActive || (lowPowerMode && !hasClickedPlay)) ? (
        <Box data-action={'playVideo'} sx={styles.textPlayButton} onClick={onPlayVideoButtonClick}>
          {formatMessage({
            id: 'pdp.textPlayButton',
            defaultMessage: 'Play Video',
          })}
        </Box>
      ) : isActive ? (
        <Flex sx={styles.heroImgIconStyleProps}>
          <Box onClick={handleToggleMute}>
            <HeroImgMuteIcon />
          </Box>
          <Box onClick={onPlayIconClick}>
            <HeroImgPlayIcon data-qa={isVideoPaused ? 'pdp_btn_pdt_pause' : 'pdp_btn_pdt_play'} />
          </Box>
        </Flex>
      ) : null}
    </Box>
  )
}

export default CarouselVideo
