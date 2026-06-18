import React, { FC, useCallback } from 'react'
import { render, screen } from 'test-utils/react'
import { useTabbedSlider } from './useTabbedSlider'
import { splideControllers } from 'toro/helpers/home'
import { Splide } from '@splidejs/splide'
import { cmsObserverManager } from '../services/observerManager'

jest.mock('../services/observerManager')

const mockedCmsObserverManager = cmsObserverManager as jest.Mocked<typeof cmsObserverManager>

interface MockSplide extends Partial<Splide> {
  _triggerMove: (newIndex: number, oldIndex: number) => void
  index: number
  go: jest.Mock
  on: jest.Mock
}

const mockSplideOn = jest.fn()
const mockSplideGo = jest.fn()
const mockSplideInstance: MockSplide = {
  on: mockSplideOn,
  go: mockSplideGo,
  index: 0,
  _triggerMove: (newIndex: number, oldIndex: number) => {
    const moveCallback = mockSplideOn.mock.calls.find((call) => call[0] === 'moved')?.[1]
    if (moveCallback) {
      moveCallback(newIndex, oldIndex)
    }
  },
}

jest.mock('toro/helpers/home', () => ({
  splideControllers: {} as Record<string, { splide: MockSplide }>,
}))

jest.mock('toro/helpers/isMobileDevice', () => jest.fn(() => false))

interface TestComponentProps {
  autoAdvance?: boolean
}

const TestComponent: FC<TestComponentProps> = ({ autoAdvance = false }) => {
  const initializeTabbedSlider = useTabbedSlider()

  const refCallback = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        initializeTabbedSlider(node)
      }
    },
    [initializeTabbedSlider]
  )

  return (
    <div ref={refCallback}>
      <article
        id="test-slider"
        className="mol-tabbed-slider"
        data-time-interval={autoAdvance ? '5000' : '0'}
      >
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className="nav-link active"
              data-target="#pane1"
              id="tab1"
              role="tab"
              aria-selected="true"
            >
              Tab 1
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              data-target="#pane2"
              id="tab2"
              role="tab"
              aria-selected="false"
            >
              Tab 2
            </button>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="pane1" role="tabpanel">
            <div className="component-block-slide-0">
              <video autoPlay muted />
            </div>
          </div>
          <div className="tab-pane fade" id="pane2" role="tabpanel">
            <div className="component-block-slide-1">
              <video autoPlay muted />
            </div>
          </div>
        </div>
        <div className="tab-content-wrapper-desktop"></div>
        <div className="tab-content-wrapper-mobile"></div>
      </article>
    </div>
  )
}

