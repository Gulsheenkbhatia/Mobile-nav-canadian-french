import React, { useState, useContext, useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import PWAContext from 'components/common/PWAContext'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useRouter } from 'next/router'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import {
  exposedSearchStatusAtom,
  isEmptySearchResultsAtom,
  isSearchInDrawerActiveAtom,
  isSearchV2EnabledAtom,
  searchTermAtom,
  setSearchTermAtom,
  invalidSearchTermErrorAtom,
} from 'store/search.atom'
import { activeMobileMenuBrandBaseAtom, setOneSiteMainAtoms } from 'store/menu-data.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { MOBILE_VARIANTS, MOBILE_VARIANTS_TYPES } from 'toro/constants/mobileVariants'
import { getGASearchLocation } from 'toro/helpers/getGASearchLocation'
import { BRAND } from 'toro/constants/cookies'
import SearchWidgetDesktop from 'toro/components/SearchWidget/SearchWidgetDesktop'
import SearchWidgetMobile from 'toro/components/SearchWidget/SearchWidgetMobile'
import SearchWidgetFooter from 'toro/components/SearchWidget/SearchWidgetFooter'
import { trackXgenEventAtom } from 'store/xgen-tracking.atom'
import { usePrevious } from '@chakra-ui/react'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

export type SearchWidgetVariant =
  | 'desktop'
  | 'mobile'
  | 'footer'
  | 'footerMobile'
  | 'mobileV2'
  | 'mobileV2Redesign'
  | 'mobileExposed'
  | 'mobileTransparentExposed'
  | 'mobileV2RedesignExposed'
  | 'searchV2'

/** `styleVariant` value passed to layout components (can differ from the `variant` prop for redesign rows). */
export type SearchWidgetLayoutStyleType =
  | 'desktop'
  | 'mobile'
  | 'footer'
  | 'footerMobile'
  | 'mobileV2'
  | 'mobileExposed'
  | 'mobileTransparentExposed'

type SearchWidgetLayoutComponent =
  | typeof SearchWidgetDesktop
  | typeof SearchWidgetMobile
  | typeof SearchWidgetFooter

type SearchWidgetVariantsMap = Record<
  SearchWidgetVariant,
  {
    type: SearchWidgetLayoutStyleType
    component: SearchWidgetLayoutComponent
  }
>

type SearchWidgetProps = {
  variant: SearchWidgetVariant
  onNavigation?: () => void
  compact?: boolean
  placeholder?: any
  focusInput?: any
  onSearchInputFocus?: () => void
  toRenderItems?: boolean
  onMenuClose?: () => void
  liveEventConfig?: any
  hasAnimatedContainer?: boolean
}

/**
 * SearchWidget
 *
 * @param  {string} variant desktop|mobile|footer|mobileV2|mobileExposed|mobileTransparentExposed (default 'desktop')
 */

