import get from 'lodash/get'

function getVisibilityMap(
  masterCustomData,
  variationGroupsCustomData,
  variantsCustomData,
  masterId,
  attribute,
  fallbackAttribute
) {
  let obj = {}

  obj[masterId] = masterCustomData[attribute] || masterCustomData[fallbackAttribute]
  variationGroupsCustomData.forEach((variationGroup) => {
    obj[variationGroup?.color] = variationGroup[attribute] || variationGroup[fallbackAttribute]
  })
  variantsCustomData.forEach((variation) => {
    obj[variation?.ID] = variation[attribute] || variation[fallbackAttribute]
  })

  return obj
}

export function getVisibilityMapsForPrice(masterCustomInfo, masterId) {
  const masterCustomData = get(masterCustomInfo, '0', masterCustomInfo)
  const variationGroupsCustomData = get(masterCustomData, 'productData.variationGroup', [])
  const variantsCustomData = get(masterCustomData, 'productData.variant', [])

  return {
    hideComparablePriceMap: getVisibilityMap(
      masterCustomData,
      variationGroupsCustomData,
      variantsCustomData,
      masterId,
      'hideComparablePriceValue',
      'c_hideComparablePriceValue'
    ),
    hideDiscountedRateMap: getVisibilityMap(
      masterCustomData,
      variationGroupsCustomData,
      variantsCustomData,
      masterId,
      'hideDiscountRate',
      'c_hideDiscountRate'
    ),
  }
}
