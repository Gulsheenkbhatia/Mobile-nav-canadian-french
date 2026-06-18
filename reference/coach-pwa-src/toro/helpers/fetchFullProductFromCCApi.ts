import getClient from 'lib/sales-force-connector/client'
import type { NextApiRequest } from 'next'

interface FetchFullProductOptions {
  expanded?: boolean
}

export async function fetchFullProductFromCCApi(
  productId: string,
  req: NextApiRequest,
  options: FetchFullProductOptions = {}
) {
  const { expanded } = options
  const ccapiClient = await getClient(req)

  const query: Record<string, string> = {
    c_pid: productId,
  }

  if (expanded) query.c_expanded = 'true'

  const fullProductData = await ccapiClient.getFullProducts(query)
  return fullProductData
}
