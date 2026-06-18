import { useCallback, useContext } from 'react'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import usePreference from 'toro/hooks/usePreference_new'
import MainContainer from 'toro/components/MainContainer'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useSearchState from 'toro/hooks/useSearchState'
import PWAContext from 'components/common/PWAContext'
import { useAtomValue } from 'jotai/utils'
import { isSWOutletAtom, isOneCoachTabbedAtom } from 'store/global.atom'
import useViewportType from 'toro/hooks/useViewportType'
import useExposedSearch from 'toro/hooks/useExposedSearch'

import HeaderCenterContent from 'toro/components/header/HeaderMainContent/HeaderCenterContent.tsx'
import HeaderLeftContent from 'toro/components/header/HeaderMainContent/HeaderLeftContent.tsx'
import HeaderRightContent from 'toro/components/header/HeaderMainContent/HeaderRightContent.tsx'

import SearchWidgetExposed from 'toro/components/SearchWidget/SearchWidgetExposed'
import usePageType from 'toro/hooks/usePageType'
import useOneCoachTabConfig from 'toro/hooks/useOneCoachTabConfig'
import { usePdpV7EntranceHeaderAnimation } from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation'

const HeaderMainContent = ({ setIsMiniCartRef, setIsHoveredOnMiniCart }) => {
  const { isDesktop } = useViewportType()
  const { isPDP } = usePageType()
  const analytics = useAnalytics()
  const { appData } = useContext(PWAContext)
  const initializeSearchState = useSearchState()
  const exposeMobileSearchBar = useExposedSearch()
  const { formatMessage } = useIntl()

  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isOneCoachTabbedHeaderActive = useAtomValue(isOneCoachTabbedAtom)

  const brand = get(appData, 'brand')
  const siteId = get(appData, 'siteId')
  const liveEventConfig = get(appData, 'liveStreamingData', {})
  const isReducedHeader = get(appData, 'isReducedHeaderAndFooter', false)

  const isOutlet = brand === 'coach-outlet'

  const {
    toggleSiteFeatures: { isStoreReplace = false },
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreference({
    ToggleSiteFeatures: ['isStoreReplace'],
    generalConfiguration: ['enableNewGlobalHeader'],
  })

  const { configuredTabColors } = useOneCoachTabConfig()
  const pdpV7EntranceHeaderSx = usePdpV7EntranceHeaderAnimation()

  const styles = useMultiStyleConfig('HeaderMainContentPage', {
    variant: enableNewGlobalHeader ? 'globalHeaderV2' : 'globalHeaderV1',
    configuredTabColors,
  })

  const onClick = useCallback((newtext) => {
    analytics.send('navClick', {
      eventLocation: 'utility',
      text: newtext,
    })
  }, [])

  const onStoresClick = useCallback(() => {
    onClick('store locator')
  }, [])

  const onWishlistClick = useCallback(() => {
    onClick(formatMessage({ id: 'header.navigation.wishlistTooltip', defaultMessage: 'Wishlist' }))
  }, [])

  return (
    <MainContainer>
      <Box w="100%" sx={styles.headerMainContentBox}>
        <Flex
          align="center"
          w="100%"
          sx={{
            ...styles.headerMainContentInnerBox(isOneCoachTabbedHeaderActive),
            ...pdpV7EntranceHeaderSx,
          }}
          className={isOneCoachTabbedHeaderActive && !isPDP ? 'one-tab-header' : ''}
        >
          {!isSWOutlet && !isReducedHeader && (
            <HeaderLeftContent
              styles={styles}
              isOutlet={isOutlet}
              onClick={onClick}
              onStoresClick={onStoresClick}
              isStoreReplace={isStoreReplace}
              enableNewGlobalHeader={enableNewGlobalHeader && !isDesktop}
              exposeMobileSearchBar={exposeMobileSearchBar}
              initializeSearchState={initializeSearchState}
            />
          )}

          {((!enableNewGlobalHeader && !isDesktop) || isDesktop) && (
            <HeaderCenterContent
              styles={styles}
              isSWOutlet={isSWOutlet}
              isReducedHeader={isReducedHeader}
            />
          )}

          {!isReducedHeader && (
            <HeaderRightContent
              isSWOutlet={isSWOutlet}
              siteId={siteId}
              styles={styles}
              initializeSearchState={initializeSearchState}
              onWishlistClick={onWishlistClick}
              onClick={onClick}
              liveEventConfig={liveEventConfig}
              setIsMiniCartRef={setIsMiniCartRef}
              setIsHoveredOnMiniCart={setIsHoveredOnMiniCart}
              enableNewGlobalHeader={enableNewGlobalHeader && !isDesktop}
              exposeMobileSearchBar={exposeMobileSearchBar}
            />
          )}
        </Flex>
      </Box>

      {exposeMobileSearchBar && (
        <SearchWidgetExposed initializeSearchState={initializeSearchState} />
      )}
    </MainContainer>
  )
}

export default HeaderMainContent
