import { useContext, useCallback, useEffect } from 'react'
import PWAContext from 'components/common/PWAContext'
import SearchWidget from 'toro/components/SearchWidget'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import get from 'lodash/get'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  setSearchTermAtom,
  setExposedSearchStatusAtom,
  isSearchInDrawerActiveAtom,
  exposedSearchStatusAtom,
} from 'store/search.atom'
import { MOBILE_VARIANTS_TYPES } from 'toro/constants/mobileVariants'
import usePreference from 'toro/hooks/usePreference_new'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import SearchOverlayIcon from 'toro/icons/search.svg'
import usePageType from 'toro/hooks/usePageType'
import { useIntl } from 'react-intl'

type VariantTypes = 'mobileV2' | 'mobileExposed' | 'mobileTransparentExposed'

export interface SearchWidgetExposedProps {
  initializeSearchState: () => void
}
const SearchWidgetExposed = ({ initializeSearchState }: SearchWidgetExposedProps) => {
  const { appData } = useContext(PWAContext)
  const isSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
  const setSearchStatus = useUpdateAtom(setExposedSearchStatusAtom)
  const setSearchTerm = useUpdateAtom(setSearchTermAtom)
  const setIsMobileMenuVisible = useUpdateAtom(isMobileMenuVisibleAtom)
  const setSearchInDrawerActive = useUpdateAtom(isSearchInDrawerActiveAtom)
  const { isPLP, isSRP } = usePageType()
  const { formatMessage } = useIntl()
  const {
    xgenPreferences: { searchV2Features },
  } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })
  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const placeholderText = isPLP
    ? formatMessage({ id: 'search.plp.inputPlaceholder', defaultMessage: 'Search' })
    : isSRP
    ? formatMessage({ id: 'search.srp.inputPlaceholder', defaultMessage: 'Search' })
    : 'Search'
  const styles = useMultiStyleConfig('HeaderMainContentPage', {
    variant: searchOverlayRedesign ? 'globalHeaderV2Redesign' : 'globalHeaderV2',
  })

  useEffect(() => {
    if (searchOverlayRedesign) return
    toggleBodyScroll(!isSearchStatusActive)
    if (isSearchStatusActive) {
      initializeSearchState()
    }
    return () => {
      toggleBodyScroll(true)
    }
  }, [isSearchStatusActive])

  const handleCloseSearch = useCallback(() => {
    setSearchStatus(false)
    setIsMobileMenuVisible(false)
    setSearchInDrawerActive(false)
    setSearchTerm('')
  }, [setSearchStatus, setIsMobileMenuVisible, setSearchInDrawerActive, setSearchTerm])

  const handleNavigation = useCallback(() => {
    setSearchTerm('')
    setSearchStatus(false)
    setIsMobileMenuVisible(false)
    setSearchInDrawerActive(false)
  }, [setSearchTerm, setSearchStatus, setIsMobileMenuVisible, setSearchInDrawerActive])

  const handleOpenSearch = useCallback(() => {
    initializeSearchState()
    setSearchStatus(true)
    setIsMobileMenuVisible(true)
    setSearchInDrawerActive(true)
  }, [initializeSearchState, setSearchStatus, setIsMobileMenuVisible, setSearchInDrawerActive])

  const liveEventConfig = get(appData, 'liveStreamingData')

  return (
    <>
      {searchOverlayRedesign && searchV2Features?.NavSearchRedesign ? (
        <Box sx={styles.exposeSearchWrapperContainer}>
          <Box className="exposed-search-wrapper" sx={styles.exposeSearchWrapper}>
            <SearchOverlayIcon height="16px" width="16px" />
            <Text className="exposed-search-wrapper-placeholder">{placeholderText}</Text>
            <Box sx={styles.exposedSearchHeaderContainer}>
              <SearchWidget
                variant={'mobileV2RedesignExposed'}
                onNavigation={handleNavigation}
                onSearchInputFocus={handleOpenSearch}
                toRenderItems={isSearchStatusActive}
                onMenuClose={handleCloseSearch}
                liveEventConfig={liveEventConfig}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={styles.exposedSearchHeaderContainer}>
          <SearchWidget
            variant={MOBILE_VARIANTS_TYPES.MOBILE_EXPOSED as VariantTypes}
            onNavigation={handleNavigation}
            onSearchInputFocus={handleOpenSearch}
            toRenderItems={isSearchStatusActive}
            onMenuClose={handleCloseSearch}
            liveEventConfig={liveEventConfig}
          />
          {isSearchStatusActive && <Box sx={styles.exposedSearchSuggestionsBackground} />}
        </Box>
      )}
    </>
  )
}

export default SearchWidgetExposed
