import { resolveCountrySelectorURLs } from './resolveCountrySelectorURLs'

const makeLanguage = (name: string, href: string) => ({ name, href })

const makeDropdownItem = (flag: string, languages: { name: string; href: string }[]) => ({
  label: `${flag} label`,
  flag,
  languages,
  dataQA: {},
})

const makeCountrySelector = (items: ReturnType<typeof makeDropdownItem>[]) => ({
  selector: { label: 'US', flag: 'usa', dataQA: {} },
  dropdown: {
    title: 'CHANGE LOCATION',
    items,
    viewMore: { viewMoreText: '' },
    selectedItemIndex: 0,
    selectedLanguageIndex: 0,
  },
})

describe('resolveCountrySelectorURLs', () => {
  const countrySelectorURLs = {
    url_us_en: 'https://www.coach.com',
    url_ca_en: 'https://www.coach.com/ca/en',
    url_ca_fr: 'https://www.coach.com/ca/fr',
  }

  it('should resolve US item to the correct URL', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('usa', [makeLanguage('EN', 'https://old-us.coach.com')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://www.coach.com')
  })

  it('should resolve Canada EN and FR to the correct URLs', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('canada', [
        makeLanguage('EN', 'https://old-ca.coach.com/en'),
        makeLanguage('FR', 'https://old-ca.coach.com/fr'),
      ]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://www.coach.com/ca/en')
    expect(result.dropdown.items[0].languages[1].href).toBe('https://www.coach.com/ca/fr')
  })

  it('should resolve both US and Canada items together', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('usa', [makeLanguage('EN', 'https://old.coach.com')]),
      makeDropdownItem('canada', [
        makeLanguage('EN', 'https://old-ca.coach.com/en'),
        makeLanguage('FR', 'https://old-ca.coach.com/fr'),
      ]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://www.coach.com')
    expect(result.dropdown.items[1].languages[0].href).toBe('https://www.coach.com/ca/en')
    expect(result.dropdown.items[1].languages[1].href).toBe('https://www.coach.com/ca/fr')
  })

  it('should fall back to original href when countrySelectorURLs key is missing', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('canada', [makeLanguage('ES', 'https://original-es.coach.com')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://original-es.coach.com')
  })

  it('should return original countrySelector when countrySelectorURLs is empty', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('usa', [makeLanguage('EN', 'https://old.coach.com')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, {})

    expect(result).toBe(countrySelector)
  })

  it('should return original countrySelector when countrySelector is empty', () => {
    const result = resolveCountrySelectorURLs(undefined, countrySelectorURLs)

    expect(result).toBeUndefined()
  })

  it('should handle case-insensitive flag values', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('Canada', [makeLanguage('EN', 'https://old-ca.coach.com/en')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://www.coach.com/ca/en')
  })

  it('should default to "us" country code for unknown flags', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('unknown', [makeLanguage('EN', 'https://old.coach.com')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].languages[0].href).toBe('https://www.coach.com')
  })

  it('should preserve non-language properties on dropdown items', () => {
    const countrySelector = makeCountrySelector([
      makeDropdownItem('usa', [makeLanguage('EN', 'https://old.coach.com')]),
    ])

    const result = resolveCountrySelectorURLs(countrySelector, countrySelectorURLs)

    expect(result.dropdown.items[0].label).toBe('usa label')
    expect(result.dropdown.items[0].flag).toBe('usa')
    expect(result.dropdown.items[0].dataQA).toEqual({})
  })
})
