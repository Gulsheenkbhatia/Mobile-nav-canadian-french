import React, { useEffect } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Sort from 'toro/components/list/Sort'
import ActiveFilters from 'toro/components/list/ActiveFilters'
import DesktopFiltersV3 from 'toro/components/list/Filters/DesktopFiltersV3'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { activeFiltersAtom, setLastAppliedFacetAtom } from 'store/search-results.atom'
import usePageType from 'toro/hooks/usePageType'
import { isPlpV3Atom } from 'store/plp.atom'

const getVariant = ({ isSRP, isPlpV3, isShopBy }: Record<string, boolean>) => {
  if (isSRP) return 'srp'
  if (isShopBy) return 'shopBy'
  if (isPlpV3) return 'plpV3'
  return undefined
}

function HorizontalFiltersBar() {
  const { isSRP, isShopBy } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const variant = getVariant({ isSRP, isPlpV3, isShopBy })
  const styles = useMultiStyleConfig('HorizontalFiltersBar', {
    variant,
  })
  const { isHeaderHidden } = useHeadroomAtom()
  const activeFilters = useAtomValue(activeFiltersAtom)

  const setLastVisitedFacet = useUpdateAtom(setLastAppliedFacetAtom)

  useEffect(() => {
    if (activeFilters?.length > 0) {
      setLastVisitedFacet()
    }
  }, [activeFilters?.length])

  return (
    <>
      <Box id="horizontal-filters-bar-top-edge" />
      <Box
        id="horizontal-filters-bar"
        sx={styles.horizontalFilterWrapper}
        position={isHeaderHidden ? 'sticky' : ''}
        data-qa={
          isHeaderHidden ? 'scroll_down_horizontal_filters_bar' : 'scroll_up_horizontal_filters_bar'
        }
      >
        <Box sx={styles.horizontalFilterContent}>
          <Flex sx={styles.filtersAndSortContainer}>
            <DesktopFiltersV3 variant={variant} />
            <Sort variant="desktopFilterV3" />
          </Flex>
        </Box>
      </Box>
      <Box sx={styles.horizontalFilterContent}>
        {activeFilters.length > 0 && <ActiveFilters styles={styles} showClearAll />}
      </Box>
      {!isShopBy && (
        <>
          <Box height="20px" />
          <Box sx={styles.bottomLine} position={isHeaderHidden ? 'sticky' : ''} />
        </>
      )}
    </>
  )
}

export default HorizontalFiltersBar
