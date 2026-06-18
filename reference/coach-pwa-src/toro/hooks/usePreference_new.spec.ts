import { renderHook } from '@testing-library/react'
import usePreference from 'toro/hooks/usePreference_new'

// The usePreference hook is strongly typed, so we need to use existing group and preference IDs from the site-preferences.ts file.
// The type of the preference ID values don't have to match the real values.
const MOCK_TRANSFORMED_PREFERENCES = {
  Monetate: {
    monetateScriptUrl: 'https://example.com/monetate.js',
  },
  badging: {
    enableBadges: true,
    thresholdStarRating: 4.5,
    newArrivalInXDays: 30,
  },
  'Storefront Configs': {
    showQuickView: true,
    pdpAltImageCarouselThreshold: 5,
  },
  TrueFit: {
    enableTrueFit: true,
    enableTrueFitDisplayValue: ['Size Guide', 'Fit Recommendations'],
  },
}

jest.mock('store/preferences.atom', () => ({
  preferencesAtom: {
    read: jest.fn(() => MOCK_TRANSFORMED_PREFERENCES),
  },
}))

describe('usePreference', () => {
  it('get specific preference IDs from a preference group', () => {
    const { result } = renderHook(() =>
      usePreference({ badging: ['enableBadges', 'thresholdStarRating'] })
    )

    expect(result.current).toEqual({
      badging: {
        enableBadges: MOCK_TRANSFORMED_PREFERENCES.badging.enableBadges,
        thresholdStarRating: MOCK_TRANSFORMED_PREFERENCES.badging.thresholdStarRating,
      },
    })
  })

  it('get specific preference IDs from multiple preference groups', () => {
    const { result } = renderHook(() =>
      usePreference({
        Monetate: ['monetateScriptUrl'],
        badging: ['enableBadges', 'thresholdStarRating'],
      })
    )

    expect(result.current).toEqual({
      monetate: {
        monetateScriptUrl: MOCK_TRANSFORMED_PREFERENCES.Monetate.monetateScriptUrl,
      },
      badging: {
        enableBadges: MOCK_TRANSFORMED_PREFERENCES.badging.enableBadges,
        thresholdStarRating: MOCK_TRANSFORMED_PREFERENCES.badging.thresholdStarRating,
      },
    })
  })

  it('get all preference IDs from a preference group', () => {
    const { result } = renderHook(() => usePreference({ badging: '*' }))

    expect(result.current).toEqual({
      badging: {
        enableBadges: MOCK_TRANSFORMED_PREFERENCES.badging.enableBadges,
        thresholdStarRating: MOCK_TRANSFORMED_PREFERENCES.badging.thresholdStarRating,
        newArrivalInXDays: MOCK_TRANSFORMED_PREFERENCES.badging.newArrivalInXDays,
      },
    })
  })

  it('get specific preference IDs and display value if it presents', () => {
    const { result } = renderHook(() => usePreference({ TrueFit: ['enableTrueFit'] }))

    expect(result.current).toEqual({
      trueFit: {
        enableTrueFit: MOCK_TRANSFORMED_PREFERENCES.TrueFit.enableTrueFit,
        enableTrueFitDisplayValue: MOCK_TRANSFORMED_PREFERENCES.TrueFit.enableTrueFitDisplayValue,
      },
    })
  })

  it('transforms preference props group IDs to camelCase', () => {
    const { result } = renderHook(() => usePreference({ 'Storefront Configs': '*' }))

    expect(Object.keys(result.current)).toEqual(['storefrontConfigs'])
  })
})
