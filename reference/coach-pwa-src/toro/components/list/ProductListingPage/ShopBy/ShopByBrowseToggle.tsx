import { useMultiStyleConfig } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { isShopByBrowseAllEnabledAtom } from 'store/plp.atom'
import get from 'lodash/get'
import {
  setSearchResultsReloadingAtom,
  activeFiltersAtom,
  setFiltersAtom,
} from 'store/search-results.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'

type ShopByBrowseToggleProps = {
  targetRefinement?: {
    id: string
    name: string
  }
  displayLabel?: string
}

export default function ShopByBrowseToggle({
  targetRefinement,
  displayLabel,
}: ShopByBrowseToggleProps) {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('ShopByProductListingPage')
  const [isViewAll, setIsViewAll] = useAtom(isShopByBrowseAllEnabledAtom)
  const setSearchResultsReloading = useUpdateAtom(setSearchResultsReloadingAtom)
  const setFilters = useUpdateAtom(setFiltersAtom)
  const activeFilters = useAtomValue(activeFiltersAtom)
  const label = displayLabel || get(targetRefinement, 'name')
  const targetRefinementId = get(targetRefinement, 'id')

  function handleClickBrowseByCategory() {
    if (isViewAll && activeFilters.some((filter) => filter.id === targetRefinementId)) {
      setFilters([])
    }

    setIsViewAll(false)
    setSearchResultsReloading(true)
    analytics.send('listInteraction', {
      eventLocation: 'header',
      eventAction: 'toggle list click',
      eventLabel: 'Browse by Category',
    })
  }

  function handleClickBrowseAll() {
    setIsViewAll(true)
    analytics.send('listInteraction', {
      eventLocation: 'header',
      eventAction: 'toggle list click',
      eventLabel: 'Browse All',
    })
  }

  return (
    <Box sx={styles.toggleContainerWrapper}>
      <Box sx={styles.toggleContainer}>
        <Text
          className={isViewAll ? '' : 'active'}
          sx={styles.toggleLink}
          onClick={handleClickBrowseByCategory}
          data-qa="browseByCategories"
        >
          Browse by {label}
        </Text>
        <Text
          className={isViewAll ? 'active' : ''}
          sx={styles.toggleLink}
          onClick={handleClickBrowseAll}
          data-qa="browseAll"
        >
          Browse All
        </Text>
      </Box>
    </Box>
  )
}
