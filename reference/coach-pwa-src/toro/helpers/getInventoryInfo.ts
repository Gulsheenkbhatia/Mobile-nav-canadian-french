import authToken from 'toro/helpers/getBase64AuthToken'
import serialize from 'toro/helpers/serialize'
import fetchFromSfccApi from 'toro/helpers/fetchFromSfccApi'
import getCookie from 'toro/helpers/getCookie'
import { DW_ANONYMOUS, DWSID } from 'toro/constants/cookies'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'
import type { NextApiRequest } from 'next'
import { InventoryResponsePayload } from 'store/inventory.atom'

async function getInventoryInfo(req: NextApiRequest, id?: string) {
  const { vgId, includeVariantData } = req.query
  const dwsid = getCookie(DWSID, req.headers.cookie, true)
  const dwanonymous = getCookie(DW_ANONYMOUS, req.headers.cookie, true)
  const inventoryQuery = serialize({
    id: vgId || id,
    variants: true,
    variationGroups: true,
  })

  const requests = [
    fetchFromSfccApi(
      `Headless-GetInventory${inventoryQuery}`,
      req,
      {
        method: 'GET',
        headers: {
          referer: req.headers.referer,
          HeadlessHeader: authToken,
          cookie: `${dwsid};${dwanonymous}`,
        },
      },
      false,
      true
    ),
  ]

  if (includeVariantData === 'true') {
    const productInfoQuery = serialize({
      vgId: vgId || id,
    })
    requests.push(
      fetchFromServerSideWithCorrId(req, `/api/fetch-variants${productInfoQuery}`)
        .then((r) => r.json())
        .catch((err) => console.log('Error in fetching variant data', err))
    )
  }
  let [inventoryData, variantData] = await Promise.all(requests)

  try {
    if (typeof inventoryData === 'string') {
      inventoryData = JSON.parse(inventoryData)
    }
  } catch (error) {
    console.log(error)
  }
  return {
    inventory: inventoryData?.inventory as InventoryResponsePayload,
    variants: variantData?.variants || [],
    klarnaDetailsMap: variantData?.klarnaDetailsMap || {},
  }
}

export default getInventoryInfo
