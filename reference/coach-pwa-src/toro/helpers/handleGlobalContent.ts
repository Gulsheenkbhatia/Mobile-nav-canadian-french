import cheerio from 'toro/lib/cheerio'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

export default function ({ globalContent, ids }) {
  // sanitize the output
  const sanitizedFetchedAssets = sanitizeHtmlMarkup(globalContent)
  // load the sanitized output into cheerio
  const $ = cheerio.load(sanitizedFetchedAssets, null, false)

  const fetchedAssetsObject = {}
  ids.forEach((id) => {
    try {
      const elem = $(`[id='${id.replace(/\./g, '\\.')}']`) // If the ID has dot such as pdp-content-1.1, it will escape the dot
      const materialImagePath = elem.attr('materialimagepath') || ''
      const sustainableContentMaterial = elem.attr('sustainablecontentmaterial') || ''
      const metaData = elem.data()
      fetchedAssetsObject[id] = {
        _type: 'content_asset',
        id,
        online: { default: elem.attr('online') === 'true' },
        c_body: { default: { markup: elem.html() } },
        metaData,
        other_info: {
          c_materialImagePath: materialImagePath ? { default: materialImagePath } : undefined,
          c_sustainableContentMaterial: sustainableContentMaterial
            ? { default: sustainableContentMaterial }
            : undefined,
        },
        status: elem.attr('status') || '',
        error_message: elem?.attr('errormessage') || '',
      }
    } catch (error) {
      console.log('Error in parsing content asset id', error)
    }
  })
  return fetchedAssetsObject
}
