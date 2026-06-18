type IntersectionCallback = (isIntersecting: boolean) => void
type VisibilityCallback = (isHidden: boolean) => void

class CmsObserverManager {
  private readonly intersectionObserver: IntersectionObserver | undefined
  private readonly intersectionCallbacks = new Map<Element, IntersectionCallback>()
  private readonly visibilityCallbacks = new Set<VisibilityCallback>()
  private isVisibilityListenerActive = false

  constructor() {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(this.handleIntersection)
    }
  }

  private readonly handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const callback = this.intersectionCallbacks.get(entry.target)
      callback?.(entry.isIntersecting)
    })
  }

  private readonly handleVisibilityChange = () => {
    if (typeof document !== 'undefined') {
      this.visibilityCallbacks.forEach((callback) => callback(document.hidden))
    }
  }

  private initializeGlobalListener() {
    if (this.isVisibilityListenerActive || typeof document === 'undefined') return
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    this.isVisibilityListenerActive = true
  }

  public observe(element: Element, callback: IntersectionCallback) {
    if (!this.intersectionObserver) return
    this.intersectionObserver.observe(element)
    this.intersectionCallbacks.set(element, callback)
  }

  public unobserve(element: Element) {
    if (!this.intersectionObserver) return
    this.intersectionObserver.unobserve(element)
    this.intersectionCallbacks.delete(element)
  }

  public addVisibilityListener(callback: VisibilityCallback) {
    this.initializeGlobalListener()
    this.visibilityCallbacks.add(callback)
  }

  public removeVisibilityListener(callback: VisibilityCallback) {
    this.visibilityCallbacks.delete(callback)
    if (
      this.visibilityCallbacks.size === 0 &&
      this.isVisibilityListenerActive &&
      typeof document !== 'undefined'
    ) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange)
      this.isVisibilityListenerActive = false
    }
  }
}

export const cmsObserverManager = new CmsObserverManager()
