import cheerio from 'toro/lib/cheerio'

/**
 * Parses combined global content HTML and extracts individual content slots by ID
 * @param globalContentData - Combined HTML content from fetchGlobalContent
 * @param slotIds - Array of slot IDs to extract
 * @returns Object with slot IDs as keys and their HTML content as values
 */
export const parseGlobalContentSlots = (
  globalContentData: string,
  slotIds: string[] = []
): Record<string, string> => {
  const emptySlots = slotIds.reduce<Record<string, string>>((acc, slotId) => {
    acc[slotId] = ''
    return acc
  }, {})

  if (!globalContentData) {
    return emptySlots
  }

  try {
    const $ = cheerio.load(globalContentData)
    const parsedSlots: Record<string, string> = {}

    slotIds.forEach((slotId) => {
      const element = $(`#${slotId}`)
      parsedSlots[slotId] = element.length ? $.html(element) : ''
    })

    return parsedSlots
  } catch (error) {
    console.error('Error parseGlobalContent Slots :', error, globalContentData, slotIds)
    return emptySlots
  }
}
