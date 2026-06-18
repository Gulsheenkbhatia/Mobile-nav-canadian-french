import { render } from 'test-utils/react'
import UGCVideo from './UGCVideo'

const VIDEO_SRC = 'https://example.com/video.mp4'

const getVideoElement = (container: HTMLElement) =>
  container.querySelector('video') as HTMLVideoElement

const setPaused = (video: HTMLVideoElement, paused: boolean) => {
  Object.defineProperty(video, 'paused', { configurable: true, value: paused })
}

const setEnded = (video: HTMLVideoElement, ended: boolean) => {
  Object.defineProperty(video, 'ended', { configurable: true, value: ended })
}

describe('UGCVideo playback position memory', () => {
  let playSpy: jest.Mock
  let pauseSpy: jest.Mock
  let originalPlay: PropertyDescriptor | undefined
  let originalPause: PropertyDescriptor | undefined

  beforeEach(() => {
    originalPlay = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'play')
    originalPause = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'pause')

    playSpy = jest.fn().mockResolvedValue(undefined)
    pauseSpy = jest.fn(function (this: HTMLMediaElement) {
      setPaused(this as HTMLVideoElement, true)
    })

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: playSpy,
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      writable: true,
      value: pauseSpy,
    })
  })

  afterEach(() => {
    if (originalPlay) {
      Object.defineProperty(HTMLMediaElement.prototype, 'play', originalPlay)
    }
    if (originalPause) {
      Object.defineProperty(HTMLMediaElement.prototype, 'pause', originalPause)
    }
  })

  it('preserves currentTime on simple manual pause/resume', () => {
    const { rerender, container } = render(
      <UGCVideo videoSrc={VIDEO_SRC} shouldPlay={true} index={0} />
    )
    const video = getVideoElement(container)
    setPaused(video, false)

    rerender(<UGCVideo videoSrc={VIDEO_SRC} shouldPlay={false} index={0} />)
    video.currentTime = 3.2

    rerender(<UGCVideo videoSrc={VIDEO_SRC} shouldPlay={true} index={0} />)

    expect(video.currentTime).toBe(3.2)
  })

  it('preserves currentTime when user manually switches to another video and back', () => {
    const { rerender, container } = render(
      <UGCVideo videoSrc={VIDEO_SRC} shouldPlay={true} index={0} />
    )
    const video = getVideoElement(container)
    setPaused(video, false)
    video.currentTime = 7.5

    rerender(<UGCVideo videoSrc={VIDEO_SRC} shouldPlay={false} index={0} />)
    expect(video.currentTime).toBe(7.5)

    rerender(<UGCVideo videoSrc={VIDEO_SRC} shouldPlay={true} index={0} />)

    expect(video.currentTime).toBe(7.5)
    expect(playSpy).toHaveBeenCalledTimes(2)
  })

  it('resets to the beginning when the video has played through to the end', () => {
    const { rerender, container } = render(
      <UGCVideo videoSrc={VIDEO_SRC} shouldPlay={false} index={0} />
    )
    const video = getVideoElement(container)
    video.currentTime = 12
    setEnded(video, true)

    rerender(<UGCVideo videoSrc={VIDEO_SRC} shouldPlay={true} index={0} />)

    expect(video.currentTime).toBe(0)
    expect(playSpy).toHaveBeenCalled()
  })
})
