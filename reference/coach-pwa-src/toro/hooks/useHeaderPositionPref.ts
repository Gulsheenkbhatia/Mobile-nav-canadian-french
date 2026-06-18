import usePreference from 'toro/hooks/usePreference_new'
import useHeadroomAtom from 'toro/hooks/useHeadroomAtom'
import { useMemo } from 'react'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { PageTypeFlags } from 'toro/types'
import { useAtomValue } from 'jotai/utils'
import { pageTypeAtom } from 'store/navigation.atom'

export type StickyOrSlidingHeaderPref =
  | {
      HP?: string
      retailHP?: string
      outletHP?: string
      coachtopiaHP?: string
      PLP?: string
      PDP?: string
    }
  | string

export enum HeaderType {
  STICKY = 'sticky header',
  TRANSPARENT_STICKY = 'transparent sticky header',
  TRANSPARENT_SLIDING = 'transparent sliding header',
  SLIDING_NAV = 'sliding header with nav anchoring',
  SLIDING_CAROUSEL = 'sliding header with carousel anchoring',
  STATIC = '',
}

const getBrandHPKey = (
  pageType: PageTypeFlags
): keyof Exclude<StickyOrSlidingHeaderPref, string> | undefined => {
  if (pageType.isOutletHP) return 'outletHP'
  if (pageType.isSubHP) return 'coachtopiaHP'
  if (pageType.isRetailHP) return 'retailHP'
  return undefined
}

export const getHeaderTypeFromPreferences = (
  preference: StickyOrSlidingHeaderPref,
  legacyPreference: StickyOrSlidingHeaderPref,
  pageType: PageTypeFlags
): HeaderType => {
  const preferenceValue = preference || legacyPreference
  if (isObject(preferenceValue)) {
    const { isPLP, isSRP, isPDP } = pageType

    if (isPLP || isSRP) {
      if (isString(preferenceValue.PLP)) {
        return preferenceValue.PLP.toLowerCase() as HeaderType
      }
    } else if (isPDP) {
      if (isString(preferenceValue.PDP)) {
        return preferenceValue.PDP.toLowerCase() as HeaderType
      }
    } else {
      const brandHPKey = getBrandHPKey(pageType)
      if (brandHPKey && isString(preferenceValue[brandHPKey])) {
        return preferenceValue[brandHPKey].toLowerCase() as HeaderType
      }
    }

    if (isString(preferenceValue.HP)) {
      return preferenceValue.HP.toLowerCase() as HeaderType
    }
    return HeaderType.STATIC
  }
  if (isString(preferenceValue)) {
    return preferenceValue.toLowerCase() as HeaderType
  }
  return HeaderType.STATIC
}

const useHeaderPositionPref = () => {
  const {
    toggleSiteFeatures: { stickyOrSlidingHeader, headerTypeOnPages },
  } = usePreference({ ToggleSiteFeatures: ['stickyOrSlidingHeader', 'headerTypeOnPages'] })

  const { isHeaderHeight, isHeaderHidden } = useHeadroomAtom()
  const pageType = useAtomValue(pageTypeAtom)

  return useMemo(() => {
    const headerType = getHeaderTypeFromPreferences(
      headerTypeOnPages,
      stickyOrSlidingHeader,
      pageType
    )
    const isStaticHeader = !headerType
    const isStickyHeader = headerType === HeaderType.STICKY
    const isTransparentStickyHeader = headerType === HeaderType.TRANSPARENT_STICKY
    const isTransparentSlidingHeader = headerType === HeaderType.TRANSPARENT_SLIDING
    const isSlidingNavHeader = headerType === HeaderType.SLIDING_NAV
    const isSlidingCarouselHeader = headerType === HeaderType.SLIDING_CAROUSEL
    const isStickyOrSlidingHeader =
      isStickyHeader ||
      isTransparentStickyHeader ||
      isTransparentSlidingHeader ||
      isSlidingNavHeader ||
      isSlidingCarouselHeader

    let stickyHeaderHeight = 0
    if (isStickyOrSlidingHeader) {
      stickyHeaderHeight = isHeaderHeight
      if (isHeaderHidden) {
        stickyHeaderHeight = 0
      }
    }
    return {
      isStaticHeader,
      isStickyHeader,
      isTransparentStickyHeader,
      isTransparentSlidingHeader,
      isSlidingNavHeader,
      isSlidingCarouselHeader,
      isStickyOrSlidingHeader,
      stickyHeaderHeight,
    }
  }, [stickyOrSlidingHeader, headerTypeOnPages, pageType, isHeaderHidden])
}

export default useHeaderPositionPref
