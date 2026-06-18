import {
  consumePrefetchCacheIfFresh,
  isPrefetchResponseFresh,
  PREFETCH_CACHE_TTL_MS,
  PREFETCH_CACHED_AT_HEADER,
} from 'toro/helpers/cacheStorageHelpers'

describe('cacheStorageHelpers (prefetch cache)', () => {
  describe('isPrefetchResponseFresh', () => {
    describe('when cached-at header is missing or invalid', () => {
      it('returns false when header is absent', () => {
        const response = new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })

        expect(isPrefetchResponseFresh(response)).toBe(false)
      })

      it('returns false when header is not a finite number timestamp', () => {
        const response = makeCachedResponse('not-a-number')

        expect(isPrefetchResponseFresh(response)).toBe(false)
      })
    })

    describe('when age is within TTL', () => {
      it('returns true', () => {
        const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
        const cachedAt = String(1_000_000 - PREFETCH_CACHE_TTL_MS + 1)
        const response = makeCachedResponse(cachedAt)

        expect(isPrefetchResponseFresh(response)).toBe(true)

        nowSpy.mockRestore()
      })
    })

    describe('when age is at or beyond TTL', () => {
      it('returns false when age equals TTL', () => {
        const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
        const cachedAt = String(1_000_000 - PREFETCH_CACHE_TTL_MS)
        const response = makeCachedResponse(cachedAt)

        expect(isPrefetchResponseFresh(response)).toBe(false)

        nowSpy.mockRestore()
      })

      it('returns false when age is past TTL', () => {
        const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
        const cachedAt = String(1_000_000 - PREFETCH_CACHE_TTL_MS - 1)
        const response = makeCachedResponse(cachedAt)

        expect(isPrefetchResponseFresh(response)).toBe(false)

        nowSpy.mockRestore()
      })
    })
  })

  describe('consumePrefetchCacheIfFresh', () => {
    describe('when there is no cache entry', () => {
      it('returns false', async () => {
        const cache = createFakeCache()

        await expect(consumePrefetchCacheIfFresh(cache, '/api/foo')).resolves.toBe(false)
        expect(cache.delete).not.toHaveBeenCalled()
      })
    })

    describe('when entry is fresh', () => {
      it('returns true and does not delete', async () => {
        const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(2_000_000)
        const cache = createFakeCache()
        const url = '/api/home'
        const freshResponse = makeCachedResponse(String(2_000_000 - 60_000))
        cache.match.mockResolvedValue(freshResponse)

        await expect(consumePrefetchCacheIfFresh(cache, url)).resolves.toBe(true)

        expect(cache.match).toHaveBeenCalledWith(url)
        expect(cache.delete).not.toHaveBeenCalled()

        nowSpy.mockRestore()
      })
    })

    describe('when entry is stale', () => {
      it('deletes entry and returns false', async () => {
        const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(3_000_000)
        const cache = createFakeCache()
        const url = '/api/stale'
        const staleResponse = makeCachedResponse(String(3_000_000 - PREFETCH_CACHE_TTL_MS - 1))
        cache.match.mockResolvedValue(staleResponse)

        await expect(consumePrefetchCacheIfFresh(cache, url)).resolves.toBe(false)

        expect(cache.match).toHaveBeenCalledWith(url)
        expect(cache.delete).toHaveBeenCalledWith(url)

        nowSpy.mockRestore()
      })
    })
  })
})

function makeCachedResponse(cachedAt: string): Response {
  return new Response('{}', {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      [PREFETCH_CACHED_AT_HEADER]: cachedAt,
    },
  })
}

function createFakeCache(): Cache & { match: jest.Mock; put: jest.Mock; delete: jest.Mock } {
  return {
    match: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    add: jest.fn(),
    addAll: jest.fn(),
    keys: jest.fn(),
    matchAll: jest.fn(),
  } as unknown as Cache & { match: jest.Mock; put: jest.Mock; delete: jest.Mock }
}
