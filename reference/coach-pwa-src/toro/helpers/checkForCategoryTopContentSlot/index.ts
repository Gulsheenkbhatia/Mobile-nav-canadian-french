import cheerio from 'toro/lib/cheerio'

export function checkForCategoryTopContentSlot(html = '') {
  try {
    const $ = cheerio.load(html)
    const topContentCategory = $('#category_top_content_slot')

    if (topContentCategory?.length === 0) {
      return false
    }

    const content = String(topContentCategory?.text()).trim()
    return Boolean(content)
  } catch (error) {
    console.error('Error parsing Top Content HTML:', error)
    return false
  }
}
