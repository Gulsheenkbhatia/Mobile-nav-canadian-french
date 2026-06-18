import React, { useEffect, useRef, useContext, useMemo } from 'react'
import TotalCount from 'toro/components/listing/TotalCount'
import usePreference from 'toro/hooks/usePreference'
import PWAContext from 'components/common/PWAContext'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import useDisclosure from 'toro/hooks/useDisclosure'
import ActiveFilters from 'toro/components/list/ActiveFilters'
import Box from 'toro/components/Box'
import { Collapse } from '@chakra-ui/react'
import Button from 'toro/components/Button'
import Cookies from 'js-cookie'
import { TED_COLLAPSE_STATE } from 'toro/constants/cookies'
import Hidden from 'toro/components/Hidden'
import Skeleton from '../Skeleton'
import get from 'lodash/get'
import { filtersAtom, focusedFilteringAtom, totalProductsAtom } from 'store/search-results.atom'
import { useAtomValue } from 'jotai/utils'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { NavChevronDownIcon } from 'toro/icons'
import usePageType from 'toro/hooks/usePageType'
import { isPlpV3Atom, onModelAtom } from 'store/plp.atom'
import useExposedFilters from 'toro/hooks/useExposedFilters'

import Sort from 'toro/components/list/Sort'
import SortDrawerMobile from 'toro/components/SortDrawerMobile'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'

function CategoryHeader({ loading, ...props }) {
  const { isSRP } = usePageType()
  const { isDesktop, isMobile } = useViewportType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isSrpV3 = isSRP && isPlpV3
  const {
    isOpen: tedIsOpen,
    onToggle: tedOnToggle,
    onOpen: tedOnOpen,
    onClose: tedOnClose,
  } = useDisclosure({ id: 'ted' })
  const styles = useMultiStyleConfig('Listing', { variant: isPlpV3 && 'plpV3' })
  const hostRef = useRef()
  const firstUpdateRef = useRef(true)
  const filters = useAtomValue(filtersAtom)
  const total = useAtomValue(totalProductsAtom)
  const { hasTopDirectionScroll, showBanner } = useVerticalScrollDirection()
  const { bannerHeight, isHeaderHeight } = useHeadroomAtom()
  const { appData } = useContext(PWAContext)
  const isStickyFilterEnabled = usePreference({
    groupId: 'ToggleSiteFeatures',
    preferenceId: 'enableSitckyFilterSortOnPLP',
    siteId: get(appData, 'siteId'),
  })
  const onModel = useAtomValue(onModelAtom)
  const isOnModelPLPToggleEnabled = onModel.isOnModelPLPToggleEnabled

  const { isExposedFiltersEnabled } = useExposedFilters()

  const setTedStateToCookie = (boolean) => {
    Cookies.set(
      TED_COLLAPSE_STATE,
      JSON.stringify({
        isTedOpen: boolean,
      }),
      {
        expires: 3600,
      }
    )
  }
  const shouldDisplayMobileTabletActiveFilters =
    !isDesktop && filters && filters?.length > 0 && !isPlpV3
  const handleTedToggle = () => {
    tedOnToggle()
    setTedStateToCookie(!tedIsOpen)
  }

  useEffect(() => {
    if (filters && filters?.length > 0 && !firstUpdateRef.current) {
      tedOnOpen()
      setTedStateToCookie(true)
    } else {
      tedOnClose()
      if (firstUpdateRef.current) {
        firstUpdateRef.current = false
      }
    }
  }, [filters])

  useEffect(() => {
    const tedLastStateCookie = Cookies.get(TED_COLLAPSE_STATE)
    let parsedTedLastState
    if (tedLastStateCookie) {
      try {
        parsedTedLastState = JSON.parse(tedLastStateCookie)
      } catch (e) {
        console.error(e.message)
      }
    }

    let tedLastState
    if (parsedTedLastState) {
      tedLastState = parsedTedLastState.isTedOpen
      if (tedLastState) {
        tedOnOpen()
      } else {
        tedOnClose()
      }
    }
  }, [])

  const isStickyFilterSortEnabled = useMemo(
    () => isMobile && (isStickyFilterEnabled || isExposedFiltersEnabled),
    [isMobile, isExposedFiltersEnabled, isStickyFilterEnabled]
  )

  const styleForStickyFilterSort = {
    ...styles.stickyFilterSort(
      isStickyFilterSortEnabled,
      isHeaderHeight,
      bannerHeight,
      showBanner && hasTopDirectionScroll
    ),
  }

  let elementProps = { ...props.sx, ...styleForStickyFilterSort }
  if (isSrpV3) {
    elementProps = {
      p: 'var(--spacing-3)',
    }
  }
  if (isPlpV3) {
    elementProps = {}
  }

  // the pointer-events style fixes a bug with react-headroom which triggers element unpin when the
  // collapsible element's height changes

  // check if focused filtering is enabled
  const focusedFiltering = useAtomValue(focusedFilteringAtom)
  const isFocusedFilteringEnabled =
    useExperiment(EXPERIMENTS.FOCUSED_FILTERING) &&
    Boolean(focusedFiltering?.categoryID && focusedFiltering?.value)

  const isExposedOrFocusedFilteringEnabled = isExposedFiltersEnabled || isFocusedFilteringEnabled
  return (
    <Box
      ref={hostRef}
      id="product-category-header"
      width="100%"
      maxWidth="100%"
      sx={{
        ...styles.categoryHeader,
        ...elementProps,
        ...(isOnModelPLPToggleEnabled && styles.noBorderForModelToggle),
      }}
      pointerEvents={!isDesktop ? 'all' : null}
    >
      <Flex
        sx={
          isExposedOrFocusedFilteringEnabled
            ? styles.categoryHeaderFilterWrapperExposed
            : styles.categoryHeaderFilterWrapper
        }
      >
        {!isPlpV3 && (
          <Skeleton isLoaded={!loading}>
            <TotalCount variant="small" totalCount={total} />
          </Skeleton>
        )}
        {isDesktop && (
          <Box
            flexGrow={1}
            overflow="auto"
            mx="60px"
            mb="-m"
            data-qa="m_plpfltr_sctn_fltrorsrt_drawer"
            sx={styles.appliedFilterWrapper}
          >
            <ActiveFilters styles={styles} />
          </Box>
        )}
        {shouldDisplayMobileTabletActiveFilters && (
          <Button
            variant="icon-only"
            size="sm"
            ml="24px"
            onClick={handleTedToggle}
            sx={styles.labelToggleBtn}
          >
            <NavChevronDownIcon
              width="24"
              height="24"
              style={{
                transform: tedIsOpen ? 'rotate(-180deg)' : 'rotate(0)',
                transition: '0.2s transform ease',
              }}
              data-qa={
                tedIsOpen
                  ? 'm_plpfltr_icon_aplyd_fltr_up_arrow'
                  : 'm_plpfltr_icon_aplyd_fltr_down_arrow'
              }
            />
          </Button>
        )}
        <Hidden onNonDesktop>
          <Sort ml="auto" />
        </Hidden>
        <Hidden onDesktop width="100%">
          <SortDrawerMobile loading={loading} />
        </Hidden>
      </Flex>
      {shouldDisplayMobileTabletActiveFilters && (
        <Box mb="-m" mt="m" data-qa="m_plpfltr_sctn_fltrorsrt_drawer">
          <Collapse in={tedIsOpen} animateOpacity>
            <ActiveFilters styles={styles} />
          </Collapse>
        </Box>
      )}
    </Box>
  )
}

export default CategoryHeader
