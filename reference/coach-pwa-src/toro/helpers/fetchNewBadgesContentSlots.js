import { getNewContentSlotIds } from 'toro/helpers/badges'
import fetchContentAssets from 'toro/helpers/fetchContentAssets'
import isNil from 'lodash/isNil'
import get from 'lodash/get'

async function fetchNewBadgesContentSlots(badgingContentSlots, products, req) {
  const newSlotIds = getNewContentSlotIds(badgingContentSlots, products)

  if (!newSlotIds.length) {
    return []
  }

  const assestsRaw = await fetchContentAssets(req, newSlotIds)
  const assets = Object.values(get(assestsRaw, 'data', []))
  return assets.filter((asset) => !isNil(asset)) // filter out offline OCAPI assets
}

export default fetchNewBadgesContentSlots
