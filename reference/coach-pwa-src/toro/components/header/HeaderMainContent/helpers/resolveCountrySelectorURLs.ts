import type { CountrySelectorData, CountryItem } from 'toro/components/LanguageSelector/types'

type CountryCode = 'us' | 'ca'
type LanguageCode = 'en' | 'fr'
type CountrySelectorURLKey = `url_${CountryCode}_${LanguageCode}`
type CountrySelectorURLs = Partial<Record<CountrySelectorURLKey, string>>

const FLAG_TO_COUNTRY_CODE = {
  canada: 'ca',
  usa: 'us',
}

export const resolveCountrySelectorURLs = (
  countrySelector: CountrySelectorData | undefined,
  countrySelectorURLs: CountrySelectorURLs
): CountrySelectorData | undefined => {
  const items = countrySelector?.dropdown?.items
  if (!items?.length || !Object.keys(countrySelectorURLs).length) return countrySelector

  return {
    selector: countrySelector.selector,
    dropdown: {
      ...countrySelector.dropdown,
      items: items.reduce<CountryItem[]>((acc, dropdownItem) => {
        const countryCode = FLAG_TO_COUNTRY_CODE[dropdownItem?.flag?.toLowerCase()] || 'us'

        acc.push({
          ...dropdownItem,
          languages: (dropdownItem?.languages || []).map((language) => {
            const urlKey = `url_${countryCode}_${(language.name || '').toLowerCase()}`
            const resolvedURL = countrySelectorURLs[urlKey] || language.href

            return resolvedURL ? { ...language, href: resolvedURL } : language
          }),
        })

        return acc
      }, []),
    },
  }
}
