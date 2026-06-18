import { atomFamily, atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atom } from 'jotai'
import _get from 'lodash/get'
import { visibleTilesPathsMap } from 'toro/constants/utils.plp'
import {
  STORAGE_FIRST_PDP_VIEWED,
  STORAGE_FILTER_FOCUS_TOOLTIP_SHOWN,
} from 'toro/constants/storageIds'
import { isPlpV3PrefEnabled } from 'toro/helpers/plpTemplate'
import { PlpSizeDrawerSizes } from 'toro/components/list/PlpSizeDrawer/types'
import { AnalyticsData } from 'toro/hooks/useAddToCart'
import isBoolean from 'lodash/isBoolean'

type VisibleTilesAtomFamilyType = {
  id: string
}

type SetTileVisibilityAtomType = {
  urlPath: string
  tileIndex: number
  visible: boolean
}

type QvProductAnalyticsDataAtomType = {
  on_image_badge?: string
  upper_placement_badge?: string
  lower_placement_badge?: string
  upper_misc_badge?: string
  promo_sale_badge?: string
  marketing_message_badge?: string
}

const getNextVisibleTiles = (
  visibleTiles: number[],
  visible: boolean,
  tileIndex: number
): number[] | undefined => {
  const visibleTileIndex = visibleTiles.findIndex((index) => index === tileIndex)
  if (visible) {
    if (visibleTileIndex === -1) {
      return [...visibleTiles, tileIndex]
    }
  } else {
    if (visibleTileIndex !== -1) {
      return visibleTiles.filter((id) => tileIndex !== id)
    }
  }
}

export const visibleTilesAtomFamily = atomFamily(
  () => atom<number[]>([]),
  (a: VisibleTilesAtomFamilyType, b: VisibleTilesAtomFamilyType) => a.id === b.id
)
export const setTileVisibilityForPathAtom = atom(
  null,
  (get, set, { urlPath, tileIndex, visible }: SetTileVisibilityAtomType) => {
    if (!urlPath) {
      return
    }

    const nextVisibleTiles = getNextVisibleTiles(
      get(visibleTilesAtomFamily({ id: urlPath })),
      visible,
      tileIndex
    )
    if (nextVisibleTiles !== undefined) {
      set(visibleTilesAtomFamily({ id: urlPath }), nextVisibleTiles)
      visibleTilesPathsMap.set(urlPath, nextVisibleTiles)
    }
  }
)

export const qvProductAnalyticsDataAtom = atom<QvProductAnalyticsDataAtomType>({})

export const getIsPlpV3 = (preferences, pageProps) => {
  const deviceType = _get(pageProps, 'deviceType')
  const isMobile = deviceType === 'smartphone' || deviceType === 'mobile'
  const isDesktop = deviceType === 'desktop'
  const config = _get(preferences, 'plpTemplateConfigurations', {})
  const plpV3PrefEnabledMobile = isPlpV3PrefEnabled(config.plpTemplateVersion)
  const plpV3PrefEnabledDesktop = isPlpV3PrefEnabled(config.plpTemplateVersionDesktop)

  return (plpV3PrefEnabledMobile && isMobile) || (plpV3PrefEnabledDesktop && isDesktop)
}

export const getIsCompletePlpV3Desktop = (preferences, pageProps) => {
  const isPlpV3 = getIsPlpV3(preferences, pageProps)
  const config = _get(preferences, 'plpTemplateConfigurations', {})
  const deviceType = _get(pageProps, 'deviceType')
  const isDesktop = deviceType === 'desktop'
  return isDesktop && isPlpV3 && config.plpTemplateVersionDesktop === 'PLPV3.1'
}

export const isPlpV3Atom = atom(false)
export const isCompletePlpV3DesktopAtom = atom(false)

export const firstPDPViewAtom = atomWithStorage<number>(STORAGE_FIRST_PDP_VIEWED, 0)

export const enableVisuallySimilarFromCategoryAtom = atom(false)

export const addToBagSizesAtom = atom<PlpSizeDrawerSizes>([])
export const sizeDrawerVgIdAtom = atom('')

export const sizeDrawerAnalyticsDataAtom = atom<AnalyticsData>({})

export const whitelistedLastVisitedPlpAtom = atom<string>(undefined)

export const isOnModelPlp2UpAtom = atom(false)

export const isShopByBrowseAllEnabledAtom = atom(false)

export const getOnModelPlp2Up = (pageData) => {
  const onModelPlpSequence = _get(pageData, 'onModel.onModelPlpSequence')
  const showOnModel2Up = _get(pageData, 'onModel.showOnModel2Up')

  return showOnModel2Up && !!onModelPlpSequence?.length
}

export const onModelAtom = atom<{
  onModelPlpSequence?: string[]
  isOnModelTabActive?: boolean
  isOnModelPLPToggleEnabled?: boolean
  isOnModel2UpToggleEnabled?: boolean
  showOnModel2Up?: boolean
}>({})

export const onModelPlpSequenceAtom = atom((get) => {
  const onModel = get(onModelAtom)
  const sequence = _get(onModel, 'onModelPlpSequence')
  const isOnModelPLPToggleEnabled = _get(onModel, 'isOnModelPLPToggleEnabled')
  const isModelViewActive = get(isModelViewActiveAtom)

  if (isOnModelPLPToggleEnabled) {
    return isModelViewActive ? sequence : null
  }

  return sequence
})

export enum ModelToggleView {
  Model = 'Model',
  Product = 'Product',
}

export const modelToggleViewAtom = atom<ModelToggleView>(ModelToggleView.Model)

export const isModelViewActiveAtom = atom(
  (get) => get(modelToggleViewAtom) === ModelToggleView.Model
)

export const isShopByStickyFiltersEnabledAtom = atom(false)

export const filterFocusTooltipShownAtom = atomWithStorage<boolean>(
  STORAGE_FILTER_FOCUS_TOOLTIP_SHOWN,
  false,
  createJSONStorage<boolean>(() => sessionStorage)
)

export const plpRecsFetchedAtom = atom<string>('')
export const setPlpRecsFetchedAtom = atom(null, (get, set, fetched: string) => {
  if (fetched === get(plpRecsFetchedAtom)) {
    return
  }
  set(plpRecsFetchedAtom, fetched)
})

export const hasVisitedPdpInSessionAtom = atom(false)
export const setHasVisitedPdpInSessionAtom = atom(null, (get, set, visited: boolean) => {
  if (!isBoolean(visited) || visited === get(hasVisitedPdpInSessionAtom)) {
    return
  }
  set(hasVisitedPdpInSessionAtom, visited)
})
