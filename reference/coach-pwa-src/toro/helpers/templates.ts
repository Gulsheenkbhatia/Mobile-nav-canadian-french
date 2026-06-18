import { TemplateName, TemplatePerDevice } from 'toro/constants/templates'
import isExperimentEnabled from 'toro/helpers/isExperimentEnabled'
import { EXPERIMENTS } from 'toro/constants/experiments'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const PDP_V7_PRODUCT_CUSTOM_FLAG = 'custom.c_enablePdp7Template'

function sanitizePdpClassification(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

function sanitizeEligibleCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((c): c is string => typeof c === 'string')
    .map((c) => c.trim().toLowerCase())
    .filter((c) => c.length > 0)
}

export type TemplateConfig = {
  enabled?: boolean
  eligibleCategories?: string[]
}

/**
 * Returns whether the product is eligible for the given PDP template based on
 * preferences.templateConfigs[templateName] and (for pdpv7) product custom.c_enablePdp7Template.
 */
export const getPdpTemplateEligibility = (
  productData: Record<string, unknown> | null | undefined,
  preferences: Record<string, unknown> = {},
  templateName: string = TemplateName.pdpv7
): boolean => {
  if (isEmpty(productData)) return false

  if (templateName === TemplateName.pdpv7) {
    const enablePdp7OnProduct = get(productData, PDP_V7_PRODUCT_CUSTOM_FLAG, false)

    if (!enablePdp7OnProduct) return false
  }

  const config = get(preferences, `templateConfigs.${templateName}`, {}) as TemplateConfig
  const enabled = get(config, 'enabled', false)
  const eligibleCategories = sanitizeEligibleCategories(get(config, 'eligibleCategories', []))

  if (!enabled || eligibleCategories.length === 0) return false

  const classification = sanitizePdpClassification(get(productData, 'custom.c_classification'))
  if (classification.length === 0) return false

  /**
   * Check if the classification includes any of the eligible categories
   * or if the eligible categories include the classification
   * This is to handle the case where the classification is a substring of the eligible category
   * or the eligible category is a substring of the classification
   * For example:
   * - classification: "bags"
   * - eligible categories: ["shoes", "handbags"]
   * - should return true
   * - classification: "Other Shoes"
   * - eligible categories: ["shoes", "handbags"]
   * - should also return true
   */
  return eligibleCategories.some((c) => c.includes(classification) || classification.includes(c))
}

export const getPdpTemplateMobile = ({ req, isBundleProduct, productData, preferences = {} }) => {
  const isPdpV7Eligible = getPdpTemplateEligibility(productData, preferences, TemplateName.pdpv7)

  if (!isBundleProduct && isPdpV7Eligible && isExperimentEnabled(req, EXPERIMENTS.PDP_V7)) {
    return TemplateName.pdpv7
  }
  if (!isBundleProduct && isExperimentEnabled(req, EXPERIMENTS.PDP_V6)) {
    return TemplateName.pdpv6
  }

  return TemplateName.default
}

export const getPdpTemplateDesktop = ({ req, productData, preferences = {} }) => {
  const isPdpV7Eligible = getPdpTemplateEligibility(productData, preferences, TemplateName.pdpv7)

  if (isPdpV7Eligible && isExperimentEnabled(req, EXPERIMENTS.PDP_V7)) {
    return TemplateName.pdpv7
  }
  if (
    isExperimentEnabled(req, EXPERIMENTS.PDP_V5_1) &&
    get(productData, 'isPdpV5Applicable', false)
  ) {
    return TemplateName.pdpv5_1
  }

  if (
    isExperimentEnabled(req, EXPERIMENTS.PDP_V5) &&
    get(productData, 'isPdpV5Applicable', false)
  ) {
    return TemplateName.pdpv5_0
  }

  return TemplateName.default
}

export const getPdpTemplates = ({
  req,
  productData,
  isBundleProduct,
  preferences = {},
}): TemplatePerDevice => {
  return {
    mobile: getPdpTemplateMobile({ req, isBundleProduct, productData, preferences }),
    desktop: getPdpTemplateDesktop({ req, productData, preferences }),
  }
}
