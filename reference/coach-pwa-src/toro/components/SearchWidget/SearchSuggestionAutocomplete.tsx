import { memo, useCallback, useMemo } from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import {
  isEmptySearchResultsAtom,
  isInitialSuggestionsAtom,
  initialRecommendedSearchesAtom,
  searchSuggestionsLoadingAtom,
  searchRecentItemsAvailableAtom,
  searchesByTermAtom,
  searchAutocompleteSuggestionsAtom,
  showAutocompleteSuggestionsAtom,
  isEmptyAutocompleteSuggestionsAtom,
  invalidSearchTermErrorAtom,
  exposedSearchStatusAtom,
} from 'store/search.atom'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import escapeRegExp from 'lodash/escapeRegExp'
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import RecentSearchIcon from 'toro/icons/recent-search'
import { FormErrorOutlineIcon } from 'toro/icons'
import { Collapse, SystemStyleObject } from '@chakra-ui/react'
import { useIntl } from 'react-intl'
import Skeleton from 'toro/components/Skeleton'
import { useRouter } from 'next/router'

const THRESHOLD_OVERLAY_REDESIGN_PILL = 10

const AUTOCOMPLETE_ITEM_HEIGHT = 42
const AUTOCOMPLETE_ITEM_GAP = 8

type SearchSuggestionAutocompleteProps = {
  title: string
  onClick: (name: string) => void
  variant: string
  subBrandQuery: string
  styles: Record<string, SystemStyleObject | any>
}

const PillsSkeleton = memo(() => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton h="48px" w="110px" borderRadius="var(--border-radius-full)" key={index} />
      ))}
    </>
  )
})

