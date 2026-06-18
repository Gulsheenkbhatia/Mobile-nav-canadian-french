import getAPIURL from 'helpers/getAPIURL'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import abortableFetch from 'helpers/abortableFetch'

type AbortableFetchResult = {
  fetchLatest: Promise<{
    json: () => Promise<any>
  }>
  controller?: {
    abort: () => void
  }
}

export const getVisuallySimilarV1Data = (
  visuallySimilarProp,
  locale,
  imageDomain
): Array<object> => {
  const data = JSON.parse(visuallySimilarProp)
  return normalizeV1Data(data, locale, imageDomain)
}

export const abortableFetchVisuallySimilarData = (
  visuallySimilarProp,
  minCount,
  maxCount,
  authToken
): AbortableFetchResult => {
  const params = new URLSearchParams({
    ids: visuallySimilarProp,
    minCount,
    maxCount,
  })
  const url = getAPIURL(`/get-llm-products-data?${params.toString()}`)
  return abortableFetch(url, {
    credentials: 'include',
    headers: {
      'Ccapi-Authorization': authToken,
    },
  })
}

const normalizeV1Data = (products, locale, imageDomain) => {
  const { currencySymbol } = normalizeLocalizationContent(locale)
  return products?.map((product) => {
    return {
      ...product,
      name: product.prodName,
      detailURL: `${window.location.origin}/products/${product.prodUrl}?rrec=true`,
      imageURL: `${imageDomain}/is/image/Coach/${product.imageURL}?$imageRec$`,
      aIType: 'llm',
      price: {
        discountpercentage: product.discountPercent,
        saleprice: product.salePrice,
        fullprice: product.listPrice,
        currency: currencySymbol,
      },
    }
  })
}
