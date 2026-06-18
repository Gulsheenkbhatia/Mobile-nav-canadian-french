import get from 'lodash/get'
import { parseProductId, getColorVariantId } from 'toro/helpers/productVariations'
import size from 'lodash/size'
import getAPIURL from 'helpers/getAPIURL'
import { API_GET_PRODUCTS, API_GET_MIN_PRODUCTS } from 'toro/constants/Urls'
import uniq from 'lodash/uniq'
import getProductUrlFromClient from 'toro/helpers/getProductUrlFromClient'
import withCorrId from 'helpers/traceability'
import { getToken } from 'toro/lib/shopper-login/helpers/token'

/**
 * Returns not cached product data by id
 */
export async function fetchProductDataFromClient({
  id: idParam,
  activeColorId: acIdParam,
  url,
  cached = true,
  masterId: mIdParam,
  variants = [],
  colorId,
  signal,
  locale,
  include,
}) {
  try {
    const fetchWithCorrId = withCorrId()
    let requestUrl
    let data
    const [id, masterId, activeColorId] = [idParam, mIdParam, acIdParam].map((id) => {
      if (/%2F|\//.test(id)) {
        return encodeURIComponent(id)
      }
      return id
    })
    if (!cached && id) {
      let variantId = getColorVariantId(mIdParam, acIdParam ?? colorId, variants)
      if (/%2F|\//.test(variantId)) {
        variantId = encodeURIComponent(variantId)
      }
      let urlToFetch = activeColorId
        ? `/get-product-data/${encodeURIComponent(id)}/${encodeURIComponent(
            masterId
          )}/${encodeURIComponent(variantId)}/${encodeURIComponent(activeColorId)}`
        : `/get-product-data/${encodeURIComponent(id)}/${encodeURIComponent(
            masterId
          )}/${encodeURIComponent(variantId)}`
      urlToFetch = include ? `${urlToFetch}?include=${include}` : urlToFetch
      requestUrl = getAPIURL(`${locale ? `/${locale}` : ''}${urlToFetch}`).replace('frp=', 'frpId=')
      if (!requestUrl || requestUrl.includes('undefined')) {
        return null
      }
      data = await fetchWithCorrId(requestUrl, { credentials: 'include', signal }).then((res) =>
        res.json()
      )
    } else if (url) {
      requestUrl = getAPIURL(url).replace('frp=', 'frpId=')
      if (requestUrl.includes('undefined')) {
        return null
      }
      const response = await fetchWithCorrId(requestUrl, { credentials: 'include', signal }).then(
        (res) => res.json()
      )
      data = get(response, 'pageData', {})
    }
    const isDiscontinued = get(data, 'custom.c_isDiscontinued', false)
    const discontinuedProductId = get(data, 'custom.c_recommendedProductForDiscontinuedProduct')
    const parsedDiscontinuedProductId = parseProductId(discontinuedProductId)
    let recommendedProduct = null
    try {
      if (size(parsedDiscontinuedProductId) > 0 && isDiscontinued) {
        const recommendedProductRequestUrl = getAPIURL(
          `${locale ? `/${locale}` : ''}/get-product-data/${encodeURIComponent(
            parsedDiscontinuedProductId.masterId
          )}`
        )
        recommendedProduct = await fetchWithCorrId(recommendedProductRequestUrl, {
          credentials: 'include',
        }).then((res) => res.json())
      }
    } catch (error) {
      console.error('unable to fetch productData', error)
    }
    if (recommendedProduct) {
      recommendedProduct.url = getProductUrlFromClient({
        name: recommendedProduct.name,
        productId: recommendedProduct.id,
        caller: 'fetchProductData.js',
      })
    }
    data.recommendedProduct = recommendedProduct

    return data
  } catch (e) {
    console.error(e)
  }
}

export async function fetchFullProductsDataFromClient(ids = [], options = {}) {
  const fetchIds = [...ids]
  if (options.withMaster) {
    const masterIds = ids.map((item) => get(parseProductId(item), 'masterId'))
    fetchIds.push(...masterIds)
  }

  const filteredFetchIds = uniq(fetchIds.filter(Boolean).sort())

  if (!filteredFetchIds.length) {
    return []
  }

  const includeInventory = options.includeInventory
  const localeQuery = options?.locale ? `&locale=${options?.locale}` : ''
  let url
  let requestOptions
  if (options.minProductsApiEnabled) {
    url = getAPIURL(`${API_GET_MIN_PRODUCTS}?ids=${filteredFetchIds.join(',')}${localeQuery}`)
    const { token } = await getToken()
    requestOptions = {
      headers: {
        'Ccapi-Authorization': token,
      },
    }
  } else {
    url = getAPIURL(
      `${API_GET_PRODUCTS}?ids=${filteredFetchIds.join(',')}${
        includeInventory ? '&includeInventory=true' : ''
      }${localeQuery}`
    )
  }

  const fetchWithCorrId = withCorrId()
  const response = await fetchWithCorrId(url, requestOptions).then((res) => (res ? res.json() : {}))
  const productsData = get(response, 'productsData', [])

  let products = productsData
  if (options.withMaster) {
    const masterProductsMap = new Map()
    const variantProducts = []

    productsData.forEach((product) => {
      if (ids.includes(product.id)) {
        variantProducts.push(product)
      } else {
        masterProductsMap.set(product.id, product)
      }
    })

    products = variantProducts.map((item) => {
      return {
        ...item,
        masterProductData: masterProductsMap.get(item.master?.ID),
      }
    })
  }

  return products
}
