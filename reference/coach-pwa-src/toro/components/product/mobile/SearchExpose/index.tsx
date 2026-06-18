import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useAtomValue } from 'jotai/utils'
import throttle from 'lodash/throttle'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Input from 'toro/components/Input'
import Search from 'toro/icons/search.svg'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import { trendingSearchesLoadableAtom } from 'store/search.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { FormErrorOutlineIcon } from 'toro/icons'

const MAX_TRENDING_SEARCHES = 5

const SearchExpose = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isInvalidSearchTermError, setIsInvalidSearchTermError] = useState(false)
  const [fadingClassNames, setFadingClassNames] = useState('leftFadeHidden')
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const styles = useStyleConfig('SearchExposeTheme')
  const {
    xgenPreferences: { searchV2Features },
  } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })
  const analytics = useAnalytics()
  const trendingSearchesAtomValue = useAtomValue(trendingSearchesLoadableAtom)
  const searchExposeTitle = formatMessage({
    id: 'pdp.searchExpose.title',
    defaultMessage: 'Keep exploring',
  })

  const trendingSearches = useMemo(
    () =>
      trendingSearchesAtomValue.state === 'hasData'
        ? trendingSearchesAtomValue.data.slice(0, MAX_TRENDING_SEARCHES)
        : [],
    [trendingSearchesAtomValue]
  )

  const updateFadingClasses = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const leftFadeStyle = scrollLeft > 0 ? '' : 'leftFadeHidden'
      const rightFadeStyle = scrollLeft + 1 < scrollWidth - clientWidth ? '' : 'rightFadeHidden'
      const newFadeClasses = `${leftFadeStyle} ${rightFadeStyle}`.trim()

      if (fadingClassNames !== newFadeClasses) {
        setFadingClassNames(newFadeClasses)
      }
    }
  }, [fadingClassNames])

  useEffect(() => {
    // Set initial fading state
    if (trendingSearches.length > 0) {
      updateFadingClasses()
    }
  }, [trendingSearches, updateFadingClasses])

  const handlePillsScroll = useCallback(
    throttle(updateFadingClasses, 16), // ~60fps for smooth visual updates
    [updateFadingClasses]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsInvalidSearchTermError(false)
  }

  const handleSubmit = () => {
    if (!searchTerm?.trim()) {
      setIsInvalidSearchTermError(true)
      return
    }

    router.push(getSearchUrl(searchTerm))
    setSearchTerm('')
    analytics.send('searchStarted', {
      searchType: 'typed',
      searchSection: 'search bar',
      searchTermTyped: searchTerm,
      searchTermUsed: searchTerm,
      eventLocation: 'search module',
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const sendSearchInteraction = () => {
    analytics.send('searchInteraction', {
      eventAction: 'search module impression',
      eventLabel: searchExposeTitle.toLowerCase(),
    })
  }

  const handleTrendingSearchClick = (name: string) => {
    analytics.send('searchStarted', {
      searchType: 'recommended',
      searchSection: 'trending searches',
      searchTermTyped: 'none',
      searchTermUsed: name,
      eventLocation: 'search module',
    })
  }

  if (!searchV2Features?.PdpMobileSearchModule) {
    return null
  }

  return (
    <ImpressionSensor onVisible={sendSearchInteraction}>
      <Box sx={styles.containerWrapper}>
        <Box sx={styles.container} data-qa="m_pdp_search_container">
          <Box as="h2" sx={styles.mainTitle}>
            {searchExposeTitle}
          </Box>
          <Box sx={styles.searchInputContainer}>
            <Box sx={styles.searchIcon}>
              <Search width="16px" height="16px" />
            </Box>
            <Input
              variant="unstyled"
              placeholder={formatMessage({
                id: 'search.pdp.inputPlaceholder',
                defaultMessage: 'What are you looking for?',
              })}
              sx={styles.searchInput}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              enterKeyHint="search"
              data-qa="m_pdp_what_are_you_looking_for"
            />
          </Box>
          {isInvalidSearchTermError && (
            <Box sx={styles.invalidSearchTermContainer}>
              <FormErrorOutlineIcon height={16} width={16} />
              <Box as="span" sx={styles.invalidSearchTermText}>
                {formatMessage({
                  id: 'search.searchSuggestions.NoSearchTerm',
                  defaultMessage: 'Please enter your search term.',
                })}
              </Box>
            </Box>
          )}
          {trendingSearches.length > 0 && (
            <Box sx={styles.trendingSection}>
              <Box as="h3" sx={styles.trendingSectionTitle}>
                {formatMessage({
                  id: 'pdp.searchExpose.trendingsearches',
                  defaultMessage: 'Trending searches',
                })}
              </Box>
              <Box sx={styles.pillsWrapper} className={fadingClassNames}>
                <Box
                  ref={scrollRef}
                  sx={styles.pillsContainer}
                  onScroll={handlePillsScroll}
                  data-qa="m_trending_search_suggestions_list"
                >
                  {trendingSearches.map(({ name, link }, index) => (
                    <Link
                      key={`trending-${name}-${index}`}
                      href={link}
                      sx={styles.pill}
                      onClick={() => handleTrendingSearchClick(name)}
                    >
                      {name}
                    </Link>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ImpressionSensor>
  )
}

export default SearchExpose
