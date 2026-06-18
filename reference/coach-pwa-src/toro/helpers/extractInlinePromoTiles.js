import get from 'lodash/get'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'

const extractInlinePromoTiles = (sapiData) => {
  const rawData = get(sapiData, 'inlinePromoTileJson')
  if (isString(rawData) && rawData.length > 0) {
    try {
      const parsedData = JSON.parse(rawData)
      if (isArray(parsedData)) {
        return parsedData
      } else {
        console.log('inlinePromoTileJson bad format after parsing.')
      }
    } catch (e) {
      console.log(`inlinePromoTileJson error ${e}`)
    }
    return []
  } else if (isArray(rawData)) {
    return rawData
  }
  return []
}

export default extractInlinePromoTiles
