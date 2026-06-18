import { useContext, useMemo, useRef, useCallback } from 'react'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Flex from 'toro/components/Flex'
import get from 'lodash/get'
import useViewportType from 'toro/hooks/useViewportType'
import SearchSuggestionItem from 'toro/components/SearchWidget/SearchSuggestionItem'
import SearchSuggestionCategories from 'toro/components/SearchWidget/SearchSuggestionCategories'
import Text from 'toro/components/Text'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import usePreference from 'toro/hooks/usePreference_new'
import {
  initialSearchStateAtom,
  isEmptySearchResultsAtom,
  isInitialSuggestionsAtom,
  recommendedSearchesAtom,
  searchesByTermAtom,
  searchRecentItemsAvailableAtom,
  searchTermAtom,
  searchTotalProductCountAtom,
  suggestedItemsAtom,
  hasRecentSearchesFromCookieAtom,
  exposedSearchStatusAtom,
  showAutocompleteSuggestionsAtom,
} from 'store/search.atom'
import { useAtomValue } from 'jotai/utils'
import certonaSchemesAtoms from 'store/certona-schemes.atoms'
import PWAContext from 'components/common/PWAContext'
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import { MOBILE_VARIANTS } from 'toro/constants/mobileVariants'
import { getGASearchLocation } from 'toro/helpers/getGASearchLocation'
import { useSearchKeyboardNavigation } from './useSearchKeyboardNavigation'
import WrapIf from 'toro/components/WrapIf'
import SearchSuggestionAutocomplete from 'toro/components/SearchWidget/SearchSuggestionAutocomplete'
import { getSearchSectionAndType, getCategorySectionAndType } from './searchHelpers'
import { SystemStyleObject } from '@chakra-ui/react'
import type { SearchWidgetVariant } from 'toro/components/SearchWidget'
import { SearchSuggestionProduct } from 'toro/types/productTypes'

const EVENT_LOCATIONS = {
  footer: 'footer search bar',
  hamburger: 'hamburger menu search bar',
  header: 'header search bar',
}

const EVENT_LOCATION_MAP = {
  footer: EVENT_LOCATIONS.footer,
  mobile: EVENT_LOCATIONS.hamburger,
  mobileV2: EVENT_LOCATIONS.hamburger,
  desktop: EVENT_LOCATIONS.header,
  mobileExposed: EVENT_LOCATIONS.header,
  mobileTransparentExposed: EVENT_LOCATIONS.header,
  mobileV2RedesignExposed: EVENT_LOCATIONS.header,
}

const VIEW_ALL_PRODUCTS_THRESHOLD = 4
const VIEW_ALL_PRODUCTS_THRESHOLD_OVERLAY_REDESIGN = 12

const searchSuggestionTitleHandlers = [
  ({ isSearchOverlayRedesignWithXgen, hasRecentSearches }) => {
    if (!isSearchOverlayRedesignWithXgen) return
    return hasRecentSearches
      ? { id: 'search.keepExploring', defaultMessage: 'Keep Exploring' }
      : { id: 'search.trendingSearches', defaultMessage: 'Trending Searches' }
  },
  ({ totalProducts }) => {
    return totalProducts > 0 && { id: 'search.topSearches', defaultMessage: 'Top Searches' }
  },
  ({ isRecent }) => {
    return (
      isRecent && {
        id: 'search.recentSearchesTitle',
        defaultMessage: 'Recent Searches',
      }
    )
  },
  ({ isInitial }) => {
    return isInitial && { id: 'search.popularSearches', defaultMessage: 'Popular Searches' }
  },
]

type SearchSuggestionTitleState = {
  totalProducts: number
  isInitial: boolean
  isRecent: boolean
  isSearchOverlayRedesignWithXgen: boolean
  hasRecentSearches: boolean
}

const getSearchSuggestionTitleParams = (state: SearchSuggestionTitleState) => {
  const callback = (result, handler) => result || handler(state)
  return (
    searchSuggestionTitleHandlers.reduce(callback, null) || {
      id: 'search.searchSuggestions.topSuggestions',
      defaultMessage: 'Top Suggestions',
    }
  )
}

type SearchSuggestionsProps = {
  onClose: () => void
  styleVariant: SearchWidgetVariant
  styles: Record<string, SystemStyleObject>
}

