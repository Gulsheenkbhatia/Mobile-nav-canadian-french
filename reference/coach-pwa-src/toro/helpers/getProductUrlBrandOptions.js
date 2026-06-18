import get from 'lodash/get'
import has from 'lodash/has'
import getLocaleFromUrl from 'toro/helpers/getLocaleFromUrl'

const getProductUrlBrandOptions = ({ product, brandConfig = {}, locale }) => {
  const customData = get(product, 'custom', get(product, 'customAttributes', {}))
  const hasSubBrandCustomAttribute =
    has(customData, 'c_isCoachtopia') || has(product, 'c_isCoachtopia')
  const isCoachtopia = get(customData, 'c_isCoachtopia', get(product, 'c_isCoachtopia', false))
  const canonicalUrl =
    get(product, 'canonicals.default') ||
    get(product, 'promotionData.canonicals.default') ||
    get(product, 'promotion[0].canonicals.default', '')
  const localeFromUrl = getLocaleFromUrl(canonicalUrl)
  const localizedCanonicalUrl =
    get(product, `canonicals[${locale || brandConfig?.locale || localeFromUrl}]`) ||
    get(product, `promotion[0].canonicals[${locale || brandConfig?.locale || localeFromUrl}]`)

  return {
    ...brandConfig,
    isSubBrand: hasSubBrandCustomAttribute ? isCoachtopia : brandConfig?.isSubBrand,
    locale: canonicalUrl ? localeFromUrl : locale || brandConfig.locale,
    canonicalUrl: localizedCanonicalUrl,
  }
}

export default getProductUrlBrandOptions
