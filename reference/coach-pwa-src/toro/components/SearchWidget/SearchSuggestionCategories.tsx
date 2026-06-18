import { CSSProperties, useCallback, useMemo } from 'react'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import {
  isInitialSuggestionsAtom,
  recommendedSearchesAtom,
  searchRecentItemsAvailableAtom,
  searchesByTermAtom,
} from 'store/search.atom'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import escapeRegExp from 'lodash/escapeRegExp'
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import { SystemStyleObject } from '@chakra-ui/react'
import type { SearchWidgetVariant } from 'toro/components/SearchWidget'

type DataQATag = 'title' | 'wrapper' | 'categoryName'

export type SearchSuggestionCategoriesProps = {
  title: string
  variant: SearchWidgetVariant
  styles: Record<string, SystemStyleObject>
  subBrandQuery: string
  onClick: (categoryName: string) => void
}

function SearchSuggestionCategories({
  title,
  onClick,
  variant,
  subBrandQuery,
  styles,
}: SearchSuggestionCategoriesProps) {
  const recommendedSearches = useAtomValue(recommendedSearchesAtom)
  const isRecent = useAtomValue(searchRecentItemsAvailableAtom)
  const isInitial = useAtomValue(isInitialSuggestionsAtom)
  const searchQuery = useAtomValue(searchesByTermAtom)

  const dataQA: Record<DataQATag, string> = useMemo(
    () => ({
      title:
        variant === 'footer'
          ? `${isRecent ? 'cm_txt_popular_sugglist' : 'cm_txt_ts_title'}`
          : `${isRecent ? 'cm_txt_recent_sugglist' : 'cm_txt_popular_sugglist'}`,
      wrapper: isRecent ? 'cm_ps_prod_list' : 'cm_ts_prod_list',
      categoryName: `${
        variant === 'mobile' ? 'm_inp_field_search_sugg_prdname' : 'd_inp_field_search_sugg_prdname'
      }`,
    }),
    [isRecent, variant]
  )

  const getRecommendedSearchUrl = useCallback(
    (link: string): string => {
      const categoryLink = isInitial && subBrandQuery ? `${link}${subBrandQuery}` : link
      return getRelativeUrl(categoryLink)
    },
    [isInitial, subBrandQuery]
  )

  const renderCategoryName = (categoryName?: string): React.ReactNode => {
    if ((variant === 'mobileV2' || variant === 'mobileExposed') && categoryName && searchQuery) {
      const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi')
      const parts = categoryName.split(regex).filter(Boolean)
      return (
        <>
          {parts.map((part, index) =>
            regex.test(part) ? (
              <span key={`${categoryName}${index}`}>{part}</span>
            ) : (
              <span
                style={styles.SearchSuggestionCategoriesBasePart as CSSProperties}
                key={`${categoryName}${index}`}
              >
                {part}
              </span>
            )
          )}
        </>
      )
    }
    return categoryName
  }

  if (recommendedSearches.length === 0) {
    return null
  }

  return (
    <Flex
      name="SearchSuggestionCategoriesWrapper"
      sx={styles.SearchSuggestionCategoriesWrapper}
      minWidth="146px"
      data-qa={dataQA.wrapper}
    >
      <Text
        name="SearchSuggestionCategoriesText"
        sx={styles.SearchSuggestionCategoriesText}
        variant="body-primary"
        size="sm"
        data-qa={dataQA.title}
      >
        {variant === 'mobileV2' || variant === 'mobileExposed' ? startCase(toLower(title)) : title}
      </Text>
      {recommendedSearches.map((category, index) => (
        <Link
          name="SearchSuggestionCategoriesLink"
          sx={styles.SearchSuggestionCategoriesLink}
          key={`searched-categories-${category.name}-${index}`}
          href={getRecommendedSearchUrl(category.link)}
          onClick={() => onClick(category.name)}
          data-qa={
            isRecent
              ? 'cm_link_ts_item_' + `${category.name?.replace(/<\/?span[^>]*>/g, '')}`
              : null
          }
        >
          <Box
            name="SearchSuggestionCategoriesDetails"
            sx={styles.SearchSuggestionCategoriesDetails}
            display="flex"
          >
            <Text
              name="SearchSuggestionCategoriesName"
              sx={styles.SearchSuggestionCategoriesName}
              variant="top-suggestions-categories"
              data-qa={dataQA.categoryName}
            >
              {renderCategoryName(category.name)}
            </Text>
            {category.count && (
              <Text
                name="SearchSuggestionCategoriesCount"
                sx={styles.SearchSuggestionCategoriesCount}
                variant="top-suggestions-categories"
              >
                {`(${category.count})`}
              </Text>
            )}
          </Box>
        </Link>
      ))}
    </Flex>
  )
}

export default SearchSuggestionCategories
