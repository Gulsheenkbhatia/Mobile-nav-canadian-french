import get from 'lodash/get'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'

const findObjectWithKeyValue = (data, targetKey, targetValue) => {
  const keys = Object.keys(data || {})
  for (const key of keys) {
    const value = data?.[key]

    if (isPlainObject(value)) {
      const result = findObjectWithKeyValue(value, targetKey, targetValue)
      if (result) {
        return true
      }
    } else if (isString(value) && key === targetKey && value === targetValue) {
      return true
    }
  }

  return false
}

const getAvailableCustomerSegments = (customerSegments = [], valueCheck = '', isLoggedIn) =>
  customerSegments?.filter?.(
    (segmentItem) =>
      segmentItem?.IsActive &&
      !segmentItem?.ExcludeSegment &&
      (isLoggedIn ? true : get(segmentItem, 'Name') === valueCheck)
  ) || []

export const getActiveCustomerSegment = async (
  customerSegments,
  isLoggedIn,
  createEventData,
  shoppingGivesGuestCustomerSegment = ''
) => {
  const availableSegments = getAvailableCustomerSegments(
    customerSegments,
    shoppingGivesGuestCustomerSegment,
    isLoggedIn
  )

  for (const segment of availableSegments) {
    const { FrontEndPropertyName, FrontEndSource, SpecifiedValues } = segment || {}
    if (FrontEndSource === 0 && SpecifiedValues?.length) {
      // Exactly the way SG parses FrontEndSource === 0
      for (const value of SpecifiedValues)
        if (window?.[FrontEndPropertyName] === value) {
          return segment
        }
    } else if (FrontEndSource === 1) {
      const { getDataLayerInitializedData } = await import(
        'toro/analytics/clients/googleAnalyticsHelpers'
      )
      const dataLayerInitializedData = createEventData(getDataLayerInitializedData)
      if (
        dataLayerInitializedData &&
        (isLoggedIn
          ? findObjectWithKeyValue(dataLayerInitializedData, FrontEndPropertyName, '1')
          : findObjectWithKeyValue(dataLayerInitializedData, FrontEndPropertyName, '0'))
      ) {
        return segment
      }
    }
  }

  return null
}