describe('useTabbedSlider', () => {
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn()
    HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = jest.fn()
  })

  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
    const sc = splideControllers
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(sc).forEach((key) => delete (sc as any)[key])
  })

  const initializeSplide = () => {
    splideControllers['test-slider'] = { splide: mockSplideInstance }
    document.dispatchEvent(new CustomEvent('splide:registered', { detail: { id: 'test-slider' } }))
  }

  it('should initialize with the default active tab', () => {
    render(<TestComponent />)
    const tab1 = screen.getByText('Tab 1')
    const tab2 = screen.getByText('Tab 2')
    const pane1 = document.querySelector<HTMLDivElement>('#pane1')

    expect(tab1.classList.contains('active')).toBe(true)
    expect(tab1.getAttribute('aria-selected')).toBe('true')
    expect(pane1?.classList.contains('active')).toBe(true)
    expect(pane1?.classList.contains('show')).toBe(true)

    expect(tab2.classList.contains('active')).toBe(false)
  })

  it('should switch tabs on click', async () => {
    const { user } = render(<TestComponent />)
    initializeSplide()

    const tab1 = screen.getByText('Tab 1')
    const tab2 = screen.getByText('Tab 2')
    const pane1 = document.querySelector<HTMLDivElement>('#pane1')
    const pane2 = document.querySelector<HTMLDivElement>('#pane2')

    await user.click(tab2)
    mockSplideInstance._triggerMove(1, 0)

    expect(tab2.classList.contains('active')).toBe(true)
    expect(tab2.getAttribute('aria-selected')).toBe('true')
    expect(pane2?.classList.contains('active')).toBe(true)
    expect(pane2?.classList.contains('show')).toBe(true)

    expect(tab1.classList.contains('active')).toBe(false)
    expect(pane1?.classList.contains('active')).toBe(false)

    expect(mockSplideGo).toHaveBeenCalledWith(1)
  })

  it('should switch tabs when splide moves', () => {
    render(<TestComponent />)
    initializeSplide()

    const tab2 = screen.getByText('Tab 2')
    const pane2 = document.querySelector<HTMLDivElement>('#pane2')

    mockSplideInstance._triggerMove(1, 0)

    expect(tab2.classList.contains('active')).toBe(true)
    expect(pane2?.classList.contains('active')).toBe(true)
  })

  it('should auto-advance to the next tab if configured', () => {
    jest.useFakeTimers()

    render(<TestComponent autoAdvance={true} />)
    initializeSplide()

    const tab2 = screen.getByText('Tab 2')
    const pane2 = document.querySelector<HTMLDivElement>('#pane2')
    const intersectionCallback = mockedCmsObserverManager.observe.mock.calls[0][1]
    intersectionCallback(true)

    jest.advanceTimersByTime(5000)
    mockSplideInstance._triggerMove(1, 0)

    expect(tab2.classList.contains('active')).toBe(true)
    expect(pane2?.classList.contains('active')).toBe(true)
    expect(mockSplideGo).toHaveBeenCalledWith(1)

    jest.useRealTimers()
  })

  it('should stop auto-advancing on user interaction', async () => {
    jest.useFakeTimers()

    const { user } = render(<TestComponent autoAdvance={true} />, {
      userSetupOptions: { advanceTimers: jest.advanceTimersByTime },
    })
    initializeSplide()
    const intersectionCallback = mockedCmsObserverManager.observe.mock.calls[0][1]
    intersectionCallback(true)

    await user.click(screen.getByText('Tab 2'))
    mockSplideGo.mockClear()

    jest.advanceTimersByTime(5000)

    expect(mockSplideGo).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('should clean up event listeners on unmount', () => {
    const { unmount } = render(<TestComponent autoAdvance={true} />)
    const nav = document.querySelector<HTMLUListElement>('.nav-tabs')
    const rootEl = document.querySelector<HTMLElement>('.mol-tabbed-slider')

    if (!nav || !rootEl) {
      throw new Error('Test setup failed: slider elements not found')
    }

    const removeNavSpy = jest.spyOn(nav, 'removeEventListener')
    const removeRootSpy = jest.spyOn(rootEl, 'removeEventListener')
    const removeDocSpy = jest.spyOn(document, 'removeEventListener')

    unmount()

    expect(removeNavSpy).toHaveBeenCalledWith('click', expect.any(Function))
    expect(removeRootSpy).toHaveBeenCalledWith('click', expect.any(Function))
    expect(removeRootSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(removeDocSpy).toHaveBeenCalledWith('splide:registered', expect.any(Function))
    expect(mockedCmsObserverManager.unobserve).toHaveBeenCalled()
    expect(mockedCmsObserverManager.removeVisibilityListener).toHaveBeenCalled()
  })

  it('should play video on the active slide and pause on inactive', async () => {
    const { user } = render(<TestComponent />)
    initializeSplide()
    const videos = document.querySelectorAll<HTMLVideoElement>('video')
    const video1 = videos[0]
    const video2 = videos[1]

    const video1PausedSpy = jest.spyOn(video1, 'paused', 'get').mockReturnValue(true)
    const video2PausedSpy = jest.spyOn(video2, 'paused', 'get').mockReturnValue(true)

    const video1Play = jest.spyOn(video1, 'play').mockImplementation(() => {
      video1PausedSpy.mockReturnValue(false)
      return Promise.resolve()
    })
    const video1Pause = jest.spyOn(video1, 'pause').mockImplementation(() => {
      video1PausedSpy.mockReturnValue(true)
    })

    const video2Play = jest.spyOn(video2, 'play').mockImplementation(() => {
      video2PausedSpy.mockReturnValue(false)
      return Promise.resolve()
    })
    const video2Pause = jest.spyOn(video2, 'pause').mockImplementation(() => {
      video2PausedSpy.mockReturnValue(true)
    })

    expect(video1Play).not.toHaveBeenCalled()
    expect(video2Play).not.toHaveBeenCalled()

    await user.click(screen.getByText('Tab 2'))
    mockSplideInstance._triggerMove(1, 0)

    expect(video2Play).toHaveBeenCalledTimes(1)
    expect(video1Pause).not.toHaveBeenCalled()

    await user.click(screen.getByText('Tab 1'))
    mockSplideInstance._triggerMove(0, 1)

    expect(video1Play).toHaveBeenCalled()
    expect(video2Pause).toHaveBeenCalled()
  })
})
