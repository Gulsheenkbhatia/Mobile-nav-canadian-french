import { renderHook } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import usePreference from 'toro/hooks/usePreference_new'
import { countryTabIndexAtom } from 'store/pdp.atom'
import { isSubBrandActiveAtom } from 'store/global.atom'

jest.mock('jotai/utils')

jest.mock('toro/hooks/usePreference_new')
const mockedUsePreference = jest.mocked(usePreference)
const mockedUseAtomValue = useAtomValue as any

const makeSetup = () => renderHook(() => useNeutralSizingData())

describe('useNeutralSizingData', () => {
  it('returns empty data when neutral sizing preferences are turned off', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isSubBrandActiveAtom) {
        return false
      }
    })
    mockedUsePreference.mockImplementation(() => {
      return {
        storefrontConfigs: {
          defaultSize: {
            brand: {
              isEnabled: false,
            },
          },
        },
      }
    })

    const { result } = makeSetup()
    expect(result.current).toEqual({
      isNeutralSizingEnabled: false,
      neutralSizingCountryTypes: [],
      selectedNeutralSizingCountry: undefined,
    })
  })

  it('returns valid data when neutral sizing preferences are turned on', () => {
    mockedUseAtomValue.mockImplementation((atom) => {
      if (atom === isSubBrandActiveAtom) {
        return false
      }
      if (atom === countryTabIndexAtom) {
        return 1
      }
    })
    mockedUsePreference.mockImplementation(() => {
      return {
        storefrontConfigs: {
          defaultSize: {
            brand: {
              isEnabled: true,
              sizeType: ['EU', 'JP'],
            },
          },
        },
      }
    })

    const { result } = makeSetup()
    expect(result.current).toEqual({
      isNeutralSizingEnabled: true,
      neutralSizingCountryTypes: ['EU', 'JP'],
      selectedNeutralSizingCountry: 'JP',
    })
  })
})
