import { useRef } from 'react'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import throttle from 'lodash/throttle'
import Box from 'toro/components/Box'
import SearchInput from 'toro/components/SearchWidget/SearchInput'
import isBrowser from 'toro/helpers/isBrowser'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import dynamic from 'next/dynamic'
import type { SearchWidgetVariantProps } from 'toro/components/SearchWidget/searchHelpers'

const SearchSuggestions = dynamic(() => import('toro/components/SearchWidget/SearchSuggestions'), {
  ssr: false,
})

const SEARCH_INPUT_ID = 'SearchInput'

const SearchWidgetDesktop = ({
  isPopUpOpen,
  setPopUpOpen,
  styleVariant,
  value,
  variant,
  onClear,
  styles,
  ...inputProps
}: SearchWidgetVariantProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useOutsideClick({
    ref,
    handler: (e: Event) => {
      if ((e.target as HTMLElement).id === SEARCH_INPUT_ID || !isPopUpOpen) {
        return
      }
      onClear?.()
      setPopUpOpen?.(false)
    },
  })

  const getScrollY = (): number => {
    return isBrowser() ? window.scrollY || window.pageYOffset : 0
  }

  const onScroll = throttle(() => {
    if (getScrollY() > 280) {
      handleOnNavigation()
    }
  }, 200)

  const handleOnNavigation = (): void => {
    setPopUpOpen?.(false)
    onClear?.()
  }

  return (
    <>
      <SearchInput
        onClear={onClear}
        {...inputProps}
        id={SEARCH_INPUT_ID}
        onScroll={onScroll}
        styleVariant={styleVariant}
        value={value}
        variant={variant}
        styles={styles}
      />

      {isPopUpOpen && (
        <>
          <Box
            position="absolute"
            top="120px"
            left={0}
            right={0}
            bottom={0}
            background="rgba(0, 0, 0, 0.5)"
            zIndex={1000}
          >
            <Box ref={ref}>
              <SearchSuggestions
                onClose={handleOnNavigation}
                styleVariant={styleVariant}
                styles={styles}
              />
            </Box>
          </Box>
          <Box sx={styles?.backdrop} />
        </>
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(SearchWidgetDesktop)
