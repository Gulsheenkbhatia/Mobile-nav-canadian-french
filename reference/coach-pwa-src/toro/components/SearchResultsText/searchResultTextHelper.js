import capitalize from 'lodash/capitalize'

const getMarkupData = (
  suggestionPhrase,
  isAlternateProducts,
  styles,
  isMobile,
  searchTerm,
  total,
  formatMessage
) => {
  let headerProps = {}

  let textProps = {
    variant: 'secondary',
  }
  let formatMessageHeader = ''
  let formatMessageText = ''

  if (suggestionPhrase) {
    headerProps.sx = styles?.NoResultFoundText?.(isMobile)
    headerProps['data-qa'] = 'hs_nsr_txt_hdng'
    formatMessageHeader = formatMessage(
      {
        id: 'search.searchSuggestions.didYouMeanText',
        defaultMessage: 'No Results Found for "{query}".',
      },
      { query: capitalize(searchTerm) }
    )

    textProps.sx = styles?.DidYouMeanText?.(isMobile)
    textProps['data-qa'] = 'hs_invsearch_txt_didyoumean'
    textProps['size'] = 'xxs'
    formatMessageText = formatMessage(
      {
        id: 'search.searchSuggestions.alternativeSearchResult',
        defaultMessage:
          'Did you mean "{suggestionPhrase}"? Showing {total} results for "{suggestionPhrase}".',
      },
      {
        total,
        suggestionPhrase: capitalize(suggestionPhrase),
      }
    )
  } else if (isAlternateProducts) {
    headerProps.sx = styles?.NoResultText?.(isMobile)
    formatMessageHeader = formatMessage(
      {
        id: 'search.searchSuggestions.alternativeSearchResultHeadingConstructor',
        defaultMessage: 'No Match Found For “{query}”',
      },
      { query: searchTerm }
    )
    textProps.sx = styles?.SearchResultSkeletonMessageText?.(isMobile)
    textProps.variant = 'body-text-secondary'

    formatMessageText = formatMessage({
      id: 'search.searchSuggestions.alternativeSearchResultTextConstructor',
      defaultMessage: 'Try a new search or explore similar styles below.',
    })
  }

  return [headerProps, textProps, formatMessageHeader, formatMessageText]
}

export default getMarkupData
