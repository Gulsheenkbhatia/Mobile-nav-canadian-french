import promiseWithTimeout from 'helpers/promiseWithTimeout'

/**
 * Validates image availability by making HEAD requests to check if images exist
 * Uses Promise.allSettled to handle all requests concurrently and gracefully handle failures
 *
 * @param imageUrls - Array of image URLs to validate
 * @param timeout - Request timeout in milliseconds (default: 5000ms)
 * @returns Promise<Map<string, boolean>> - Map of URL to availability status (true if available, false otherwise). Returns empty Map if no valid URLs provided for graceful degradation.
 *
 * @example
 * const imageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
 * const availabilityMap = await validateImageAvailability(imageUrls)
 * // Map { 'https://example.com/image1.jpg' => true, 'https://example.com/image2.jpg' => false }
 */
export async function validateImageAvailability(
  imageUrls: string[],
  timeout: number = 5000
): Promise<Map<string, boolean>> {
  const uniqueUrls = Array.from(new Set(imageUrls.filter(Boolean)))

  if (uniqueUrls.length === 0) {
    return new Map()
  }

  const validationPromises = uniqueUrls.map(async (url): Promise<[string, boolean]> => {
    try {
      const existsUrl = new URL(url)
      existsUrl.searchParams.set('req', 'exists')

      const fetchPromise = fetch(existsUrl.toString(), {
        method: 'GET',
      })

      const response = await promiseWithTimeout(fetchPromise, {
        timeInMs: timeout,
        errorMessage: `Image validation timeout for URL: ${url}`,
      })

      // Type guard: promiseWithTimeout returns Response (or throws) since resolveOnTimeout defaults to false
      if (!(response instanceof Response)) {
        return [url, false]
      }
      const text = await response.text()
      const isAvailable = text.includes('catalogRecord.exists=1')
      return [url, isAvailable]
    } catch (error) {
      return [url, false]
    }
  })

  const results = await Promise.allSettled(validationPromises)

  const fulfilledResults = results.filter(
    (result): result is PromiseFulfilledResult<[string, boolean]> => result.status === 'fulfilled'
  )

  return new Map(fulfilledResults.map((result) => result.value))
}
