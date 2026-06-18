import getEnvVariables from 'toro/helpers/getEnvVariables'
import { isSubBrandInPath, isSubBrandInQueryParams } from 'helpers/subBrand'

export const getSubBrandConfig = (
  subBrandConfig = [],
  oneCoachConfig = [],
  locale = '',
  currentRoute = '',
  queryStringParameters = {}
) => {
  const { subBrand: subBrandName, brand: brandName } = getEnvVariables()
  const { coachtopiaGlobalConfig: subBrandGlobalConfigPref, enableCoachTopia } =
    subBrandConfig.reduce((obj, pref) => {
      return { ...obj, [pref?.id]: pref?.value }
    }, {})

  const subBrandGlobalConfig = subBrandGlobalConfigPref?.find((item) =>
    item?.locale.includes(locale?.replace('-', '_'))
  )

  const isOneCoachTabbedHeaderEnabled = String(oneCoachConfig[0]?.value?.enable) === 'true'

  const isSubBrandEnabled = enableCoachTopia && String(subBrandGlobalConfig?.enable) === 'true'

  const currentUrl = isSubBrandEnabled ? queryStringParameters?.brand || currentRoute : ''

  const isSubBrandInUrl =
    isSubBrandInPath(currentUrl, subBrandName) ||
    isSubBrandInQueryParams(queryStringParameters, subBrandName)

  const isSubBrandActive = isSubBrandEnabled && isSubBrandInUrl

  let brandCookieValue = brandName
  if (isSubBrandActive) {
    brandCookieValue = subBrandName
  } else if (
    !isSubBrandInUrl &&
    (queryStringParameters?.brand?.includes(brandName) ||
      currentRoute === '/' ||
      currentRoute?.includes('shop') ||
      currentRoute?.includes('products'))
  ) {
    brandCookieValue = brandName
  }
  const isReducedHeaderAndFooter = Boolean(
    isSubBrandActive && subBrandGlobalConfig?.reducedheaderfooter
  )

  const isTabHeaderVisible =
    Boolean(isSubBrandEnabled && subBrandGlobalConfig?.tabheader) ||
    Boolean(isOneCoachTabbedHeaderEnabled)

  return {
    isSubBrandEnabled,
    isSubBrandActive,
    brandCookieValue,
    isReducedHeaderAndFooter,
    isTabHeaderVisible,
    subBrandName,
  }
}
