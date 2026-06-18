import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import Box from 'toro/components/Box'
import { AspectRatio } from '@chakra-ui/react'
import PlayIcon from 'design-tokens/icon/video/play-cta.svg'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import Flex from 'toro/components/Flex'
import HeroPlayIcon from 'design-tokens/icon/video/play.svg'
import HeroPauseIcon from 'design-tokens/icon/video/pause.svg'
import MuteIcon from 'design-tokens/icon/video/mute.svg'
import VolumeIcon from 'design-tokens/icon/video/volume.svg'
import MuteAdapriveIcon from 'components/assets/soundMute.svg'
import UnmuteAdapriveIcon from 'components/assets/soundUnmute.svg'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { ProductMainSectionBreakpointContext } from '../ProductMainSection/context'
import {
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  isTabbedAdaptivePDPEligibleAtom,
  productIdAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import { InView } from 'react-intersection-observer'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useAnalytics from 'toro/analytics/useAnalytics'
import noop from 'lodash/noop'

const playButtonStyleProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
}

const CarouselVideo = ({
  isPlay,
  isActive,
  poster,
  videoSrc,
  height,
  width,
  objectFit,
  thumbnails,
  isDesktop,
  isGallery,
  idx,
  isQuickView,
  onLoad,
  classes = '',
  variant,
  muted: mutedDefault = false,
  fullHeight = false,
  onClick = noop,
}) => {
  const isTabbedAdaptivePDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const [play, setPlay] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [lowPowerMode, setLowPowerMode] = useState(false)
  const [isInViewport, setIsInViewport] = useState(false)
  const [isVideoDataLoaded, setIsVideoDataLoaded] = useState(false)
  const analytics = useAnalytics()
  const videoRef = useRef(null)
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('CarouselVideo', { variant })
  const { tangibleeWidgetProps, membershipExclusiveProduct } = useContext(
    ProductMainSectionBreakpointContext
  )
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const isMegaPDP = isMegaPDPEligible || isNewMegaPDPEligible
  const { isTransparentStickyHeader } = useHeaderPositionPref()
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const productId = useAtomValue(productIdAtom)
  const { aspectRatioForPdpV6 } = useMultiStyleConfig('ImageZoomTheme')
  const mobileRatio = isPDPv6 ? aspectRatioForPdpV6 : 0.8
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

  const onPlayIconClick = (e) => {
    togglePlayVideo(e)
    fireSwatchVideoClickEvent()
  }

  const togglePlayVideo = ({ forcePlay = false }) => {
    if (forcePlay) {
      if (videoRef.current) {
        playVideo()
        return
      }
    }
    if (!thumbnails) {
      if (videoRef.current) {
        if (play) {
          pauseVideo()
        } else {
          playVideo()
        }
      }
    } else {
      videoRef.current.pause()
    }
  }

  useEffect(() => {
    if (!!idx && videoRef?.current && !videoLoaded) {
      videoRef.current.load()
      setVideoLoaded(true)
    }
  }, [idx])

  useEffect(() => {
    if (videoLoaded) {
      onLoad?.()
    }
  }, [videoLoaded])

  useEffect(() => {
    if (isPlay && isActive) {
      togglePlayVideo({ forcePlay: isGallery })
    }
    return () => {
      pauseVideo()
    }
  }, [isActive])

  useEffect(() => {
    const shouldPlay = isActive && !thumbnails && poster
    if (shouldPlay) {
      // Note: render process needs to finish first
      setTimeout(() => {
        playVideo()
      })
    }
  }, [])

  const handlePlayOverlayClick = () => {
    togglePlayVideo({ forcePlay: true })
    setLowPowerMode(false)
    fireSwatchVideoClickEvent()
  }

  const [muted, setMuted] = useState(mutedDefault)
  const HeroImgPlayIcon = !play && isActive ? HeroPlayIcon : HeroPauseIcon
  const dataQaAttr = !play && isActive ? 'pdp_btn_pdt_play' : 'pdp_btn_pdt_pause'
  const HeroImgMuteIcon =
    isTabbedAdaptivePDP || isPDPv6
      ? muted
        ? MuteAdapriveIcon
        : UnmuteAdapriveIcon
      : muted
      ? MuteIcon
      : VolumeIcon
  const handleToggleMute = () => {
    setMuted((current) => !current)
    fireSwatchVideoClickEvent()
  }
  const { isVisible: isTangibleeEnabled } = tangibleeWidgetProps

  const handleMetadataLoading = useCallback((event) => setIsVideoDataLoaded(!!event), [])

  const shouldLoadPoster = useMemo(() => isInViewport && !isVideoDataLoaded, [isInViewport])

  const handleVideoClick = () => {
    pauseVideo()
    onClick?.()
  }

  return (
    <InView
      triggerOnce
      onChange={setIsInViewport}
      threshold={0.1}
      className="carousel-video-wrapper"
    >
      <Box position="relative" h={thumbnails || fullHeight ? '100%' : null}>
        <AspectRatio
          h={isDesktop ? height : '100%'}
          minHeight={isDesktop ? '495px' : null}
          w={isQuickView ? '317px' : isDesktop ? (width ? width : '') : '100%'}
          ratio={isDesktop ? 1 : mobileRatio}
        >
          {videoSrc && (
            <>
              <video
                poster={!isGallery ? poster : shouldLoadPoster ? poster : ''}
                loop
                muted={muted}
                preload="none"
                playsInline
                ref={videoRef}
                className={`pdp-carousel-d ${classes ?? ''}`}
                onLoadedMetadataCapture={handleMetadataLoading}
                style={{
                  objectFit,
                  maxHeight: isDesktop && '100%',
                  height: isQuickView && 'auto',
                }}
                data-qa="pdp_btn_pdt_video"
                onClick={handleVideoClick}
              >
                <source src={videoSrc} type="video/mp4" />
                {formatMessage({
                  id: 'pdp.browserNotSupportHTML5Video',
                  defaultMessage: 'Your browser does not support HTML5 video.',
                })}
              </video>
              {lowPowerMode && (
                <Box sx={styles.blurredOverLay}>
                  <div {...playButtonStyleProps} onClick={handlePlayOverlayClick}>
                    <HeroPlayIcon width="58" height="58" />
                  </div>
                </Box>
              )}
            </>
          )}
        </AspectRatio>
        {thumbnails ? (
          <Box
            sx={{
              ...playButtonStyleProps,
              '& svg': {
                transform: 'scale(2)',
              },
            }}
          >
            <PlayIcon />
          </Box>
        ) : !lowPowerMode ? (
          <Flex
            sx={{
              ...styles.heroImgIconStyleProps(
                isDesktop,
                isQuickView,
                isTangibleeEnabled,
                membershipExclusiveProduct
              ),
              ...(isTransparentStickyHeader && styles.heroImgIconTransparentHeaderStyle),
            }}
          >
            <Box onClick={handleToggleMute}>
              <HeroImgMuteIcon />
            </Box>
            <Box onClick={onPlayIconClick}>
              <HeroImgPlayIcon data-qa={dataQaAttr} />
            </Box>
          </Flex>
        ) : null}
      </Box>
    </InView>
  )
}
CarouselVideo.propTypes = {
  isPlay: PropTypes.bool,
  isActive: PropTypes.bool,
  poster: PropTypes.string,
  videoSrc: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  objectFit: PropTypes.string,
  thumbnails: PropTypes.bool,
  isDesktop: PropTypes.bool,
  isGallery: PropTypes.bool,
  idx: PropTypes.string | PropTypes.number,
  isQuickView: PropTypes.bool,
  onLoad: PropTypes.func,
}

CarouselVideo.defaultProps = {
  isPlay: false,
  isActive: false,
  thumbnails: false,
  onLoad: () => {},
}

export default CarouselVideo
