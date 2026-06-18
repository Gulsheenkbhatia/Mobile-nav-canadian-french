import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { useIntl } from 'react-intl'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  activeFiltersAtom,
  currentSortAtom,
  defaultSortAtom,
  filtersAtom,
  searchResultsReloadingAtom,
  setRefinementsIdAtom,
  setSortingRuleAtom,
  sortOptionsAtom,
  totalProductsAtom,
  focusedFilteringAtom,
} from 'store/search-results.atom'
import useExposedFilters from 'toro/hooks/useExposedFilters'
import Skeleton from 'toro/components/Skeleton'
import TotalCount from 'toro/components/listing/TotalCount'
import Box from 'toro/components/Box'
import { useRouter } from 'next/router'
import usePreference from 'toro/hooks/usePreference_new'
import { NavChevronDownIcon } from 'toro/icons'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import ActiveFilters from 'toro/components/list/ActiveFiltersV2'
import useAnalytics from 'toro/analytics/useAnalytics'
import { isPlpV3Atom, onModelAtom } from 'store/plp.atom'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import ExposedFiltersContainer from 'toro/components/ExposedFilters/ExposedFiltersContainer'
import FocusedFiltersContainer from 'toro/components/FocusedFiltering/FocusedFiltersContainer'
import { useRefinementsToRender } from 'toro/hooks/useRefinementsToRender'
import OnModelToggle from 'toro/components/listing/OnModelToggle'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

const SortFilterButton = ({ styles, handleClick, formatMessage, isExposedFiltersEnabled }) => {
  const { FilterIcon } = styles

  return (
    <Flex
      sx={{
        ...styles.mobileFilterButton,
        ...(isExposedFiltersEnabled ? { mr: '0px' } : {}),
      }}
      alignItems="center"
      name="mobileFilterButton"
      onClick={handleClick}
      data-qa="m_plpsrt_rdobtn_srtby"
    >
      <FilterIcon height="16px" width="16px" />
      <Text
        key="filterButtonText"
        sx={styles.filterButtonText}
        alignItems="center"
        data-qa="m_plpfltr_btn_fltrorsrt"
      >
        {formatMessage({ id: 'plp.filter.filterlabelMobile', defaultMessage: 'Filter/Sort' })}
      </Text>
    </Flex>
  )
}

