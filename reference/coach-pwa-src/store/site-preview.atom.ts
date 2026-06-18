import { atom } from 'jotai'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import _get from 'lodash/get'
import getAPIURL from 'helpers/getAPIURL'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Cookies from 'js-cookie'
import type { ExperimentsInfoResponseBody } from 'pages/api/experiments'
import { OPTIMIZELY_ENABLED_FEATURES } from 'toro/constants/cookies'
import type { ProductReachVariants, ProductVariant } from 'toro/types/productTypes'
import { resolveProductReach } from 'lib/oneSite/utils'
import { productDataAtom, selectedVariantGroupAtom, selectedVariantAtom } from './pdp.atom'
import { isPdpAtom } from './navigation.atom'
import { atomWithReset } from 'jotai/utils'
import { DetailedProduct, ListingProduct } from 'toro/types/productTypes'

type SitePreviewConfig = {
  'customer-group': string
  dateTime: string
  'source-code': string
}

export type SitePreviewData = {
  customerGroupsData?: string[]
  sourceCodeGroupsData?: string[]
  sitePreviewConfig?: SitePreviewConfig | null
}

export type ProductTooltipData = (Partial<DetailedProduct> | Partial<ListingProduct>) & {
  'productReach (selected variant)'?: ProductReachVariants
  'productReach (resolved)'?: ProductReachVariants
}

type ProductTooltipState = {
  enabled: boolean
  data?: ProductTooltipData
}

const tooltipDefaultDataPaths = ['id', 'custom.c_productVertical', 'custom.c_productReach']

/** Always return a string so the tooltip never crashes and values are visible (no silent empty for undefined/null/boolean). */
const toSafeDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return String(value)
  }
  if (typeof value !== 'object') {
    return String(value)
  }
  try {
    return JSON.stringify(value)
  } catch {
    // Fallback for circular or otherwise unserializable objects
    return String(value)
  }
}

const defaultState = {
  customerGroupsData: [],
  sourceCodeGroupsData: [],
  sitePreviewConfig: null,
} as SitePreviewData

export const sitePreviewAtom = atom<SitePreviewData>(defaultState)

export const isSitePreviewActiveAtom = atom((get) => {
  const { sitePreviewConfig } = get(sitePreviewAtom)
  return isPlainObject(sitePreviewConfig) && !isEmpty(sitePreviewConfig)
})

export const setSitePreviewSessionAtom = atom(
  null,
  (_, set, sitePreviewConfig: SitePreviewConfig) => {
    set(sitePreviewAtom, (prev) => ({
      ...prev,
      sitePreviewConfig,
    }))
  }
)

export const deriveSitePreview = (pageProps) => {
  const isSitePreviewEnabled = _get(pageProps, 'appData.isSitePreviewEnabled', false)
  if (!isSitePreviewEnabled) {
    return defaultState
  }
  const { sitePreviewData, sitePreviewConfig } = pick(pageProps, [
    'sitePreviewData',
    'sitePreviewConfig',
  ])

  return {
    sitePreviewConfig,
    ...pick(sitePreviewData, ['customerGroupsData', 'sourceCodeGroupsData']),
  }
}

const experimentsApiUrl = getAPIURL('/experiments')

export const previewExperimentsAtom = atom(async () => {
  const config = (await fetch(experimentsApiUrl).then((res) =>
    res.json()
  )) as ExperimentsInfoResponseBody
  const variableControlled = _get(config, 'variable-controlled', {})
  const segmentedList = Object.values(_get(config, 'segmentation', {})).map(
    (test) => test.segmentedTo
  )
  const cookieValueList = Cookies.get(OPTIMIZELY_ENABLED_FEATURES)?.split('-') || []
  const entries = Object.entries(EXPERIMENTS)
  const formatName = (name, key) => `${name.replace(/_/g, ' ')} (${key})`

  const evergreenTests = entries
    .map(([internalName, variationKey]) => {
      const enabled = !!variableControlled[variationKey]
      const name = formatName(internalName, variationKey)
      return { name, key: variationKey, enabled }
    })
    .sort((a, b) => Number(b.enabled) - Number(a.enabled))

  const options = entries
    .filter(([_, variationKey]) =>
      evergreenTests.some((test) => !test.enabled && test.key === variationKey)
    )
    .map(([internalName, variationKey]) => {
      const enabled = [...cookieValueList, ...segmentedList].includes(variationKey)
      const name = formatName(internalName, variationKey)
      return { name, key: variationKey, enabled }
    })
    .sort((a, b) => Number(b.enabled) - Number(a.enabled))

  return { evergreenTests, options, defaultList: cookieValueList }
})

export const forceAppRemountKeyAtom = atom(0)

export const setForceAppRemountKeyAtom = atom(null, (get, set) => {
  const currentKey = get(forceAppRemountKeyAtom)
  set(forceAppRemountKeyAtom, Number(!currentKey))
})

export const enableProductDetailsTooltip = atom(false)

export const activeProductDetailsTooltipDataAtom = atomWithReset<ProductTooltipState['data']>({})

const resolvedProductReachAtom = atom((get) => {
  const productData = get(productDataAtom)
  const variants = _get(productData, 'variant', []) as ProductVariant[]
  return resolveProductReach(variants)
})

/** Tooltip data for PDP: path-based fields + 2 computed productReach fields at the end. */
const productDetailsTooltipDataPDPAtom = atom((get): ProductTooltipData => {
  const dataPaths = get(productDetailsTooltipDataPathsAtom)
  const productData = get(productDataAtom)
  const selectedVG = get(selectedVariantGroupAtom)
  const selectedVariant = get(selectedVariantAtom)
  const resolvedReach = get(resolvedProductReachAtom)
  const reachSelected = selectedVariant?.customAttributes?.c_productReach

  const data = dataPaths.reduce<Record<string, unknown>>((acc, path) => {
    const raw = _get(selectedVG, path, _get(productData, path))
    acc[path] = toSafeDisplayValue(raw)
    return acc
  }, {})
  data['productReach (selected variant)'] = toSafeDisplayValue(reachSelected)
  data['productReach (resolved)'] = toSafeDisplayValue(resolvedReach)
  return data as ProductTooltipData
})

export const productDetailsTooltipStateAtom = atom<ProductTooltipState>((get) => {
  const isTooltipEnabled = get(enableProductDetailsTooltip)
  if (!isTooltipEnabled) {
    return { enabled: false }
  }
  const isPDP = get(isPdpAtom)
  const dataPaths = get(productDetailsTooltipDataPathsAtom)
  const activeProductData = get(activeProductDetailsTooltipDataAtom)
  if (!isPDP) {
    const data = dataPaths.reduce((acc, curr) => {
      acc[curr] = String(_get(activeProductData, curr))
      return acc
    }, {})
    return { enabled: !isEmpty(activeProductData), data }
  }

  const data = get(productDetailsTooltipDataPDPAtom)
  return { enabled: true, data }
})

export const productDetailsTooltipDataPathsAtom = atom(tooltipDefaultDataPaths)
