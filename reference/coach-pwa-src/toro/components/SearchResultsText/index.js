import { useRouter } from 'next/router'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import NoResultsText from './NoResultText'
import { useIntl } from 'react-intl'
import Skeleton from '../Skeleton'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import { totalProductsAtom } from 'store/search-results.atom'
import getMarkupData from 'toro/components/SearchResultsText/searchResultTextHelper'
import { isPlpV3Atom } from 'store/plp.atom'
import TotalCount from 'toro/components/listing/TotalCount'
import usePageType from 'toro/hooks/usePageType'

const SearchResultsText = ({
  loading,
  suggestionPhrase = '',
  pageData,
  isAlternateProducts = false,
}) => {
  const { isMobile, isDesktop } = useViewportType()
  const { isSRP } = usePageType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('SearchResultTextTheme', {
    variant: isPlpV3 && 'plpV3',
  })
  const router = useRouter()
  const queryObj = router?.query
  const { searchTerm, isFeatured } = pageData || {}
  const total = useAtomValue(totalProductsAtom)
  const { formatMessage } = useIntl()
  const categoryNameForOOS = get(pageData, 'oosCategoryNameDisplay', capitalize(searchTerm))
  let resultsText = ''
  if (total !== undefined) {
    resultsText = isFeatured
      ? searchTerm
      : formatMessage(
          {
            id: 'search.searchResultsText.resultsFor',
            defaultMessage: '{total} results for "{query}"',
          },
          { total, query: searchTerm }
        )
  }

  const resultTextBlock = () => {
    if (suggestionPhrase || isAlternateProducts) {
      const [headerProps, textProps, formatMessageHeader, formatMessageText] = getMarkupData(
        suggestionPhrase,
        isAlternateProducts,
        styles,
        isMobile,
        searchTerm,
        total,
        formatMessage
      )
      if (isPlpV3 && isSRP && isDesktop) {
        return (
          <>
            <Skeleton
              flex
              alignSelf="flex-start"
              isLoaded={!loading}
              sx={styles.ResultsTextWrapper}
            >
              <Text name="AiResultText" sx={styles.AiResultText} minWidth={0}>
                {capitalize(formatMessageHeader)}
              </Text>
              <TotalCount variant="srpV3" totalCount={total} />
            </Skeleton>
            <Text
              name="AiSearchResultSkeletonMessageText"
              sx={styles.AiSearchResultSkeletonMessageText}
              minWidth={0}
            >
              {formatMessageText}
            </Text>
          </>
        )
      }

      return (
        <>
          <Text minWidth={0} variant="secondary" {...headerProps}>
            {formatMessageHeader}
          </Text>
          <Text minWidth={0} {...textProps}>
            {formatMessageText}
          </Text>
        </>
      )
    }
    return (
      <Text
        name="ResultText"
        sx={styles.ResultText(isMobile)}
        minWidth={0}
        variant="secondary"
        data-qa="d_srp_txt_hdng"
        as={isFeatured ? 'h1' : null}
      >
        {resultsText}
      </Text>
    )
  }

  return (
    <Box name="SearchResultWrapper" sx={styles.SearchResultWrapper(isMobile)}>
      {total > 0 ? (
        queryObj?.discontinued ? (
          <Skeleton
            isLoaded={!loading}
            name="SearchResultSkeleton"
            sx={styles.SearchResultSkeleton}
          >
            <Text
              minWidth={0}
              name="SearchResultSkeletonSorryText"
              sx={styles.SearchResultSkeletonSorryText(isMobile)}
              variant="secondary"
              data-qa="cm_plp_txt_pdt_no_longer_available"
            >
              {formatMessage(
                {
                  id: 'search.searchSuggestions.noLongerAvailableText',
                  defaultMessage: 'Sorry, "{query}" is no longer available.',
                },
                {
                  query: queryObj?.discontinued,
                }
              )}
            </Text>
            <Text
              name="SearchResultSkeletonText"
              sx={styles.SearchResultSkeletonText(isMobile)}
              minWidth={0}
              variant="secondary"
              data-qa="cm_plp_txt_we_think_youll_love_alternate_pdt"
            >
              {formatMessage(
                {
                  id: 'search.searchSuggestions.youWillloveText',
                  defaultMessage: `We think you'll love "{query}"`,
                },
                {
                  query: searchTerm,
                }
              )}
            </Text>
          </Skeleton>
        ) : (
          <Skeleton
            isLoaded={!loading}
            name="SearchResultSkeletonBlock"
            sx={styles.SearchResultSkeletonBlock}
          >
            {resultTextBlock()}
          </Skeleton>
        )
      ) : (
        <>
          <Skeleton isLoaded={!loading} sx={styles.SearchResultSkeletonBlock}>
            {(!isPlpV3 || !isDesktop) && (
              <NoResultsText styles={styles} query={categoryNameForOOS} />
            )}
            {isPlpV3 && isSRP && isDesktop && (
              <Skeleton
                flex
                alignSelf="flex-start"
                isLoaded={!loading}
                sx={styles.NoResultsTextWrapper}
              >
                <NoResultsText styles={styles} query={categoryNameForOOS} />
                <TotalCount variant="srpV3" totalCount={total} />
              </Skeleton>
            )}
            <Text
              name="SearchResultSkeletonMessageText"
              sx={styles.SearchResultSkeletonMessageText(isMobile)}
              minWidth={0}
              variant="body-text-secondary"
              data-qa="hs_nsr_txt_chksplng"
            >
              {formatMessage({
                id: 'search.checkSpellingText',
                defaultMessage:
                  'Check Your Spelling Or Use A More General Search Term And Try Again.',
              })}
            </Text>
          </Skeleton>
        </>
      )}
      {isPlpV3 && isSRP && !isDesktop && (
        <Skeleton flex alignSelf="flex-start" isLoaded={!loading}>
          <TotalCount variant="srpV3" totalCount={total} />
        </Skeleton>
      )}
    </Box>
  )
}

export default SearchResultsText
