import React, { useEffect, useMemo, memo, useCallback } from 'react'
import get from 'lodash/get'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useTimeout from 'toro/hooks/useTimeout'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import useAnalytics from 'toro/analytics/useAnalytics'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import menuDataAtom, {
  activeMenuItemsAtom,
  setActiveMenuItemAtom,
  dropActiveMenuItemsAtom,
} from 'store/menu-data.atom'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import { isTransparentHeaderAtom } from 'store/headroom.atom'

import DesktopNavigationItem from 'toro/components/header/DesktopNavigationItem'
import DesktopNavigationSubCategories from 'toro/components/header/DesktopNavigation/DesktopNavigationSubCategories'

const DesktopNavigation = ({ siteId, isHeaderHidden }) => {
  const analytics = useAnalytics()
  const isTransparentHeader = useAtomValue(isTransparentHeaderAtom)
  const styles = useMultiStyleConfig('DesktopNavigation', { isTransparentHeader })

  const menuData = useAtomValue(menuDataAtom)
  const activeMenuItems = useAtomValue(activeMenuItemsAtom)
  const setActiveMenuItem = useUpdateAtom(setActiveMenuItemAtom)
  const dropActiveMenuItems = useUpdateAtom(dropActiveMenuItemsAtom)

  const activeT1Category = get(menuData, activeMenuItems.t1)
  const activeT2Category = get(menuData, activeMenuItems.t2)
  const activeT3Category = get(menuData, activeMenuItems.t3)

  const t1Categories = useMemo(
    () => getCategoriesByCgIds(menuData, menuData?.topCategories),
    [menuData]
  )
  const t2Categories = useMemo(
    () => getCategoriesByCgIds(menuData, activeT1Category?.subCategories),
    [menuData, activeMenuItems.t1]
  )
  const t3Categories = useMemo(
    () => getCategoriesByCgIds(menuData, activeT2Category?.subCategories),
    [menuData, activeMenuItems.t2]
  )

  const onT2MouseOver = useCallback((cgid) => {
    setActiveMenuItem({ tn: 2, cgid })
    setActiveMenuItem({ tn: 3, cgid: null })
  }, [])

  const onSelectT3Item = useCallback((cgid) => {
    setActiveMenuItem({ tn: 3, cgid })
  }, [])

  const { start: startSelectT3Item, clear: stopSelectT3Item } = useTimeout(onSelectT3Item, 300)

  const onT3MouseOver = useCallback((cgId) => {
    startSelectT3Item(cgId)
  }, [])

  const { start: startCloseMenuCountdown, clear: stopCloseMenuCountdown } = useTimeout(
    dropActiveMenuItems,
    500
  )

  const onT1MouseOver = useCallback(
    (cgid) => {
      setActiveMenuItem({ tn: 1, cgid })
      setActiveMenuItem({ tn: 2, cgid: null })
      stopCloseMenuCountdown()
    },
    [stopCloseMenuCountdown]
  )

  const onNavigation = useCallback((navigationItemData) => {
    dropActiveMenuItems()

    analytics.send('navClick', {
      eventLocation: 'header',
      navigationItemData,
    })
  }, [])

  useEffect(() => {
    dropActiveMenuItems()
  }, [isHeaderHidden, isTransparentHeader])

  return (
    <>
      <DesktopNavigationTier
        w="100%"
        zIndex="2"
        __css={styles.t1MenuContainer}
        position="relative"
        className="menu-tier-1"
      >
        <Flex justifyContent="center" w="100%" flexWrap="wrap">
          {t1Categories.map((data) => (
            <DesktopNavigationItem
              key={data.cgid}
              data={data}
              variant="tier1"
              onMouseOver={onT1MouseOver}
              onMouseOut={startCloseMenuCountdown}
              isActive={activeMenuItems.t1 === data.cgid}
              onNavigation={onNavigation}
            />
          ))}
        </Flex>
      </DesktopNavigationTier>
      {!!t2Categories?.length && (
        <DesktopNavigationSubCategories
          activeT1Category={activeT1Category}
          activeT2Category={activeT2Category}
          activeT3Category={activeT3Category}
          t2Categories={t2Categories}
          t3Categories={t3Categories}
          activeMenuItems={activeMenuItems}
          siteId={siteId}
          onNavigation={onNavigation}
          stopSelectT3Item={stopSelectT3Item}
          startCloseMenuCountdown={startCloseMenuCountdown}
          stopCloseMenuCountdown={stopCloseMenuCountdown}
          onT2MouseOver={onT2MouseOver}
          onT3MouseOver={onT3MouseOver}
        />
      )}
    </>
  )
}

const DesktopNavigationTier = withErrorBoundaryWrapper(Box)

export default withErrorBoundaryWrapper(memo(DesktopNavigation))
