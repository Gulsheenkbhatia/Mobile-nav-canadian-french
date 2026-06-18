import { useRef, useEffect } from 'react'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import Box from 'toro/components/Box'
import SearchInput from 'toro/components/SearchWidget/SearchInput'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import type { SearchWidgetVariantProps } from 'toro/components/SearchWidget/searchHelpers'

const SearchSuggestions = dynamic(() => import('toro/components/SearchWidget/SearchSuggestions'), {
  ssr: false,
})

const SEARCH_INPUT_ID = 'SearchInput'

const SearchWidgetFooter = ({
  isPopUpOpen,
  value,
  setPopUpOpen,
  styleVariant,
  variant,
  onClear,
  styles,
  ...inputProps
}: SearchWidgetVariantProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', onClear)
    return () => {
      router.events.off('routeChangeComplete', onClear)
    }
  }, [router.events, onClear])

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

  const handleOnNavigation = (): void => {
    setPopUpOpen?.(false)
    onClear?.()
  }

  return (
    <>
      <SearchInput
        {...inputProps}
        id={SEARCH_INPUT_ID}
        onClear={onClear}
        value={value}
        styleVariant={styleVariant}
        variant={variant}
        styles={styles}
      />
      {isPopUpOpen && (
        <Box ref={ref}>
          <SearchSuggestions
            onClose={handleOnNavigation}
            styleVariant={styleVariant}
            styles={styles}
          />
        </Box>
      )}
    </>
  )
}

export default SearchWidgetFooter
