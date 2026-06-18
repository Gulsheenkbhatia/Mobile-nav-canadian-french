import { act, renderHook } from 'test-utils/react'
import { initMarqueeTicker, useMarqueeTicker } from 'toro/cms/hooks/useMarqueeTicker'

/**
 * JSDOM does not perform layout, so `scrollWidth` is always 0.
 * Simulate it by returning (number of children × ITEM_WIDTH) on the .ticker element.
 * This makes the clone count calculation deterministic.
 *
 * threshold  = 2 × window.innerWidth = 2 × 1000 = 2000 px
 * ITEM_WIDTH = 400 px
 *
 * children needed to meet threshold:
 *   ceil(2000 / 400) = 5  →  5 is odd  →  bumped to 6
 *
 * Expected after init: 1 original + 5 clones = 6 total items.
 */
const ITEM_WIDTH = 400
const VIEWPORT_WIDTH = 1000
const EXPECTED_TOTAL_ITEMS = 6 // 5 meets threshold (odd) → 6 (even)
const EXPECTED_CLONE_COUNT = EXPECTED_TOTAL_ITEMS - 1 // 5

/**
 * Builds a `.ticker-wrap > .ticker > h2` structure and mocks `scrollWidth`
 * on the group element so the fill-loop behaves deterministically in JSDOM.
 */
function createTickerWrap(text = 'FREE SHIPPING •') {
  const wrap = document.createElement('div')
  wrap.className = 'ticker-wrap'

  const group = document.createElement('div')
  group.className = 'ticker'

  // Mock scrollWidth proportional to child count because JSDOM does not do layout.
  Object.defineProperty(group, 'scrollWidth', {
    configurable: true,
    get: () => group.children.length * ITEM_WIDTH,
  })

  const originalItem = document.createElement('h2')
  originalItem.className = 'at-headline-text'
  originalItem.textContent = text
  group.appendChild(originalItem)
  wrap.appendChild(group)

  return { wrap, group, originalItem }
}

describe('useMarqueeTicker', () => {
  beforeEach(() => {
    // useFakeTimers MUST come first — calling it after spyOn replaces our mock.
    jest.useFakeTimers()

    // Override the fake-timer rAF with a synchronous implementation so
    // setupMarquee executes immediately inside each test.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(jest.fn())

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: VIEWPORT_WIDTH,
    })
  })

  afterEach(() => {
    // restoreAllMocks first (reverts spies to the fake-timer values),
    // then useRealTimers to fully restore original globals.
    jest.restoreAllMocks()
    jest.useRealTimers()
    document.body.innerHTML = ''
  })

  // ---------------------------------------------------------------------------
  // initMarqueeTicker
  // ---------------------------------------------------------------------------
  describe('initMarqueeTicker', () => {
    it('returns void when the container has no .ticker-wrap elements', () => {
      const container = document.createElement('div')
      expect(initMarqueeTicker(container)).toBeUndefined()
    })

    it('initialises every .ticker-wrap found in the container', () => {
      const container = document.createElement('div')
      const { wrap: wrapA, group: groupA } = createTickerWrap('Text A')
      const { wrap: wrapB, group: groupB } = createTickerWrap('Text B')
      container.appendChild(wrapA)
      container.appendChild(wrapB)

      initMarqueeTicker(container)

      expect(groupA.querySelectorAll('.ticker-item-clone').length).toBeGreaterThan(0)
      expect(groupB.querySelectorAll('.ticker-item-clone').length).toBeGreaterThan(0)
    })
  })

  // ---------------------------------------------------------------------------
  // setupMarquee — DOM mutations
  // ---------------------------------------------------------------------------
  describe('setupMarquee (via initMarqueeTicker)', () => {
    it('fills .ticker with clones until scrollWidth exceeds 2× window.innerWidth', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      expect(group.children.length).toBe(EXPECTED_TOTAL_ITEMS)
    })

    it('inserts cloned items with a single group append', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)
      const appendSpy = jest.spyOn(group, 'appendChild')

      initMarqueeTicker(container)

      expect(appendSpy).toHaveBeenCalledTimes(1)
      expect(appendSpy).toHaveBeenCalledWith(expect.any(DocumentFragment))
    })

    it('always produces an even total item count', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      expect(group.children.length % 2).toBe(0)
    })

    it('adds the ticker-item-clone class to every cloned item', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      const clones = group.querySelectorAll('.ticker-item-clone')
      expect(clones.length).toBe(EXPECTED_CLONE_COUNT)
    })

    it('sets aria-hidden="true" on every cloned item', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      group.querySelectorAll('.ticker-item-clone').forEach((clone) => {
        expect(clone.getAttribute('aria-hidden')).toBe('true')
      })
    })

    it('does not set aria-hidden on the original item', () => {
      const container = document.createElement('div')
      const { wrap, originalItem } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      expect(originalItem.getAttribute('aria-hidden')).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // Resize handling (throttled — leading + trailing, 250 ms window)
  // ---------------------------------------------------------------------------
  describe('resize handling', () => {
    it('registers a resize listener on window during init', () => {
      const addSpy = jest.spyOn(window, 'addEventListener')
      const container = document.createElement('div')
      const { wrap } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })

    it('fires setupMarquee immediately on the leading edge of the first resize event', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)

      group.querySelectorAll('.ticker-item-clone').forEach((el) => el.remove())
      expect(group.children.length).toBe(1)

      // Leading edge: clones should be re-added immediately without advancing timers.
      window.dispatchEvent(new Event('resize'))

      expect(group.children.length).toBe(EXPECTED_TOTAL_ITEMS)
    })

    it('throttles rapid resize events — clone count stays correct, not multiplied', () => {
      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      initMarqueeTicker(container)
      const countAfterInit = group.children.length

      // Fire many events in quick succession; leading fires immediately,
      // subsequent events are throttled. Advance past the window for trailing call.
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('resize'))
      }
      jest.advanceTimersByTime(250)

      // setupMarquee clears old clones before re-adding, so count must never multiply.
      expect(group.children.length).toBe(countAfterInit)
    })
  })

  // ---------------------------------------------------------------------------
  // useMarqueeTicker hook
  // ---------------------------------------------------------------------------
  describe('useMarqueeTicker', () => {
    it('returns a setter function', () => {
      const { result } = renderHook(() => useMarqueeTicker())
      expect(typeof result.current).toBe('function')
    })

    it('initialises the ticker when a node is passed to the setter', () => {
      const { result } = renderHook(() => useMarqueeTicker())

      const container = document.createElement('div')
      const { wrap, group } = createTickerWrap()
      container.appendChild(wrap)

      act(() => {
        result.current(container)
      })

      expect(group.querySelectorAll('.ticker-item-clone').length).toBe(EXPECTED_CLONE_COUNT)
    })
  })
})
