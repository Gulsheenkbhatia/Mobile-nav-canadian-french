import { slugify } from 'lib/sales-force-connector/utils/getUrl'

export type GetProductUrlParams = {
  name: string
  productId?: string
  frpId?: string
  locale?: string
  canonicalUrl?: string
  isSubBrand?: boolean
  subBrandName?: string
  [key: string]: any
}

const getProductUrl = ({
  name,
  productId,
  frpId,
  locale,
  canonicalUrl,
  isSubBrand,
  subBrandName,
  ...payloadDetails
}: GetProductUrlParams): string => {
  if (typeof productId !== 'string' || productId?.includes('object') || !name) {
    const errorPayload = {
      error: 'Product url requested for invalid product ID or name.',
      context: {
        detail: {
          productId,
          frpId,
          name,
          ...payloadDetails,
        },
      },
    }
    console.error(errorPayload)
  }

  let baseUrl = new URL('http://localhost:3000')
  const localeSection = locale && !locale.startsWith('/') ? `/${locale}` : ''

  if (canonicalUrl && /^https?:\/\//gi.test(canonicalUrl)) {
    baseUrl = new URL(canonicalUrl)
  } else {
    baseUrl.pathname = `${localeSection}/products/${
      isSubBrand && subBrandName ? `${subBrandName}/` : ''
    }${slugify(name)}/${encodeURIComponent(productId)}.html`
  }

  if (frpId) {
    baseUrl.searchParams.append('frp', frpId)
    return baseUrl.pathname + baseUrl.search
  }

  return baseUrl.pathname
}

export default getProductUrl
