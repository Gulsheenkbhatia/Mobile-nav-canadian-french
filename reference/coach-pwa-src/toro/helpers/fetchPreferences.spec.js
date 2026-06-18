import fetchPreferences from 'toro/helpers/fetchPreferences'

const mockFetch = jest.fn()

global.fetch = mockFetch

describe('fetchPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch preferences successfully with valid payload', async () => {
    const payload = {
      req: null,
      groupId: 'group123',
      id: 'preference123',
      all: true,
      ids: ['id1', 'id2'],
      grouped: true,
    }

    const expectedResponse = {
      preferences: [],
    }

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expectedResponse),
    })

    const result = await fetchPreferences(payload)

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/get-site-preferences?groupId=group123&preferenceId=preference123&all=true&ids=id1%7Cid2&grouped=true',
      expect.any(Object)
    )
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedResponse)
  })

  it('should fetch preferences with default values when payload is empty', async () => {
    const expectedResponse = {
      preferences: [],
    }

    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(expectedResponse),
    })

    const result = await fetchPreferences({})

    expect(mockFetch).toHaveBeenCalledWith('/api/get-site-preferences?ids=', expect.any(Object))
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedResponse)
  })

  it('should handle fetch error and log the error', async () => {
    const consoleSpy = jest.spyOn(console, 'log')

    const error = new Error('Fetch error')
    mockFetch.mockRejectedValueOnce(error)

    await fetchPreferences({})

    expect(mockFetch).toHaveBeenCalledWith('/api/get-site-preferences?ids=', expect.any(Object))
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith(error)
  })
})
