import isBrowser from 'toro/helpers/isBrowser'

/**
 * Creates a lazy import function with promise caching to prevent duplicate imports
 * @param {() => Promise} importFunction - The dynamic import function
 * @returns {() => Promise} - Cached lazy import function that reuses the same promise
 */
export const createLazyImporter = (importFunction) => {
  let cachedPromise = null

  return () => {
    if (cachedPromise !== null) {
      return cachedPromise
    }

    cachedPromise = importFunction().catch((error) => {
      cachedPromise = null
      return Promise.reject(error)
    })
    return cachedPromise
  }
}

/**
 * Schedules a lazy import when the browser is idle
 * @param {() => Promise} lazyImporter - The lazy import function to call when idle
 * @returns {() => void} - Cleanup function to cancel the idle callback
 */
export const scheduleIdleLazyLoad = (lazyImporter) => {
  if (!isBrowser()) {
    return () => {}
  }

  const callbackId = requestIdleCallback(() => {
    lazyImporter().catch(() => {})
  })
  return () => cancelIdleCallback(callbackId)
}
