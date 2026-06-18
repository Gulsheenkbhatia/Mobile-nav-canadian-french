import { useCallback, useContext, useMemo } from 'react'
import BadgesContext from 'toro/components/badges/BadgesContext'
import usePreferenceGroup from 'toro/hooks/usePreferenceGroup'
import {
  getBadgeTypesListByArea,
  getContentIdByBadgeType,
  getSocialProofSlotContent,
} from 'toro/helpers/preferences'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'
import { badgesAtom } from 'store/badges.atom'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import { ProductForBadges } from 'toro/components/badges/types'

const BadgesProvider: React.FC = ({ children }) => {
  const { appData } = useContext(PWAContext)
  const siteId = useMemo(() => get(appData, 'siteId'), [appData])
  const badgingPreferences = usePreferenceGroup({ groupId: 'badging' })
  const badgingContentSlots = useAtomValue(badgesAtom)
  const { defaultLocale } = useIntl()

  const getContentByBadgeType = useCallback(
    ({ page, type, isBundleProduct, isSocialProofEnabled = false }) => {
      return getContentIdByBadgeType({
        page,
        type,
        badgingPreferences,
        isBundleProduct,
        siteId,
        isSocialProofEnabled,
      })
    },
    [badgingPreferences, siteId]
  )

  const getBadgeTypesByArea = useCallback(
    ({ page, area, isMobile, ...props }) => {
      return getBadgeTypesListByArea({
        page,
        area,
        badgingPreferences,
        siteId,
        isMobile,
        ...props,
      })
    },
    [badgingPreferences, siteId]
  )

  const getContentSlotBySlotId = useCallback(
    (slotId: string, product?: ProductForBadges): string => {
      const badgeContent = badgingContentSlots.find((slot) => get(slot, 'id') === slotId)
      // TODO use locale for needed content
      let slotContent =
        get(badgeContent, `c_body.${defaultLocale}.markup`) ||
        get(badgeContent, 'c_body.default.markup')
      if (slotId === 'only-few-left-badge-default' || slotId === 'only-few-left-badge-alternate') {
        const itemsLeft = get(product, 'inventory.ats', 0)
        if (itemsLeft === 0) {
          return ''
        }
        slotContent = slotContent?.replace(/\{0\}/gi, itemsLeft)
      }
      if (slotId === 'social-proof-badge-default') {
        slotContent = getSocialProofSlotContent(product, slotContent)
      }
      return slotContent
    },
    [badgingContentSlots, defaultLocale]
  )

  const context = useMemo(
    () => ({
      actions: {
        getContentByBadgeType,
        getBadgeTypesByArea,
        getContentSlotBySlotId,
      },
    }),
    [getContentByBadgeType, getBadgeTypesByArea, getContentSlotBySlotId]
  )

  return <BadgesContext.Provider value={context}>{children}</BadgesContext.Provider>
}

export default BadgesProvider
