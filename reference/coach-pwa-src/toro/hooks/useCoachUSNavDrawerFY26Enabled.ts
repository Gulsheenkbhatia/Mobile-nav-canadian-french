import { useContext, useMemo } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'

/** Coach flagship + Coach Outlet US retail sites (SFCC site IDs). */
const COACH_US_SITE_IDS = new Set(['coh_us_rt', 'coh_us_out'])

function isTruthySitePref(value: unknown): boolean {
  return value === true || value === 'true'
}

/**
 * FY26–27 mobile nav drawer body/footer layout (Figma: Nav Redesign FY26-27, node 781:24083).
 * Gated by ToggleSiteFeatures.enableCoachUSNavDrawerFY26 plus Coach US siteId.
 * SFCC must expose the toggle; defaults off when unset.
 */
export default function useCoachUSNavDrawerFY26Enabled(): boolean {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId', '') as string

  const preferenceGroups = usePreference({
    ToggleSiteFeatures: ['enableCoachUSNavDrawerFY26'],
  })

  return useMemo(() => {
    const toggleSiteFeatures = get(preferenceGroups, 'toggleSiteFeatures', {}) as Record<
      string,
      unknown
    >
    const enabled = isTruthySitePref(get(toggleSiteFeatures, 'enableCoachUSNavDrawerFY26'))
    return enabled && COACH_US_SITE_IDS.has(siteId)
  }, [preferenceGroups, siteId])
}
