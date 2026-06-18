import {
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  isQuickViewAtom,
  productIdAtom,
  isTabbedAdaptivePDPEligibleAtom,
  activeTabIndexAtom,
  isProductFullyOOSAtom,
  productDataAtom,
} from 'store/pdp.atom'
import get from 'lodash/get'
import { useHydrateAtoms, useUpdateAtom } from 'jotai/utils'
import type { Atom } from 'jotai/core/atom'
import { useEffect, useMemo } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import useNewActiveTabIndex from 'toro/hooks/useNewActiveTabIndex'
import { setHasVisitedPdpInSessionAtom } from 'store/plp.atom'

const usePDPAtomsUpdate = (isQuickView = false, productData) => {
  const isTabbedAdaptivePDP = useExperiment(EXPERIMENTS.TABBED_ADAPTIVE_PDP)
  const { isMobile } = useViewportType()
  const productId = get(productData, 'id')
  const { isMegaPDPEligible, isNewMegaPDPEligible } =
    get(productData, 'megaPDPEligibleOptions') || {}

  const isTabbedAdaptivePDPEligible =
    isTabbedAdaptivePDP && isMobile && get(productData, 'custom.c_enablePdp4Template', false)

  const {
    toggleSiteFeatures: { enableOOSExperience },
  } = usePreference({
    ToggleSiteFeatures: ['enableOOSExperience'],
  })

  const isCurrentVariantOrderable = get(productData, 'selectedVariantGroupData.orderable', true)
  const isProductFullyOOS = useMemo(
    () =>
      enableOOSExperience &&
      get(productData, 'variationGroup', []).every((variant) => !variant?.orderable),
    [enableOOSExperience, productData]
  )

  const isHideReview = get(productData, 'custom.c_hideReview')
  const isReviewExists = !!get(productData, 'reviewsData.results[0].reviews.length', 0)

  const activeTabIndex = useNewActiveTabIndex({
    orderable: isCurrentVariantOrderable,
    isHideReview,
    isReviewExists,
  })

  useHydrateAtoms(
    new Map([
      [productDataAtom, productData],
      [isQuickViewAtom, isQuickView],
      [productIdAtom, productId],
      [isMegaPDPEligibleAtom, isMegaPDPEligible],
      [isNewMegaPDPEligibleAtom, isNewMegaPDPEligible],
      [activeTabIndexAtom, activeTabIndex],
      [isProductFullyOOSAtom, isProductFullyOOS],
      [isTabbedAdaptivePDPEligibleAtom, isTabbedAdaptivePDPEligible],
    ] as Iterable<readonly [Atom<unknown>, unknown]>)
  )

  // Keep the atom values updated through side-effects.
  const setProductId = useUpdateAtom(productIdAtom)
  useEffect(() => {
    setProductId(productId)
  }, [productId])

  const setIsQuickView = useUpdateAtom(isQuickViewAtom)
  const setHasVisitedPdpInSession = useUpdateAtom(setHasVisitedPdpInSessionAtom)
  useEffect(() => {
    if (!isQuickView) {
      setHasVisitedPdpInSession(true)
    }
    setIsQuickView(isQuickView)
  }, [isQuickView])

  const setIsMegaPDPEligible = useUpdateAtom(isMegaPDPEligibleAtom)
  useEffect(() => {
    setIsMegaPDPEligible(isMegaPDPEligible)
  }, [isMegaPDPEligible])

  const setIsNewMegaPDPEligible = useUpdateAtom(isNewMegaPDPEligibleAtom)
  useEffect(() => {
    setIsNewMegaPDPEligible(isNewMegaPDPEligible)
  }, [isNewMegaPDPEligible])

  const setIsTabbedAdaptivePDPEligible = useUpdateAtom(isTabbedAdaptivePDPEligibleAtom)
  useEffect(() => {
    setIsTabbedAdaptivePDPEligible(isTabbedAdaptivePDPEligible)
  }, [isTabbedAdaptivePDPEligible])

  const setActiveTabIndex = useUpdateAtom(activeTabIndexAtom)
  useEffect(() => {
    setActiveTabIndex(activeTabIndex)
  }, [activeTabIndex])

  const setIsProductFullyOOS = useUpdateAtom(isProductFullyOOSAtom)
  useEffect(() => {
    setIsProductFullyOOS(isProductFullyOOS)
  }, [isProductFullyOOS])
}

export default usePDPAtomsUpdate
