const getLocaleFromUrl = (url) => {
  const localePattern = /com\/(.*)\/products/
  const localeFromUrl = localePattern.exec(url)
  const locale = localeFromUrl ? localeFromUrl[1] : ''
  return locale.length > 0 ? `/${locale}` : ''
}

export default getLocaleFromUrl
