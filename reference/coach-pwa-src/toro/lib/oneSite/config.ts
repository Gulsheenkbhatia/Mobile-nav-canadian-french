import _invert from 'lodash/invert'
import type { ProductReachVariants } from 'toro/types/productTypes'

// TODO: move to constants
export enum BRANDS {
  COACH = 'coach',
  OUTLET = 'outlet',
  COACHTOPIA = 'coachtopia',
  RETAIL = 'retail',
}

export enum PARENT_BRAND_MAP {
  COACH = 'coach',
  OUTLET = 'outlet',
  COACHTOPIA = 'coach',
}

export type Brand = typeof BRANDS[keyof typeof BRANDS]
export type OneSiteBrands = BRANDS.COACH | BRANDS.OUTLET // coachtopia is a subbrand of coach (means not a main brand)

export const ONE_SITE_BRAND_TABS = {
  COACH: BRANDS.RETAIL,
  OUTLET: BRANDS.OUTLET,
} as const

export type OneSiteBrandTabs = typeof ONE_SITE_BRAND_TABS[keyof typeof ONE_SITE_BRAND_TABS]

// Binary map that should always provide max 2 options, since we have 2 tabs on the UI
export const ONE_SITE_TAB_MAP = {
  [BRANDS.COACH]: ONE_SITE_BRAND_TABS.COACH,
  [BRANDS.OUTLET]: ONE_SITE_BRAND_TABS.OUTLET,
} as const

/** OneSite Brand -> SFCC cookie brand (for WRITING cookie) */
export const ONE_SITE_TO_SFCC_BRAND_MAP = {
  [BRANDS.COACH]: BRANDS.RETAIL,
  [BRANDS.OUTLET]: BRANDS.OUTLET,
} as const

/** SFCC cookie brand -> OneSite Brand (for READING cookie) */
export const SFCC_TO_ONE_SITE_BRAND_MAP = _invert(ONE_SITE_TO_SFCC_BRAND_MAP) as Record<
  string,
  Brand
>

export const ONE_SITE_ENV_ID = {
  coh_us_one: true,
  coh_ca_one: true,
}

export const ONE_SITE_PRODUCT_REACH_SWITCH_MAP: Record<ProductReachVariants, Brand | undefined> = {
  retail: BRANDS.COACH,
  outlet: BRANDS.OUTLET,

  // multi -> fallback to the original brand, means do not switch from the already defined brand
  multi: undefined,
}

// data attribute | object key
export const ONE_SITE_ACTIVE_BRAND_PROPERTY = 'oneSiteActiveBrand'
