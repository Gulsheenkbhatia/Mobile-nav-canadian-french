import { cmsObserverManager } from './observerManager'

// Mock IntersectionObserver
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

global.IntersectionObserver = jest.fn(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: jest.fn(),
}))

// Mock document for visibility tests
Object.defineProperty(document, 'addEventListener', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(document, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
})

describe('CmsObserverManager', () => {
  let testElement: HTMLElement
  let addEventListenerSpy: jest.SpyInstance
  let removeEventListenerSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    testElement = document.createElement('div')
    testElement.id = 'test-element'
    document.body.appendChild(testElement)

    addEventListenerSpy = jest.spyOn(document, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement)
    }
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should add and remove visibility listeners', () => {
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    cmsObserverManager.addVisibilityListener(callback1)
    expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))

    cmsObserverManager.addVisibilityListener(callback2)
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    cmsObserverManager.removeVisibilityListener(callback1)
    expect(removeEventListenerSpy).not.toHaveBeenCalled()

    cmsObserverManager.removeVisibilityListener(callback2)
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
  })

  it('should trigger visibility callbacks when document visibility changes', () => {
    const callback = jest.fn()

    cmsObserverManager.addVisibilityListener(callback)

    const visibilityHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === 'visibilitychange'
    )?.[1] as EventListener

    expect(visibilityHandler).toBeDefined()

    Object.defineProperty(document, 'hidden', {
      value: true,
      configurable: true,
    })

    const visibilityEvent = new Event('visibilitychange')
    visibilityHandler(visibilityEvent)

    expect(callback).toHaveBeenCalledWith(true)

    Object.defineProperty(document, 'hidden', {
      value: false,
      configurable: true,
    })

    visibilityHandler(visibilityEvent)

    expect(callback).toHaveBeenCalledWith(false)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
