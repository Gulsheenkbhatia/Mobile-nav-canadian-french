import type {
  PreferenceGroupType,
  PreferencesAtomGroupType,
  PreferencesAtomType,
} from 'store/preferences.atom'
import { PreferenceType } from 'store/preferences.atom'

const transformPreferences = (preferences: PreferenceGroupType = {}) => {
  return Object.entries(preferences).reduce<PreferencesAtomType>(
    (accPrefs, [groupId, groupValues]: [string, PreferenceType[]]) => {
      if (groupId === 'invalidJSONPreferences') {
        return accPrefs
      }

      accPrefs[groupId] = groupValues.reduce<PreferencesAtomGroupType>(
        (accGroups, { id, value, displayValue }) => {
          accGroups[id] = value

          if (displayValue) {
            accGroups[`${id}DisplayValue`] = displayValue
          }

          return accGroups
        },
        {}
      )
      return accPrefs
    },
    {}
  )
}

export default transformPreferences
