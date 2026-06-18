import { renderHook, act } from '@testing-library/react'
import useUGCVideoRotation from './useUGCVideoRotation'

const VIDEO_MAX_PLAY_MS = 5000

const video = () => ({ content: { media: { mediatype: 'video' } } })
const image = () => ({ content: { media: { mediatype: 'image' } } })

describe('useUGCVideoRotation', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  const defaults = {
    items: [image(), video(), image(), video()],
    isDesktop: true,
    activeSlideIndex: 0,
    slidesToShow: 4,
  }

  describe('desktop autoplay', () => {
    it('autoplays the first visible video on mount', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      expect(result.current.shouldPlayVideo(1)).toBe(true)
      expect(result.current.shouldPlayVideo(3)).toBe(false)
    })

    it('rotates to the next visible video after 5 seconds', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS))

      expect(result.current.shouldPlayVideo(3)).toBe(true)
      expect(result.current.shouldPlayVideo(1)).toBe(false)
    })

    it('wraps back to the first video after rotating past the last', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS))
      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS))

      expect(result.current.shouldPlayVideo(1)).toBe(true)
    })

    it('loops a single visible video instead of rotating', () => {
      const { result } = renderHook(() =>
        useUGCVideoRotation({ ...defaults, items: [video(), image()], slidesToShow: 2 })
      )

      expect(result.current.shouldLoop).toBe(true)
      expect(result.current.shouldPlayVideo(0)).toBe(true)
    })

    it('sets shouldLoop false when multiple videos are visible', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      expect(result.current.shouldLoop).toBe(false)
    })

    it('returns null activeVideoIndex when no videos are in visible range', () => {
      const { result } = renderHook(() =>
        useUGCVideoRotation({ ...defaults, items: [image(), image(), video()], slidesToShow: 2 })
      )

      expect(result.current.activeVideoIndex).toBeNull()
    })
  })

  describe('desktop user interaction', () => {
    it('pauses rotation on onPlayToggle(index, false)', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      act(() => result.current.onPlayToggle(1, false))

      expect(result.current.isPaused).toBe(true)
      expect(result.current.shouldPlayVideo(1)).toBe(false)

      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS * 2))
      expect(result.current.activeVideoIndex).toBe(1)
    })

    it('resumes rotation on onPlayToggle(index, true)', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      act(() => result.current.onPlayToggle(1, false))
      act(() => result.current.onPlayToggle(1, true))

      expect(result.current.isPaused).toBe(false)
      expect(result.current.shouldPlayVideo(1)).toBe(true)
    })

    it('advances to next video on onActiveVideoEnded', () => {
      const { result } = renderHook(() => useUGCVideoRotation(defaults))

      act(() => result.current.onActiveVideoEnded())

      expect(result.current.shouldPlayVideo(3)).toBe(true)
    })
  })

  describe('desktop slide navigation', () => {
    it('resets playback to the first video in the new visible range', () => {
      const items = [image(), video(), image(), image(), video(), image()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items, slidesToShow: 3, activeSlideIndex: 0 },
      })

      expect(result.current.shouldPlayVideo(1)).toBe(true)

      rerender({ ...defaults, items, slidesToShow: 3, activeSlideIndex: 3 })

      expect(result.current.shouldPlayVideo(4)).toBe(true)
      expect(result.current.shouldPlayVideo(1)).toBe(false)
    })

    it('keeps pause state sticky across slide changes (no autoplay after manual pause)', () => {
      const items = [image(), video(), image(), image(), video(), image()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items, slidesToShow: 3, activeSlideIndex: 0 },
      })

      act(() => result.current.onPlayToggle(1, false))
      expect(result.current.isPaused).toBe(true)

      rerender({ ...defaults, items, slidesToShow: 3, activeSlideIndex: 3 })

      expect(result.current.isPaused).toBe(true)
      expect(result.current.shouldPlayVideo(4)).toBe(false)
      expect(result.current.shouldPlayVideo(1)).toBe(false)
    })

    it('does not schedule rotation while paused, even after the visible range changes', () => {
      const items = [image(), video(), image(), image(), video(), image()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items, slidesToShow: 3, activeSlideIndex: 0 },
      })

      act(() => result.current.onPlayToggle(1, false))
      rerender({ ...defaults, items, slidesToShow: 3, activeSlideIndex: 3 })

      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS * 3))

      expect(result.current.isPaused).toBe(true)
      expect(result.current.shouldPlayVideo(4)).toBe(false)
    })

    it('keeps the user-selected video active when items reference changes but visible set is the same', () => {
      const items = [image(), video(), image(), video()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items },
      })

      act(() => result.current.onPlayToggle(3, true))
      expect(result.current.shouldPlayVideo(3)).toBe(true)

      rerender({ ...defaults, items: [...items] })

      expect(result.current.shouldPlayVideo(3)).toBe(true)
      expect(result.current.shouldPlayVideo(1)).toBe(false)
    })

    it('does not reset the rotation timer when items reference changes without visible-set change', () => {
      const items = [image(), video(), image(), video()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items },
      })

      act(() => result.current.onPlayToggle(3, true))
      act(() => jest.advanceTimersByTime(VIDEO_MAX_PLAY_MS - 1000))

      rerender({ ...defaults, items: [...items] })
      act(() => jest.advanceTimersByTime(1000))

      expect(result.current.shouldPlayVideo(1)).toBe(true)
    })

    it('resumes rotation in the current visible range only after explicit play', () => {
      const items = [image(), video(), image(), image(), video(), image()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...defaults, items, slidesToShow: 3, activeSlideIndex: 0 },
      })

      act(() => result.current.onPlayToggle(1, false))
      rerender({ ...defaults, items, slidesToShow: 3, activeSlideIndex: 3 })

      act(() => result.current.onPlayToggle(4, true))

      expect(result.current.isPaused).toBe(false)
      expect(result.current.shouldPlayVideo(4)).toBe(true)
    })
  })

  describe('mobile', () => {
    const mobile = { isDesktop: false, slidesToShow: 1 }

    it('plays only the video at the centered slide index', () => {
      const items = [image(), video(), image()]
      const { result } = renderHook(() =>
        useUGCVideoRotation({ ...mobile, items, activeSlideIndex: 1 })
      )

      expect(result.current.shouldPlayVideo(1)).toBe(true)
    })

    it('does not play when the centered slide is an image', () => {
      const items = [image(), video(), image()]
      const { result } = renderHook(() =>
        useUGCVideoRotation({ ...mobile, items, activeSlideIndex: 0 })
      )

      expect(result.current.activeVideoIndex).toBeNull()
    })

    it('tracks slide changes — plays video when swiped to, stops when swiped away', () => {
      const items = [video(), image(), video()]
      const { result, rerender } = renderHook((props) => useUGCVideoRotation(props), {
        initialProps: { ...mobile, items, activeSlideIndex: 0 },
      })

      expect(result.current.shouldPlayVideo(0)).toBe(true)

      rerender({ ...mobile, items, activeSlideIndex: 1 })
      expect(result.current.activeVideoIndex).toBeNull()

      rerender({ ...mobile, items, activeSlideIndex: 2 })
      expect(result.current.shouldPlayVideo(2)).toBe(true)
    })

    it('ignores onActiveVideoEnded — no rotation on mobile', () => {
      const { result } = renderHook(() =>
        useUGCVideoRotation({ ...mobile, items: [video(), video()], activeSlideIndex: 0 })
      )

      act(() => result.current.onActiveVideoEnded())

      expect(result.current.shouldPlayVideo(0)).toBe(true)
    })
  })
})
