import get from 'lodash/get'
import isArray from 'lodash/isArray'
import unionBy from 'lodash/unionBy'
import uniq from 'lodash/uniq'
import flattenDeep from 'lodash/flattenDeep'
import isEmpty from 'lodash/isEmpty'
import differenceBy from 'lodash/differenceBy'

function getVariantSlotContentIds(products) {
  const contentIds = []
  products.forEach((product) => {
    product?.variationGroup?.forEach((variation) => {
      variation?.badgeData?.marketingBadgeJson?.forEach?.((badge) => {
        contentIds.push(badge?.contentId)
      })
      variation?.badgeData?.marketingMessageJson?.forEach?.((badge) => {
        contentIds.push(badge?.contentId)
      })
    })
  })
  return contentIds
}

export function getNewContentSlotIds(badgingContentSlots = [], products) {
  if (!isArray(products) || products.length === 0) {
    return []
  }

  const existingSlotsIds = badgingContentSlots.map((slot) => slot.id)
  const variantSlotsIds = getVariantSlotContentIds(products)
  const allUsedSlotIds = products
    .reduce(
      (sum, product) => [
        ...sum,
        ...Object.values(get(product, 'marketingBadgeConf') || {}),
        ...Object.values(get(product, 'marketingMessageConf') || {}),
        ...Object.values(get(product, 'sourceCodeBadge') || {}),
        ...Object.values(get(product, 'sourceCodeMessage') || {}),
      ],
      []
    )
    .map((item) =>
      isArray(item) ? item.map(({ contentId }) => contentId) : get(item, 'contentId') || item
    )

  return uniq(flattenDeep([...allUsedSlotIds, ...variantSlotsIds])).filter(
    (slotId) => !isEmpty(slotId) && !existingSlotsIds.includes(slotId)
  )
}

export const mergeContentSlots = (left = [], right = []) => {
  const deltaRight = differenceBy(right, left, 'id')
  if (deltaRight.length === 0) {
    return left
  }
  return unionBy(left, right, 'id')
}
