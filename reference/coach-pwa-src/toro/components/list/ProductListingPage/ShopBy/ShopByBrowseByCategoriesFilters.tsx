import { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import FilterIcon from '@tapestry-inc/design-tokens/coach/icon/navigation/filter-and-sort.svg'
import KSFilterIcon from '@tapestry-inc/design-tokens/kate-spade/icon/navigation/filter-and-sort.svg'
import FilterItemV3 from 'toro/components/list/Filters/DesktopFiltersV3/FilterItemV3'
import { useRouter } from 'next/router'
import ScrollableContent from 'toro/components/ScrollableContent'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ShopBySortDrawer from './ShopBySortDrawer'
import {
  activeFiltersAtom,
  setExpandedAccordionRefinementsAtom,
  setRefinementsIdAtom,
} from 'store/search-results.atom'
import { useRefinementsToRender } from 'toro/hooks/useRefinementsToRender'
import ActiveFiltersV2 from 'toro/components/list/ActiveFiltersV2'
import useAnalytics from 'toro/analytics/useAnalytics'
import get from 'lodash/get'
import SortFilterControls from 'toro/components/SortDrawerMobile/SortFilterControls'
import SortFilterButton from 'toro/components/SortDrawerMobile/SoftFilterButton'
import {
  isPlpV3Atom,
  isShopByBrowseAllEnabledAtom,
  isShopByStickyFiltersEnabledAtom,
} from 'store/plp.atom'
import useVerticalScrollDirection from 'toro/hooks/useVerticalScrollDirection'
import useIsKS from 'toro/helpers/isKS'

const ShopByBrowseByCategoriesFilters = ({ exposedFilterConfigs, loading }) => {
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const { toggleMobileDrawer } = useHeadroomAtom()
  const router = useRouter()
  const setExpandedAccordionRefinements = useUpdateAtom(setExpandedAccordionRefinementsAtom)
  const setRefinementId = useUpdateAtom(setRefinementsIdAtom)
  const activeFilters = useAtomValue(activeFiltersAtom)
  const isShopByBrowseAllEnabled = useAtomValue(isShopByBrowseAllEnabledAtom)
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const { hasTopDirectionScroll } = useVerticalScrollDirection()
  const setIsShopByStickyFiltersEnabled = useUpdateAtom(isShopByStickyFiltersEnabledAtom)
  const isKateSpade = useIsKS()
  const Icon = isKateSpade ? KSFilterIcon : FilterIcon

  const hideExposedFilters = get(exposedFilterConfigs, 'hide', false)
  const allowedRefinements = get(exposedFilterConfigs, 'filters', [])

  const refinementsToRender = useRefinementsToRender({
    routerAsPath: router.asPath,
    routerQuery: router.query,
    allowedRefinements,
  })

  const hasExposedFilters = !hideExposedFilters && !!refinementsToRender?.length

  const shopByStyles = useMultiStyleConfig('ShopByProductListingPage', {
    hasExposedFilters,
  })
  const styles = useMultiStyleConfig('SortDrawerMobile', {
    variant: 'shopByBrowseAll',
  })

  useEffect(() => {
    setIsShopByStickyFiltersEnabled(hasExposedFilters)
  }, [hasExposedFilters])

  const onFilterItemClick = useCallback(
    (refinementId) => {
      analytics.send('listInteraction', {
        eventLocation: 'filter bar',
        eventAction: 'expand menu',
        eventLabel: refinementsToRender?.find((refinement) => refinement.id === refinementId)?.name,
      })
      setExpandedAccordionRefinements([refinementId])
      setRefinementId(refinementId)
      toggleMobileDrawer(true)
    },
    [refinementsToRender]
  )

  function handleClickFilterSort(options) {
    toggleMobileDrawer(true)

    if (!isPlpV3) return

    analytics.send('openSortDrawer', {
      eventLocation: 'filter bar',
      eventAction: 'expand menu',
      eventLabel: options?.caption,
    })
  }

  return (
    <Box
      sx={{
        ...shopByStyles.sortFilterContainer,
        ...(hasTopDirectionScroll && {
          position: 'relative',
          top: 'auto',
        }),
      }}
      id="shop-by-browse-by-categories-filters"
    >
      <Box id="sort-drawer-mobile" sx={styles.mainWrapper}>
        <ShopBySortDrawer />
        {isShopByBrowseAllEnabled ? (
          <>
            {isPlpV3 ? (
              <SortFilterControls
                styles={styles}
                loading={loading}
                handleOpen={handleClickFilterSort}
                isSrp={false}
              />
            ) : (
              <SortFilterButton styles={styles} handleOpen={handleClickFilterSort} />
            )}
          </>
        ) : (
          <>
            <Flex alignItems="center" gap="2">
              <Box sx={shopByStyles.sortFilterControls}>
                <Button
                  onClick={handleClickFilterSort}
                  sx={shopByStyles.mobileFilterButton}
                  data-qa="m_plpfltr_btn_fltr"
                >
                  <Icon width="16px" height="16px" />
                  <Box as="span" sx={shopByStyles.filterButtonText}>
                    {formatMessage({
                      id: 'plp.filter.filterlabelMobile',
                      defaultMessage: 'Filter/Sort',
                    })}
                  </Box>
                </Button>
              </Box>
              {hasExposedFilters && (
                <ScrollableContent wrapperStyles={{ gap: 'var(--spacing-2)' }}>
                  {refinementsToRender.map((refinement) => (
                    <FilterItemV3
                      key={refinement.id}
                      refinement={refinement}
                      styles={shopByStyles}
                      onClick={onFilterItemClick}
                      isSelected={false}
                    />
                  ))}
                </ScrollableContent>
              )}
            </Flex>
            {activeFilters?.length > 0 && (
              <Box mx="var(--spacing-3)" flexGrow={1} overflow="auto">
                <ActiveFiltersV2 styles={styles} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default ShopByBrowseByCategoriesFilters
