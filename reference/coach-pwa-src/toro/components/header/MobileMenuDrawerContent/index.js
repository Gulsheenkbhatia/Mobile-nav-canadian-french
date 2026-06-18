import Box from 'toro/components/Box'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import MobileNavigation from 'toro/components/header/MobileNavigation'
import NavMobileContent from 'toro/components/header/NavMobileContent'
import CustomSlot from 'cms/components/CustomSlot'
import { Divider } from '@chakra-ui/react'
import useGlobalSlotAtomData from 'hooks/useGlobalSlotAtomData'
import usePreference from 'toro/hooks/usePreference'
import { useCallback, useContext, useEffect } from 'react'
import PWAContext from 'components/common/PWAContext'
import MobileMenuNavLinks from 'toro/components/header/MobileMenuNavLinks'
import ContentLinks from 'toro/components/footer/ContentLinks'
import PropTypes from 'prop-types'
import { dropActiveMobileMenuItemsAtom } from 'store/menu-data.atom'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { useAtom } from 'jotai'
import SearchWidget from 'toro/components/SearchWidget'
import {
  exposedSearchStatusAtom,
  isSearchInDrawerActiveAtom,
  isSearchV2EnabledAtom,
  isSearchV2InDrawerActiveAtom,
} from 'store/search.atom'
import usePreference_new from 'toro/hooks/usePreference_new'

const MobileMenuDrawerContent = ({ isOpen, onClose, styles }) => {
  const { appData } = useContext(PWAContext)
  const footerData = get(appData, 'footer')
  const siteId = get(appData, 'siteId')
  const liveEventConfig = get(appData, 'liveStreamingData')
  const [isSearchActive, setSearchState] = useAtom(isSearchInDrawerActiveAtom)
  const dropActiveMenuItems = useUpdateAtom(dropActiveMobileMenuItemsAtom)

  const navMobileContent = useGlobalSlotAtomData('nav-mobile-additional-content')
  const changeNavDrawerContentLinkPositionPrefValue = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'changeNavDrawerContentLinkPosition',
    siteId,
  })

  const {
    xgenPreferences: { searchV2Features },
  } = usePreference_new({
    xgenPreferences: ['searchV2Features'],
  })

  const isSearchV2InDrawerActive = useAtomValue(isSearchV2InDrawerActiveAtom)
  const isSearchV2Enabled = useAtomValue(isSearchV2EnabledAtom)
  const isExposedSearchActive = useAtomValue(exposedSearchStatusAtom)

  useEffect(() => {
    if (!isOpen) {
      setSearchState(false)
    }
  }, [isOpen])

  const closeNavigation = useCallback(() => {
    onClose?.()
    dropActiveMenuItems()
  }, [onClose])

  const toggleSearchState = useCallback(() => {
    setSearchState(!isSearchActive)
  }, [isSearchActive])

  const isNavSearchRedesignEnabled = get(searchV2Features, 'NavSearchRedesign', false)
  const navSearchRedesignVariant =
    isNavSearchRedesignEnabled && isExposedSearchActive
      ? 'mobileV2RedesignExposed'
      : 'mobileV2Redesign'

  const searchWidgetVariant = isNavSearchRedesignEnabled
    ? navSearchRedesignVariant
    : isSearchV2InDrawerActive
    ? 'mobileV2'
    : 'mobile'

  return (
    <Flex
      flexDirection="column"
      height="100%"
      paddingTop={isSearchV2InDrawerActive ? '0px' : undefined}
      overflowX="hidden"
    >
      <Box sx={styles.expendedNavbarContainer} flexGrow="1">
        <SearchWidget
          variant={searchWidgetVariant}
          onNavigation={closeNavigation}
          siteId={siteId}
          onSearchInputFocus={!isSearchV2InDrawerActive ? toggleSearchState : undefined}
          toRenderItems={isSearchActive}
          onMenuClose={toggleSearchState}
          liveEventConfig={liveEventConfig}
          hasAnimatedContainer={isSearchV2Enabled}
        />
        {!isSearchActive && <MobileNavigation onNavigation={closeNavigation} />}
      </Box>
      {!isSearchActive && (
        <>
          <NavMobileContent content={navMobileContent} />
          <Box
            sx={styles.menuMobileContentarea}
            style={{
              display: 'flex',
              flexDirection: changeNavDrawerContentLinkPositionPrefValue
                ? 'column-reverse'
                : 'column',
            }}
          >
            <CustomSlot
              content={get(footerData, 'contentSlots["nav-element-content-area"]')}
              Component={MobileMenuNavLinks}
            />
            <Divider sx={styles.contentDividerContainer} />
            <CustomSlot
              content={get(footerData, 'contentSlots["nav-drawer-content-link"]')}
              Component={ContentLinks}
              isMobileMenu
            />
          </Box>
        </>
      )}
    </Flex>
  )
}

MobileMenuDrawerContent.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  styles: PropTypes.object,
}

export default MobileMenuDrawerContent
