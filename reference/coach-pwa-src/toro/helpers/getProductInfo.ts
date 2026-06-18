import get from 'lodash/get'
import CustomRequestError from 'helpers/CustomRequestError'
import serialize from 'toro/helpers/serialize'
import fetchFromSfccApi from 'toro/helpers/fetchFromSfccApi'
import authToken from 'toro/helpers/getBase64AuthToken'
import type { NextApiRequest } from 'next'
type GetProductInfoOptions = {
  variantsOnly?: boolean
  isBundlePDP?: boolean
}

export default async function getProductInfo(
  request: NextApiRequest,
  id: string,
  options: GetProductInfoOptions = {}
) {
  const expanded = process.env.LIMITED_PRODUCT_DATA !== 'true'
  const query = serialize({ ...options, id, expanded })

  const requestProperties = {
    method: 'GET',
    headers: {
      referer: request.headers.referer,
      HeadlessHeader: authToken,
      cookie: request.headers.cookie,
    },
  }

  try {
    const response = await fetchFromSfccApi(
      `Headless-GetFullProductInfo${query}`,
      request,
      requestProperties,
      true,
      true
    )
    if (typeof response === 'string' && response.trim() === '') {
      return {}
    }
    const result = JSON.parse(response)
    const product = get(result, 'product.productData')
    if (!product) throw new Error(`The product ${id} was not found.`)
    return product
  } catch (error) {
    throw new CustomRequestError(error, { skipReport: true, status: 404, skipAppData: false })
  }
}
