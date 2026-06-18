import { useMemo } from 'react'
import { thinkPLPAtom, ThinkTemplateHeaderConfig } from 'store/think-plp.atom'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import usePageType from 'toro/hooks/usePageType'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import { isOneCoachTabbedAtom, isSubBrandActiveAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'

type PageTabColorsConfig = {
  active: {
    backgroundColor: string
    textColor: string
  }
  inActive: {
    backgroundColor: string
    textColor: string
  }
}

type UseOneCoachTabConfigResult = {
  configuredTabColors: PageTabColorsConfig | Record<string, never>
  utmLink: string
  isOutletSubCategory: boolean
}

type OneCoachTabConfig = {
  SubBrandTabColor?: {
    desktop: PageTabColorsConfig
    mobile: PageTabColorsConfig
  }
  HPTabColor?: {
    desktop: PageTabColorsConfig
    mobile: PageTabColorsConfig
  }
  PLPTabColor?: {
    mobile: PageTabColorsConfig
  }
}

const getConfiguredTabColors = (
  oneCoachTabConfig: OneCoachTabConfig,
  isOneCoachTabbedHeaderActive: boolean,
  isSubBrandActive: boolean,
  isHP: boolean,
  isPLP: boolean,
  isSRP: boolean,
  isContentPage: boolean,
  isMobile: boolean,
  isThinkPage: boolean,
  thinkPageHeaderConfig: ThinkTemplateHeaderConfig
): PageTabColorsConfig | Record<string, never> => {
  if (!isOneCoachTabbedHeaderActive) {
    return {}
  }

  if (isThinkPage && thinkPageHeaderConfig) {
    return get(thinkPageHeaderConfig, 'mobile', {})
  }

  if (isSubBrandActive) {
    return isHP || isPLP || isSRP || isContentPage
      ? get(oneCoachTabConfig, `SubBrandTabColor.${isMobile ? 'mobile' : 'desktop'}`, {})
      : {}
  }

  const tabType = isHP ? 'HPTabColor' : isPLP || isSRP || isContentPage ? 'PLPTabColor' : ''
  return get(oneCoachTabConfig, `${tabType}.${isMobile ? 'mobile' : 'desktop'}`, {})
}

const useOneCoachTabConfig = (): UseOneCoachTabConfigResult => {
  const {
    oneCoach: { oneCoachTabConfig = {} },
  } = usePreferenceNew({
    oneCoach: ['oneCoachTabConfig'],
  })
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const { isPLP, isHP, isSRP, isContentPage } = usePageType()
  const { isMobile } = useViewportType()
  const { isThinkPage, PLPTabColor: thinkPageHeaderConfig } = useAtomValue(thinkPLPAtom)
  const configuredTabColors = getConfiguredTabColors(
    oneCoachTabConfig,
    isOneCoachTabbedHeaderActive,
    isSubBrandActive,
    isHP,
    isPLP,
    isSRP,
    isContentPage,
    isMobile,
    isThinkPage,
    thinkPageHeaderConfig
  )
  return useMemo(
    () => ({
      configuredTabColors,
      utmLink: oneCoachTabConfig?.link?.trim() || '',
      isOutletSubCategory: oneCoachTabConfig?.isOutletSubCategory ?? false,
    }),
    [isPLP, isHP, isContentPage, isMobile, oneCoachTabConfig, isThinkPage, thinkPageHeaderConfig]
  )
}

export default useOneCoachTabConfig
