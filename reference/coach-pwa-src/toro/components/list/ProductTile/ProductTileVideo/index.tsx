import { useRef, useState, useEffect } from 'react'
import Box from 'toro/components/Box'
import AspectRatio from 'toro/components/AspectRatio'
import { useIntl } from 'react-intl'
import PauseVideoIcon from 'design-tokens/icon/video/pause.svg'
import PlayVideoIcon from 'design-tokens/icon/video/play.svg'
import { useInView } from 'react-intersection-observer'
import useAnalytics from 'toro/analytics/useAnalytics'

type ProductTileVideoProps = {
  videoSrc: string
  onVideoEnd: () => void
} & JSX.IntrinsicElements['video']

const ProductTileVideo = ({ videoSrc, onVideoEnd, ...rest }: ProductTileVideoProps) => {
  // Explicitly omit autoPlay to prevent it from being passed through and reintroducing eager loading
  const { autoPlay, ...safeRest } = rest
  const [play, setPlay] = useState(true)
  const videoRef = useRef(null)
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()

  const [inViewRef] = useInView({
    onChange: (isVisible) => {
      if (isVisible) {
        playVideo()
      } else {
        pauseVideo()
      }
    },
    rootMargin: '0px',
    threshold: [0.25, 0.75],
  })

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setPlay(true)
        })
        .catch(() => {
          setPlay(false)
        })
    }
  }

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setPlay(false)
    }
  }

  const onPlayIconClick = (e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()

    if (videoRef.current) {
      if (play) {
        pauseVideo()
      } else {
        playVideo()
      }
      analytics.send('listInteraction', {
        eventLocation: 'list product tile',
        eventAction: 'video swatch click',
        eventLabel: play ? 'pause' : 'play',
      })
    }
  }

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('ended', onVideoEnd)
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', onVideoEnd)
      }
    }
  }, [])

  const HeroImgPlayIcon = !play ? PlayVideoIcon : PauseVideoIcon

  return (
    <Box position="relative" w="100%" ref={inViewRef} h="100%">
      <AspectRatio h="100%" minHeight="100%" w="100%" ratio={0.9}>
        <video
          ref={videoRef}
          {...safeRest}
          muted={true}
          preload="none"
          playsInline
          height="var(--max-mobile-image-tile-height, var(--min-mobile-tile-height))"
        >
          <source src={videoSrc} type="video/mp4" />
          {formatMessage({
            id: 'pdp.browserNotSupportHTML5Video',
            defaultMessage: 'Your browser does not support HTML5 video.',
          })}
        </video>
      </AspectRatio>

      <Box
        onClick={onPlayIconClick}
        className="video-play-pause-btn"
        data-qa="plp_alt_video_controls"
      >
        <HeroImgPlayIcon />
      </Box>
    </Box>
  )
}

export default ProductTileVideo
