import { useMemo } from 'react'
import { selectAtom, useAtomValue } from 'jotai/utils'
import { xgenRecommendationsDataAtom } from 'store/xgen-recommendations.atom'
import { XgenContainerID } from 'lib/xgen'
import usePreference from 'toro/hooks/usePreference_new'
import useProductData from 'toro/hooks/useProductData'
import useProductCategoryFlags from 'toro/hooks/useProductCategoryFlags'
import useBagCharmsSelectorVisibility from 'toro/components/product/mobile/v7/hooks/useBagCharmsSelectorVisibility'
import {
  WAYS_TO_WEAR_MARKUP_PATH,
  WAYS_TO_WEAR_ONLINE_PATH,
  hasWaysToWearProductContent,
} from 'toro/components/product/mobile/v7/WaysToWear'
import { visuallySimilarDataAtom, isVisuallySimilarDataInitializedAtom } from 'store/global.atom'
import { isPdpV7UgcAnchorNavVisibleAtom, isTangibleePdpV7WfiContentReadyAtom } from 'store/pdp.atom'

export type PdpV7AnchorStripTabVisibility = {
  compare: boolean
  features: boolean
  makeItYours: boolean
  specs: boolean
  ugc: boolean
  waysToWear: boolean
  ymal: boolean
}

const compareItemsAtom = selectAtom(
  xgenRecommendationsDataAtom,
  (xgenData) => xgenData[XgenContainerID.product5_rr]?.items ?? []
)

const makeItYoursItemsAtom = selectAtom(
  xgenRecommendationsDataAtom,
  (xgenData) => xgenData[XgenContainerID.upsellRecs]?.items ?? []
)

const ymalItemsAtom = selectAtom(
  xgenRecommendationsDataAtom,
  (xgenData) => xgenData[XgenContainerID.ymal]?.items ?? []
)

export function usePdpV7AnchorNavTabVisibility() {
  const compareItems = useAtomValue(compareItemsAtom)
  const makeItYoursItems = useAtomValue(makeItYoursItemsAtom)
  const ymalItems = useAtomValue(ymalItemsAtom)
  const visuallySimilarData = useAtomValue(visuallySimilarDataAtom)
  const isVisuallySimilarDataInitialized = useAtomValue(isVisuallySimilarDataInitializedAtom)
  const productSpecs = useProductData('productSpecs')
  const [wtwMarkup, wtwOnline] = useProductData([
    WAYS_TO_WEAR_MARKUP_PATH,
    WAYS_TO_WEAR_ONLINE_PATH,
  ])
  const { isShoeCategory, isBagCategory } = useProductCategoryFlags()
  const isBagCharmsSelectorVisible = useBagCharmsSelectorVisibility()
  const isTangibleePdpV7WfiContentReady = useAtomValue(isTangibleePdpV7WfiContentReadyAtom)
  const isPdpV7UgcAnchorNavVisible = useAtomValue(isPdpV7UgcAnchorNavVisibleAtom)
  const {
    tangiblee: { IS_TANGIBLEE_ENABLED: isTangibleeEnabled = false },
    pdpPreferences: {
      templateConfigs: {
        pdpv7: { enableProdSpecs = false, signatureFeaturesShoes = [] } = {},
      } = {},
    },
  } = usePreference({
    Tangiblee: ['IS_TANGIBLEE_ENABLED'],
    PDPPreferences: ['templateConfigs'],
  })

  return useMemo((): PdpV7AnchorStripTabVisibility => {
    const specsRows = productSpecs || []
    const hasValidSpecs = specsRows.some((item) => item?.values?.length)
    const hasEnabledShoeSignatureInSfcc =
      Array.isArray(signatureFeaturesShoes) &&
      signatureFeaturesShoes.length > 0 &&
      signatureFeaturesShoes.some((item) => item != null && item.enable === true)

    let features = isTangibleeEnabled && isTangibleePdpV7WfiContentReady
    if (isShoeCategory) {
      features = hasEnabledShoeSignatureInSfcc
    }

    const ugc = isPdpV7UgcAnchorNavVisible

    const hasYmalOrVisuallySimilarRecs =
      ymalItems.length > 0 || (isVisuallySimilarDataInitialized && visuallySimilarData.length > 0)

    return {
      compare: compareItems.length > 0,
      features,
      makeItYours: isBagCharmsSelectorVisible || (isShoeCategory && makeItYoursItems.length > 0),
      specs: enableProdSpecs && hasValidSpecs,
      ugc,
      waysToWear: isBagCategory && hasWaysToWearProductContent(wtwMarkup, wtwOnline),
      ymal: hasYmalOrVisuallySimilarRecs,
    }
  }, [
    compareItems,
    makeItYoursItems,
    ymalItems,
    visuallySimilarData,
    isVisuallySimilarDataInitialized,
    productSpecs,
    enableProdSpecs,
    isShoeCategory,
    isBagCategory,
    isTangibleeEnabled,
    isTangibleePdpV7WfiContentReady,
    isBagCharmsSelectorVisible,
    signatureFeaturesShoes,
    isPdpV7UgcAnchorNavVisible,
    wtwMarkup,
    wtwOnline,
  ])
}
