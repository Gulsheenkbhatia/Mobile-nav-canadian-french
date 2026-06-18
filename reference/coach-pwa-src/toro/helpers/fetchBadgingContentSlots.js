import uniq from 'lodash/uniq'
import isNil from 'lodash/isNil'
import fetchContentAssets from 'toro/helpers/fetchContentAssets'
import fetchPreferences from 'toro/helpers/fetchPreferences'

export default async function fetchBadgingContentSlots(req) {
  try {
    const badgingDetailsPreferenceResponse = await fetchPreferences({
      req,
      ids: ['badgeDetailsJSONplp', 'badgeDetailsJSONpdp', 'bundlebadgeDetailsJSONminicart'],
    })
    const slotIds = uniq(
      Object.values(badgingDetailsPreferenceResponse)
        .filter(Boolean)
        .reduce((acc, curr) => {
          if (Array.isArray(curr.value)) {
            return acc.concat(curr.value.map((v) => v.contentId).filter(Boolean))
          }
          return acc
        }, [])
    )
    const slotsBuff = await fetchContentAssets(req, slotIds)
    const slots = Object.values(slotsBuff?.data)
    return slots.filter((slot) => !isNil(slot)) // filter out offline OCAPI assets
  } catch (error) {
    console.log('Error during fetching badges content slots', error)
    return
  }
}
