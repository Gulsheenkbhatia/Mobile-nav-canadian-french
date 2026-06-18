import { useState, useEffect, useCallback, useRef } from 'react'

const VIDEO_MAX_PLAY_MS = 5000

type UGCItem = {
  content?: {
    media?: {
      mediatype?: string
    }
  }
  [key: string]: any
}

type UseUGCVideoRotationParams = {
  items?: UGCItem[]
  isDesktop: boolean
  activeSlideIndex: number
  slidesToShow: number
}

function getVisibleVideoIndexes(
  items: UGCItem[],
  activeSlideIndex: number,
  slidesToShow: number
): number[] {
  const firstVisible = activeSlideIndex
  const lastVisible = Math.min(firstVisible + slidesToShow - 1, items.length - 1)

  const videoIndexes: number[] = []
  for (let i = firstVisible; i <= lastVisible; i++) {
    if (items[i]?.content?.media?.mediatype === 'video') {
      videoIndexes.push(i)
    }
  }
  return videoIndexes
}

export default function useUGCVideoRotation({
  items = [],
  isDesktop,
  activeSlideIndex,
  slidesToShow,
}: UseUGCVideoRotationParams) {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const rotationIndexRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const visibleVideosRef = useRef<number[]>([])
  const [shouldLoop, setShouldLoop] = useState(false)
  // True when the last video switch was triggered by the rotation timer (not the user).
  // Used to reset currentTime on timer-driven advances while preserving position on user switches.
  const timerRotatedRef = useRef(false)
  // Cached signature of the previous visible-video index set. Lets the
  // rotation effect skip reset work when `items` gets a new reference but the
  // visible video indexes are unchanged (pagination, parent re-render with a
  // freshly built array, etc.) — without that guard, clicking a video would
  // briefly play it before the effect resets active back to visibleVideos[0].
  const prevVisibleVideosKeyRef = useRef<string>('')

  const clearRotationTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const advanceToNext = useCallback(() => {
    clearRotationTimeout()
    const videos = visibleVideosRef.current
    if (videos.length === 0) return
    rotationIndexRef.current = (rotationIndexRef.current + 1) % videos.length
    timerRotatedRef.current = true
    setActiveVideoIndex(videos[rotationIndexRef.current])
  }, [clearRotationTimeout])

  const scheduleNext = useCallback(() => {
    clearRotationTimeout()
    timeoutRef.current = setTimeout(advanceToNext, VIDEO_MAX_PLAY_MS)
  }, [clearRotationTimeout, advanceToNext])

  const onActiveVideoEnded = useCallback(() => {
    if (!isDesktop) return
    advanceToNext()
  }, [isDesktop, advanceToNext])

  const onPlayToggle = useCallback(
    (index: number, shouldPlay: boolean) => {
      timerRotatedRef.current = false
      setActiveVideoIndex(index)
      setIsPaused(!shouldPlay)

      if (shouldPlay) {
        const posInVisible = visibleVideosRef.current.indexOf(index)
        if (posInVisible !== -1) {
          rotationIndexRef.current = posInVisible
        }
        if (isDesktop) {
          scheduleNext()
        }
      } else {
        clearRotationTimeout()
      }
    },
    [isDesktop, clearRotationTimeout, scheduleNext]
  )
  const stopRotation = useCallback(() => {
    setIsPaused(true)
    clearRotationTimeout()
  }, [])

  // Desktop: rotate through visible videos
  useEffect(() => {
    if (!isDesktop || !items?.length) {
      clearRotationTimeout()
      prevVisibleVideosKeyRef.current = ''
      return
    }

    const visibleVideos = getVisibleVideoIndexes(items, activeSlideIndex, slidesToShow)
    visibleVideosRef.current = visibleVideos
    setShouldLoop(visibleVideos.length === 1)

    if (visibleVideos.length === 0) {
      setActiveVideoIndex(null)
      clearRotationTimeout()
      prevVisibleVideosKeyRef.current = ''
      return
    }

    const visibleKey = visibleVideos.join(',')
    const visibleSetChanged = visibleKey !== prevVisibleVideosKeyRef.current
    prevVisibleVideosKeyRef.current = visibleKey

    // Skip the reset when the visible video set hasn't actually changed
    // (e.g. parent re-rendered with a fresh `items` array of the same shape).
    // Without this guard, clicking a non-active video would briefly play it
    // before the effect resets active back to visibleVideos[0].
    if (!visibleSetChanged) return

    // Sticky pause: once the user pauses any video, keep rotation off even
    // when the slide range changes. Visible-video bookkeeping above still
    // runs so resume picks the correct video for the current range.
    if (isPaused) {
      clearRotationTimeout()
      return
    }

    rotationIndexRef.current = 0
    setActiveVideoIndex(visibleVideos[0])
    scheduleNext()
  }, [isDesktop, items, activeSlideIndex, slidesToShow, scheduleNext, clearRotationTimeout])

  useEffect(() => {
    const restartTimerNeeded = isDesktop && activeVideoIndex !== null && !isPaused
    if (!restartTimerNeeded) return
    clearRotationTimeout()
    scheduleNext()
    return clearRotationTimeout
  }, [isDesktop, activeVideoIndex, isPaused, scheduleNext, clearRotationTimeout])

  // Mobile: play centered slide
  useEffect(() => {
    if (isDesktop || !items?.length) return
    const item = items[activeSlideIndex]
    setActiveVideoIndex(item?.content?.media?.mediatype === 'video' ? activeSlideIndex : null)
  }, [isDesktop, items, activeSlideIndex])

  const shouldPlayVideo = useCallback(
    (index: number) => activeVideoIndex === index && !isPaused,
    [activeVideoIndex, isPaused]
  )

  const shouldResetVideo = useCallback(
    (index: number) => timerRotatedRef.current && activeVideoIndex === index,
    [activeVideoIndex]
  )

  return {
    activeVideoIndex,
    isPaused,
    shouldPlayVideo,
    shouldResetVideo,
    onPlayToggle,
    onActiveVideoEnded,
    shouldLoop,
    stopRotation,
  }
}
