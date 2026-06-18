const normalizeLocalizationContent = (locale) => {
  /*
    This is the default locale setting if we find no match in the i18n config.
    As long as the i18n file has been defined correctly, we should never have to use this.
  */
  const defaultLocale = {
    locale: 'en-US',
    currency: 'USD',
    currencyDecimals: 2,
    currencySymbol: '$',
    lang: 'en',
    region: 'US',
  }

  // Get the locale settings mapped object from the i18n config
  const locales = process.env.locales || {}
  // Return current locale as either the match from i18n or the default above
  return locales[locale] || defaultLocale
}

export default normalizeLocalizationContent
