import { useEffect, useState } from 'react'
import Box from 'toro/components/Box'
import ScrollableContent from 'toro/components/ScrollableContent'
import { SearchIcon } from 'toro/icons'
import usePreference from 'toro/hooks/usePreference_new'
import Link from 'toro/components/Link'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'

type InlineSearchSuggestionsProps = {
  styles: any
  label: string
}

type SuggestionType = {
  label: string
  url: string
}

function generateSuggestionList(suggestions: string[]) {
  if (!suggestions.length) {
    return []
  }

  return suggestions?.map((suggestion: string) => ({
    label: suggestion,
    url: `/search?q=${encodeURIComponent(suggestion)}`,
  }))
}

function InlineSearchSuggestions({ styles, label }: InlineSearchSuggestionsProps) {
  const {
    adaptiveExperience: { inlineSearchPills: inlineSearchPillsPreference },
  } = usePreference({
    adaptiveExperience: ['inlineSearchPills'],
  })
  const inlineSearchPills = get(inlineSearchPillsPreference, 'inlineSearchPills')
  const defaultSuggestions = get(inlineSearchPills, 'default', [])
  const [suggestions, setSuggestions] = useState(() => generateSuggestionList(defaultSuggestions))
  const analytics = useAnalytics()

  useEffect(() => {
    const queryParams = new URLSearchParams(window?.location.search)
    const utmMediumCode = queryParams?.get('utm_medium')
    const suggestionsList = get(inlineSearchPills, utmMediumCode, defaultSuggestions)

    setSuggestions(generateSuggestionList(suggestionsList))
  }, [inlineSearchPills, defaultSuggestions])

  if (!suggestions?.length) {
    return null
  }

  const handleSelectSuggestion = (searchText: string) => () => {
    analytics.send('searchStarted', {
      searchType: 'recommended',
      searchSection: 'keyword tab',
      searchTermTyped: '',
      searchTermUsed: searchText,
      eventLocation: 'inline search',
    })
  }

  return (
    <>
      <Box as="h3" sx={styles.suggestionsHeader}>
        {label}
      </Box>
      <Box sx={styles.suggestionsContainer}>
        <ScrollableContent fadeColor={'#FFFFFF'}>
          <Box sx={styles.suggestionsList}>
            {suggestions.map((suggestion: SuggestionType, idx: number) => (
              <Link
                key={idx}
                href={suggestion?.url}
                onClick={handleSelectSuggestion(suggestion?.label || '')}
              >
                <Box sx={styles.pill}>
                  <SearchIcon width="14px" height="14px" color="var(--color-neutral-medium)" />
                  {suggestion?.label}
                </Box>
              </Link>
            ))}
          </Box>
        </ScrollableContent>
      </Box>
    </>
  )
}

export default InlineSearchSuggestions
