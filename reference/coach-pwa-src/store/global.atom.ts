import { atom } from 'jotai'
import isString from 'lodash/isString'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { atomWithReset, atomWithStorage, createJSONStorage } from 'jotai/utils'
import { preferencesAtom } from 'store/preferences.atom'
import { STORAGE_IS_FIRST_VISIT, STORAGE_LAST_VISIT_TIME } from 'toro/constants/storageIds'
import { MAIN_CONTENT } from 'toro/constants/appConstants'
import { HOTSPOT_HORIZONTAL_OFFSET_DESKTOP, SIZE_DRAWER_WIDTH } from 'toro/cms/constants'
import deriveOptimizelyLabels from 'toro/optimizely/deriveOptimizelyLabels'
import type { OptimizelyExperimentsMap } from 'toro/optimizely/types'

export interface SizeDrawerState {
  isOpen: boolean
  sizeDrawerStyles?: {
    [key: string]: string
  }
  sizeDrawerParentElement?: HTMLElement | null
}

export interface SizeDrawerConfig {
  atbTooltip: HTMLElement
  isMobile: boolean
  tooltipPositions: {
    left: number
    right: number
    top: number
    bottom: number
  }
  tooltipStyledPositions: {
    leftSpace: string
    rightSpace: string
    topSpace: string
    bottomSpace: string
  }
  screenWidth: number
}

export const isSubBrandActiveAtom = atom(false)
export const brandAtom = atom('')
export const subBrandAtom = atom('')
export const brandThemeAtom = atom('')
export const currentLocaleAtom = atom('')
export const imageDomainAtom = atom('')

export const optUserAtom = atom<string>('')
export const setOptUserAtom = atom(null, (_, set, userId: string) => {
  if (!isString(userId)) {
    return
  }
  set(optUserAtom, userId)
})

export const optimizelyEnabledFeaturesAtom = atom<string>('')
export const setOptimizelyEnabledFeaturesAtom = atom(null, (_, set, features: string) => {
  if (!isString(features)) {
    return
  }
  set(optimizelyEnabledFeaturesAtom, features)
})

export const experimentsMapAtom = atom<OptimizelyExperimentsMap>({})
export const setExperimentsMapAtom = atom(
  null,
  (_, set, experimentsMap: OptimizelyExperimentsMap) => {
    set(experimentsMapAtom, experimentsMap)
  }
)

export const optimizelyEventLabelAtom = atom((get) => {
  const userId = get(optUserAtom)
  const optimizelyEnabledFeatures = get(optimizelyEnabledFeaturesAtom)
  const experimentsMap = get(experimentsMapAtom)

  if (optimizelyEnabledFeatures?.length && userId && !_isEmpty(experimentsMap)) {
    const label = deriveOptimizelyLabels(experimentsMap, optimizelyEnabledFeatures)
    return label
  }

  return ''
})

export const maxCertonadataRecommendationAtom = atom<string>('')
export const isSWOutletAtom = atom(false)

export const quantumMetricSessionIdAtom = atom('')

export const isMobileMenuVisibleAtom = atom(false)
export const isThreadUpModalVisibleAtom = atom(false)

export enum MiniCartOpenReasons {
  PickUpInStore = 'pickUpInStore',
  AddToBag = 'addToBag',
  Hovered = 'hovered',
  Closed = '',
}
export const miniCartOpenReasonAtom = atomWithReset<MiniCartOpenReasons>(MiniCartOpenReasons.Closed)

export const isOneCoachTabbedAtom = atom((get) => {
  const preferences = get(preferencesAtom)
  const oneCoachPref = _get(preferences, 'oneCoach.oneCoachTabConfig.enable', 'false') as string
  return Boolean(oneCoachPref === 'true')
})

export const hslColorAdaptivePDPAtom = atom({
  main: 'var(--color-white-base)',
  second: 'var(--color-neutral-light-2)',
})
export const isHeaderMountedAtom = atom(false)

export const lastVisitTimeAtom = atomWithStorage<number | null>(STORAGE_LAST_VISIT_TIME, null)
export const addToBagButtonOnEventAtom = atomWithReset<JSX.Element | null>(null)
export const productsWithDisabledATBAtom = atom([])
export const productsWithMaxSizeATBAtom = atom([])
export const sizeDrawerMobileAtom = atom(false)

