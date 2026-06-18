import throttle from 'lodash/throttle'

type ExtendedWindow = Window & typeof globalThis & { scrollListener?: ScrollListener }

type ScrollTarget = 'window' | 'document'

type ScrollListenerType = {
  add: (callback: () => void, target?: ScrollTarget) => (callback: () => void) => void
  remove: (callback: () => void, target?: ScrollTarget) => void
  destroy: () => void
}

const THROTTLE_DELTA = 150

/**
 * A class to handle application-wide scroll
 * event listener that can be subscribed to on demand.
 * Supports both window and document scroll events.
 */
export class ScrollListener implements ScrollListenerType {
  /**
   * Set of callback functions to be executed on window scroll.
   * @private
   */
  private readonly windowCallbacks = new Set<() => void>()

  /**
   * Set of callback functions to be executed on document scroll.
   * @private
   */
  private readonly documentCallbacks = new Set<() => void>()

  /**
   * The throttled window scroll event listener.
   * @private
   */
  private readonly windowListener: (this: Window, ev: Event) => any

  /**
   * The throttled document scroll event listener.
   * @private
   */
  private readonly documentListener: (this: Document, ev: Event) => any

  constructor() {
    if (typeof window === 'undefined') {
      return
    }

    this.windowListener = throttle(() => {
      this.windowCallbacks.forEach((c) => c?.())
    }, THROTTLE_DELTA)

    this.documentListener = throttle(() => {
      this.documentCallbacks.forEach((c) => c?.())
    }, THROTTLE_DELTA)

    window.addEventListener('scroll', this.windowListener, { passive: true })
    document.addEventListener('scroll', this.documentListener, { passive: true })
    ;(<ExtendedWindow>window).scrollListener = this
  }

  /**
   * Adds a callback to be executed on scroll.
   * @param {Function} callback - The callback function to be added.
   * @param {ScrollTarget} target - The scroll target ('window' or 'document'). Defaults to 'window' for backward compatibility.
   * @returns {Function} A function that can be called to remove the added callback.
   */
  add(callback: () => void, target: ScrollTarget = 'window') {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const bucket = target === 'document' ? this.documentCallbacks : this.windowCallbacks
    bucket.add(callback)
    return () => this.remove(callback, target)
  }

  /**
   * Removes a previously added callback.
   * @param {Function} callback - The callback function to be removed.
   * @param {ScrollTarget} target - The scroll target ('window' or 'document'). Defaults to 'window' for backward compatibility.
   */
  remove(callback: () => void, target: ScrollTarget = 'window') {
    const bucket = target === 'document' ? this.documentCallbacks : this.windowCallbacks
    bucket.delete(callback)
  }

  /**
   * Destroys the instance removing all callbacks and the event listeners.
   */
  destroy() {
    if (typeof window === 'undefined') {
      return
    }

    window.removeEventListener('scroll', this.windowListener)
    document.removeEventListener('scroll', this.documentListener)
    this.windowCallbacks.clear()
    this.documentCallbacks.clear()
    delete (window as ExtendedWindow).scrollListener
    Object.assign(this, null)
  }
}

export default new ScrollListener()
