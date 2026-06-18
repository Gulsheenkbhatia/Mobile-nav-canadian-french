import { slugify } from 'lib/sales-force-connector/utils/getUrl'

const getProductUrlFromClient = ({ name, productId, frpId, ...payloadDetails }) => {
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

  if (frpId) {
    return `/products/${slugify(name)}/${encodeURIComponent(
      productId
    )}.html?frp=${encodeURIComponent(frpId)}`
  }
  return `/products/${slugify(name)}/${encodeURIComponent(productId)}.html`
}

export default getProductUrlFromClient
