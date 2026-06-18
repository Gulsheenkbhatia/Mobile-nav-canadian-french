import { renderHook } from 'test-utils/react'
import { Atom } from 'jotai'
import { preferencesAtom, PreferencesAtomType } from 'store/preferences.atom'
import useCoachUSNavDrawerFY26Enabled from './useCoachUSNavDrawerFY26Enabled'

const prefsWithToggle = (value: boolean | string): PreferencesAtomType => ({
  ToggleSiteFeatures: {
    enableCoachUSNavDrawerFY26: value,
  },
})

const renderWithPrefs = (
  siteId: string,
  prefs: PreferencesAtomType,
  overrides: Array<[Atom<unknown>, unknown]> = []
) =>
  renderHook(() => useCoachUSNavDrawerFY26Enabled(), {
    contexts: {
      PWAContext: { appData: { siteId } },
      JotaiProviderContext: new Map([[preferencesAtom, prefs], ...overrides]),
    },
  })

describe('useCoachUSNavDrawerFY26Enabled', () => {
  it('returns false when toggle is off on Coach US retail', () => {
    const { result } = renderWithPrefs('coh_us_rt', prefsWithToggle(false))
    expect(result.current).toBe(false)
  })

  it('returns false when toggle is on but site is not Coach US', () => {
    const { result } = renderWithPrefs('katespade_us_rt', prefsWithToggle(true))
    expect(result.current).toBe(false)
  })

  it('returns true when toggle is true and site is coh_us_rt', () => {
    const { result } = renderWithPrefs('coh_us_rt', prefsWithToggle(true))
    expect(result.current).toBe(true)
  })

  it('returns true when toggle is string true and site is coh_us_out', () => {
    const { result } = renderWithPrefs('coh_us_out', prefsWithToggle('true'))
    expect(result.current).toBe(true)
  })

  it('returns false when toggle is string false', () => {
    const { result } = renderWithPrefs('coh_us_rt', prefsWithToggle('false'))
    expect(result.current).toBe(false)
  })
})
