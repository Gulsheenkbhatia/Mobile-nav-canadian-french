import { atom } from 'jotai'
import { productsAtom } from 'store/search-results.atom'
import has from 'lodash/has'
import _get from 'lodash/get'
import flatMap from 'lodash/flatMap'
import { preferencesAtom } from 'store/preferences.atom'
import { experimentsAtom } from 'store/experiments.atom'
import { pageTypeShorthandAtom } from 'store/navigation.atom'
import { oneSiteActiveBrandAtom } from 'store/menu-data.atom'
import { BRANDS } from 'toro/lib/oneSite/config'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { enableVisuallySimilarFromCategoryAtom } from 'store/plp.atom'
import { viewedProductsAtom } from 'store/viewed-products.atom'

type VisuallySimilarAttributes =
  | 'visuallySimilar'
  | 'retailVisuallySimilarPIDs'
  | 'outletVisuallySimilarPIDs'
  | 'visuallySimilarPIDs'

const visuallySimilarBrandAttribute = {
  [BRANDS.COACH]: 'retailVisuallySimilarPIDs',
  [BRANDS.OUTLET]: 'outletVisuallySimilarPIDs',
} as const

const visuallySimilarSRPTestKey = EXPERIMENTS.VISUALLY_SIMILAR_SRP_TEST

export const visuallySimilarAttributeMapAtom = atom((get) => {
  const products = get(productsAtom)
  const preferences = get(preferencesAtom)
  const experiments = get(experimentsAtom)
  const pageTypeShorthand = get(pageTypeShorthandAtom)
  const activeBrand = get(oneSiteActiveBrandAtom)
  const isEnabledForCategory = get(enableVisuallySimilarFromCategoryAtom)
  const viewedProductIds = get(viewedProductsAtom)
  const isSRP = pageTypeShorthand === 'SRP'

  const isPreferenceEnabled = _get(
    preferences,
    `ToggleSiteFeatures.enableVisuallySimilar.${pageTypeShorthand}.enable`,
    false
  )

  const pageExperimentVariationKey = _get(EXPERIMENTS, `VIEW_SIMILAR_LLM_${pageTypeShorthand}`)
  const controlledViaExperimentDirectly = experiments.includes(pageExperimentVariationKey)
  const isVisuallySimilarTestExpEnabledOnSRP = experiments.includes(visuallySimilarSRPTestKey)

  if (!isPreferenceEnabled || (isSRP && !isVisuallySimilarTestExpEnabledOnSRP)) {
    return new Map()
  }

  const isVisuallySimilarCrossChannel = experiments.includes(
    EXPERIMENTS.VISUALLY_SIMILAR_CROSS_CHANNEL
  )

  const vsAttribute: VisuallySimilarAttributes = isVisuallySimilarCrossChannel
    ? 'visuallySimilar'
    : visuallySimilarBrandAttribute[activeBrand] || 'visuallySimilar'

  const visuallySimilarPairIterable = flatMap(products, (product) => {
    const validVariationGroups = product?.variationGroup

    const filteredVariationGroups = validVariationGroups?.filter((vg) => {
      const enabledForCategoryAndVisitedProduct = () =>
        isEnabledForCategory && viewedProductIds.some((id) => vg.productID?.includes(id))

      const searchResultsPageWithEnabledExperiment = () =>
        isSRP && isVisuallySimilarTestExpEnabledOnSRP

      const requiredConditions = has(vg, vsAttribute)
      const optionalConditions =
        controlledViaExperimentDirectly ||
        enabledForCategoryAndVisitedProduct() ||
        searchResultsPageWithEnabledExperiment()

      return requiredConditions && optionalConditions
    })

    return filteredVariationGroups.map((vg) => [vg.productID, vg[vsAttribute]] as [string, string])
  })

  return new Map(visuallySimilarPairIterable)
})
