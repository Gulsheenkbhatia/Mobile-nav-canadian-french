import { renderHook } from 'test-utils/react'
import Cookies from 'js-cookie'
import useRecentlySearchCookie from 'toro/hooks/useRecentSearches'

jest.mock('js-cookie')

jest.mock('toro/hooks/usePreference', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    groupId: 'SearchSuggestions',
    preferenceId: 'lastSeenpidsCookieMaxAge',
    value: 3628800,
  }),
}))

const hookMockSetup = (searchQuery, lastSeenpidsCookieMaxAge, loading, total) => {
  renderHook(() => useRecentlySearchCookie(searchQuery, lastSeenpidsCookieMaxAge, loading, total))
}

describe('useRecentlySearchCookie', () => {
  beforeEach(() => {
    Cookies.get.mockClear()
    Cookies.set.mockClear()
  })

  it('does not set cookie if searchQuery is empty', () => {
    hookMockSetup('', true, false, 0)

    expect(Cookies.set).not.toHaveBeenCalled()
  })

  it('does not set cookie if lastSeenpidsCookieMaxAge is falsy', () => {
    hookMockSetup('example', false, false, 0)

    expect(Cookies.set).not.toHaveBeenCalled()
  })

  it('does not set cookie if loading is true or total is falsy', () => {
    hookMockSetup('example', true, true, 0)

    expect(Cookies.set).not.toHaveBeenCalled()
  })

  it('does not set cookie if searchQuery already exists in recentSearchedUrls', () => {
    Cookies.get.mockReturnValueOnce(
      JSON.stringify({ '2023-05-30': 'example', '2023-05-29': 'test' })
    )

    hookMockSetup('example', true, false, 2)

    expect(Cookies.set).not.toHaveBeenCalled()
  })

  it('sets localStorage with new searchQuery and removes oldest entry if currentLimit is reached', () => {
    const mockStorage = { one: '1', two: '2', three: '3', four: '4', five: '5' }
    localStorage.setItem('recent_searches', JSON.stringify(mockStorage))

    hookMockSetup('newSearch', true, false, 3)

    const newStorage = JSON.parse(localStorage.getItem('recent_searches'))
    expect(newStorage.one).toBeUndefined()
    expect(Object.values(newStorage)).toContain('newSearch')
  })
  it('sets localStorage with new searchQuery if currentLimit is not reached', () => {
    localStorage.setItem(
      'recent_searches',
      JSON.stringify({
        one: 'example',
        '2023-05-29': 'test',
      })
    )
    hookMockSetup('newSearch', true, false, 2)
    const newStorage = JSON.parse(localStorage.getItem('recent_searches'))
    expect(Object.values(newStorage)).toContain('newSearch')
    expect(Object.keys(newStorage).length).toBe(3)
  })
})
