import { renderHook } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import useAEDrawer from './useAEDrawer'

jest.mock('jotai/utils')
jest.mock('toro/hooks/useViewportType')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/usePreference_new')

const mockedUseAtomValue = jest.mocked(useAtomValue)
const mockedUseViewportType = jest.mocked(useViewportType)
const mockedUseExperiment = jest.mocked(useExperiment)
const mockedUsePreference = jest.mocked(usePreference)

const enableAEDrawerExpAllValues = {
  adaptiveExperience: {
    enableAEDrawerExp: {
      PDP: { enable: true, recommenders: ['product1_rr'] },
      PLP: { recommenders: ['productlisting6_rr'] },
      brand: { desktop: true, mobile: true },
      subBrand: { desktop: true, mobile: true },
    },
  },
}

const enableAEDrawerExpPreferenceDisabled = {
  adaptiveExperience: {
    enableAEDrawerExp: {
      PDP: { enable: false, recommenders: ['product1_rr'] },
      PLP: { recommenders: ['productlisting6_rr'] },
      brand: { desktop: false, mobile: false },
      subBrand: { desktop: false, mobile: false },
    },
  },
}

const enableAEDrawerExpPreferenceDisabledForPDP = {
  adaptiveExperience: {
    enableAEDrawerExp: {
      PDP: { enable: false, recommenders: ['product1_rr'] },
      PLP: { recommenders: ['productlisting6_rr'] },
      brand: { desktop: true, mobile: true },
      subBrand: { desktop: true, mobile: true },
    },
  },
}

describe(__filename, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return null when the general values of the pref are on and specific PDP value is off', () => {
    mockedUseAtomValue.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true }))
    mockedUsePreference.mockImplementation(() => enableAEDrawerExpPreferenceDisabledForPDP)
    mockedUseExperiment.mockImplementation(() => true)
    let setAEDrawerConfig
    renderHook(() => {
      setAEDrawerConfig = useAEDrawer()
    })
    expect(setAEDrawerConfig).toBeNull()
  })

  it('should return a function when the preference is enabled and the experiment is enabled', () => {
    mockedUseAtomValue.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true }))
    mockedUseExperiment.mockImplementation(() => true)
    mockedUsePreference.mockImplementation(() => enableAEDrawerExpAllValues)
    let setAEDrawerConfig
    renderHook(() => {
      setAEDrawerConfig = useAEDrawer()
    })
    expect(setAEDrawerConfig).not.toBeNull()
  })

  it('should return null when the preference is off', () => {
    mockedUseAtomValue.mockImplementation(() => false)
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true }))
    mockedUsePreference.mockImplementation(() => enableAEDrawerExpPreferenceDisabled)
    mockedUseExperiment.mockImplementation(() => true)
    let setAEDrawerConfig
    renderHook(() => {
      setAEDrawerConfig = useAEDrawer()
    })
    expect(setAEDrawerConfig).toBeNull()
  })
})
