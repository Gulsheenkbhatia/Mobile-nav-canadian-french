import getMarkupData from './searchResultTextHelper'

describe('getMarkupData', () => {
  const mockStyleFn = jest.fn(() => {})
  const formatMessageMock = jest.fn((message, values) => {
    return values
      ? message.defaultMessage
          .replaceAll('{query}', values.query)
          .replaceAll('{total}', values.total)
          .replaceAll('{suggestionPhrase}', values.suggestionPhrase)
      : message.defaultMessage
  })
  const styles = {
    NoResultFoundText: mockStyleFn,
    DidYouMeanText: mockStyleFn,
    NoResultText: mockStyleFn,
    SearchResultSkeletonMessageText: mockStyleFn,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns correct data when suggestionPhrase is provided', () => {
    const result = getMarkupData('bags', false, styles, true, 'beg', 10, formatMessageMock)

    expect(result).toEqual([
      { sx: undefined, 'data-qa': 'hs_nsr_txt_hdng' },
      {
        variant: 'secondary',
        sx: undefined,
        'data-qa': 'hs_invsearch_txt_didyoumean',
        size: 'xxs',
      },
      'No Results Found for "Beg".',
      'Did you mean "Bags"? Showing 10 results for "Bags".',
    ])
  })

  test('returns correct data when isAlternateProducts is true', () => {
    const result = getMarkupData('', true, styles, false, 'bag', '10', formatMessageMock)

    expect(result).toEqual([
      { sx: undefined },
      { variant: 'body-text-secondary', sx: undefined },
      'No Match Found For “bag”',
      'Try a new search or explore similar styles below.',
    ])
  })

  test('returns default data when neither suggestionPhrase nor isAlternateProducts is provided', () => {
    const result = getMarkupData('', false, styles, false, 'bags', 0, formatMessageMock)

    expect(result).toEqual([{}, { variant: 'secondary' }, '', ''])
  })
})
