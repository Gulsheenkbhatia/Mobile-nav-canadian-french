export const PREFETCH_CACHE_NAME = 'prefetch'

// Extend TTL configurations if you have different cache entries
export const PREFETCH_CACHE_TTL_MS = 5 * 60 * 1000

// Extend header configurations if you have different cache entries
export const PREFETCH_CACHED_AT_HEADER = `x-${PREFETCH_CACHE_NAME}-cached-at`

export function isPrefetchResponseFresh(response: Response): boolean {
  const cachedAt = response.headers.get(PREFETCH_CACHED_AT_HEADER)
  if (!cachedAt) return false

  const ageMs = Date.now() - Number(cachedAt)
  if (!Number.isFinite(ageMs)) return false

  return ageMs < PREFETCH_CACHE_TTL_MS
}

/**
 * Returns true when `url` has a non-expired prefetch cache entry.
 * If an entry exists but is past TTL, it is removed and this returns false.
 */
export async function consumePrefetchCacheIfFresh(cache: Cache, url: string): Promise<boolean> {
  const cached = await cache.match(url)
  if (!cached) return false

  if (isPrefetchResponseFresh(cached)) return true
  await cache.delete(url)

  return false
}

interface GetCachedResponseProps {
  (url: string): Promise<Response>
}

interface DeleteCacheEntriesProps {
  (url: string): Promise<void>
}

async function findMatchingPrefetchCacheRequest(
  url: string
): Promise<{ cacheStorage: Cache; request: Request } | null> {
  const cacheStorage = await caches.open(PREFETCH_CACHE_NAME)
  const keys = await cacheStorage.keys()

  const passedUrl = new URL(url, 'http://localhost:3000')
  passedUrl.searchParams.delete('__v__') // remove automatic parameter
  const passedPath = `${passedUrl.pathname}${passedUrl.search}`

  const matchedRequest = keys.find((request: Request) => {
    const cachedUrl = new URL(request.url)
    const cachedPath = `${cachedUrl.pathname}${cachedUrl.search}`

    return cachedPath === passedPath
  })

  return matchedRequest ? { cacheStorage, request: matchedRequest } : null
}

export const getCachedResponse: GetCachedResponseProps = async (url) => {
  try {
    const found = await findMatchingPrefetchCacheRequest(url)
    if (!found) return undefined

    const cachedResponse = await found.cacheStorage.match(found.request)
    if (!cachedResponse) return undefined

    Object.defineProperty(cachedResponse, 'url', { value: found.request.url })
    return cachedResponse
  } catch (e) {
    console.error(e)
  }
}

export const deleteCachedResponse = async (url: string): Promise<void> => {
  try {
    const found = await findMatchingPrefetchCacheRequest(url)
    if (!found) return

    await found.cacheStorage.delete(found.request)
  } catch (e) {
    console.error(e)
  }
}

export const deleteCacheEntries: DeleteCacheEntriesProps = async (url) => {
  try {
    const cacheStorage = await caches.open(PREFETCH_CACHE_NAME)
    const keys = await cacheStorage.keys()
    // loop through requests in keys and delete all matching responses from cacheStorage
    keys.forEach((request) => {
      const cachedPath = new URL(request.url).pathname
      const passedPath = new URL(url, 'http://localhost:3000').pathname
      if (cachedPath.includes(passedPath)) {
        cacheStorage.delete(request)
      }
    })
  } catch (e) {
    console.error(e)
  }
}