export const visuallySimilarDataAtom = atom<object[]>([])
export const setVisuallySimilarDataAtom = atom(null, (_, set, data: object[]) => {
  set(visuallySimilarDataAtom, data)
})
export const isVisuallySimilarDataInitializedAtom = atom(false)
export const setIsVisuallySimilarDataInitializedAtom = atom(null, (_, set, loading) => {
  set(isVisuallySimilarDataInitializedAtom, loading)
})
export const isOutletTabAtom = atom<boolean>(false)
export const setIsOutletTabAtom = atom(
  null,
  (
    get,
    set,
    {
      url = '',
      isOutletProduct = false,
    }: {
      url: string
      isOutletProduct: boolean
    }
  ) => {
    const preferences = get(preferencesAtom)
    const isOutletSubCategory = Boolean(
      _get(preferences, 'oneCoach.oneCoachTabConfig.isOutletSubCategory', false)
    )
    const outletSubCategoryLink = _get(preferences, 'oneCoach.oneCoachTabConfig.link', '') as string
    const isInOutletCategory =
      outletSubCategoryLink.length > 0 &&
      url.toLowerCase().includes(outletSubCategoryLink.toLowerCase())

    const isOutletTabVal = isOutletSubCategory && (isInOutletCategory || isOutletProduct)
    set(isOutletTabAtom, isOutletTabVal)
  }
)
export const getIsOutletTabAtom = (url: string, preferences, isOutletProduct) => {
  const isOutletSubCategory = Boolean(
    _get(preferences, 'oneCoach.oneCoachTabConfig.isOutletSubCategory', false)
  )
  const isInOutletCategory = url.includes('outlet')

  return isOutletSubCategory && (isInOutletCategory || isOutletProduct)
}

export const isFooterVisibleAtom = atom<boolean>(false)

export const hotspotSizeDrawerAtom = atom<SizeDrawerState>({
  isOpen: false,
  sizeDrawerStyles: {},
  sizeDrawerParentElement: null,
})

export const openHotspotSizeDrawerAtom = atom(
  null,
  (get, set, config: Omit<SizeDrawerConfig, 'isOpen'>) => {
    const { atbTooltip, isMobile, tooltipPositions, tooltipStyledPositions, screenWidth } = config
    const sizeDrawerParent = document.getElementById(MAIN_CONTENT)

    let leftSpace
    let rightSpace = 'auto'

    if (!isMobile) {
      leftSpace = atbTooltip.style.left
      rightSpace = atbTooltip.style.right
      if (
        tooltipStyledPositions.leftSpace !== 'auto' &&
        tooltipPositions.left + SIZE_DRAWER_WIDTH > screenWidth
      ) {
        leftSpace = `${screenWidth - SIZE_DRAWER_WIDTH - HOTSPOT_HORIZONTAL_OFFSET_DESKTOP}px`
      }

      if (
        tooltipStyledPositions.rightSpace !== 'auto' &&
        tooltipPositions.right + SIZE_DRAWER_WIDTH > screenWidth
      ) {
        rightSpace = `${screenWidth - SIZE_DRAWER_WIDTH - HOTSPOT_HORIZONTAL_OFFSET_DESKTOP}px`
      }
    }

    const sizeDrawerStyles = {
      position: 'absolute',
      left: isMobile ? '50%' : leftSpace,
      right: rightSpace,
      top: atbTooltip.style.top,
      bottom: atbTooltip.style.bottom,
      transform: isMobile ? 'translateX(-50%)' : 'none',
    }

    set(hotspotSizeDrawerAtom, {
      isOpen: true,
      sizeDrawerStyles,
      sizeDrawerParentElement: sizeDrawerParent as HTMLElement,
    })
  }
)

export const closeHotspotSizeDrawerAtom = atom(null, (get, set) => {
  const currentState = get(hotspotSizeDrawerAtom)

  set(hotspotSizeDrawerAtom, {
    ...currentState,
    isOpen: false,
  })
})

export const isProductDrawerOpenAtom = atom(false)
export const productDrawerContentAtom = atom(null as string | null)

export const openProductDrawerAtom = atom(null, (_, set, assetId: string | null) => {
  set(productDrawerContentAtom, assetId)
  set(isProductDrawerOpenAtom, true)
})

export const closeProductDrawerAtom = atom(null, (_, set) => {
  set(isProductDrawerOpenAtom, false)
  set(productDrawerContentAtom, null)
})

export const videoModalSrcAtom = atomWithReset<string | null>(null)

export const isFirstVisitAtom = atomWithStorage<boolean | null>(
  STORAGE_IS_FIRST_VISIT,
  null,
  createJSONStorage<boolean | null>(() => sessionStorage)
)
