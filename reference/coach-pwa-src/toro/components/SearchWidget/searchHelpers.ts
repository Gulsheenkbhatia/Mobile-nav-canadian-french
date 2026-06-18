import type { ChangeEvent, KeyboardEvent, RefObject } from 'react'
import type { SystemStyleObject } from '@chakra-ui/react'
import type { SearchWidgetVariant } from 'toro/components/SearchWidget'

/** Shared props for SearchWidget layout variants (e.g. desktop, footer) that wrap SearchInput and suggestions. */
export type SearchWidgetVariantProps = {
  isPopUpOpen?: boolean
  setPopUpOpen?: (open: boolean) => void
  styleVariant?: SearchWidgetVariant
  value?: string
  variant?: string
  onClear?: () => void
  styles?: Record<string, SystemStyleObject>
  onFocus?: () => void
  placeholder?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit?: () => void
  onBlur?: () => void
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void
  focusInput?: (ref: RefObject<HTMLInputElement>) => void
  autoComplete?: string
  handleClose?: () => void
  compact?: boolean
  onClose?: () => void
  toRenderItems?: boolean
  onMenuClose?: () => void
  liveEventConfig?: Record<string, unknown>
  hasAnimatedContainer?: boolean
}

interface SearchSectionParams {
  isRecent?: boolean
  searchQuery?: string
  isSearchOverlayRedesignActive?: boolean
  isInitial?: boolean
}

interface CategorySectionParams {
  isXgenToggled?: boolean
  searchQuery?: string
  isRecent?: boolean
  hasRecentSearches?: boolean
  isSearchOverlayRedesignActive?: boolean
  isInitial?: boolean
}

interface SectionAndType {
  searchSection: string
  searchType: string
}

export const getSearchSectionAndType = ({
  isRecent,
  searchQuery,
  isSearchOverlayRedesignActive,
  isInitial,
}: SearchSectionParams): SectionAndType => {
  switch (true) {
    case isSearchOverlayRedesignActive && isInitial && !isRecent:
      return { searchSection: 'trending products', searchType: 'product' }

    case isSearchOverlayRedesignActive && isInitial && isRecent:
      return { searchSection: 'just for you', searchType: 'recent + product' }

    case isRecent && !searchQuery:
      return { searchSection: 'Recently Viewed Products', searchType: 'product' }

    case isInitial:
      return { searchSection: 'popular product', searchType: 'product' }

    default:
      return { searchSection: 'Top Products', searchType: 'product' }
  }
}

export const getCategorySectionAndType = ({
  isXgenToggled,
  searchQuery,
  isRecent,
  hasRecentSearches,
  isSearchOverlayRedesignActive,
  isInitial,
}: CategorySectionParams): SectionAndType => {
  const defaultSearchType = isRecent ? 'recent' : 'recommended'
  const isInitialWithRedesign = isSearchOverlayRedesignActive && isInitial

  switch (true) {
    case isXgenToggled && !!searchQuery:
      return { searchSection: 'Top Searches', searchType: defaultSearchType }

    case hasRecentSearches:
      return { searchSection: 'keep exploring', searchType: 'recent + recommended' }

    case isInitialWithRedesign && (!searchQuery || !hasRecentSearches):
      return { searchSection: 'trending searches', searchType: 'recommended' }

    case isRecent:
      return { searchSection: 'recent search', searchType: defaultSearchType }

    default:
      return { searchSection: 'Top Searches', searchType: defaultSearchType }
  }
}
