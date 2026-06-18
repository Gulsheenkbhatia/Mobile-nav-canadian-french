import { globalSlotDataParser } from 'toro/helpers/parseContent'
import { GLOBAL_CONTENT_SLOTS_IDS } from 'toro/constants/globalContentSlotIds'
import fetchGlobalContent from 'toro/helpers/fetchGlobalContent'

export async function fetchHeaderGlobalBanners(req, src, locale, brand, isCachingDisabled) {
  const headerGlobalBanners = await fetchGlobalContent(
    req,
    GLOBAL_CONTENT_SLOTS_IDS,
    { src, brand, isCachingDisabled },
    locale
  )

  let globalSlotData
  try {
    globalSlotData = globalSlotDataParser(headerGlobalBanners)
  } catch (e) {
    console.error({
      error: e,
      context: {
        apiHandler: 'fetchHeaderGlobalBanners.js',
        section: 'global Slot Data Parser',
      },
    })
  }
  return globalSlotData
}
