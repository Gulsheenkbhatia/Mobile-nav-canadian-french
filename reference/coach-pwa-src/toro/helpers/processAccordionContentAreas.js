import get from 'lodash/get'
import { parseCMSContentSlots } from 'toro/cms/server/contentSlotsParser'
import isString from 'lodash/isString'

/**
 * Process accordion content areas and return processed accordion items
 * This helper processes accordion data server-side to avoid client-side computation on each render
 *
 * @param {Object} accordionConfig - The accordion configuration from preferences
 * @param {Object} masterCustomAttributes - Master product custom attributes
 * @param {Object} contentAssetsDataFull - Full content assets data
 * @param {string} siteId - Site identifier
 * @param {string} viewport - Viewport type (mobile/desktop)
 * @returns {Array} Processed accordion items array
 */
const processAccordionContentAreas = (
  accordionConfig,
  masterCustomAttributes,
  contentAssetsDataFull,
  siteId,
  viewport,
  locale = 'en_US'
) => {
  const localeKey = locale.replace(/-/g, '_')
  if (!accordionConfig?.enabled || !accordionConfig?.accordions?.length) {
    return []
  }

  const accordionSlots = {}
  accordionConfig.accordions.forEach((accordion) => {
    if (accordion.enabled && accordion.content) {
      const contentId = get(masterCustomAttributes, accordion.content)
      const contentData = contentAssetsDataFull[contentId]
      if (contentData) {
        accordionSlots[accordion.id] = {
          content: contentData,
          config: { device: 'All' },
        }
      }
    }
  })

  const parsedSlots = parseCMSContentSlots(accordionSlots, { siteId, viewport })

  // Process accordion items on server to avoid client-side computation on each render
  const accordionItems = []
  accordionConfig.accordions.forEach((accordion) => {
    if (!accordion.enabled) return

    const contentSlot = parsedSlots[accordion.id]
    if (!contentSlot?.content) return

    const isOnline = contentSlot.online?.default
    const markup = contentSlot.content.html
    if (!isOnline || !markup) return

    accordionItems.push({
      id: accordion.id,
      title:
        (isString(accordion.title) ? accordion.title : accordion.title?.[localeKey]) ||
        contentSlot.content.metaData?.title ||
        'Content Area',
      content: markup,
      openOnLoad: accordion.openOnLoad || false,
    })
  })

  return accordionItems
}

export default processAccordionContentAreas
