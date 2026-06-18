import { SystemStyleObject } from '@chakra-ui/react'

export interface SearchWidget {
  variant: string
  siteId: string
  onSearchInputFocus: () => void
}

export interface HeaderRightContentProps {
  isSWOutlet: boolean
  siteId: string
  styles: Record<string, SystemStyleObject | any>
  initializeSearchState: () => void
  onWishlistClick: () => void
  onClick: () => void
  setIsMiniCartRef: (ref: React.RefObject<any>) => void
  setIsHoveredOnMiniCart: (isHovered: boolean) => void
  enableNewGlobalHeader: boolean
  liveEventConfig: any
  setOpenModal: (value: boolean) => void
  exposeMobileSearchBar: boolean
}

export interface HeaderLeftContentProps {
  styles: Record<string, SystemStyleObject | any>
  isOutlet: boolean
  onClick: () => void
  isStoreReplace: boolean
  onStoresClick: () => void
  enableNewGlobalHeader: boolean
  exposeMobileSearchBar: boolean
  initializeSearchState: () => void
}
