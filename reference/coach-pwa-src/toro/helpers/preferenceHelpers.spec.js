import {
  MOCKED_APP_PREFEERENCES,
  MOCKED_PREFERENCE_VALUES,
  MOCK_PREFERENCES_GROUPED,
  MOCK_PREFERENCE_RESPONSE,
} from 'mocks/preferences'
import { fetchPreferenceBundle, pickPreferenceBundle } from './preferenceHelpers'

const mockBundle = {
  ToggleSiteFeatures: ['isStoreReplace', 'DisplayMaterialInfoinProductTile'],
  powerReviews: ['isEnableUGCModalDetails'],
}

const mockRequest = { headers: { host: 'mock.com' } }

describe('pickPreferenceBundle', () => {
  it('picks preferences specified in a bundle from app preferences and returns their values', () => {
    const preferences = pickPreferenceBundle(mockBundle)(MOCKED_APP_PREFEERENCES)
    expect(preferences).toMatchObject(MOCKED_PREFERENCE_VALUES)
  })

  it('picks preferences specified in a bundle from app preferences and returns their values grouped', () => {
    const preferences = pickPreferenceBundle(mockBundle)(MOCKED_APP_PREFEERENCES, false)
    expect(preferences).toMatchObject(MOCK_PREFERENCES_GROUPED)
  })
})

describe('fetchPreferenceBundle', () => {
  it('fetches preferences specified in a bundle and returns their values', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: async () => MOCK_PREFERENCE_RESPONSE,
      })
    )
    const preferences = await fetchPreferenceBundle(mockBundle)(mockRequest)

    expect(preferences).toMatchObject(MOCKED_PREFERENCE_VALUES)
  })

  it('fetches preferences specified in a bundle and returns their values grouped', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: async () => MOCK_PREFERENCES_GROUPED,
      })
    )
    const preferences = await fetchPreferenceBundle(mockBundle)(mockRequest, false)
    expect(preferences).toMatchObject(MOCK_PREFERENCES_GROUPED)
  })
})
