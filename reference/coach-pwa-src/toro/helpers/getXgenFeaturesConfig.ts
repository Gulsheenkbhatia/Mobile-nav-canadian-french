import { EXPERIMENTS } from 'toro/constants/experiments'
import {
  XgenFeaturesConfig,
  XgenPreferences,
} from 'toro/lib/vendorProductsAdapter/shared/types/preferences'
import { getXgenPreferences } from 'toro/lib/vendorProductsAdapter/shared/utility/getXgenPreferences'

const XGEN_FEATURES_DEFAULT_CONFIG = {
  search: false,
  recommendations: false,
  tracking: false,
}

export const getXgenFeaturesConfig = (
  preferences: XgenPreferences,
  experiments: Set<string>
): XgenFeaturesConfig => {
  const {
    enableXgen,
    xgenClientID,
    xgenDeploymentID,
    enableXgenReco,
    enableXgenSearch,
    enableXgenTracking,
  } = getXgenPreferences(preferences)

  if (!enableXgen || !xgenClientID) {
    return XGEN_FEATURES_DEFAULT_CONFIG
  }

  return {
    search: Boolean(
      xgenDeploymentID &&
        enableXgenSearch &&
        experiments.has(EXPERIMENTS.XGEN_SEARCH) &&
        !experiments.has(EXPERIMENTS.XGEN_SERVER)
    ),
    recommendations: Boolean(enableXgenReco && experiments.has(EXPERIMENTS.XGEN_RECOMMENDATIONS)),
    tracking: enableXgenTracking,
  }
}
