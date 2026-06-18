import transformPreferences from 'toro/helpers/transformPreferences'
import { PreferenceGroupType, PreferencesAtomType } from 'store/preferences.atom'

const MOCK_SSR_API_PREFERENCES: PreferenceGroupType = {
  someGroupId_ONE: [{ id: 'somePrefIdOne', value: 'somePrefIdOne any value' }],
  someGroupId_TWO: [{ id: 'somePrefIdTwo', value: 'somePrefIdTwo any value' }],
  someGroupId_WITH_DISPLAY_VALUE: [{ id: 'somePrefId', value: true, displayValue: ['any', 'any'] }],
  invalidJSONPreferences: ['someInvalidGroupID'],
}

const MOCK_TRANSFORMED_PREFERENCES: PreferencesAtomType = {
  someGroupId_ONE: {
    somePrefIdOne: 'somePrefIdOne any value',
  },
  someGroupId_TWO: {
    somePrefIdTwo: 'somePrefIdTwo any value',
  },
  someGroupId_WITH_DISPLAY_VALUE: {
    somePrefId: true,
    somePrefIdDisplayValue: ['any', 'any'],
  },
}

describe('transformPreferences', () => {
  it('should transform from collection to nested object', () => {
    const result = transformPreferences(MOCK_SSR_API_PREFERENCES)

    expect(result).toEqual(MOCK_TRANSFORMED_PREFERENCES)
  })
})
