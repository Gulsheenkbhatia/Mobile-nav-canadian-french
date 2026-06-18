import { useRef, useEffect, useState, useCallback, Ref } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import PlayIcon from 'toro/components/UGC/icons/PlayIcon'
import PauseIcon from 'toro/components/UGC/icons/PauseIcon'
import MutedIcon from 'toro/components/UGC/icons/MutedIcon'
import UnmutedIcon from 'toro/components/UGC/icons/UnmutedIcon'
import { SystemStyleObject } from '@chakra-ui/react'

type UGCVideoProps = {
  onClick?: () => void
  videoSrc: string
  shouldPlay: boolean
  onEnded?: () => void
  onPlayToggle?: (index: number, shouldPlay: boolean) => void
  index?: number
  sx?: SystemStyleObject
  loop?: boolean
  showControls?: boolean
  resetOnPlay?: boolean
}

const controlsContainerSx = {
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  gap: '8px',
  cursor: 'pointer',
  zIndex: 1,
  '& svg': { width: '40px', height: '40px' },
}

const UGCVideo = ({
  onClick,
  videoSrc,
  shouldPlay,
  onEnded,
  onPlayToggle,
  index = 0,
  sx,
  loop = false,
  showControls = false,
  resetOnPlay = false,
}: UGCVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldPlay) {
      // Reset on timer-driven rotation or when video has ended (ended video
      // stays at the last frame without explicit reset). User-triggered switches
      // preserve currentTime so playback resumes from where it was paused.
      if (resetOnPlay || video.ended) {
        video.currentTime = 0
      }
      video.play().catch(() => {})
    } else if (!video.paused) {
      video.pause()
    }
  }, [shouldPlay])

  const handleControlClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const handlePlayToggle = useCallback(
    (e: React.MouseEvent) => {
      handleControlClick(e)
      onPlayToggle?.(index, !shouldPlay)
    },
    [handleControlClick, onPlayToggle, index, shouldPlay]
  )

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      handleControlClick(e)
      const video = videoRef.current
      if (!video) return
      video.muted = !video.muted
      setIsMuted(video.muted)
    },
    [handleControlClick]
  )

  const PlayPauseIcon = shouldPlay ? PauseIcon : PlayIcon
  const MuteIcon = isMuted ? MutedIcon : UnmutedIcon

  return (
    <Box position="relative" w="100%" h="fit-content" onClick={onClick}>
      <Box
        as="video"
        ref={videoRef as unknown as Ref<HTMLDivElement>}
        w="100%"
        h="100%"
        sx={sx}
        muted
        playsInline
        preload="metadata"
        onEnded={onEnded}
        loop={loop}
      >
        <source src={videoSrc} type="video/mp4" />
      </Box>
      {showControls && (
        <Flex sx={controlsContainerSx}>
          <Box onClick={toggleMute} data-qa="ugc_video_mute_toggle">
            <MuteIcon bgColor="#00000066" strokeColor="#FFF" fillColor="#FFF" />
          </Box>
          <Box onClick={handlePlayToggle} data-qa="ugc_video_play_toggle">
            <PlayPauseIcon bgColor="#00000066" strokeColor="#FFF" fillColor="#FFF" />
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export default UGCVideo