function SearchSuggestionAutocomplete({
  title,
  onClick,
  variant,
  subBrandQuery,
  styles = {},
}: SearchSuggestionAutocompleteProps) {
  const isRecent = useAtomValue(searchRecentItemsAvailableAtom)
  const isInitial = useAtomValue(isInitialSuggestionsAtom)
  const searchQuery = useAtomValue(searchesByTermAtom)
  const isEmptySearchResults = useAtomValue(isEmptySearchResultsAtom)
  const invalidSearchTermError = useAtomValue(invalidSearchTermErrorAtom)
  const searchSuggestionsLoading = useAtomValue(searchSuggestionsLoadingAtom)
  const isEmptyAutocompleteSuggestions = useAtomValue(isEmptyAutocompleteSuggestionsAtom)
  const searchAutocompleteSuggestions = useAtomValue(searchAutocompleteSuggestionsAtom)
  const initialRecommendedSearches = useAtomValue(initialRecommendedSearchesAtom)
  const showAutocompleteSuggestions = useAtomValue(showAutocompleteSuggestionsAtom)
  const isExposedSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
  const router = useRouter()
  const currentQuery = router.query.q as string
  const { formatMessage } = useIntl()

  const dataQA = useMemo(
    () => ({
      title:
        variant === 'footer'
          ? `${isRecent ? 'cm_txt_popular_sugglist' : 'cm_txt_ts_title'}`
          : `${isRecent ? 'cm_txt_recent_sugglist' : 'cm_txt_popular_sugglist'}`,
      wrapper: isRecent ? 'cm_ps_prod_list' : 'cm_ts_prod_list',
      pillsRecommendedSearches: isExposedSearchStatusActive
        ? 'cm_exposed_sugglist'
        : 'cm_main_nav_sugglist',
      categoryName: `${
        variant.includes('mobile')
          ? 'm_inp_field_search_sugg_prdname'
          : 'd_inp_field_search_sugg_prdname'
      }`,
    }),
    [isRecent, variant, isExposedSearchStatusActive]
  )

  const getRecommendedSearchUrl = useCallback(
    (link) => {
      const categoryLink = isInitial && subBrandQuery ? `${link}${subBrandQuery}` : link
      return getRelativeUrl(categoryLink)
    },
    [isInitial, subBrandQuery]
  )

  const renderAutocompleteItemText = (categoryName) => {
    if (!categoryName || !searchQuery) {
      return categoryName
    }
    const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi')
    const parts = categoryName.split(regex).filter(Boolean)
    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={`${categoryName}${index}`}>{part}</span>
          ) : (
            <span style={styles.autoCompleteBasePart} key={`${categoryName}${index}`}>
              {part}
            </span>
          )
        )}
      </>
    )
  }

  const getLinkProps = (category) => ({
    href: getRecommendedSearchUrl(category?.link),
    onClick: () => onClick(category.name),
    'data-qa': isRecent
      ? 'cm_link_ts_item_' + `${category?.name?.replace(/<\/?span[^>]*>/g, '')}`
      : null,
  })

  const hasNoAutocompleteSuggestions = searchAutocompleteSuggestions.length === 0
  const shouldShowNoResultsFound =
    !searchSuggestionsLoading && isEmptySearchResults && hasNoAutocompleteSuggestions
  return (
    <Box>
      <Collapse
        in={isEmptySearchResults && shouldShowNoResultsFound}
        animateOpacity
        transition={{ enter: { duration: 0.4 }, exit: { duration: 0.4 } }}
        style={styles.collapseContainingError}
      >
        <Flex sx={styles.autoCompleteWrapper} data-qa={dataQA.wrapper}>
          <Box sx={styles.noResultsFound}>
            {formatMessage({
              id: 'search.searchSuggestions.NoResultsFound',
              defaultMessage: 'No Results Found',
            })}
          </Box>
        </Flex>
      </Collapse>
      <Collapse
        in={invalidSearchTermError}
        animateOpacity
        transition={{ enter: { duration: 0.4 }, exit: { duration: 0.4 } }}
        style={styles.collapseContainingError}
      >
        <Flex sx={styles.autoCompleteWrapper} data-qa={dataQA.wrapper}>
          <Box sx={styles.noSearchTerm}>
            <FormErrorOutlineIcon height={16} width={16} />
            {formatMessage({
              id: 'search.searchSuggestions.NoSearchTerm',
              defaultMessage: 'Please enter your search term',
            })}
          </Box>
        </Flex>
      </Collapse>
      <Collapse
        in={showAutocompleteSuggestions && !isEmptyAutocompleteSuggestions}
        animateOpacity
        transition={{ enter: { duration: 0.4 }, exit: { duration: 0.4 } }}
        style={styles.autoCompleteCollapse}
      >
        <Flex sx={styles.autoCompleteWrapper} data-qa={dataQA.wrapper}>
          <Box
            sx={styles.autoCompleteRecommendedSearches}
            maxHeight={
              AUTOCOMPLETE_ITEM_GAP +
              searchAutocompleteSuggestions.length * AUTOCOMPLETE_ITEM_HEIGHT
            }
          >
            {searchAutocompleteSuggestions.map((category, index) => (
              <Link
                sx={styles.autoCompleteLink}
                key={`searched-categories-${category.name}-${index}`}
                shallow={category.name === currentQuery}
                {...getLinkProps(category)}
              >
                <Box display="flex">
                  <Text
                    sx={styles.autoCompleteName}
                    variant="top-suggestions-categories"
                    data-qa={dataQA.categoryName}
                  >
                    {renderAutocompleteItemText(category.name)}
                  </Text>
                </Box>
              </Link>
            ))}
          </Box>
        </Flex>
      </Collapse>
      <Box sx={styles.pillsContainer}>
        {!showAutocompleteSuggestions && (
          <Flex sx={styles.pillsWrapper} data-qa={dataQA.wrapper}>
            <Text sx={styles.pillsText} variant="body-primary" size="sm" data-qa={dataQA.title}>
              {variant === 'mobileV2' || variant === 'mobileExposed'
                ? startCase(toLower(title))
                : title}{' '}
            </Text>
            <Box sx={styles.pillsRecommendedSearches} data-qa={dataQA.pillsRecommendedSearches}>
              {!initialRecommendedSearches && <PillsSkeleton />}
              {initialRecommendedSearches
                ?.slice(0, THRESHOLD_OVERLAY_REDESIGN_PILL)
                .map((category, index) => (
                  <Link
                    sx={styles.pillsLink}
                    key={`searched-categories-${category.name}-${index}`}
                    shallow={category.name === currentQuery}
                    {...getLinkProps(category)}
                  >
                    <Box sx={styles.pillsDetails} display="flex">
                      {category.wasSearched && <RecentSearchIcon height={16} width={16} />}
                      <Text
                        sx={styles.pillsName}
                        variant="top-suggestions-categories"
                        data-qa={dataQA.categoryName}
                      >
                        {category.name}
                      </Text>
                    </Box>
                  </Link>
                ))}
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default SearchSuggestionAutocomplete
