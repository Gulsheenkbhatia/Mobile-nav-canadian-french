import { useCallback, useEffect, useState, useContext, ChangeEvent, FormEvent } from 'react'
import Cookies from 'js-cookie'
import { BRAND } from 'toro/constants/cookies'
import PWAContext from 'components/common/PWAContext'
import { useRouter } from 'next/router'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import Box from 'toro/components/Box'
import useInlineSearchState from 'toro/hooks/useInlineSearchState'
import Input from 'toro/components/Input'
import InputGroup from 'toro/components/InputGroup'
import InputLeftElement from 'toro/components/InputLeftElement'
import InputRightElement from 'toro/components/InputRightElement'
import InlineSearchPlaceholder from 'toro/components/AdaptableInlineSearch/InlineSearchPlaceholder'
import { SearchIcon } from 'toro/icons'
import {
  inlineSearchTermAtom,
  setInlineSearchTermAtom,
  recommendedInlineSearchesAtom,
} from 'store/search.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useDisclosure from 'toro/hooks/useDisclosure'
import { useIntl } from 'react-intl'
import { SlideFade, SystemStyleObject } from '@chakra-ui/react'
import Link from 'toro/components/Link'
import { renderSearchResultText } from 'toro/components/AdaptableInlineSearch/helpers/renderSearchResultText'
import useAnalytics from 'toro/analytics/useAnalytics'

type InlineSearchTextFieldProps = {
  styles: Record<string, SystemStyleObject | any>
}

function InlineSearchInput({ styles }: InlineSearchTextFieldProps) {
  const initializeSearchState = useInlineSearchState()
  const router = useRouter()
  const { appData } = useContext(PWAContext)
  const searchTerm = useAtomValue(inlineSearchTermAtom)
  const setSearchTerm = useUpdateAtom(setInlineSearchTermAtom)
  const recommendedSearches = useAtomValue(recommendedInlineSearchesAtom)
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false })
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()

  const [displayRecommendedSearches, setDisplayRecommendedSearches] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useCallback(() => {
    initializeSearchState()
    setDisplayRecommendedSearches(true)
    setIsFocused(true)
  }, [initializeSearchState])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleBlur = () => {
    onClose()
    setIsFocused(false)
    if (!searchTerm) {
      setDisplayRecommendedSearches(false)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    onClose()
    setDisplayRecommendedSearches(false)
    setIsFocused(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!searchTerm?.trim()) {
      return null
    }

    let subBrandQuery = ''
    if (appData?.isSubBrandEnabled) {
      const currentBrandCookie = Cookies.get(BRAND)
      if (currentBrandCookie === appData?.subBrand) {
        subBrandQuery = '&isCoachtopia=true'
      }
    }

    analytics.send('searchStarted', {
      searchType: 'typed',
      searchSection: 'search bar',
      searchTermTyped: searchTerm,
      searchTermUsed: searchTerm,
      eventLocation: 'inline search',
    })

    router.push(`${getSearchUrl(searchTerm)}${subBrandQuery}`)
  }

  useEffect(() => {
    if (displayRecommendedSearches && isFocused && recommendedSearches.length > 0) {
      onOpen()
    }
  }, [recommendedSearches, displayRecommendedSearches, isFocused])

  useEffect(() => {
    return () => {
      handleClear()
    }
  }, [])

  const handleSelectRecommendation = (searchText: string) => () => {
    analytics.send('searchStarted', {
      searchType: 'recommended',
      searchSection: 'Top Searches',
      searchTermTyped: searchTerm,
      searchTermUsed: searchText,
      eventLocation: 'inline search',
    })
  }

  return (
    <Box sx={styles.inputWrapper}>
      <Box sx={styles.inputInnerWrapper}>
        <SlideFade in={isOpen}>
          <Box sx={styles.inputRecommendationsWrapper}>
            <Box sx={styles.recommendationsList}>
              {recommendedSearches.map((recommendation, idx) => (
                <Link
                  key={idx}
                  href={recommendation.link}
                  sx={styles.recomendationLink}
                  onClick={handleSelectRecommendation(recommendation.name)}
                >
                  {renderSearchResultText(
                    recommendation.name,
                    searchTerm,
                    styles.recomendationLinkHighlight
                  )}
                </Link>
              ))}
            </Box>
          </Box>
        </SlideFade>
        <form onSubmit={handleSubmit}>
          <Box sx={styles.inputContainer}>
            <InputGroup>
              <InputLeftElement
                sx={styles.inputLeftElement}
                onClick={searchTerm ? handleSubmit : handleFocus}
              >
                <SearchIcon width="34px" height="34px" />
              </InputLeftElement>
              <Input
                sx={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={searchTerm}
                onChange={handleChange}
                enterKeyHint="search"
              />
              <InputRightElement
                sx={styles.inputRightElement}
                onClick={handleClear}
                className={`${searchTerm.length === 0 ? 'hide' : ''}`}
              >
                {formatMessage({
                  id: 'search.searchInput.clear',
                  defaultMessage: 'Clear',
                })}
              </InputRightElement>
              {!displayRecommendedSearches ? (
                <Box sx={styles.placeHolderContainer}>
                  <InlineSearchPlaceholder styles={styles} />
                </Box>
              ) : null}
            </InputGroup>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default InlineSearchInput
