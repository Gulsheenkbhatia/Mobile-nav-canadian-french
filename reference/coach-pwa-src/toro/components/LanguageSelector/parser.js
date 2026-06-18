import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function languageSelectorParser(html, urls) {
  if (!html) {
    return {}
  }
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const $label = $('.dropdown.country-selector label')
  const countryFullName = $label.data('countryFullName')
  const languageFullName = $label.data('languageFullName')
  const languageShortName = $label.data('languageShortName')
  const selectedLocale = $label.text().trim()
  const selectedFlag = $('.dropdown.country-selector svg > use').attr('href')?.trim()?.slice(1) // remove leading '#'
  const selectedFlagQa = $('.dropdown.country-selector svg').attr('data-qa')
  const selectedLabelQa = $('.dropdown.country-selector label').attr('data-qa')
  const viewMore = {
    viewMoreText: $('.country-selector-viewmore a.dropdown-item-lang span').text().trim(),
    viewMoreLink: $('.country-selector-viewmore a').attr('href'),
  }
  const title = $('.dropdown-title').text().trim()
  let selectedItemIndex = 0
  let selectedLanguageIndex = 0
  const items = $('.dropdown-item.locale-items')
    .map((i, wrapperEl) => {
      const $wrapperEl = $(wrapperEl)
      const anchorEl = $wrapperEl.find('a.dropdown-item-locale')
      const $anchorEl = $(anchorEl)
      if ($wrapperEl.hasClass('active')) {
        selectedItemIndex = i
      }
      const label = $anchorEl
        .contents()
        .filter(function () {
          return this.type === 'text'
        })
        .text()
        .trim()
      const flag = $anchorEl.find('svg > use').attr('href')?.trim()?.slice(1) // remove leading '#'
      const flagDataQa = $anchorEl.find('svg').attr('data-qa')
      const labelDataQa = $wrapperEl.attr('data-qa')
      const langDataQa = $wrapperEl.find('a.dropdown-item-lang').attr('data-qa')
      const languages = $wrapperEl
        .find('a.dropdown-item-lang')
        .map((j, langEl) => {
          const $langEl = $(langEl)
          if ($langEl.hasClass('active')) {
            selectedLanguageIndex = j
          }
          const name = $langEl.text().trim()
          const urlId = $langEl.attr('href')?.slice(2, -2) // remove leading ## and trailing ##
          const href = urls[urlId] || ''
          return {
            name,
            href,
          }
        })
        .toArray()
      return {
        label,
        flag,
        languages,
        dataQA: {
          flag: flagDataQa,
          label: labelDataQa,
          lang: langDataQa,
        },
      }
    })
    .toArray()

  return {
    selector: {
      countryFullName,
      languageFullName,
      languageShortName,
      label: selectedLocale,
      flag: selectedFlag,
      dataQA: {
        flag: selectedFlagQa,
        label: selectedLabelQa,
      },
    },
    dropdown: {
      title,
      items,
      viewMore,
      selectedItemIndex,
      selectedLanguageIndex,
    },
  }
}
