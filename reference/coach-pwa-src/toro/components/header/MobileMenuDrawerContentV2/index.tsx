import React, { useMemo, useCallback, useEffect, useContext, useState } from 'react'
import PWAContext from 'components/common/PWAContext'
import { SystemStyleObject, Accordion } from '@chakra-ui/react'
import Flex from 'toro/components/Flex'
import MobileMenuDrawerContentFooterV2 from 'toro/components/header/MobileMenuDrawerContentFooterV2'
import TierOneMobileCategories from 'toro/components/header/MobileMenuDrawerContentV2/TierOneMobileCategories'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import menuDataAtom, {
  selectedMobileItemAtom,
  setActiveMobileMenuItemAtom,
  activeMobileMenuItemsAtom,
} from 'store/menu-data.atom'
import get from 'lodash/get'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import { useRouter } from 'next/router'
import TierTwoMobileCategory from 'toro/components/header/MobileMenuDrawerContentV2/TierTwoMobileCategory'
import type Category from 'toro/types/categoryTypes'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getDataQa } from 'toro/components/header/MobileMenuDrawerContentV2/helpers'
import Portal from 'toro/components/Portal'
import NavFlyoutPromoContentCoachtopia from 'toro/components/header/MobileMenuDrawerContentV2/NavFlyoutPromoContentCoachtopia'
import usePreference from 'toro/hooks/usePreference_new'
import { NavColorScheme } from 'toro/getColorSchemeVariables'
import useReInitMenuItems from 'toro/hooks/useReInitMenuItems'

import SearchWidget from 'toro/components/SearchWidget'
import {
  exposedSearchStatusAtom,
  isSearchInDrawerActiveAtom,
  isSearchV2EnabledAtom,
} from 'store/search.atom'
import { useAtom } from 'jotai'
import { useIntl } from 'react-intl'
import MobileMenuTabs from 'toro/components/header/MobileMenuTabs'
import useSearchState from 'toro/hooks/useSearchState'
import useCoachUSNavDrawerFY26Enabled from 'toro/hooks/useCoachUSNavDrawerFY26Enabled'

type MobileMenuDrawerContentV2Props = {
  isOpen: boolean
  onClose: () => void
  styles: Record<string, SystemStyleObject>
  activeT1ItemRef: React.RefObject<HTMLDivElement>
}

