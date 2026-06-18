import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import get from 'lodash/get'

export type PickPreferenceOutput = { [key: string]: any }

export const preferenceReducer = (acc, curr) => {
  return Boolean(curr.id) ? { ...acc, [curr.id]: get(curr, 'value') } : acc
}

const filterById = (id: string | readonly string[]) => (pref) => {
  if (Array.isArray(id)) {
    return id.includes(pref.id)
  }
  if (isString(id)) {
    return id == pref.id
  }
  return false
}

const pickPreference = (
  id: { [key: string]: readonly string[] },
  preferences: object
): PickPreferenceOutput => {
  if (isPlainObject(preferences) && id) {
    const pickedPreferenceData = {}

    Object.entries(id).forEach(([groupId, preferenceIds]) => {
      const pickedPreferences = get(preferences, groupId, [])
      const pickedPreferenceObjects = preferenceIds
        ? pickedPreferences.filter(filterById(preferenceIds))
        : pickedPreferences
      pickedPreferenceData[groupId] = pickedPreferenceObjects.reduce(preferenceReducer, {})
    })

    return pickedPreferenceData
  }

  return {}
}

export default pickPreference
