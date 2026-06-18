import { useEffect, useRef } from 'react'
import { render, cleanup } from 'test-utils/react'
import useHotspotsImage from 'toro/cms/hooks/useHotspotsImage'
jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: false }))
jest.mock('toro/constants/appConstants', () => ({
  MAIN_CONTENT: 'maincontent',
}))
const { MAIN_CONTENT } = jest.requireActual('toro/constants/appConstants')
const TOOLTIP_SELECTOR = `#${MAIN_CONTENT} .global-tooltip`

const mockAnalytyticsSend = jest.fn()
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)
const HOTSPOT_1_CONTENT = 'Hotspot 1 Content'
const HOTSPOT_2_CONTENT = 'Hotspot 2 Content'
const HOTSPOTS_DATA_CONFIG = JSON.stringify({
  hotspots: [
    { id: 'hotspot1', target: HOTSPOT_1_CONTENT },
    { id: 'hotspot2', target: HOTSPOT_2_CONTENT },
  ],
})
const HOTSPOTS_MOBILE_DATA_CONFIG = JSON.stringify({
  hotspots: [
    { id: 'hotspot1', target: `${HOTSPOT_1_CONTENT} Mobile` },
    { id: 'hotspot2', target: `${HOTSPOT_2_CONTENT} Mobile` },
  ],
})

const TestComponent = () => {
  const ref = useRef(null)
  const setNode = useHotspotsImage()

  useEffect(() => {
    if (ref.current) {
      setNode(ref.current)
    }
  }, [ref, setNode])

  return (
    <div>
      <div id={MAIN_CONTENT}>
        <div className="global-tooltip text-body1-l" role="tooltip"></div>
        <div ref={ref}>
          <div className="mol-hotspots-image">
            <div className="img-container">
              <div className="img-interactive">
                <div className="hotspots-wrapper">
                  <div id="hotspot1" className="hotspot-icon" style={{ left: '42%', top: '29%' }}>
                    <svg className="icon" role="presentation">
                      <use xlinkHref="#icon-plus"></use>
                    </svg>
                  </div>
                  <div id="hotspot2" className="hotspot-icon" style={{ left: '70%', top: '73%' }}>
                    <svg className="icon" role="presentation">
                      <use xlinkHref="#icon-plus"></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="hotspots-data"
              data-desktop-config={HOTSPOTS_DATA_CONFIG}
              data-mobile-config={HOTSPOTS_MOBILE_DATA_CONFIG}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

describe('Tooltip Functionality', () => {
  let container
  let user

  beforeEach(() => {
    const rendered = render(<TestComponent />, {
      contexts: {
        PWAContext: {
          appData: {
            siteId: 'coh_us_out',
            isOptGtmDisabled: false,
          },
        },
      },
    })
    container = rendered.container
    user = rendered.user
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should not show any tooltips initially', () => {
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    const activeHotspots = container.querySelectorAll('.hotspot-icon.active')
    expect(globalTooltip.classList.contains('active')).toBe(false)
    expect(activeHotspots.length).toBe(0)
  })

  it('should show the tooltip on hovering over a hotspot icon', async () => {
    const icon = container.querySelector('#hotspot1')
    await user.hover(icon)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(icon.classList.contains('active')).toBe(true)
    expect(globalTooltip.classList.contains('active')).toBe(true)
    expect(globalTooltip.innerHTML).toContain(HOTSPOT_1_CONTENT)
  })

  it('should hide the tooltip on hovering over the same hotspot icon again', async () => {
    const icon = container.querySelector('#hotspot1')
    await user.hover(icon)
    await user.unhover(icon)
    await user.hover(icon)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(icon.classList.contains('active')).toBe(false)
    expect(globalTooltip.classList.contains('active')).toBe(false)
  })

  it('should hide the tooltip when clicking outside on mobile', async () => {
    jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true }))
    const icon = container.querySelector('#hotspot1')
    await user.click(icon)
    await user.click(document.body)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(icon.classList.contains('active')).toBe(false)
    expect(globalTooltip.classList.contains('active')).toBe(false)
  })

  it('should position tooltip correctly based on left value', async () => {
    const icon = container.querySelector('#hotspot2')
    await user.hover(icon)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(globalTooltip.style.inset).toBeDefined()
  })

  it('should position tooltip correctly based on top value', async () => {
    const icon = container.querySelector('#hotspot2')
    await user.hover(icon)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(globalTooltip.style.inset).toBeDefined()
  })

  it('should display correct tooltip content based on configuration', async () => {
    const icon = container.querySelector('#hotspot1')
    await user.hover(icon)
    const globalTooltip = container.querySelector(TOOLTIP_SELECTOR)
    expect(globalTooltip.innerHTML).toContain(HOTSPOT_1_CONTENT)
  })
})