const MobileMenuDrawerContentV2 = ({
  isOpen,
  onClose,
  styles,
  activeT1ItemRef,
}: MobileMenuDrawerContentV2Props) => {
  const { appData } = useContext(PWAContext)
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const menuData = useAtomValue(menuDataAtom)
  const activeMenuItems = useAtomValue(activeMobileMenuItemsAtom)
  const setSelectedMobileItem = useUpdateAtom(selectedMobileItemAtom)
  const { push } = useRouter()
  const [footerElementHeight, setFooterElementHeight] = useState(0)
  const onMountFooter = useCallback((currentRef) => {
    setFooterElementHeight(currentRef?.offsetHeight ?? 0)
  }, [])
  const {
    xgenPreferences: { searchV2Features },
  } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })

  const setActiveMenuItem = useUpdateAtom(setActiveMobileMenuItemAtom)
  useReInitMenuItems()

  const [isSearchActive, setSearchState] = useAtom(isSearchInDrawerActiveAtom)
  const isExposedSearchActive = useAtomValue(exposedSearchStatusAtom)
  const isSearchV2Enabled = useAtomValue(isSearchV2EnabledAtom)
  const initializeSearchState = useSearchState()
  const isFY26Drawer = useCoachUSNavDrawerFY26Enabled()
  const getSubCategoriesByCgid = useCallback(
    (cgid) => getCategoriesByCgIds(menuData, menuData[cgid]?.subCategories) as Category[],
    [menuData]
  )
  const {
    navFlyoutStylings: { chooseNavTheme },
    oneCoach: { oneCoachTabConfig = {} },
  } = usePreference({
    navFlyoutStylings: ['chooseNavTheme'],
    oneCoach: ['oneCoachTabConfig'],
  })
  // TODO: Remove this once we have a proper solution for the dark/gray theme in the search v2 redesign
  const isDarkNavTheme =
    chooseNavTheme === NavColorScheme.dark && !searchV2Features?.NavSearchRedesign
  const activeT1Category = get(menuData, activeMenuItems.t1 || menuData?.topCategories?.[0])
  const t1Categories = useMemo(
    () => getCategoriesByCgIds(menuData, menuData?.topCategories) as Category[],
    [menuData]
  )
  const t2Categories = useMemo(
    () => getCategoriesByCgIds(menuData, activeT1Category?.subCategories || []) as Category[],
    [menuData, activeMenuItems.t1]
  )

  const t2CategoriesWithSubCategories = useMemo(
    () => t2Categories.filter((category) => category?.subCategories?.length > 0),
    [t2Categories]
  )

  const activeT2Index = useMemo(
    () => t2CategoriesWithSubCategories.findIndex((data) => data.cgid === activeMenuItems.t2),
    [t2CategoriesWithSubCategories, activeMenuItems.t2]
  )

  const onClickT1 = useCallback(
    (cgid: string, closeMenu: boolean = false, name) => {
      setActiveMenuItem({ tn: 1, cgid })
      setActiveMenuItem({ tn: 2, cgid: null })
      analytics.send('navClick', {
        eventLocation: 'header',
        text: name,
      })
      closeMenu && onClose()
    },
    [onClose, setActiveMenuItem, analytics]
  )

  const handleNavigation = useCallback(
    async (
      e: any,
      url: string,
      cgid: string,
      data: { parentCategoryTree: { cgid: string; name: string }[] },
      name?: string
    ) => {
      setSelectedMobileItem({ cgid, url })
      e?.preventDefault()
      onClose()
      push(url)
      analytics.send('navClick', {
        eventLocation: 'header',
        text: name,
        navigationItemData: data,
      })
    },
    [onClose, push, setSelectedMobileItem, analytics]
  )

  const handleAccordionChange = useCallback(
    (index: number) => {
      setActiveMenuItem({ tn: 2, cgid: get(t2CategoriesWithSubCategories, `${index}.cgid`) })
    },
    [setActiveMenuItem, t2CategoriesWithSubCategories]
  )

  useEffect(() => {
    if (!isOpen) {
      setSearchState(false)
    }
  }, [isOpen])

  const closeSearchState = useCallback(() => {
    setSearchState(false)
  }, [])

  const openSearchState = useCallback(() => {
    initializeSearchState()
    setSearchState(true)
  }, [initializeSearchState])

  const liveEventConfig = get(appData, 'liveStreamingData')
  const isNavSearchRedesignEnabled = get(searchV2Features, 'NavSearchRedesign', false)
  const navSearchRedesignVariant =
    isNavSearchRedesignEnabled && isExposedSearchActive
      ? 'mobileV2RedesignExposed'
      : 'mobileV2Redesign'
  return (
    <>
      {!isSearchActive && <MobileMenuTabs onClose={onClose} />}
      <Flex
        flexDirection="column"
        height="100%"
        paddingTop={isSearchActive && isSearchV2Enabled ? '0px' : '10px'}
        overflowX={isSearchActive && isSearchV2Enabled ? 'hidden' : 'unset'}
      >
        <SearchWidget
          variant={isNavSearchRedesignEnabled ? navSearchRedesignVariant : 'mobileV2'}
          onNavigation={onClose}
          onSearchInputFocus={openSearchState}
          toRenderItems={isSearchActive}
          onMenuClose={closeSearchState}
          liveEventConfig={liveEventConfig}
          hasAnimatedContainer={isSearchV2Enabled}
          placeholder={formatMessage({
            id: 'header.navigation.search',
            defaultMessage: 'Search',
          })}
        />

        <Flex flexDirection="column" display={isSearchActive ? 'none' : null} flex={1}>
          <TierOneMobileCategories
            onClickT1={onClickT1}
            styles={styles}
            t1Categories={t1Categories}
            t1ActiveCgid={activeMenuItems.t1}
            isDarkNavTheme={isDarkNavTheme}
            isSubBrandEnabled={appData?.isSubBrandEnabled}
            isOneCoachTabEnabled={oneCoachTabConfig?.enable === 'true'}
            activeT1ItemRef={activeT1ItemRef}
            isFY26Drawer={isFY26Drawer}
          />
          <Flex flexDirection="column" justifyContent="space-between" flex={1}>
            <Flex
              flexDirection="column"
              sx={styles.accordionWrapper}
              data-qa={getDataQa('allMenuContainer', 2)}
              mb={footerElementHeight}
            >
              {activeT1Category?.isCoachtopiaRootCategory && activeT1Category?.flyoutContent ? (
                <NavFlyoutPromoContentCoachtopia
                  content={activeT1Category.flyoutContent}
                  url={activeT1Category.url}
                  styles={styles}
                  onClose={onClose}
                />
              ) : null}
              <Accordion
                sx={styles.accordion}
                allowToggle
                index={[activeT2Index]}
                onChange={handleAccordionChange}
              >
                {t2Categories.map((category) => (
                  <TierTwoMobileCategory
                    key={category.cgid}
                    handleNavigation={handleNavigation}
                    styles={styles}
                    t2Category={category}
                    getSubCategoriesByCgid={getSubCategoriesByCgid}
                    isDarkNavTheme={isDarkNavTheme}
                    isFY26Drawer={isFY26Drawer}
                  />
                ))}
              </Accordion>
            </Flex>
            {isOpen && (
              <Portal appendToParentPortal>
                <MobileMenuDrawerContentFooterV2
                  onMount={onMountFooter}
                  styles={styles}
                  isFY26Drawer={isFY26Drawer}
                />
              </Portal>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default MobileMenuDrawerContentV2
