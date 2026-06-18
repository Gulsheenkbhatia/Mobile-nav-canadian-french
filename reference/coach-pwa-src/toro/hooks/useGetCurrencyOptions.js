import { useContext } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import isCA from 'toro/helpers/isCA'
import { isJapan as isJP } from 'toro/helpers/localization'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'

const useGetCurrencyOptions = () => {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  const defaultLocale = get(appData, 'defaultLocale', 'en-US')
  const locale = get(appData, 'locale', defaultLocale)
  const isCanada = isCA()
  const isJapan = isJP(siteId)
  const {
    currency: currencyLocale,
    currencyDecimals,
    disablePriceFormatGrouping,
    forceCommaSeparated,
    currencySymbol,
    currencySymbolAfterPrice,
    forceCommaSeparatedForThousands,
  } = normalizeLocalizationContent(locale)

  return (customCurrency) => {
    const currency = customCurrency || currencyLocale
    let currencyOptions = {
      currency,
      decimals: currencyDecimals,
      locale,
      disablePriceFormatGrouping,
      forceCommaSeparated,
      currencySymbol,
      currencySymbolAfterPrice,
      forceCommaSeparatedForThousands,
    }
    //for the 'en-CA' locale, the Intl.NumberFormat returns the '$' character
    //so we need to use the 'en-US' locale and the currency of the 'CAD' so that the Intl.NumberFormat returns the correct character 'C$'
    if (isCanada) {
      currencyOptions.locale = 'en-US'
    }
    if (isJapan) {
      currencyOptions.locale = 'ja-JP'
    }
    return currencyOptions
  }
}

export default useGetCurrencyOptions
