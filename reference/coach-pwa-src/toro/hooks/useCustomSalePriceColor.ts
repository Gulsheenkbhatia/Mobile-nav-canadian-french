import { useMemo } from 'react'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import { NavColorScheme } from 'toro/getColorSchemeVariables'

export type SalePriceColor = {
  enable: boolean
  PLP: {
    color: string
  }
  SRP: {
    color: string
  }
  SEARCH_SUGGESTION_FLYOUT: {
    black: {
      color: string
    }
    white: {
      color: string
    }
  }
  RECOMMENDATION_CONTAINER: {
    color: string
  }
}

type UseCustomCertonaSalePriceColorOptions = {
  isSearchSuggestionFlyout?: boolean
  isCertonaRecommendationContainer?: boolean
}

const useCustomSalePriceColor = ({
  isSearchSuggestionFlyout = false,
  isCertonaRecommendationContainer = false,
}: UseCustomCertonaSalePriceColorOptions = {}) => {
  const { isPLP, isSRP } = usePageType()

  const {
    generalConfiguration: { changeSalePriceColor },
    navFlyoutStylings: { chooseNavTheme },
  } = usePreferenceNew({
    generalConfiguration: ['changeSalePriceColor'],
    navFlyoutStylings: ['chooseNavTheme'],
  })

  const salePriceColor = changeSalePriceColor as SalePriceColor

  const navThemeColor = chooseNavTheme === NavColorScheme.dark ? 'black' : 'white'

  const customSalePriceColor = useMemo(() => {
    if (!salePriceColor?.enable) {
      return {}
    }

    if (isSearchSuggestionFlyout === true) {
      return { color: salePriceColor.SEARCH_SUGGESTION_FLYOUT[navThemeColor].color }
    }

    if (isCertonaRecommendationContainer === true) {
      return { color: salePriceColor.RECOMMENDATION_CONTAINER.color }
    }

    if (isSRP) {
      return { color: salePriceColor.SRP.color }
    }

    if (isPLP) {
      return { color: salePriceColor.PLP.color }
    }

    return { color: salePriceColor.RECOMMENDATION_CONTAINER.color }
  }, [salePriceColor, isPLP, isSRP, isSearchSuggestionFlyout])

  if (!changeSalePriceColor) {
    return {}
  }

  return customSalePriceColor
}

export default useCustomSalePriceColor