function SortFilterControls({ styles, loading, handleOpen, isSrp }) {
  const { formatMessage } = useIntl()
  const { isExposedFiltersEnabled } = useExposedFilters()
  const onModel = useAtomValue(onModelAtom)
  const focusedFiltering = useAtomValue(focusedFilteringAtom)
  const isOnModelPLPToggleEnabled = onModel.isOnModelPLPToggleEnabled
  const isFocusedFilteringEnabled =
    useExperiment(EXPERIMENTS.FOCUSED_FILTERING) &&
    Boolean(focusedFiltering?.categoryID && focusedFiltering?.value)
  const isExposedOrFocusedFilteringEnabled = isExposedFiltersEnabled || isFocusedFilteringEnabled
  const filters = useAtomValue(filtersAtom)
  const sortOptions = useAtomValue(sortOptionsAtom)
  const currentSort = useAtomValue(currentSortAtom)
  const defaultSort = useAtomValue(defaultSortAtom)
  const setSort = useUpdateAtom(setSortingRuleAtom)
  const setReloading = useUpdateAtom(searchResultsReloadingAtom)
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const activeFilters = useAtomValue(activeFiltersAtom)
  const {
    plpTemplateConfigurations: { sortTypeId = '' },
  } = usePreference({
    plpTemplateConfigurations: ['sortTypeId'],
  })
  const total = useAtomValue(totalProductsAtom)
  const setRefinementId = useUpdateAtom(setRefinementsIdAtom)
  const analytics = useAnalytics()

  const filterOptionsRef = useRef(null)
  const router = useRouter()
  const refinementsToRender = useRefinementsToRender({
    routerAsPath: router.asPath,
    routerQuery: router.query,
  }).slice(0, 2)

  const handleFilterSortClick = () => {
    handleOpen({ caption: 'filter sort' })
  }

  const handleClickOption = (filterOptionId, caption) => () => {
    setRefinementId(filterOptionId)
    handleOpen({ caption })
  }

  useEffect(() => {
    if (filterOptionsRef.current) {
      filterOptionsRef.current.scrollTo({
        behavior: 'smooth',
        left: 0,
      })
    }
  }, [refinementsToRender])

  const sortOption = useMemo(() => {
    return (
      sortOptions.find((option) => option.code === sortTypeId) ||
      sortOptions.find((option) => option.code === defaultSort)
    )
  }, [sortTypeId, sortOptions, defaultSort])

  const handleClickSortOption = useCallback(() => {
    const configuredSortOption = sortOptions.find((option) => option.code === sortTypeId)
    const currentSortOption = sortOptions.find((option) => option.name === currentSort)

    let newSort = null

    if (configuredSortOption?.name && currentSort !== configuredSortOption.name) {
      newSort = configuredSortOption.code
    } else if (configuredSortOption?.name && currentSort === configuredSortOption.name) {
      newSort = defaultSort
    } else if (currentSortOption && currentSortOption.code !== defaultSort) {
      newSort = defaultSort
    }

    if (newSort !== null) {
      setSort(newSort)
      setReloading(true)
      analytics.send('sort', {
        eventLocation: 'filter bar',
        eventAction: 'apply',
        sortOption: sortOptions.find((option) => option.code === newSort)?.name,
      })
    }
  }, [currentSort, sortOption, sortOptions, sortTypeId, defaultSort])

  const renderSortOption = () => {
    const isSelected = currentSort === sortOption.name
    return (
      <Flex
        key={`sortOption-${sortOption.id}`}
        sx={styles.filterOption}
        alignItems="center"
        mr={1}
        onClick={handleClickSortOption}
        className={isSelected ? 'active' : ''}
      >
        <Text sx={styles.filterOptionsText} className={isSelected ? 'active' : ''}>
          {sortOption.name}
        </Text>
      </Flex>
    )
  }

  const renderFilterOption = ({ id, name, options = [], type }) => {
    const isNested = Boolean(options.length)
    let isSelected = false

    if (type === REFINEMENT_TYPE.PRICE) {
      const existingMinPriceFilter = filters.find((f) => f.id === 'pmin')
      const existingMaxPriceFilter = filters.find((f) => f.id === 'pmax')

      isSelected = !!(existingMinPriceFilter || existingMaxPriceFilter)
    } else {
      isSelected = options?.some((item) => item?.isSelected)
    }

    const handleClick = () => {
      handleClickOption(id, name)()
    }

    return (
      <Flex
        key={`filterOption-${id}`}
        sx={styles.filterOption}
        alignItems="center"
        mr={1}
        onClick={handleClick}
        className={isSelected ? 'active' : ''}
      >
        <Text sx={styles.filterOptionsText} className={isSelected ? 'active' : ''}>
          {name}
        </Text>
        {isNested && (
          <Box ml={1}>
            <NavChevronDownIcon width="14px" height="14px" />
          </Box>
        )}
      </Flex>
    )
  }

  return (
    <>
      <Flex sx={styles.buttonsWrapper} className={isSrp ? 'isSrp' : 'default'}>
        <ConditionalWrapper condition={!isSrp} Wrapper={Box} sx={styles.boxShadow}>
          <SortFilterButton
            handleClick={handleFilterSortClick}
            styles={styles}
            formatMessage={formatMessage}
            isExposedFiltersEnabled={isExposedFiltersEnabled}
          />
        </ConditionalWrapper>
        {isOnModelPLPToggleEnabled && (
          <OnModelToggle isExposedOrFocusedFilteringEnabled={isExposedOrFocusedFilteringEnabled} />
        )}
        {!isPlpV3 && !isSrp && (
          <Flex ref={filterOptionsRef} sx={styles.filterWrapper}>
            {sortOption && renderSortOption()}
            {refinementsToRender.map(renderFilterOption)}
          </Flex>
        )}
        <ExposedFiltersContainer />
        <FocusedFiltersContainer loading={loading} />
      </Flex>
      {(!isSrp || (isPlpV3 && isSrp)) && activeFilters?.length > 0 && (
        <Box
          flexGrow={1}
          overflow="auto"
          mx="var(--spacing-3)"
          data-qa="m_plpfltr_sctn_fltrorsrt_drawer"
        >
          <ActiveFilters styles={styles} />
        </Box>
      )}
      {!isSrp && !isPlpV3 && (
        <Skeleton ml="var(--spacing-3)" isLoaded={!loading}>
          <TotalCount variant="small" totalCount={total} defaultMessage="{itemCount} Results" />
        </Skeleton>
      )}
    </>
  )
}

export default SortFilterControls
