import { createLazyImporter, scheduleIdleLazyLoad } from './dynamicImportUtils'
import isBrowser from './isBrowser'

// Mock the isBrowser helper
jest.mock('./isBrowser')

describe('dynamicImportUtils', () => {
  const MOCK_CALLBACK_ID = 123

  // Test helper to mock requestIdleCallback with immediate execution
  const mockRequestIdleCallbackWithImmediate = () => {
    global.requestIdleCallback = jest.fn((callback) => {
      callback() // Execute immediately for testing
      return MOCK_CALLBACK_ID
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock - tests can override if needed
    global.requestIdleCallback = jest.fn(() => MOCK_CALLBACK_ID)
    global.cancelIdleCallback = jest.fn()
  })

  describe('createLazyImporter', () => {
    it('should cache promises and reuse them', async () => {
      const mockImport = jest.fn(() => Promise.resolve({ default: 'Component' }))
      const lazyImporter = createLazyImporter(mockImport)

      const promise1 = lazyImporter()
      const promise2 = lazyImporter()

      // Test functional behavior, not implementation details
      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toEqual({ default: 'Component' })
      expect(result2).toEqual({ default: 'Component' })
      expect(mockImport).toHaveBeenCalledTimes(1) // Cached, so only called once
    })

    it('should reset cache on error', async () => {
      let shouldFail = true
      const mockImport = jest.fn(() => {
        if (shouldFail) {
          shouldFail = false
          return Promise.reject(new Error('Failed'))
        }
        return Promise.resolve({ default: 'Component' })
      })

      const lazyImporter = createLazyImporter(mockImport)

      await expect(lazyImporter()).rejects.toThrow('Failed')
      const result = await lazyImporter()

      expect(result).toEqual({ default: 'Component' })
      expect(mockImport).toHaveBeenCalledTimes(2)
    })
  })

  describe('scheduleIdleLazyLoad', () => {
    it('should call requestIdleCallback and execute lazyImporter when idle', () => {
      isBrowser.mockReturnValue(true)
      const mockLazyImporter = jest.fn(() => Promise.resolve())

      mockRequestIdleCallbackWithImmediate()
      const cleanup = scheduleIdleLazyLoad(mockLazyImporter)

      expect(global.requestIdleCallback).toHaveBeenCalledWith(expect.any(Function))
      expect(mockLazyImporter).toHaveBeenCalledTimes(1)
      expect(typeof cleanup).toBe('function')
    })

    it('should not call requestIdleCallback when not in browser', () => {
      isBrowser.mockReturnValue(false)
      const mockLazyImporter = jest.fn()

      const cleanup = scheduleIdleLazyLoad(mockLazyImporter)

      expect(global.requestIdleCallback).not.toHaveBeenCalled()
      expect(mockLazyImporter).not.toHaveBeenCalled()
      expect(typeof cleanup).toBe('function')
    })

    it('should return cleanup function that cancels callback', () => {
      isBrowser.mockReturnValue(true)
      const mockLazyImporter = jest.fn()

      const cleanup = scheduleIdleLazyLoad(mockLazyImporter)
      cleanup()

      expect(global.cancelIdleCallback).toHaveBeenCalledWith(MOCK_CALLBACK_ID)
      expect(typeof cleanup).toBe('function')
    })

    it('should handle rejected promises from lazyImporter gracefully', () => {
      isBrowser.mockReturnValue(true)
      const mockLazyImporter = jest.fn(() => {
        return Promise.reject(new Error('Import failed'))
      })

      mockRequestIdleCallbackWithImmediate()

      // Should not throw when lazyImporter returns rejected promise
      expect(() => scheduleIdleLazyLoad(mockLazyImporter)).not.toThrow()
      expect(mockLazyImporter).toHaveBeenCalledTimes(1)
    })

    it('should work with createLazyImporter integration', async () => {
      isBrowser.mockReturnValue(true)
      const mockImport = jest.fn(() => Promise.resolve({ default: 'Component' }))
      const lazyImporter = createLazyImporter(mockImport)

      mockRequestIdleCallbackWithImmediate()
      const cleanup = scheduleIdleLazyLoad(lazyImporter)

      // Verify the integration: preloading should trigger the import
      expect(mockImport).toHaveBeenCalledTimes(1)
      expect(typeof cleanup).toBe('function')

      // Verify the cache works: subsequent calls should reuse the cached promise
      const result = await lazyImporter()
      expect(result).toEqual({ default: 'Component' })
      expect(mockImport).toHaveBeenCalledTimes(1) // Still only called once due to caching
    })
  })
})
