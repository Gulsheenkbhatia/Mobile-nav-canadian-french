import { ProductVertical, type ProductVerticalValues } from 'toro/constants/OneSite'
import { PriceTemplate } from 'toro/types/productTypes'

const shouldHideDiscountRate = (params: GetOneCoachPricingTemplateParams): boolean => {
  // Product-level attribute overrides all category-level settings
  if (params.hideDiscountRate) {
    return true
  }
  // In Fallback State, cleanStateDisplayDiscountPercentage is ignored (discount always shown)
  if (params.enableFallBackPricing) {
    // Shop-level hide — only for outlet non-clearance in fallback
    if (!params.isOnClearance && params.fallbackHideDiscountRate) {
      return true
    }
    // Fallback default: discount shown
    return false
  }
  // Protect against undefined: default to hiding discount (backward compatibility)
  if (typeof params.cleanStateDisplayDiscountPercentage !== 'boolean') {
    return true
  }
  return params.cleanStateDisplayDiscountPercentage === false
}

const shouldHideComparableValue = (params: GetOneCoachPricingTemplateParams): boolean => {
  // Product-level attribute overrides all category-level settings
  if (params.hideComparableValue) {
    return true
  }

  if (params.enableFallBackPricing) {
    // Shop-level hide — only for outlet non-clearance in fallback
    if (!params.isOnClearance && params.fallbackHideComparableValue) {
      return true
    }
    // Fallback default: comparable shown
    return false
  }

  // Clean state default: hidden for outlet
  return true
}

const cleanOutletRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    !params.isOnClearance &&
    (!params.enableFallBackPricing ||
      (shouldHideDiscountRate(params) && shouldHideComparableValue(params))),
  template: PriceTemplate.SinglePrice,
}

const fallBackOrOnClearenceOutletRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    (params.isOnClearance || params.enableFallBackPricing),
  template: PriceTemplate.FullPriceComparable,
}

const comparableOutletRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    params.enableFallBackPricing &&
    shouldHideDiscountRate(params) &&
    !shouldHideComparableValue(params),
  template: PriceTemplate.Comparable,
}

const discountOutletRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    params.enableFallBackPricing &&
    shouldHideComparableValue(params) &&
    !shouldHideDiscountRate(params),
  template: PriceTemplate.Discount,
}

const cleanOutletWithComparableRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    !params.enableFallBackPricing &&
    !params.isOnClearance &&
    !shouldHideDiscountRate(params) &&
    !params.hideComparableValue,
  template: PriceTemplate.FullPriceComparable,
}

const cleanOutletWithDiscountRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Outlet &&
    !params.enableFallBackPricing &&
    !params.isOnClearance &&
    !shouldHideDiscountRate(params) &&
    params.hideComparableValue,
  template: PriceTemplate.Discount,
}

const cleanCollectionRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Collection && !params.enableFallBackPricing,
  template: PriceTemplate.Strikeoff,
}

const cleanCollectionWithDiscountRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Collection &&
    !params.enableFallBackPricing &&
    !shouldHideDiscountRate(params),
  template: PriceTemplate.FullPrice,
}

const fallbackCollectionRule = {
  isApplied: (params) =>
    params.productVertical === ProductVertical.Collection && params.enableFallBackPricing,
  template: PriceTemplate.Strikeoff,
}

const bundleCollectionOrOutletRule = {
  isApplied: (params) =>
    params.isBundle &&
    (params.productVertical === ProductVertical.Collection ||
      params.productVertical === ProductVertical.Outlet),
  template: PriceTemplate.Strikeoff,
}

interface GetOneCoachPricingTemplateParams {
  productVertical: ProductVerticalValues
  enableFallBackPricing: boolean
  hideDiscountRate: boolean
  hideComparableValue: boolean
  isOnClearance: boolean
  isBundle: boolean
  cleanStateDisplayDiscountPercentage?: boolean
  fallbackHideDiscountRate?: boolean
  fallbackHideComparableValue?: boolean
}

interface PricingDisplayRule {
  isApplied: (params: GetOneCoachPricingTemplateParams) => boolean
  template: PriceTemplate
}

const pricingDisplayRuleset: PricingDisplayRule[] = [
  bundleCollectionOrOutletRule,
  cleanOutletWithComparableRule,
  cleanOutletWithDiscountRule,
  comparableOutletRule,
  discountOutletRule,
  cleanOutletRule,
  fallBackOrOnClearenceOutletRule,
  cleanCollectionWithDiscountRule,
  cleanCollectionRule,
  fallbackCollectionRule,
]

const getOneCoachPricingTemplate = ({
  productVertical,
  enableFallBackPricing,
  hideDiscountRate,
  hideComparableValue,
  isOnClearance,
  isBundle,
  cleanStateDisplayDiscountPercentage = false,
  fallbackHideDiscountRate = false,
  fallbackHideComparableValue = false,
}: GetOneCoachPricingTemplateParams): PriceTemplate => {
  const appliedRule = pricingDisplayRuleset.find((rule) =>
    rule.isApplied({
      productVertical,
      enableFallBackPricing,
      hideDiscountRate,
      hideComparableValue,
      fallbackHideDiscountRate,
      fallbackHideComparableValue,
      isOnClearance,
      isBundle,
      cleanStateDisplayDiscountPercentage,
    })
  )
  return appliedRule?.template
}

export default getOneCoachPricingTemplate
