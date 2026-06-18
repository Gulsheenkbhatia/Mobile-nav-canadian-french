import { VStack, FormLabel, FormControl, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react'
import InputGroup from 'toro/components/InputGroup'
import InputRightElement from 'toro/components/InputRightElement'
import Text from 'toro/components/Text'
import Select from 'toro/components/Select'
import HStack from 'toro/components/Hstack'
import Flex from 'toro/components/Flex'
import Input from 'toro/components/Input'
import { useMemo, useRef } from 'react'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import { SearchIcon, CaretDownIcon, NavChevronDownIcon } from 'toro/icons'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Box from 'toro/components/Box'
import dynamic from 'next/dynamic'
import useAnalytics from 'toro/analytics/useAnalytics'
import { FilterType } from 'toro/hooks/useRatingsAndReviews'
import { POWER_REVIEWS_SEPARATORS } from 'toro/helpers/emplifiNormalizers'
import { Topic, RatingsFilter } from 'toro/components/product/RatingsAndReviews/ReviewsList/types'

const ClickableTags = dynamic(
  () => import('toro/components/product/RatingsAndReviews/ClickableTags/ClickableTags'),
  {
    ssr: false,
  }
)

type PagingInfo = {
  current_page_number: number
  page_size: number
  total_results: number
}

type RatingsFilterFormProps = {
  ratingsFilter: RatingsFilter
  setRatingsFilter: (filter: RatingsFilter) => void
  onClearFilters?: () => void
  onFiltersChange?: (filter: RatingsFilter) => void
  sortOrderList?: string[]
  filtersList?: string[]
  filtersListDisplayValue?: string[]
  paging: PagingInfo
  modalDefaultSortOrderValue?: string
  isLoading?: boolean
  isReviewSearchEnabled?: boolean
  displaySortAndFilterByOptions?: boolean
  enableWordCloudClickableTags?: boolean
  wordCloudProperties: string[]
  topics?: Topic[]
  properties: Record<string, unknown>
  isClearFiltersEnabled?: boolean
  productId: string
  isModalContent?: boolean
  variant?: string
}

function RatingsFilterForm({
  ratingsFilter,
  setRatingsFilter,
  onClearFilters,
  onFiltersChange,
  sortOrderList,
  filtersList,
  filtersListDisplayValue,
  paging: { current_page_number, page_size, total_results },
  isLoading,
  isReviewSearchEnabled,
  displaySortAndFilterByOptions,
  enableWordCloudClickableTags,
  wordCloudProperties,
  topics,
  properties,
  isClearFiltersEnabled,
  productId,
  isModalContent,
  variant,
}: RatingsFilterFormProps): JSX.Element {
  const analytics = useAnalytics()
  const inputSearch = useRef<HTMLInputElement>(null)
  const reviewStart = useRef<HTMLDivElement>(null)
  const styles = useMultiStyleConfig('RatingsAndReviews')
  const { formatMessage } = useIntl()
  const startRange = total_results ? (current_page_number - 1) * page_size + 1 : 0
  const endRange = Math.min(current_page_number * page_size, total_results) || 0

  function clearFilter() {
    analytics.send('filter', {
      action: 'reset',
      currentFilters: '',
      eventLocation: isModalContent ? 'reviews modal' : 'product',
    })
    setRatingsFilter({ ...ratingsFilter, search: '', filterBy: '', ratingsFilterValue: '' })
    onClearFilters?.()
  }

  function ScrollInto() {
    reviewStart?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortOption = e.target.value.replace(/([a-z])([A-Z])/g, '$1-$2')
    analytics.send('sort', {
      eventLocation: isModalContent ? 'reviews modal' : 'product',
      eventAction: 'apply',
      sortOption: sortOption,
    })
    analytics.send('reviewInteraction', {
      eventLocation: isModalContent ? 'reviews modal' : 'product',
      eventAction: `sort by click:${sortOption}`,
      eventLabel: productId || undefined,
    })
    setRatingsFilter({ ...ratingsFilter, [e.target.name]: e.target.value })
    ScrollInto()
  }

  type HandleChangeFilterParams = {
    key: string
    value: string
    displayLabel?: string
    filterType?: string
  }

  /// TODO: Need refactoring to re-use the same function from new useRatingsAndReviews hook
  const handleChangeFilter = ({
    key,
    value,
    displayLabel = '',
    filterType = FilterType.DEFAULT,
  }: HandleChangeFilterParams) => {
    if (key === 'search') {
      setRatingsFilter({ ...ratingsFilter, [key]: '' })
      onFiltersChange?.({ ...ratingsFilter, [key]: '' })
      analytics.send('reviewInteraction', {
        eventLocation: isModalContent ? 'reviews modal' : 'product',
        eventAction: `reviews search:${inputSearch.current?.value}`,
        eventLabel: productId || undefined,
      })
      return
    }

    const filters = ratingsFilter.filterBy
      ? ratingsFilter.filterBy.split(POWER_REVIEWS_SEPARATORS.filter)
      : []

    const foundFilterIndex = filters.findIndex((filter) => filter.includes(key))
    let isRemove = false

    if (foundFilterIndex === -1) {
      filters.push(`${key}:${value}`)
    } else {
      const foundFilter = filters[foundFilterIndex]
      const [, existingValues] = foundFilter.split(POWER_REVIEWS_SEPARATORS.keyValue)
      const values =
        filterType !== FilterType.STAR_RATING
          ? existingValues?.split(POWER_REVIEWS_SEPARATORS.values) ?? []
          : []

      if (filterType === FilterType.STAR_RATING && existingValues.includes(value)) {
        isRemove = true
      } else if (values.includes(value)) {
        isRemove = true
        values.splice(values.indexOf(value), 1)
      } else {
        values.push(value)
      }

      const updatedFilter = values.length
        ? `${key}:${values.join(POWER_REVIEWS_SEPARATORS.values)}`
        : ''
      if (updatedFilter === '') {
        filters.splice(foundFilterIndex, 1) // Remove the existing filter
      } else {
        filters.splice(foundFilterIndex, 1, updatedFilter) // Update the existing filter
      }
    }

    const newFilterBy = filters.join(POWER_REVIEWS_SEPARATORS.filter)
    // The code below for ANALYTIC ONLY
    let wordCloudValues: string[] = []
    let starRatingValues: string[] = []

    // Iterate over each key-value pair
    for (let pair of filters) {
      if (!pair.length) continue
      let [key, value] = pair.split(POWER_REVIEWS_SEPARATORS.keyValue)
      if (wordCloudProperties.includes(key)) {
        wordCloudValues.push(...value.split(POWER_REVIEWS_SEPARATORS.values))
      } else {
        starRatingValues.push(...value.split(POWER_REVIEWS_SEPARATORS.values))
      }
    }

    // Construct the output string
    let currentFilters = ''
    if (wordCloudValues.length > 0) {
      //Custom analytics separators applied for clear vision
      currentFilters += `${FilterType.WORD_CLOUD}:${wordCloudValues.join(',')}`
    }
    if (starRatingValues.length > 0) {
      if (currentFilters.length > 0) {
        currentFilters += ','
      }
      //Custom analytics separators applied for clear vision
      currentFilters += `${FilterType.STAR_RATING}:${starRatingValues.join(',')}`
    }

    analytics.send('filter', {
      action: isRemove ? 'remove' : 'apply',
      eventLocation: isModalContent ? 'reviews modal' : 'product',
      filter: {
        name: displayLabel,
        category: filterType === FilterType.DEFAULT ? key : filterType,
      },
      currentFilters,
    })

    const eventAction = filterType === FilterType.DEFAULT ? 'filter by' : filterType
    analytics.send('reviewInteraction', {
      eventLocation: isModalContent ? 'reviews modal' : 'product',
      eventAction: `${eventAction} click:${displayLabel}`,
      eventLabel: productId || undefined,
    })

    let updatedRatingsFilter = { ...ratingsFilter }
    if (filterType === FilterType.STAR_RATING) {
      updatedRatingsFilter.ratingsFilterValue =
        foundFilterIndex === -1 ? `${key}:${value}` : filters[foundFilterIndex] || ''
    }

    const nextFilter = { ...updatedRatingsFilter, filterBy: newFilterBy }
    setRatingsFilter(nextFilter)
    onFiltersChange?.(nextFilter)
  }

  const handleFilterBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value
    const displayLabel = filtersListDisplayValue?.[filtersList.indexOf(filter)]
      ?.replace(/([A-Z])/g, '$1')
      .trim()
    const [key, value] = filter.split(POWER_REVIEWS_SEPARATORS.keyValue)
    handleChangeFilter({
      key,
      value,
      displayLabel,
      filterType: FilterType.STAR_RATING,
    })
  }

  const handleSearch = () => {
    analytics.send('reviewInteraction', {
      eventLocation: isModalContent ? 'reviews modal' : 'product',
      eventAction: `reviews search:${inputSearch.current?.value}`,
      eventLabel: productId || undefined,
    })
    const nextFilter = { ...ratingsFilter, search: inputSearch.current?.value }
    setRatingsFilter(nextFilter)
    onFiltersChange?.(nextFilter)
    if (inputSearch.current?.value) {
      inputSearch.current.value = ''
    }
    ScrollInto()
  }

  interface TagLabel {
    key: string
    value: string
    displayLabel?: string
    filterType: string
  }

  const tagLabels = useMemo((): TagLabel[] => {
    const filters = ratingsFilter?.filterBy.split(POWER_REVIEWS_SEPARATORS.filter)
    const searchFilterArr = ratingsFilter?.search
      ? [{ key: 'search', value: ratingsFilter?.search, filterType: FilterType.DEFAULT }]
      : []

    const filterByArr = filters.flatMap((filter) => {
      const [key, values] = filter.split(POWER_REVIEWS_SEPARATORS.keyValue)

      if (values && (wordCloudProperties.includes(key) || key === 'topic')) {
        return values
          .split(POWER_REVIEWS_SEPARATORS.values)
          .map((value) => ({ key, value, filterType: FilterType.WORD_CLOUD }))
      } else if (values) {
        return [
          {
            key,
            displayLabel: `${values} Star`,
            value: values,
            filterType: FilterType.STAR_RATING,
          },
        ]
      }

      return []
    })
    return [...searchFilterArr, ...filterByArr]
  }, [ratingsFilter?.filterBy, ratingsFilter?.search])

  const getTagLabels = () => {
    return tagLabels.map(
      ({ key, displayLabel, value, filterType }) =>
        (displayLabel || value) && (
          <Tag sx={styles.pdpReviewmodalFiltersApplied} key={`${key}-${value}`}>
            <TagLabel>{displayLabel || value}</TagLabel>
            <TagCloseButton
              onClick={() =>
                handleChangeFilter({ key, value, displayLabel: displayLabel || value, filterType })
              }
            />
          </Tag>
        )
    )
  }

  return (
    <VStack
      sx={styles.searchReviews}
      spacing={6}
      align="stretch"
      ref={reviewStart}
      id="reviewstart"
    >
      {isReviewSearchEnabled && (
        <InputGroup>
          <Input
            type="text"
            ref={inputSearch}
            placeholder={formatMessage({
              id: 'pdp.product.searchReviews',
              defaultMessage: 'Search Reviews',
            })}
            name="search"
            sx={styles.ratingsFilterFormSearchBar}
            minHeight={'44px'}
            maxLength={30}
            onKeyDown={(e) => {
              if (e.keyCode === 13 && (e.target as HTMLInputElement).value !== '') {
                handleSearch()
              }
            }}
            data-qa="search_review_field"
          />
          <InputRightElement
            onClick={() => {
              if (inputSearch?.current?.value === '') return
              handleSearch()
            }}
            data-qa="search_icon"
            cursor="pointer"
          >
            <SearchIcon width="24px" height="24px" {...styles.searchBarIcon} />
          </InputRightElement>
        </InputGroup>
      )}
      {displaySortAndFilterByOptions && (
        <HStack {...styles.sortByWrapper}>
          <FormControl>
            <FormLabel sx={styles.sortByLabel}>
              {formatMessage({ id: 'pdp.product.sortBy', defaultMessage: 'Sort By' })}
            </FormLabel>
            <Select
              name="sortBy"
              onChange={handleChangeSort}
              className="w-100 pr-0"
              value={ratingsFilter?.sortBy}
              sx={styles.filterDropdownText}
              icon={
                <>
                  <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                    <CaretDownIcon />
                  </Experiment>
                  <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                    <NavChevronDownIcon {...styles.filterBarIcon} />
                  </Experiment>
                </>
              }
            >
              <option value="" selected disabled hidden>
                {formatMessage({ id: 'pdp.product.selectRatingLabel', defaultMessage: 'Select' })}
              </option>
              {sortOrderList?.map?.((sortItem) => (
                <option value={sortItem} key={sortItem}>
                  {sortItem.replace(/([a-z])([A-Z])/g, '$1 $2')}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel sx={styles.filterByLabel}>
              {formatMessage({
                id: 'pdp.product.filterByRatingLabel',
                defaultMessage: 'Filter By',
              })}
            </FormLabel>
            <Select
              name="filterBy"
              onChange={handleFilterBy}
              className="w-100"
              value={ratingsFilter?.ratingsFilterValue}
              icon={
                <>
                  <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                    <CaretDownIcon />
                  </Experiment>
                  <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                    <NavChevronDownIcon {...styles.filterBarIcon} />
                  </Experiment>
                </>
              }
              sx={styles.filterDropdownText}
              data-qa="rnr_drpdwn_allrev_flterby"
            >
              {filtersList?.map?.((filterListItem, index) => (
                <option value={filterListItem} key={filterListItem}>
                  {filtersListDisplayValue?.[index]?.replace(/([A-Z])/g, '$1').trim()}
                </option>
              ))}
            </Select>
          </FormControl>
        </HStack>
      )}

      <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
        {enableWordCloudClickableTags &&
          (Boolean(wordCloudProperties.length) || Boolean(topics?.length)) && (
            <ClickableTags
              properties={properties}
              topics={topics}
              handleChangeFilter={handleChangeFilter}
              ratingsFilter={ratingsFilter}
              allowedFilters={wordCloudProperties}
              variant={variant}
            />
          )}
      </Experiment>
      {(isClearFiltersEnabled || isReviewSearchEnabled) &&
        Object.keys(ratingsFilter || {})
          .filter((item) => item !== 'sortBy')
          .some((item) => ratingsFilter?.[item] !== '') && (
          <Flex flexWrap="wrap" alignItems="center" mt="2 !important">
            <Text
              data-qa="word_cloud_clear_filter"
              sx={styles.pdpReviewsClearTags}
              onClick={clearFilter}
              cursor="pointer"
            >
              {formatMessage({
                id: 'pdp.product.clearFiltersRatingLabel',
                defaultMessage: 'Clear Filter(s)',
              })}
            </Text>
            {getTagLabels()}
          </Flex>
        )}
      <Box sx={styles.modalContentDivider} />
      <Text sx={styles.pdpReviewmodalPaging} data-qa="rnr_txt_allrev_paging">
        {isLoading
          ? formatMessage({ id: 'pdp.product.loadingRatingReview', defaultMessage: 'Loading...' })
          : formatMessage(
              {
                id: 'pdp.product.showingRatingReview',
                defaultMessage: 'Showing {startRange}-{endRange} of {total_results} reviews',
              },
              { startRange, endRange, total_results }
            )}
      </Text>
    </VStack>
  )
}

export default RatingsFilterForm
