import { useRef, useEffect, useMemo } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import Input from 'toro/components/Input'
import InputGroup from 'toro/components/InputGroup'
import InputRightElement from 'toro/components/InputRightElement'
import InputLeftElement from 'toro/components/InputLeftElement'
import Flex from 'toro/components/Flex'
import isBrowser from 'toro/helpers/isBrowser'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import { SystemStyleObject, useMultiStyleConfig } from '@chakra-ui/react'
import {
  CloseIcon as ClearIcon,
  CloseSearchExposedIcon,
  SearchIconV2,
  SearchOverlayCloseIcon,
} from 'toro/icons'
import SearchOverlayIcon from 'toro/icons/search.svg'
import { useIntl } from 'react-intl'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  exposedSearchStatusAtom,
  invalidSearchTermErrorAtom,
  isEmptySearchResultsAtom,
  isSearchInDrawerActiveAtom,
  recommendedSearchesAtom,
  withPillSuggestionsAtom,
} from 'store/search.atom'
import { MOBILE_VARIANTS_TYPES, MOBILE_VARIANTS } from 'toro/constants/mobileVariants'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

function getInputGroupWidth(placeholder, isDesktop, variant) {
  if (variant == 'desktop' && isDesktop) {
    return placeholder !== 'Search' ? '200px' : '150px'
  }
  if (variant == 'mobile') {
    return placeholder === 'Search' ? '100%' : '95%'
  }
  if (variant == 'footer') {
    return '100%'
  }
  return null
}

type SearchInputProps = {
  onFocus: () => void
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  onSubmit: () => void
  onBlur: () => void
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
  id: string
  variant: string
  focusInput: (ref: React.RefObject<HTMLInputElement>) => void
  onScroll: () => void
  autoComplete: string
  styles: Record<string, SystemStyleObject>
  handleClose: () => void
  styleVariant: string
}

