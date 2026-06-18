import { initAllVideoModals, setVideoModalCallback } from 'toro/helpers/initVideoModals'
import { utilityStyles } from 'toro/theme'

const DESKTOP_WIDTH = parseInt(utilityStyles.breakpoints.md, 10)
const MOBILE_WIDTH = DESKTOP_WIDTH - 1

function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  })
}

type VideoModalOpen = (videoSrc: string) => void

describe('initVideoModals', () => {
  let onOpen: jest.MockedFunction<VideoModalOpen>

  beforeEach(() => {
    jest.clearAllMocks()
    onOpen = jest.mocked(jest.fn<void, [string]>())
    setViewportWidth(DESKTOP_WIDTH)
    setVideoModalCallback(onOpen)
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(HTMLVideoElement.prototype, 'play').mockResolvedValue(undefined as unknown as void)
    jest.spyOn(HTMLVideoElement.prototype, 'pause').mockImplementation(() => {})
  })

  afterEach(() => {
    setVideoModalCallback(null)
    document.body.innerHTML = ''
    document.querySelectorAll('video').forEach((v) => v.remove())
    jest.restoreAllMocks()
  })

  describe('getVideoSrc (via desktop click)', () => {
    it('uses data-desktop-video-modal on desktop if attribute is set', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-desktop-video-modal', 'https://example.com/desktop.mp4')
      trigger.setAttribute('data-mobile-video-modal', 'https://example.com/mobile.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).toHaveBeenCalledWith('https://example.com/desktop.mp4')
    })

    it('uses data-video-modal as fallback on desktop and if no desktop-specific URL is set', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', 'https://example.com/fallback.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).toHaveBeenCalledWith('https://example.com/fallback.mp4')
    })

    it('uses data-mobile-video-modal on desktop but only if mobile attribute is set', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-mobile-video-modal', 'https://example.com/mobile-only.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).toHaveBeenCalledWith('https://example.com/mobile-only.mp4')
    })
  })

  describe('getVideoSrc (via mobile width)', () => {
    beforeEach(() => {
      setViewportWidth(MOBILE_WIDTH)
    })

    it('uses data-mobile-video-modal on mobile', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-desktop-video-modal', 'https://example.com/desktop.mp4')
      trigger.setAttribute('data-mobile-video-modal', 'https://example.com/mobile.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).not.toHaveBeenCalled()
      expect(document.querySelector('video')?.src).toContain('example.com/mobile.mp4')
    })

    it('uses data-desktop-video-modal as fallback', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-desktop-video-modal', 'https://example.com/desktop-only.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).not.toHaveBeenCalled()
      expect(document.querySelector('video')?.src).toContain('example.com/desktop-only.mp4')
    })

    it('uses data-video-modal as fallback on mobile', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', 'https://example.com/fallback.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(document.querySelector('video')?.src).toContain('example.com/fallback.mp4')
    })
  })

  describe('desktop callback registration', () => {
    it('warns when trigger has data-video-modal but empty URL', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', '')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalled()
    })

    it('warns when desktop and callback was not set', () => {
      setVideoModalCallback(null)

      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', 'https://example.com/a.mp4')
      container.appendChild(trigger)

      initAllVideoModals(container)
      trigger.click()

      expect(onOpen).not.toHaveBeenCalled()
      expect(console.warn).toHaveBeenCalledWith('Video modal callback not set')
    })
  })

  describe('initAllVideoModals cleanup', () => {
    it('removes click handler and initialized flag on teardown', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', 'https://example.com/a.mp4')
      container.appendChild(trigger)

      const teardown = initAllVideoModals(container)
      expect(trigger).toHaveAttribute('data-video-modal-initialized')

      trigger.click()
      expect(onOpen).toHaveBeenCalledTimes(1)

      teardown()
      expect(trigger).not.toHaveAttribute('data-video-modal-initialized')

      onOpen.mockClear()
      trigger.click()
      expect(onOpen).not.toHaveBeenCalled()
    })

    it('does not double-bind when init runs twice on the same tree', () => {
      const container = document.createElement('div')
      const trigger = document.createElement('button')
      trigger.setAttribute('data-video-modal', 'https://example.com/a.mp4')
      container.appendChild(trigger)

      const teardown = initAllVideoModals(container)
      initAllVideoModals(container)

      trigger.click()
      expect(onOpen).toHaveBeenCalledTimes(1)

      teardown()
    })
  })
})
