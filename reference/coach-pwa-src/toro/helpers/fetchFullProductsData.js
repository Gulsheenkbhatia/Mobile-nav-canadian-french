import getProductInfo from 'toro/helpers/getProductInfo'

export async function fetchFullProductsData({ ids = [], req }) {
  if (!ids?.filter(Boolean).length) {
    return []
  }
  let res = await Promise.allSettled(ids.map((id) => getProductInfo(req, id))).then((results) => {
    const fulfilled = results.filter((result) => result?.status === 'fulfilled')
    const rejected = results.filter((result) => result?.status === 'rejected')
    rejected.forEach((result) => {
      console.log('[Error fetching full product data]:', result.reason)
    })
    if (fulfilled.length > 0) {
      return fulfilled
    }
    throw new Error(`Failed to fetch product data for ${JSON.stringify(ids)}.`)
  })

  return res.map((data) => data.value)
}