const SearchInput = (props: Partial<SearchInputProps>) => {
  const {
    onFocus,
    placeholder,
    value,
    onChange,
    onClear,
    onSubmit,
    onBlur,
    onKeyPress,
    id,
    variant,
    focusInput,
    onScroll,
    autoComplete = 'off',
    styles,
    handleClose,
    styleVariant,
  } = props
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const { isDesktop } = useViewportType()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef(null)
  const { SearchIcon } = useMultiStyleConfig('Icons') as {
    SearchIcon: React.ComponentType<{ label: string }>
  }
  const { formatMessage } = useIntl()
  const isExposedSearchStatusActive = useAtomValue(exposedSearchStatusAtom)
  const {
    xgenPreferences: { searchV2Features },
  } = usePreference({
    xgenPreferences: ['searchV2Features'],
  })
  useEffect(() => {
    if (isExposedSearchStatusActive && variant === 'mobileV2Redesign') {
      setTimeout(() => {
        searchInputRef.current?.focus({ preventScroll: true })
      }, 600)
    }
  }, [isExposedSearchStatusActive])
  const isSearchInDrawerActive = useAtomValue(isSearchInDrawerActiveAtom)

  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const navSearchRedesign = get(searchV2Features, 'NavSearchRedesign', false)

  const handleClear = () => {
    onClear?.()
    searchInputRef.current?.focus()
  }
  const handleWrapperKeyDown = (e, inputRef) => {
    const isFromInput = e.target === inputRef.current
    if ((e.key === ' ' || e.key === 'Enter') && !isFromInput) {
      e.preventDefault()
      inputRef.current?.focus()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
    }
  }
  const handlerFocusInput = () => {
    onFocus?.()
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    focusInput?.(searchInputRef)
  }, [])

  const handleOnScrollClear = () => {
    /* this if need to prevent clear and scroll on mobile and tablet devices and for footer */
    if (isBrowser() && variant !== 'desktop') {
      return
    }
    if (isBrowser() && isDesktop && window.scrollY < 300) {
      onScroll?.()
    } else {
      onScroll?.()
      onClear?.()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleOnScrollClear, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleOnScrollClear)
    }
  }, [])

  const dataQA = useMemo(() => {
    return {
      wrapper: getDataQAWrapper(variant),
      rightElement: getDataQARightElement(variant),
      input: getDataQAInput(variant),
      reset: 'cm_icon_search_reset',
    }
  }, [variant])

  const isMobileVariant = MOBILE_VARIANTS.includes(styleVariant)
  const isExposedMobileVariant = [
    MOBILE_VARIANTS_TYPES.MOBILE_EXPOSED,
    MOBILE_VARIANTS_TYPES.MOBILE_TRANSPARENT_EXPOSED,
  ].some((v) => v === styleVariant)

  const CloseIcon =
    searchOverlayRedesign && isSearchInDrawerActive
      ? SearchOverlayCloseIcon
      : CloseSearchExposedIcon

  const isEmptySearchResults = useAtomValue(isEmptySearchResultsAtom)
  const recommendedSearches = useAtomValue(recommendedSearchesAtom)
  const withPillSuggestions = useAtomValue(withPillSuggestionsAtom)
  const invalidSearchTermError = useAtomValue(invalidSearchTermErrorAtom)
  const setInvalidSearchTermError = useUpdateAtom(invalidSearchTermErrorAtom)

  const searchInputLabel = formatMessage({
    id: 'header.navigation.search',
    defaultMessage: 'Search',
  })

  const inputGroupBorderRadius =
    (withPillSuggestions || recommendedSearches.length === 0) &&
    !isEmptySearchResults &&
    !invalidSearchTermError
      ? '0 0 var(--spacing-3) var(--spacing-3)'
      : '0px'

  function onClickSearchIcon() {
    if (value) {
      onSubmit?.()
    } else {
      setInvalidSearchTermError(true)
      handlerFocusInput?.()
    }
  }

  return (
    <Flex
      w="100%"
      alignItems="center"
      justifyContent="flex-end"
      sx={styles.searchInputGroupWrapper}
      className={isPDPv5_1 ? 'desktop-input-search' : null}
      borderRadius={inputGroupBorderRadius}
    >
      <InputGroup
        variant={variant}
        ref={wrapperRef}
        w={getInputGroupWidth(placeholder, isDesktop, variant)}
        sx={styles.inputGroup}
        data-qa={dataQA.wrapper}
        tabIndex={0}
        onKeyDown={(e) => handleWrapperKeyDown(e, searchInputRef)}
      >
        <Input
          id={id}
          ref={searchInputRef}
          variant="unstyled"
          size="sm"
          onBlur={onBlur}
          tabIndex={-1}
          onFocus={handlerFocusInput}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          onKeyPress={onKeyPress}
          data-qa={dataQA.input}
          sx={styles.input}
          flex={1}
          className="searchIn"
          aria-label={searchInputLabel}
          autoComplete={autoComplete}
          enterKeyHint="search"
        />
        <Box sx={styles.inputRightElementsBlock} data-qa={dataQA.wrapper}>
          {value && !isMobileVariant && (
            <InputRightElement
              cursor="pointer"
              data-qa={dataQA.reset}
              onClick={handleClear}
              sx={styles.clearIcon}
              position={'relative'}
              tabIndex={value ? 0 : -1}
            >
              <ClearIcon width="24" height="24" />
            </InputRightElement>
          )}
          <InputRightElement
            cursor="pointer"
            tabIndex={-1}
            data-qa={dataQA.rightElement}
            onClick={onClickSearchIcon}
            sx={styles.searchIcon}
            id={id}
            title={searchInputLabel}
          >
            {(searchOverlayRedesign && isSearchInDrawerActive) || navSearchRedesign ? (
              <SearchOverlayIcon height="16px" width="16px" />
            ) : isMobileVariant ? (
              <SearchIconV2 />
            ) : (
              <SearchIcon label={id} />
            )}
          </InputRightElement>
        </Box>
        {value && isMobileVariant && (
          <InputLeftElement
            cursor="pointer"
            data-qa={dataQA.reset}
            onClick={handleClear}
            sx={{ ...styles.clearIcon, ...(styles.clearIconMobile || {}) }}
            position={'relative'}
          >
            <Box>
              {formatMessage({
                id: 'search.searchInput.clear',
                defaultMessage: 'clear',
              })}
            </Box>
          </InputLeftElement>
        )}
      </InputGroup>
      {((isExposedMobileVariant && isExposedSearchStatusActive) ||
        (searchOverlayRedesign && isSearchInDrawerActive)) && (
        <Box
          cursor="pointer"
          data-qa={dataQA.reset}
          onClick={handleClose}
          sx={{ ...styles.clearIcon, ...(styles.closeIconMobile || {}) }}
          position={'relative'}
        >
          <CloseIcon width="24" height="24" />
        </Box>
      )}
    </Flex>
  )
}

const getDataQAInput = (variant) => {
  switch (variant) {
    case 'desktop':
      return 'cm_inp_field_search'
    case 'footer':
      return 'cm_inp_field_search'
    default:
      return 'cm_inp_field_search'
  }
}
const getDataQARightElement = (variant) => {
  switch (variant) {
    case 'desktop':
      return 'cm_icon_search'
    case 'footer':
      return 'cm_icon_search'
    default:
      return 'cm_icon_search'
  }
}
const getDataQAWrapper = (variant) => {
  switch (variant) {
    case 'desktop':
      return 'd_hdr_search_wrapper'
    case 'footer':
      return 'ftr_search_wrapper'
    default:
      return 'm_hdr_search_wrapper'
  }
}

export default withErrorBoundaryWrapper(SearchInput)
