import { memo, useCallback } from 'react'
import Box from 'toro/components/Box'
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
import SortFilterButton from 'toro/components/SortDrawerMobile/SoftFilterButton'
import usePageType from 'toro/hooks/usePageType'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  isFiltersDrawerAnimationCompleteAtom,
  setRefinementsIdAtom,
} from 'store/search-results.atom'
import { isPlpV3Atom } from 'store/plp.atom'
import SortFilterControls from 'toro/components/SortDrawerMobile/SortFilterControls'
import { useLoadFilterComponents } from 'toro/components/list/Filters/FilterItem'

function SortDrawerMobile({ loading, variant }) {
  const analytics = useAnalytics()
  const theme = useTheme()
  const { isSRP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isSrpV3 = isPlpV3 && isSRP
  const styles = useMultiStyleConfig('SortDrawerMobile', {
    variant: variant || (isPlpV3 && 'plpV3'),
  })

  const setRefinementId = useUpdateAtom(setRefinementsIdAtom)
  const loadFilterComponents = useLoadFilterComponents()
  const setFiltersDrawerAnimationComplete = useUpdateAtom(isFiltersDrawerAnimationCompleteAtom)

  const { isMobileDrawerActive: isOpen, toggleMobileDrawer } = useHeadroomAtom({
    onMobileDrawerOpen: isPlpV3
      ? undefined
      : () => {
          analytics.send('openSortDrawer', {
            eventLocation: 'list page module',
            eventAction: 'expand menu',
            eventLabel: 'filter sort',
          })
        },
  })

  const handleOpen = useCallback(
    (options) => {
      toggleMobileDrawer(true)

      if (!isPlpV3) return

      analytics.send('openSortDrawer', {
        eventLocation: 'filter bar',
        eventAction: 'expand menu',
        eventLabel: options?.caption,
      })
    },
    [toggleMobileDrawer]
  )

  const handleClose = () => {
    setRefinementId('')
    toggleMobileDrawer(false)
    setFiltersDrawerAnimationComplete(false)
  }

  const onDrawerAnimationComplete = useCallback(() => {
    setFiltersDrawerAnimationComplete(true)
  }, [])

  return (
    <Box sx={styles.mainWrapper} id="sort-drawer-mobile" className={isSrpV3 ? 'search-result' : ''}>
      {isPlpV3 ? (
        <SortFilterControls
          styles={styles}
          loading={loading}
          handleOpen={handleOpen}
          isSrp={isSRP}
        />
      ) : (
        <SortFilterButton styles={styles} handleOpen={handleOpen} />
      )}
      <Drawer size="lg" isOpen={isOpen} placement="left" onClose={handleClose}>
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
            <SortDrawerContent styles={styles} loading={loading} onClose={handleClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default memo(SortDrawerMobile)
