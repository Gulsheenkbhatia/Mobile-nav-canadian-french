import { memo, useCallback } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Drawer from 'toro/components/Drawer'
import DrawerBody from 'toro/components/DrawerBody'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import SortDrawerContent from 'toro/components/SortDrawerMobile/SortDrawerContent'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { useUpdateAtom } from 'jotai/utils'
import {
  isFiltersDrawerAnimationCompleteAtom,
  setRefinementsIdAtom,
  setExpandedAccordionRefinementsAtom,
} from 'store/search-results.atom'
import { useLoadFilterComponents } from 'toro/components/list/Filters/FilterItem'

function ShopBySortDrawer() {
  const analytics = useAnalytics()
  const theme = useTheme()
  const styles = useMultiStyleConfig('SortDrawerMobile', {
    variant: 'plpV3',
  })

  const setRefinementId = useUpdateAtom(setRefinementsIdAtom)
  const setExpandedAccordionRefinements = useUpdateAtom(setExpandedAccordionRefinementsAtom)
  const loadFilterComponents = useLoadFilterComponents()
  const setFiltersDrawerAnimationComplete = useUpdateAtom(isFiltersDrawerAnimationCompleteAtom)

  const { isMobileDrawerActive: isOpen, toggleMobileDrawer } = useHeadroomAtom({
    onMobileDrawerOpen: () => {
      analytics.send('openSortDrawer', {
        eventLocation: 'list page module', // TODO: update for ShopBy
        eventAction: 'expand menu',
        eventLabel: 'filter sort',
      })
    },
  })

  const handleClose = () => {
    setRefinementId('')
    toggleMobileDrawer(false)
    setFiltersDrawerAnimationComplete(false)
    setExpandedAccordionRefinements([])
  }

  const onDrawerAnimationComplete = useCallback(() => {
    setFiltersDrawerAnimationComplete(true)
  }, [])

  return (
    <Drawer size="lg" variant="default" isOpen={isOpen} placement="left" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent
        motionProps={{
          onAnimationStart: loadFilterComponents,
          onAnimationComplete: onDrawerAnimationComplete,
        }}
        maxWidth={`calc(100% - ${theme.space.xxl})`}
      >
        <DrawerCloseButton />
        <DrawerBody name="filtersDrawerWrapper" sx={styles.filtersDrawerWrapper}>
          <SortDrawerContent styles={styles} loading={false} onClose={handleClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default memo(ShopBySortDrawer)
