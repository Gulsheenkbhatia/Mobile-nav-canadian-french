import { useContext, useMemo } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import isCA from 'toro/helpers/isCA'
import { isJapan as isJP } from 'toro/helpers/localization'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'

const useCurrencyOptions = (customCurrency) => {
  const { appData } = useContext(PWAContext)
  const isCanada = isCA()
  const siteId = get(appData, 'siteId')
  const isJapan = isJP(siteId)
  const defaultLocale = get(appData, 'defaultLocale', 'en-US')
  const currentLocale = get(appData, 'locale', defaultLocale)
  return useMemo(() => {
    const {
      currency: currencyDefault,
      currencyDecimals: decimals,
      disablePriceFormatGrouping,
      forceCommaSeparated,
      currencySymbol,
      currencySymbolAfterPrice,
      forceCommaSeparatedForThousands,
    } = normalizeLocalizationContent(currentLocale)

    const currency = customCurrency || currencyDefault

    /**
     * For the 'en-CA' locale, the Intl.NumberFormat returns the '$' character so
     * we need to use the 'en-US' locale and the currency of the 'CAD' so
     * that the Intl.NumberFormat returns the correct character 'C$'
     */
    const locale = isCanada ? 'en-US' : isJapan ? 'ja-JP' : currentLocale

    return {
      currency,
      decimals,
      locale,
      disablePriceFormatGrouping,
      forceCommaSeparated,
      currencySymbol,
      currencySymbolAfterPrice,
      forceCommaSeparatedForThousands,
    }
  }, [currentLocale, customCurrency, isCanada, isJapan])
}

export default useCurrencyOptions
