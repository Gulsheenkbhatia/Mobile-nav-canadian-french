import getRawSearches from './getRawSearches'

describe('src/toro/helpers/getRawSearches', () => {
  it('returns an empty array when given an empty input', () => {
    const raw = []
    const result = getRawSearches(raw)
    expect(result).toEqual([])
  })

  it('returns an array of RecommendedSearch objects with name and link properties', () => {
    const raw = ['leather', 'shoe', 'bags']
    const result = getRawSearches(raw)
    expect(result).toEqual([
      { name: 'leather', link: '/search?q=leather' },
      { name: 'shoe', link: '/search?q=shoe' },
      { name: 'bags', link: '/search?q=bags' },
    ])
  })
})
