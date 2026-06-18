import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import SearchInput from 'toro/components/SearchWidget/SearchInput'
import Flex from 'toro/components/Flex'
import LiveStreamBadge from 'toro/components/LiveStreamBadge/LiveStreamBadge'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useCallback, useEffect, useRef } from 'react'
import { NavChevronLeftIcon as ChevronLeft, ChevronLeftIconV2 as ChevronLeftV2 } from 'toro/icons'
import { MOBILE_VARIANTS, MOBILE_VARIANTS_TYPES } from 'toro/constants/mobileVariants'
import { Fade } from '@chakra-ui/react'
import useDisclosure from 'toro/hooks/useDisclosure'
import usePreference from 'toro/hooks/usePreference_new'
import SearchSuggestionsWrapper from 'toro/components/SearchWidget/SearchSuggestionsWrapper'
import {
  exposedSearchStatusAtom,
  invalidSearchTermErrorAtom,
  isSearchV2EnabledAtom,
} from 'store/search.atom'
import get from 'lodash/get'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'

const SEARCH_INPUT_ID = 'SearchInput'

const SearchWidgetMobile = ({
  isPopUpOpen,
  setPopUpOpen,
  styleVariant,
  value,
  onBlur,
  compact,
  onClose,
  onClear,
  toRenderItems,
  onMenuClose,
  liveEventConfig,
  styles,
  variant,
  hasAnimatedContainer,
  ...inputProps
}) => {
  const {
    generalConfiguration: { enableExposedSearchHeader },
    xgenPreferences: { searchV2Features },
  } = usePreference({
    generalConfiguration: ['enableExposedSearchHeader'],
    xgenPreferences: ['searchV2Features'],
  })
  const searchInputWrapperRef = useRef<HTMLDivElement>(null)
  const [isExposedSearchStatusActive, setExposedSearchStatusAtom] = useAtom(exposedSearchStatusAtom)
  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const { isOpen } = useDisclosure({ isOpen: toRenderItems })
  const isSearchV2Enabled = useAtomValue(isSearchV2EnabledAtom)
  const isExposedMobileVariant = [
    MOBILE_VARIANTS_TYPES.MOBILE_EXPOSED,
    MOBILE_VARIANTS_TYPES.MOBILE_TRANSPARENT_EXPOSED,
  ].includes(styleVariant)

  const setInvalidSearchTermError = useUpdateAtom(invalidSearchTermErrorAtom)

  useEffect(() => {
    return () => {
      onClear?.()
    }
  }, [])

  const handleClose = () => {
    if (isExposedSearchStatusActive) {
      onClose?.()
      setExposedSearchStatusAtom(false)
    }
    setPopUpOpen?.(false)
    onClear?.()
    onBlur?.()
    onMenuClose?.()
    setInvalidSearchTermError(false)
    if (compact) {
      onClose?.()
    }
  }
  const _onClose = useCallback(() => {
    searchInputWrapperRef.current?.scrollIntoView()
    onClose?.()
  }, [onClose])

  const shouldRenderLeftArrow = isPopUpOpen && !searchOverlayRedesign

  return (
    <>
      <Flex
        flexDirection="column"
        sx={styles.searchWrapper}
        className={
          hasAnimatedContainer ? `search-widget-animation${isPopUpOpen ? ' open' : ''}` : undefined
        }
      >
        <Flex ref={searchInputWrapperRef} className="input-wrapper" sx={styles.inputWrapper}>
          {shouldRenderLeftArrow && (
            <Button
              onClick={handleClose}
              variant="icon-only"
              sx={styles.searchBackButton}
              {...(variant === 'mobileV2' ? { 'data-qa': 'icon-chevron-leftV2' } : undefined)}
            >
              {MOBILE_VARIANTS.includes(variant) ? (
                <ChevronLeftV2 width="24" height="24" />
              ) : (
                <ChevronLeft width="24" height="24" />
              )}
            </Button>
          )}
          <SearchInput
            {...inputProps}
            id={SEARCH_INPUT_ID}
            styleVariant={styleVariant}
            value={value}
            onBlur={onBlur}
            onClear={onClear}
            data-qa="m_hdr_search_wrapper"
            styles={styles}
            variant={variant}
            handleClose={handleClose}
          />
        </Flex>
        {!isExposedMobileVariant && !isSearchV2Enabled && (
          <LiveStreamBadge config={liveEventConfig} styleVariant={styleVariant} />
        )}
        {!isExposedMobileVariant && toRenderItems && (
          <Box>
            <SearchSuggestionsWrapper
              styleVariant={styleVariant}
              onClose={_onClose}
              styles={styles}
              isSearchActive={isPopUpOpen}
            />
          </Box>
        )}
        {isExposedMobileVariant && enableExposedSearchHeader && (
          <Fade
            in={isOpen}
            transition={{
              exit: {
                duration: 0.3,
              },
            }}
            unmountOnExit
          >
            <Box sx={styles.suggestionsAnimatedContainer}>
              <SearchSuggestionsWrapper
                styleVariant={styleVariant}
                onClose={_onClose}
                styles={styles}
                isSearchActive={isPopUpOpen}
              />
            </Box>
          </Fade>
        )}
      </Flex>
    </>
  )
}

export default withErrorBoundaryWrapper(SearchWidgetMobile)
