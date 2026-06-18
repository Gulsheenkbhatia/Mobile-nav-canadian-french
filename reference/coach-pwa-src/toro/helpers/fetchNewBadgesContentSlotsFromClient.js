import { getNewContentSlotIds } from 'toro/helpers/badges'
import fetchOcapiContentAssetsFromClient from 'toro/helpers/fetchOcapiContentAssetsFromClient'
import isNil from 'lodash/isNil'

async function fetchNewBadgesContentSlotsFromClient(badgingContentSlots, products) {
  const newSlotIds = getNewContentSlotIds(badgingContentSlots, products)

  if (!newSlotIds.length) {
    return []
  }

  const assets = await fetchOcapiContentAssetsFromClient(newSlotIds)
  return assets.filter((asset) => !isNil(asset)) // filter out offline OCAPI assets
}

export default fetchNewBadgesContentSlotsFromClient