const SearchWidget = React.forwardRef<JSX.Element, SearchWidgetProps>(
  (
    {
      variant = 'desktop',
      onNavigation,
      compact,
      placeholder,
      focusInput,
      onSearchInputFocus,
      toRenderItems = true,
      onMenuClose,
      liveEventConfig = {},
      hasAnimatedContainer = false,
    },
    ref
  ) => {
    const router = useRouter()
    const { appData } = useContext(PWAContext)
    const analytics = useAnalytics()
    const [isPopUpOpen, setPopUpOpen] = useState(false)
    const searchTerm = useAtomValue(searchTermAtom)
    const setSearchTerm = useUpdateAtom(setSearchTermAtom)
    const prevPopUpOpen = usePrevious(isPopUpOpen)
    const { formatMessage } = useIntl()
    const trackXgenEvent = useUpdateAtom(trackXgenEventAtom)
    const isSearchInDrawerActive = useAtomValue(isSearchInDrawerActiveAtom)
    const isEmptySearchResults = useAtomValue(isEmptySearchResultsAtom)
    const isSearchV2Enabled = useAtomValue(isSearchV2EnabledAtom)
    const { search: isXgenSearchEnabled = false } = useAtomValue(xgenFeaturesAtom)
    const activeBrand = useAtomValue(activeMobileMenuBrandBaseAtom)
    const persistOneSiteState = useUpdateAtom(setOneSiteMainAtoms)

    // Prevent body scroll when search drawer is active
    useEffect(() => {
      if (isSearchInDrawerActive) {
        toggleBodyScroll(false)
      } else {
        toggleBodyScroll(true)
      }
      return () => {
        toggleBodyScroll(true)
      }
    }, [isSearchInDrawerActive])

    const placeholderText =
      placeholder ||
      formatMessage({
        id: 'header.navigation.search',
        defaultMessage: 'Search',
      })

    const [searchPlaceHolder, setSearchPlaceholder] = useState(placeholderText)
    const preferSearchOverlayRedesign = isSearchV2Enabled && isSearchInDrawerActive
    const isExposedSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
    const setInvalidSearchTermError = useUpdateAtom(invalidSearchTermErrorAtom)

    const styles = useMultiStyleConfig('SearchWidget', {
      variant: preferSearchOverlayRedesign ? 'searchV2' : variant,
      isEmptySearchResults,
    })

    const variants: SearchWidgetVariantsMap = {
      desktop: { type: 'desktop', component: SearchWidgetDesktop },
      mobile: { type: 'mobile', component: SearchWidgetMobile },
      mobileV2: { type: MOBILE_VARIANTS_TYPES.MOBILE_V2, component: SearchWidgetMobile },
      mobileV2Redesign: { type: MOBILE_VARIANTS_TYPES.MOBILE_V2, component: SearchWidgetMobile },
      mobileV2RedesignExposed: {
        type: MOBILE_VARIANTS_TYPES.MOBILE_V2,
        component: SearchWidgetMobile,
      },
      mobileExposed: { type: MOBILE_VARIANTS_TYPES.MOBILE_EXPOSED, component: SearchWidgetMobile },
      mobileTransparentExposed: {
        type: MOBILE_VARIANTS_TYPES.MOBILE_TRANSPARENT_EXPOSED,
        component: SearchWidgetMobile,
      },
      footer: { type: 'footer', component: SearchWidgetFooter },
      footerMobile: { type: 'footerMobile', component: SearchWidgetFooter },
      searchV2: { type: MOBILE_VARIANTS_TYPES.MOBILE_V2, component: SearchWidgetMobile },
    }

    const Component = variants[variant].component
    const styleVariant = variants[variant].type as SearchWidgetVariant

    const inputFocusedPlaceholderText =
      (styleVariant.includes('mobile') && isSearchV2Enabled) || isExposedSearchStatusActive
        ? formatMessage({
            id: 'header.navigation.searchOverlayHelpText',
            defaultMessage: 'What are you looking for?',
          })
        : formatMessage({
            id: 'header.navigation.searchHelpText',
            defaultMessage: 'What can we help you find?',
          })

    const handleInputFocus = () => {
      setPopUpOpen(true)
      setSearchPlaceholder(inputFocusedPlaceholderText)
      if (onSearchInputFocus) {
        onSearchInputFocus()
      }
    }

    const handleChanges = (e) => {
      setInvalidSearchTermError(false)
      setSearchTerm(e.target.value)
    }

    const handleClear = () => {
      setSearchTerm('')
      setInvalidSearchTermError(false)
    }

    const handleOnNavigate = () => {
      onNavigation?.()
      setPopUpOpen(false)
    }

    const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
      if (!searchTerm?.trim()) {
        setInvalidSearchTermError(true)
        return
      }

      analytics.send('searchStarted', {
        searchType: 'typed',
        searchTermTyped: searchTerm,
        searchTermUsed: searchTerm,
        eventLocation: getGASearchLocation(variant),
      })
      setPopUpOpen(false)
      handleClear()
      handleOnBlur()
      if (styleVariant === 'mobile' || MOBILE_VARIANTS.includes(styleVariant)) {
        onNavigation?.()
      }
      let subBrandQuery = ''
      if (appData?.isSubBrandEnabled) {
        const currentBrandCookie = Cookies.get(BRAND)
        if (currentBrandCookie === appData?.subBrand) {
          subBrandQuery = '&isCoachtopia=true'
        }
      }
      let searchUrl = `${getSearchUrl(searchTerm)}${subBrandQuery}`
      if (isXgenSearchEnabled) {
        searchUrl = searchUrl.replace(/%20|\s/g, '+')
      }
      if (activeBrand) {
        persistOneSiteState(activeBrand)
      }
      router.push(searchUrl)
      ;(e?.target as HTMLElement | undefined)?.blur()
    }

    const handleOnBlur = () => {
      setSearchPlaceholder(placeholderText)
    }

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!searchTerm) {
          setInvalidSearchTermError(true)
          return
        }
        const code = e.keyCode || e.which
        if (code === 13) {
          handleSubmit(e)
        }
      },
      [searchTerm]
    )

    useEffect(() => {
      if (typeof prevPopUpOpen !== 'undefined' && prevPopUpOpen !== isPopUpOpen) {
        trackXgenEvent({ eventType: 'searchOpen', eventData: { value: isPopUpOpen.toString() } })
      }
    }, [isPopUpOpen])

    return (
      <Component
        isPopUpOpen={isPopUpOpen}
        ref={ref}
        value={searchTerm}
        onFocus={handleInputFocus}
        placeholder={searchPlaceHolder}
        onChange={handleChanges}
        onClear={handleClear}
        onSubmit={handleSubmit}
        onBlur={handleOnBlur}
        onKeyPress={handleKeyPress}
        setPopUpOpen={setPopUpOpen}
        styleVariant={styleVariant}
        compact={compact}
        onClose={handleOnNavigate}
        variant={variant}
        focusInput={focusInput}
        toRenderItems={toRenderItems}
        onMenuClose={onMenuClose}
        liveEventConfig={liveEventConfig}
        styles={styles}
        hasAnimatedContainer={hasAnimatedContainer}
      />
    )
  }
)

export default React.memo(SearchWidget)
