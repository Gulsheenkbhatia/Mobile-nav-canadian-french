import usePreference from 'toro/hooks/usePreference_new'
import { useIntroBrowserSession } from 'toro/hooks/useIntroBrowserSession'

export type AnchorTab = {
  id: string
  label: string
  enable: boolean
}

export const usePdpV7SessionAnchorNavState = () => {
  const { isFirstIntroBrowserSessionActive } = useIntroBrowserSession()
  const {
    pdpPreferences: {
      templateConfigs: {
        pdpv7: {
          enableAnchorNavs = false,
          anchorNavsforFirstSession = [],
          anchorNavsforRepeatedSession = [],
          anchorNavMinTabs = 2,
        } = {},
      } = {},
    },
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  const anchorNavsForSession = isFirstIntroBrowserSessionActive
    ? anchorNavsforFirstSession
    : anchorNavsforRepeatedSession
  const enabledAnchorNavs = anchorNavsForSession.filter((tab) => tab?.enable !== false)
  const shouldShowAnchorNav = enableAnchorNavs && enabledAnchorNavs.length >= anchorNavMinTabs

  return {
    anchorNavMinTabs,
    enabledAnchorNavs,
    shouldShowAnchorNav,
  }
}