const SearchSuggestions = ({ onClose, styleVariant, styles }: SearchSuggestionsProps) => {
  const {
    xgenPreferences: { enableXgenSearch: isXgenToggled, searchV2Features },
    einsteinRecommendation: {
      isEinsteinRecomEnabled = false,
      isEinsteinRecomEnabledSearchSuggestion = false,
      recommendorsList: einsteinRecommenderPref = {},
    },
    priceSitePreferences: { isComparablePriceValue = true },
  } = usePreference({
    EinsteinRecommendation: [
      'isEinsteinRecomEnabled',
      'isEinsteinRecomEnabledSearchSuggestion',
      'recommendorsList',
    ],
    priceSitePreferences: ['isComparablePriceValue'],
    xgenPreferences: ['enableXgenSearch', 'searchV2Features'],
  })
  const analytics = useAnalytics()
  const { isDesktop, isMobile } = useViewportType()
  const totalProducts = useAtomValue(searchTotalProductCountAtom)
  const searchQuery = useAtomValue(searchesByTermAtom)
  const currentRecommendedSearches = useAtomValue(recommendedSearchesAtom)
  const isRecent = useAtomValue(searchRecentItemsAvailableAtom)
  const isInitial = useAtomValue(isInitialSuggestionsAtom)
  const initialSearchState = useAtomValue(initialSearchStateAtom)
  const searchTerm = useAtomValue(searchTermAtom)
  const currentProducts = useAtomValue(suggestedItemsAtom)
  const isEmptySearchResults = useAtomValue(isEmptySearchResultsAtom)
  const showAutocompleteSuggestions = useAtomValue(showAutocompleteSuggestionsAtom)
  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const isSearchOverlayRedesignActive = searchOverlayRedesign && isMobile
  const isInitialForSearchV2 =
    isSearchOverlayRedesignActive && (isEmptySearchResults || !showAutocompleteSuggestions)
  const shouldRenderInitialContent = isInitial || isInitialForSearchV2
  const products = (shouldRenderInitialContent
    ? initialSearchState.products
    : currentProducts) as unknown as SearchSuggestionProduct[]
  const hasRecentSearches = useAtomValue(hasRecentSearchesFromCookieAtom)
  const isExposedSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
  const eventLocationName = isExposedSearchStatusActive ? 'mobileV2RedesignExposed' : styleVariant
  const { addImpression, selectRecommItem } = useRecommAnalytics({
    products,
    eventLocation: EVENT_LOCATION_MAP[eventLocationName],
  })
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const showCertonaBestSelling = get(appData, 'showCertonaBestSelling')
  const certonaSchemes = useAtomValue(certonaSchemesAtoms)
  const certonaTitle = get(
    certonaSchemes.find(({ scheme }) => scheme === 'searchrv1_rr'),
    'explanation'
  )

  const viewAllProductsThreshold = isSearchOverlayRedesignActive
    ? VIEW_ALL_PRODUCTS_THRESHOLD_OVERLAY_REDESIGN
    : VIEW_ALL_PRODUCTS_THRESHOLD

  const isEinsteinEnabled = isEinsteinRecomEnabled && isEinsteinRecomEnabledSearchSuggestion

  const einsteinRecommenderName =
    einsteinRecommenderPref?.['SEARCH_SUGGESTION']?.[0]?.recommenderName

  let subBrandQuery = ''
  if (appData?.isSubBrandEnabled && appData?.isSubBrandActive) {
    subBrandQuery = '&isCoachtopia=true'
  }

  const isProductFromXgen = useMemo(
    () => Boolean(products.some((product) => product?.isAiDriven)),
    [products]
  )

  const isXgenProducts = isXgenToggled && isProductFromXgen

  const title = useMemo(() => {
    let text = ''

    if (isXgenProducts) {
      text = formatMessage({
        id: `search.searchSuggestions.topProducts`,
      })
    } else if (showCertonaBestSelling && isInitial && !isRecent && certonaTitle) {
      text = certonaTitle
    } else if (isEinsteinEnabled && isInitial && !isRecent && einsteinRecommenderName) {
      text = formatMessage({
        id: `search.searchSuggestions.defaultRecommenderTitle`,
        defaultMessage: einsteinRecommenderName,
      })
    } else if (isRecent && (searchTerm.length == 0 || isInitial)) {
      text = formatMessage({ id: 'search.recentlyViewedProducts' })
    } else if (isInitial) {
      text = formatMessage({ id: 'search.bestSellingProducts' })
    } else {
      text = formatMessage({ id: 'search.searchSuggestions.topProducts' })
    }

    if (isSearchOverlayRedesignActive) {
      if (shouldRenderInitialContent && !isRecent) {
        text = formatMessage({
          id: 'search.searchSuggestions.trendingStyles',
          defaultMessage: 'Trending Styles',
        })
      } else if (shouldRenderInitialContent && isRecent) {
        text = formatMessage({
          id: 'search.searchSuggestions.justForYou',
          defaultMessage: 'Just for you',
        })
      } else {
        text = formatMessage({
          id: `search.searchSuggestions.overlayRedesign.topResults`,
          defaultMessage: 'Top results',
        })
      }
    }

    if (MOBILE_VARIANTS.includes(styleVariant) && text) {
      text = startCase(toLower(text))
    }

    return text
  }, [
    isRecent,
    shouldRenderInitialContent,
    isInitial,
    certonaTitle,
    showCertonaBestSelling,
    searchTerm,
    certonaTitle,
    isEinsteinEnabled,
    einsteinRecommenderName,
    isSearchOverlayRedesignActive,
    isXgenProducts,
  ])

  const qaData = useMemo(
    () => ({
      searchSuggestionHeader: isRecent
        ? styleVariant.includes('footer')
          ? 'hs_txt_bsp_title'
          : title === 'RECENTLY VIEWED PRODUCTS'
          ? 'cm_s_txt_pdtsugg'
          : 'hs_txt_bsp_title'
        : 'cm_txt_tp_title',
      searchSuggestionProductLink: 'cm_link_tp_viewall',
      suggestionsItems: isRecent ? null : 'cm_tp_sugglst',
      wrapper:
        styleVariant === 'footer'
          ? 'ftr_search_drawer'
          : styleVariant === 'mobile' || MOBILE_VARIANTS.includes(styleVariant)
          ? 'm_hdr_search_drawer'
          : 'd_hdr_search_drawer',
    }),
    [isRecent, styleVariant, title]
  )
  const drawerRef = useRef()

  useSearchKeyboardNavigation({ drawerRef, onClose })
  const onSuggestionItemClick = (product, idx) => () => {
    onClose()

    const { searchSection, searchType } = getSearchSectionAndType({
      isRecent,
      searchQuery,
      isSearchOverlayRedesignActive,
      isInitial,
    })

    analytics.send('searchStarted', {
      searchType,
      searchSection,
      searchTermTyped: searchQuery || 'none',
      searchTermUsed: 'none',
      searchTotal: 'undefined',
      eventLocation: getGASearchLocation(eventLocationName),
      skipXgenPayloadSet: true,
    })

    selectRecommItem({
      query: searchQuery,
      listName: title,
      product,
      idx,
      eventLocation: getGASearchLocation(eventLocationName),
    })
  }

  const onSuggestionCategoryClick = (searchTermUsed) => {
    onClose()

    const { searchSection, searchType } = getCategorySectionAndType({
      isXgenToggled,
      searchQuery,
      isRecent,
      hasRecentSearches,
      isSearchOverlayRedesignActive,
      isInitial,
    })

    analytics.send('searchStarted', {
      searchType,
      searchSection,
      searchTermTyped: searchQuery || 'none',
      searchTermUsed,
      eventLocation: getGASearchLocation(eventLocationName),
    })
  }

  const onViewAllLinkClick = () => {
    onClose()
    analytics.send('searchStarted', {
      searchType: 'recommended',
      searchSection: 'view all results',
      searchTermTyped: searchQuery,
      searchTermUsed: 'none',
      searchTotal: totalProducts,
      eventLocation: getGASearchLocation(styleVariant),
    })
  }

  const onTileVisible = useCallback(
    (product, idx) => () => {
      addImpression({ listName: title, product, idx, sendOnceInViewport: true })
    },
    [title, addImpression]
  )

  const viewAllTitle = useMemo(() => {
    if (isSearchOverlayRedesignActive) {
      return formatMessage({
        id: 'search.searchSuggestions.viewAllResults',
        defaultMessage: 'View all results',
      })
    }

    let viewAllText = formatMessage({ id: 'search.searchSuggestions.viewAll' }, { totalProducts })
    if (totalProducts && !isXgenToggled) {
      return viewAllText
    }
    return viewAllText.replace(/\s\(\w\)/g, '')
  }, [totalProducts])

  const isSearchOverlayRedesignWithXgen = isXgenToggled && isSearchOverlayRedesignActive
  const searchSuggestionTitle = useMemo(() => {
    return formatMessage(
      getSearchSuggestionTitleParams({
        totalProducts,
        isInitial,
        isRecent,
        isSearchOverlayRedesignWithXgen,
        hasRecentSearches,
      })
    )
  }, [
    totalProducts,
    isInitial,
    isRecent,
    formatMessage,
    isSearchOverlayRedesignWithXgen,
    hasRecentSearches,
  ])
  const hasItemsToShow = currentProducts.length + currentRecommendedSearches.length > 0

  const SearchSuggestionLinks = isSearchOverlayRedesignActive
    ? SearchSuggestionAutocomplete
    : SearchSuggestionCategories

  const headerStyles = isSearchOverlayRedesignActive
    ? !shouldRenderInitialContent
      ? styles.autoCompleteHeader
      : styles.pillsHeader
    : styles.searchSuggestionHeader

  return (
    <Box sx={styles.suggestions} data-qa={qaData.wrapper} ref={drawerRef}>
      {hasItemsToShow || shouldRenderInitialContent ? (
        <Flex sx={styles.suggestionsContainer}>
          <Flex flexDirection="column" sx={styles.suggestionsItemsContainer}>
            <Flex
              name="searchSuggestionWrapper"
              sx={styles.searchSuggestionWrapper}
              justifyContent="space-between"
              mb="30px"
              pr="52px"
            >
              <Text
                name="searchSuggestionHeader"
                variant="body-primary"
                size="sm"
                minWidth="150px"
                sx={headerStyles}
                data-qa={qaData.searchSuggestionHeader}
              >
                {title}
              </Text>
              {totalProducts > viewAllProductsThreshold && isDesktop && (
                <Link
                  name="searchSuggestionProductLink"
                  sx={styles.searchSuggestionProductLink}
                  minWidth={'79px'}
                  href={`${getSearchUrl(searchQuery)}${subBrandQuery}`}
                  variant="underline"
                  onClick={onViewAllLinkClick}
                  data-qa={qaData.searchSuggestionProductLink}
                >
                  {viewAllTitle}
                </Link>
              )}
            </Flex>
            <Flex sx={styles.suggestionsItems} data-qa={qaData.suggestionsItems}>
              <WrapIf
                condition={isSearchOverlayRedesignActive}
                Component={Box}
                sx={styles.searchSuggestionGrid}
              >
                {products.map((product, idx) => (
                  <SearchSuggestionItem
                    key={`${shouldRenderInitialContent ? 'initial' : 'search'}-${get(
                      product,
                      'id'
                    )}-${get(product, 'defaultColor.id', idx)}`}
                    product={product}
                    onClick={onSuggestionItemClick(product, idx)}
                    isComparablePriceValue={isComparablePriceValue}
                    onVisible={onTileVisible(product, idx)}
                    styles={styles}
                    styleVariant={styleVariant}
                  />
                ))}
              </WrapIf>
              {totalProducts > viewAllProductsThreshold && !isDesktop && (
                <WrapIf
                  condition={isSearchOverlayRedesignActive}
                  Component={Flex}
                  sx={styles.searchSuggestionViewAllProductWrapper}
                >
                  <Link
                    name="searchSuggestionViewAllProduct"
                    href={`${getSearchUrl(searchQuery)}${subBrandQuery}`}
                    onClick={onViewAllLinkClick}
                    data-qa={qaData.searchSuggestionProductLink}
                    sx={styles.searchSuggestionViewAllProduct}
                  >
                    {viewAllTitle}
                  </Link>
                </WrapIf>
              )}
            </Flex>
          </Flex>
          <Flex sx={styles.suggestionsCategories} minWidth="200px">
            <SearchSuggestionLinks
              styles={styles}
              variant={styleVariant}
              title={searchSuggestionTitle}
              subBrandQuery={subBrandQuery}
              onClick={onSuggestionCategoryClick}
            />
          </Flex>
        </Flex>
      ) : (
        !isSearchOverlayRedesignActive && (
          <Text sx={styles.noResultsCont}>
            {formatMessage({ id: 'search.searchSuggestions.NoResultsFound' })}
          </Text>
        )
      )}
    </Box>
  )
}

export default SearchSuggestions
