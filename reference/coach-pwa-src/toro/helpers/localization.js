import get from 'lodash/get'
import isObject from 'lodash/isObject'

const allPossibleLocales = [
  'en-GB',
  'en-US',
  'en-CA',
  'ja-JP',
  'fr-CA',
  'en',
  'fr',
  'de-DE',
  'en-DE',
  'en-FR',
  'en-IT',
  'en-ES',
  'it-IT',
  'es-ES',
  'fr-FR',
  'it',
  'nl',
  'be',
  'es',
  'ie',
  'at',
  'pt',
  'de_DE',
  'en_DE',
  'fr_FR',
  'en_FR',
  'it_IT',
  'en_IT',
  'es_ES',
  'en_ES',
  'en-NL',
  'en_NL',
  'en-IE',
  'en_IE',
  'en-BE',
  'en_BE',
  'en-AT',
  'en_AT',
  'en-PT',
  'en_PT',
]

const optionalLocalePattern = `/:locale(${allPossibleLocales.join('|')})?`

export const withLocales = (routes) =>
  Array.isArray(routes)
    ? routes.map((route) => `${optionalLocalePattern}${route}`)
    : `${optionalLocalePattern}${routes}`

export const normalizeLocalizationContent = (slots = []) => {
  const normalizedSlots = {
    default: {},
  }

  slots.filter(isObject).forEach((slot) => {
    const content = get(slot, `c_body`)
    if (!content) {
      return
    }
    const id = get(slot, 'id', '').replace('headless_config_', '')
    Object.keys(content).forEach((locale) => {
      if (!normalizedSlots[locale]) {
        normalizedSlots[locale] = {}
      }

      try {
        const localeContent = get(content, `${locale}.markup`, '')
          .replace(/\n|\r/g, '')
          .replace(/&quot;/g, '"')
        normalizedSlots[locale][id] = JSON.parse(localeContent)
      } catch (e) {
        /*
          There's a problem with the 'fr-CA' markup.
          In 'en' in comes like this, for example:
            &quot;@id&quot;
          But in 'fr' it's:
            &qüüõöt;@îìd&qûüóõt;
         */
        normalizedSlots[locale][id] = {}
      }
    })
  })

  //default value of content assests are injected in locales
  if (Object.keys(normalizedSlots).length > 1) {
    Object.keys(normalizedSlots).forEach((localeObj) => {
      if (normalizedSlots[localeObj] !== 'default')
        normalizedSlots[localeObj] = Object.assign(
          {},
          normalizedSlots['default'],
          normalizedSlots[localeObj]
        )
    })
  }

  return normalizedSlots
}

export const isCanada = (req) => {
  const domain = get(req, 'headers.host') || ''
  const subDomain = domain ? domain.split('.')[0] : ''
  const isCanada = subDomain.includes('-ca')
  return isCanada
}

//This will be removed as per the future enhancement
export const isJapan = (siteIdValue) => {
  const siteId = process.env.SITE_ID_US ? process.env.SITE_ID_US : siteIdValue
  return siteId?.includes('_jp_')
}

export const isJapanLocale = (localeValue) => localeValue === 'ja-JP'
