import { renderHook } from '@testing-library/react'
import useCustomSalePriceColor from 'toro/hooks/useCustomSalePriceColor'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue } from 'jotai/utils'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import type { SalePriceColor } from 'toro/hooks/useCustomSalePriceColor'

jest.mock('jotai/utils')
jest.mock('store/plp.atom')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/hooks/usePageType')

const changeSalePriceColorMockData: SalePriceColor = {
  enable: true,
  PLP: {
    color: '#d2d45b',
  },
  SRP: {
    color: '#5b6bd4',
  },
  SEARCH_SUGGESTION_FLYOUT: {
    black: {
      color: '#d05bd4',
    },
    white: {
      color: '#5fd45b',
    },
  },
  RECOMMENDATION_CONTAINER: {
    color: '#ed0e4a',
  },
}

describe('useCustomSalePriceColor', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return custom sale price color for certona container at homepage', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isHP: true,
      isPDP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() =>
      useCustomSalePriceColor({ isCertonaRecommendationContainer: true })
    )

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.RECOMMENDATION_CONTAINER.color,
    })
  })

  it('should return custom sale price color for certona container at plp', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: true,
      isSRP: false,
      isHP: false,
      isPDP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() =>
      useCustomSalePriceColor({ isCertonaRecommendationContainer: true })
    )

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.RECOMMENDATION_CONTAINER.color,
    })
  })

  it('should return custom sale price color for certona container at search page', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: true,
      isHP: false,
      isPDP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() =>
      useCustomSalePriceColor({ isCertonaRecommendationContainer: true })
    )

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.RECOMMENDATION_CONTAINER.color,
    })
  })

  it('should return custom dark sale price color for certona recommendations on mobile flyout', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: true,
      isSRP: false,
      isHP: false,
      isPDP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor({ isSearchSuggestionFlyout: true }))

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.SEARCH_SUGGESTION_FLYOUT.black.color,
    })
  })

  it('should return custom light sale price color for certona recommendations on mobile flyout', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: true,
      isSRP: false,
      isHP: false,
      isPDP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'lightThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor({ isSearchSuggestionFlyout: true }))

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.SEARCH_SUGGESTION_FLYOUT.white.color,
    })
  })

  it('should return custom sale price color for certona container at pdp', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isHP: false,
      isPDP: true,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() =>
      useCustomSalePriceColor({ isCertonaRecommendationContainer: true })
    )

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.RECOMMENDATION_CONTAINER.color,
    })
  })

  it('should not return a custom color if custom sale price is disabled', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isHP: false,
      isPDP: true,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: { ...changeSalePriceColorMockData, enable: false },
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor())

    expect(result.current).toEqual({})
  })

  it('should not return a custom color if custom sale price preference is not set', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: false,
      isHP: false,
      isPDP: true,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: undefined,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor())

    expect(result.current).toEqual({})
  })

  it('should return custom sale price color for price on product tile at search page', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isSRP: true,
      isHP: false,
      isPDP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor())

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.SRP.color,
    })
  })

  it('should return custom sale price color for price on product tile at plp', () => {
    const mockedUsePageType = usePageType as jest.MockedFn<typeof usePageType>
    mockedUsePageType.mockImplementation(() => ({
      isPLP: true,
      isSRP: false,
      isHP: false,
      isPDP: false,
      isRetailHP: false,
      isOutletHP: false,
      isSubHP: false,
      isProductPassport: false,
      isContentPage: false,
    }))

    const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
    mockedUseAtomValue.mockImplementation(() => true)

    const mockedUsePreferenceNew = usePreferenceNew as jest.MockedFn<typeof usePreferenceNew>
    mockedUsePreferenceNew.mockImplementation(() => ({
      generalConfiguration: {
        changeSalePriceColor: changeSalePriceColorMockData,
      },
      navFlyoutStylings: {
        chooseNavTheme: 'darkThemeNAV',
      },
      coachtopia: { coachtopiaHomeURL: '/' },
    }))

    const { result } = renderHook(() => useCustomSalePriceColor())

    expect(result.current).toEqual({
      color: changeSalePriceColorMockData.PLP.color,
    })
  })
})
